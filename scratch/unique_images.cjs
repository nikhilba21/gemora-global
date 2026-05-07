const fs = require('fs');
const path = require('path');

const BATCH_DIR = path.join(__dirname, '..', 'src', 'frontend', 'src', 'utils');
const JSON_FILE = path.join(__dirname, '..', 'src', 'frontend', 'src', 'data', 'blogData62.json');

// Pool of high-quality jewelry and luxury related Unsplash IDs
const IMAGE_POOL = [
  "1588444837495-c6cfaf504670", "1605100804763-247f67b3557e", "1515562141207-7a88b7ce33e7", "1573496359142-b8d87734a5a2",
  "1584305116359-1985989d4ac0", "1599643478518-a784e5dc4c8f", "1617038220319-276d3acb4cb8", "1531995811006-35cb42e1a022",
  "1611085583191-a3b1a2967073", "1630019017575-f03fd7724393", "1601121141461-9d6647bca1ed", "1596944214946-17e07bfcf002",
  "1598560912005-59a0d5c1a419", "1602173574767-37ac01994b2a", "1611591437281-460bfbe1220a", "1611652022419-a9419f74343d",
  "1615655406736-b37c4fabf923", "1613947489240-6902d999059e", "1618403088350-f1741596c341", "1620656763407-e23a47b01f42",
  "1622398422974-c20ec14443af", "1624448660411-e67d43292419", "1626497746470-20ed6792330a", "1627225924765-552d49cf47ad",
  "1629190209673-f938f2a6409b", "1631557920190-706797f1f964", "1633114128174-2f8aa4967942", "1635200845348-18e539958a5e",
  "1637416067365-2b5d7e8fe839", "1638805981949-666874284587", "1642104704074-93d264f724cd", "1645062854492-0618051ad361",
  "1509319113908-11126ef7d907", "1590548784738-f79116c96ae2", "1576013551627-0cc20b96c2a7", "1512167839785-7bb29870e6d4",
  "1535632063271-ceb995bc217e", "1508216159334-3100029c7842", "1490203923055-6b45941656b2", "1567401893414-76b7b1e5a7a5",
  "1569397270338-303b55227d6d", "1589128777073-ec6a698a75a5", "1598560911732-624653443fc2", "1600050216573-097655760884",
  "1602752250419-2a93178c7724", "1605100815114-878f970a9ec2", "1608043108461-45d6068b13c3", "1611085584348-7f60965c7174",
  "1615655406736-b37c4fabf923", "1620656763407-e23a47b01f42"
];

function getUniqueImage(id) {
  const index = id % IMAGE_POOL.length;
  return `https://images.unsplash.com/photo-${IMAGE_POOL[index]}?w=800&q=80`;
}

// 1. Process Static TS files
for (let i = 1; i <= 61; i++) {
  const filePath = path.join(BATCH_DIR, `blogBatch${i}.ts`);
  if (fs.existsSync(filePath)) {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update image field for each post object
    const updatedContent = content.replace(/\{[\s\S]*?id:\s*(\d+),[\s\S]*?image:\s*".*?",/g, (match, id) => {
      return match.replace(/image:\s*".*?",/, `image: "${getUniqueImage(parseInt(id))}",`);
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
    image: getUniqueImage(post.id)
  }));
  fs.writeFileSync(JSON_FILE, JSON.stringify(updatedData, null, 2));
}

console.log('Unique image assignment complete!');
