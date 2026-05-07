const fs = require('fs');
const path = require('path');

const BATCH_DIR = path.join(__dirname, '..', 'src', 'frontend', 'src', 'utils');
const JSON_FILE = path.join(__dirname, '..', 'src', 'frontend', 'src', 'data', 'blogData62.json');

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

function generateFAQs(title, category) {
  return `
    <h2>Frequently Asked Questions</h2>
    <p><strong>Q1: How does ${title} impact the 2026 market?</strong><br/>A: In 2026, it serves as a critical 'Value-Driver' for both retail and institutional portfolios, ensuring long-term growth.</p>
    <p><strong>Q2: What is the 'Gemora-Standard' for ${category}?</strong><br/>A: It requires 100% digital traceability and a verified ethical origin certificate for every piece.</p>
    <p><strong>Q3: Why is 2026 a turning point for ${category}?</strong><br/>A: Because of the 2026 'Global-Shift' toward 'Hard-Asset-Luxe' and 'Physical-Permanence.'</p>
    <p><strong>Q4: How can B2B buyers benefit from ${category}?</strong><br/>A: By sourcing from 2026 'Certified-Manufacturers,' buyers can ensure inventory resilience and high-luxe aesthetic at scale.</p>
    <p><strong>Q5: What is the expected 'YOY-Growth' for ${category} in 2026?</strong><br/>A: We are seeing an average 2026 'Growth' of 12-18% for high-quality assets in this segment.</p>
    <p><strong>Q6: Is tokenization available for ${category}?</strong><br/>A: Yes, in 2026, fractional ownership via 'Luxe-Tokens' is standard for all high-value pieces.</p>
    <p><strong>Q7: How do I verify the authenticity of ${title}?</strong><br/>A: Via 2026 'Quantum-Scanning' and the 'Digital-Twin-Passport' provided with every order.</p>
    <p><strong>Q8: What is the role of Jaipur in this trend?</strong><br/>A: As the 2026 'Global-Manufacturing-Hub,' Jaipur provides the artisanal expertise and scale needed for the 2026 market.</p>
    <p><strong>Q9: How does inflation affect ${category}?</strong><br/>A: Rarity acts as a natural ceiling against inflation, making these pieces a definitive 'Value-Anchor.'</p>
    <p><strong>Q10: Can I customize my 2026 collection?</strong><br/>A: Yes, Gemora Global offers 2026 'Custom-Curation' services for elite family offices and retail chains.</p>
    <p><strong>Q11: What is the 'Heritage-Premium' for ${title}?</strong><br/>A: It is the 2026 added value derived from the verified history and provenance of a piece.</p>
    <p><strong>Q12: What is the next step for investors in ${category}?</strong><br/>A: To integrate these 2026 'Physical-Assets' into their digital portfolios for total wealth protection.</p>
  `;
}

function interlinkText(text) {
  let updatedText = text;
  Object.entries(INTERLINK_MAP).forEach(([keyword, url]) => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!<a[^>]*>)\\b${escapedKeyword}\\b(?![^<]*</a>)`, 'i');
    if (regex.test(updatedText)) {
      updatedText = updatedText.replace(regex, `<a href="${url}">${keyword}</a>`);
    }
  });
  return updatedText;
}

// Process Static TS files
for (let i = 1; i <= 61; i++) {
  const filePath = path.join(BATCH_DIR, `blogBatch${i}.ts`);
  if (fs.existsSync(filePath)) {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Improved regex to capture the whole object block safely
    // It looks for id, title, category, and content in any order within {}
    const updatedContent = content.replace(/\{([\s\S]*?)\}/g, (match, p1) => {
      // Extract fields using regex on the block
      const idMatch = p1.match(/id:\s*(\d+)/);
      const titleMatch = p1.match(/title:\s*"(.*?)"/);
      const categoryMatch = p1.match(/category:\s*"(.*?)"/);
      const contentMatch = p1.match(/content:\s*`([\s\S]*?)`/);
      
      if (idMatch && titleMatch && categoryMatch && contentMatch) {
        let body = contentMatch[1];
        const title = titleMatch[1];
        const category = categoryMatch[1];
        
        // Add FAQs if missing
        if (!body.includes('Frequently Asked Questions') && !body.includes('<h2>FAQs</h2>')) {
          body += generateFAQs(title, category);
        }
        
        // Ensure interlinks
        body = interlinkText(body);
        
        // Replace the body back into the block
        return match.replace(contentMatch[1], body);
      }
      return match;
    });
    
    fs.writeFileSync(filePath, updatedContent);
  }
}

// Process Batch 62 JSON
if (fs.existsSync(JSON_FILE)) {
  console.log(`Processing ${JSON_FILE}...`);
  const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  const updatedData = data.map(post => {
    let body = post.content;
    if (!body.includes('Frequently Asked Questions') && !body.includes('<h2>FAQs</h2>')) {
      body += generateFAQs(post.title, post.category);
    }
    body = interlinkText(body);
    return { ...post, content: body };
  });
  fs.writeFileSync(JSON_FILE, JSON.stringify(updatedData, null, 2));
}

console.log('Robust FAQ and Interlinking complete!');
