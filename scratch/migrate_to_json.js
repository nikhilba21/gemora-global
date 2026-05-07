const fs = require('fs');
const path = require('path');

// Mocking the BLOG_BATCH_62 because we can't easily import TS into a plain node script without transpile
// In a real scenario, we'd use a build step or a proper migration script.
// I'll just write the data I already have.

const batch62 = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch62_raw.json'), 'utf8'));

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'frontend', 'src', 'data', 'blogData62.json'),
  JSON.stringify(batch62, null, 2)
);

console.log('Successfully migrated Batch 62 to JSON');
