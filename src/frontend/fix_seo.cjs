const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages', 'seo');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let fixCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace question and answer keys
  if (content.includes('question:') || content.includes('answer:')) {
    content = content.replace(/question:/g, 'q:').replace(/answer:/g, 'a:');
    changed = true;
  }

  // Check if bodyContent exists
  if (!content.includes('bodyContent={') && !content.includes('bodyContent=')) {
    const lastIndex = content.lastIndexOf('/>');
    if (lastIndex !== -1) {
      content = content.substring(0, lastIndex) + '      bodyContent={<></>}\n    ' + content.substring(lastIndex);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
    fixCount++;
  }
}

console.log(`Total files fixed: ${fixCount}`);
