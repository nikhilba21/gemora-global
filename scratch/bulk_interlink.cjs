const fs = require('fs');
const path = require('path');

const INTERLINK_MAP = {
  "Wholesale Imitation Jewellery": "/wholesale-imitation-jewellery-manufacturer-exporter",
  "Imitation Jewellery Manufacturer": "/wholesale-imitation-jewellery-manufacturer-exporter",
  "Jaipur Jewellery": "/imitation-jewellery-manufacturer-jaipur",
  "Jewellery Manufacturer in Jaipur": "/imitation-jewellery-manufacturer-jaipur",
  "Kundan Jewellery": "/kundan-jewellery-wholesale-manufacturer",
  "Wholesale Kundan Jewellery": "/kundan-jewellery-wholesale-manufacturer",
  "Oxidized Jewellery": "/oxidized-jewellery-wholesale-india",
  "Oxidised Jewellery": "/oxidized-jewellery-wholesale-india",
  "American Diamond Jewellery": "/american-diamond-jewellery-wholesale",
  "AD Jewellery": "/american-diamond-jewellery-wholesale",
  "Jewellery Export": "/wholesale-jewellery-exporter-to-uae",
  "Jewellery Exporter": "/wholesale-jewellery-exporter-to-uae",
  "Wholesale Jewellery": "/wholesale",
  "Gemora Global": "/",
};

const BATCH_DIR = path.join(__dirname, '..', 'src', 'frontend', 'src', 'utils');
const JSON_FILE = path.join(__dirname, '..', 'src', 'frontend', 'src', 'data', 'blogData62.json');

function processText(text) {
  let updatedText = text;
  Object.entries(INTERLINK_MAP).forEach(([keyword, url]) => {
    // Regex explanation:
    // (?<!href=")(?<!">) - Ensure we aren't already inside a link
    // \b${keyword}\b - Match whole word
    // i - Case insensitive
    // Limit to 1 replacement per post for this specific keyword
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!<a[^>]*>)\\b${escapedKeyword}\\b(?![^<]*</a>)`, 'i');
    
    if (regex.test(updatedText)) {
      updatedText = updatedText.replace(regex, `<a href="${url}">${keyword}</a>`);
    }
  });
  return updatedText;
}

// 1. Process Static TS files
for (let i = 1; i <= 61; i++) {
  const filePath = path.join(BATCH_DIR, `blogBatch${i}.ts`);
  if (fs.existsSync(filePath)) {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We only want to replace text inside the "content" string values
    // This is a bit tricky with raw regex on a TS file, but for these files it's mostly safe
    // as they follow a very strict pattern: content: `...`
    const updatedContent = content.replace(/content:\s*`([\s\S]*?)`/g, (match, p1) => {
      return `content: \`${processText(p1)}\``;
    });
    
    fs.writeFileSync(filePath, updatedContent);
  }
}

// 2. Process Batch 62 JSON
if (fs.existsSync(JSON_FILE)) {
  console.log(`Processing ${JSON_FILE}...`);
  const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  const updatedData = data.map(post => ({
    ...post,
    content: processText(post.content)
  }));
  fs.writeFileSync(JSON_FILE, JSON.stringify(updatedData, null, 2));
}

console.log('Interlinking complete!');
