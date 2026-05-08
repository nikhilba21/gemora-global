// src/routes/galleryFolders.js — Folder-based gallery
const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/gallery-folders — all folders with image count + thumbnail
router.get('/', async (req, res) => {
  try {
    const r = await query(`
      SELECT gf.*,
        COUNT(gfi.id)::int AS "imageCount",
        COALESCE(gf."thumbnailUrl",
          (SELECT "imageUrl" FROM gallery_folder_images 
           WHERE "folderId" = gf.id 
           ORDER BY "sortOrder" ASC, id ASC LIMIT 1), '') AS "thumbnailUrl"
      FROM gallery_folders gf
      LEFT JOIN gallery_folder_images gfi ON gfi."folderId" = gf.id
      GROUP BY gf.id
      ORDER BY gf."sortOrder" ASC, gf.id ASC
    `);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/gallery-folders/:id/images — all images in a folder
router.get('/:id/images', async (req, res) => {
  try {
    const folder = await query('SELECT * FROM gallery_folders WHERE id=$1', [req.params.id]);
    if (!folder.rows[0]) return res.status(404).json({ error: 'Folder not found' });
    const images = await query(
      'SELECT * FROM gallery_folder_images WHERE "folderId"=$1 ORDER BY "sortOrder" ASC, id ASC',
      [req.params.id]
    );
    res.json({ folder: folder.rows[0], images: images.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/gallery-folders — create folder (Admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, description = '', thumbnailUrl = '', sortOrder = 0 } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const r = await query(
      'INSERT INTO gallery_folders(name,description,"thumbnailUrl","sortOrder") VALUES($1,$2,$3,$4) RETURNING *',
      [name, description, thumbnailUrl, sortOrder]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/gallery-folders/:id/images — add images to folder (Admin)
router.post('/:id/images', requireAdmin, async (req, res) => {
  try {
    const { images } = req.body; // array of { imageUrl, caption, sortOrder }
    if (!Array.isArray(images)) return res.status(400).json({ error: 'images array required' });

    const folderId = req.params.id;
    const folder = await query('SELECT * FROM gallery_folders WHERE id=$1', [folderId]);
    if (!folder.rows[0]) return res.status(404).json({ error: 'Folder not found' });

    let added = 0;
    for (const img of images) {
      const { imageUrl, caption = '', sortOrder = 0 } = img;
      if (!imageUrl) continue;
      await query(
        'INSERT INTO gallery_folder_images("folderId","imageUrl",caption,"sortOrder") VALUES($1,$2,$3,$4)',
        [folderId, imageUrl, caption, sortOrder]
      );
      added++;
    }

    // Update thumbnail to first image if not set
    const thumb = folder.rows[0].thumbnailUrl;
    if (!thumb && images[0]?.imageUrl) {
      await query('UPDATE gallery_folders SET "thumbnailUrl"=$1 WHERE id=$2', [images[0].imageUrl, folderId]);
    }

    // Update image count
    const countR = await query('SELECT COUNT(*) as c FROM gallery_folder_images WHERE "folderId"=$1', [folderId]);
    await query('UPDATE gallery_folders SET "imageCount"=$1 WHERE id=$2', [parseInt(countR.rows[0].c), folderId]);

    res.json({ success: true, added });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/gallery-folders/:id — update folder (Admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const ex = await query('SELECT * FROM gallery_folders WHERE id=$1', [req.params.id]);
    if (!ex.rows[0]) return res.status(404).json({ error: 'Not found' });
    const e = ex.rows[0];
    const { name, description, thumbnailUrl, sortOrder } = req.body;
    const r = await query(
      'UPDATE gallery_folders SET name=$1,description=$2,"thumbnailUrl"=$3,"sortOrder"=$4 WHERE id=$5 RETURNING *',
      [name ?? e.name, description ?? e.description, thumbnailUrl ?? e.thumbnailUrl, sortOrder ?? e.sortOrder, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/gallery-folders/:id/images/:imgId — update single image caption/sortOrder (Admin)
router.put('/:id/images/:imgId', requireAdmin, async (req, res) => {
  try {
    const folderId = Number(req.params.id);
    const imgId = Number(req.params.imgId);
    const { caption, sortOrder } = req.body;

    const ex = await query('SELECT * FROM gallery_folder_images WHERE id=$1 AND "folderId"=$2', [imgId, folderId]);
    if (!ex.rows[0]) return res.status(404).json({ error: 'Image not found in this folder' });
    
    const e = ex.rows[0];
    const r = await query(
      'UPDATE gallery_folder_images SET caption=$1, "sortOrder"=$2 WHERE id=$3 AND "folderId"=$4 RETURNING *',
      [
        caption !== undefined ? caption : e.caption, 
        sortOrder !== undefined ? sortOrder : e.sortOrder, 
        imgId, 
        folderId
      ]
    );
    res.json(r.rows[0]);
  } catch (e) { 
    console.error('Error updating folder image:', e);
    res.status(500).json({ error: e.message }); 
  }
});

// DELETE /api/gallery-folders/:id/images/:imgId — delete single image (Admin)
router.delete('/:id/images/:imgId', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM gallery_folder_images WHERE id=$1 AND "folderId"=$2', [req.params.imgId, req.params.id]);
    // Update count
    const countR = await query('SELECT COUNT(*) as c FROM gallery_folder_images WHERE "folderId"=$1', [req.params.id]);
    await query('UPDATE gallery_folders SET "imageCount"=$1 WHERE id=$2', [parseInt(countR.rows[0].c), req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/gallery-folders/:id — delete folder + all images (Admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM gallery_folders WHERE id=$1', [req.params.id]);
    // CASCADE deletes images automatically
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
