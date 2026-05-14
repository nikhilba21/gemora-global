import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = path.join(process.cwd(), 'src/frontend/public/assets/generated');

async function convertToWebP() {
  try {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.png')) {
        const filePath = path.join(directoryPath, file);
        // We will keep the original file name structure and just change extension to .webp
        // E.g., hero-jewellery-banner.dim_1600x700.jpg -> hero-jewellery-banner.dim_1600x700.webp
        const outputFilePath = path.join(directoryPath, file.replace(/\.(jpg|png)$/, '.webp'));

        console.log(`Converting ${file} to WebP...`);
        
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(outputFilePath);
          
        console.log(`Successfully converted ${file}`);
        
        // Optionally, delete the old file to save space and ensure we use the new one
        // fs.unlinkSync(filePath);
      }
    }
    console.log('All images converted successfully!');
  } catch (err) {
    console.error('Error converting images:', err);
  }
}

convertToWebP();
