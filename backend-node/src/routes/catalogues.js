const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const r = await query('SELECT * FROM catalogues ORDER BY "createdAt" DESC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/google-photos', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'url required' });

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Referer': url
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Photos shared album: ${response.statusText}`);
    }

    const html = await response.text();
    const regex = /(https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_\-]+)/g;
    const matches = [];
    const seen = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (!seen.has(match[1])) {
        seen.add(match[1]);
        matches.push(match[1]);
      }
    }

    // Attempt to paginate and fetch all subsequent batches (e.g. for albums with >300 images)
    try {
      const pos = html.indexOf("key: 'ds:1'");
      if (pos !== -1) {
        const start = html.indexOf('data:', pos) + 5;
        const end = html.indexOf('sideChannel:', start);
        let chunk = html.substring(start, end).trim();
        if (chunk.endsWith(',')) chunk = chunk.slice(0, -1).trim();

        const data = JSON.parse(chunk);
        let token = data[2];
        const albumKey = data[3] && data[3][0];
        const authKey = data[3] && data[3][19];

        while (token && albumKey) {
          const reqArr = [albumKey, token, null, authKey];
          const outer = JSON.stringify([[["snAcKc", JSON.stringify(reqArr), null, "generic"]]]);
          const body = new URLSearchParams({ 'f.req': outer }).toString();

          const rpcResp = await fetch('https://photos.google.com/_/PhotosUi/data/batchexecute', {
            method: 'POST',
            headers: {
              ...headers,
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body
          });

          if (!rpcResp.ok) break;
          const rpcText = await rpcResp.text();
          let rpcMatch;
          while ((rpcMatch = regex.exec(rpcText)) !== null) {
            if (!seen.has(rpcMatch[1])) {
              seen.add(rpcMatch[1]);
              matches.push(rpcMatch[1]);
            }
          }

          token = null;
          try {
            let stripped = rpcText;
            if (stripped.startsWith(")]}'")) stripped = stripped.slice(4).trim();
            const lines = stripped.split("\n");
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const payload = JSON.parse(line);
                if (Array.isArray(payload)) {
                  for (const item of payload) {
                    if (Array.isArray(item) && item[1] === 'snAcKc' && item[2]) {
                      const innerData = JSON.parse(item[2]);
                      if (Array.isArray(innerData) && typeof innerData[2] === 'string') {
                        token = innerData[2];
                      }
                    }
                  }
                }
              } catch (_) {}
            }
          } catch (_) {}
        }
      }
    } catch (pageErr) {
      console.warn('Google Photos pagination warning:', pageErr.message);
    }

    res.json({ images: matches });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title,description='',fileUrl='',fileName='',uploadedAt='' } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });
    const r = await query(
      'INSERT INTO catalogues(title,description,"fileUrl","fileName","uploadedAt") VALUES($1,$2,$3,$4,$5) RETURNING *',
      [title,description,fileUrl,fileName,uploadedAt]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM catalogues WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
