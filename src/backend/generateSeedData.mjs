import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const rawPath = resolve('/home/ubuntu/workspace/app/kanhai_raw.json');
const raw = readFileSync(rawPath, 'utf8').trim();

// The file is base64-encoded
let jsonStr;
try {
  const decoded = Buffer.from(raw, 'base64').toString('utf8');
  jsonStr = decoded;
} catch (e) {
  // Try as raw JSON
  jsonStr = raw;
}

const products = JSON.parse(jsonStr);
console.log(`Total products: ${products.length}`);
console.log('Sample product keys:', Object.keys(products[0]));
console.log('Sample product:', JSON.stringify(products[0], null, 2).substring(0, 800));

// Category mapping
function getCategoryId(category, subcategory) {
  const cat = (category || '').toLowerCase();
  const sub = (subcategory || '').toLowerCase();
  const combined = cat + ' ' + sub;

  // Bridal first (most specific)
  if (combined.includes('bridal') || sub.includes('bridal')) return 5;

  // Necklaces
  if (sub.includes('necklace') || sub.includes('pendant') || sub.includes('chain') ||
      sub.includes('choker') || sub.includes('mala') || sub.includes('haar') ||
      sub.includes('mangalsutra')) return 1;

  // Earrings
  if (sub.includes('earring') || sub.includes('jhumka') || sub.includes('jhumki') ||
      sub.includes('tikka') || sub.includes('ear chain') || sub.includes('ear') ||
      sub.includes('bor') || sub.includes('bore') || sub.includes('studs') ||
      sub.includes('jhuda') || sub.includes('pasa') || sub.includes('damini')) return 2;

  // Bracelets / Bangles
  if (sub.includes('bangle') || sub.includes('bracelet') || sub.includes('kada') ||
      sub.includes('payal') || sub.includes('anklet') || sub.includes('kangan') ||
      sub.includes('baju') || sub.includes('hath')) return 3;

  // Rings
  if (sub.includes('ring') || sub.includes('finger')) return 4;

  // Minimal / Fashion (everything else)
  return 6;
}

function escapeMotoko(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ');
}

function getImageUrls(product) {
  const images = product.images || [];
  // Filter out placeholder/logo/icon images, keep only product images
  const productImages = images.filter(url => {
    const lower = url.toLowerCase();
    return !lower.includes('logo.png') &&
           !lower.includes('usericon') &&
           !lower.includes('sign-up') &&
           !lower.includes('key.png') &&
           !lower.includes('key1.png') &&
           !lower.includes('lock.png') &&
           !lower.includes('lock1.png') &&
           !lower.includes('no-image') &&
           !lower.includes('noimage') &&
           url.length > 10;
  });
  return productImages.length > 0 ? productImages.slice(0, 3) : [];
}

function getMoq(product) {
  const minOrder = product.min_order || product.moq || '';
  // Extract a clean moq string
  if (minOrder && minOrder.length > 0 && minOrder.length < 100) {
    return escapeMotoko(minOrder);
  }
  return '50 pieces';
}

// Split into batches of 100 to avoid huge files
const BATCH_SIZE = 100;
const batches = [];
for (let i = 0; i < products.length; i += BATCH_SIZE) {
  batches.push(products.slice(i, i + BATCH_SIZE));
}

console.log(`Splitting into ${batches.length} batches of ${BATCH_SIZE}`);

// Generate a seed record type and data for each batch
const seedType = `  public type ProductSeed = {
    categoryId : Nat;
    name : Text;
    description : Text;
    moq : Text;
    imageUrls : [Text];
    sku : ?Text;
    subcategory : ?Text;
    color : ?Text;
    keyFeatures : ?Text;
  };`;

for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
  const batch = batches[batchIdx];
  const fileNum = batchIdx + 1;

  let lines = [];
  lines.push(`module {`);
  lines.push(seedType);
  lines.push('');
  lines.push(`  public let products : [ProductSeed] = [`);

  for (let i = 0; i < batch.length; i++) {
    const p = batch[i];
    const categoryId = getCategoryId(p.category, p.subcategory);
    const name = escapeMotoko(p.product_name || p.name || 'Unknown Product');
    const description = escapeMotoko((p.description || '').substring(0, 500));
    const moq = getMoq(p);
    const imageUrls = getImageUrls(p);
    const sku = p.sku ? `?"${escapeMotoko(String(p.sku))}"` : 'null';
    const subcategory = p.subcategory ? `?"${escapeMotoko(p.subcategory)}"` : 'null';
    const color = p.color ? `?"${escapeMotoko(p.color)}"` : 'null';
    const keyFeaturesList = Array.isArray(p.key_features) ? p.key_features : (p.key_features ? [p.key_features] : []);
    const keyFeaturesStr = keyFeaturesList.slice(0, 5).map(f => escapeMotoko(String(f))).join('; ');
    const keyFeatures = keyFeaturesStr ? `?"${keyFeaturesStr}"` : 'null';

    const imageUrlsStr = imageUrls.map(u => `"${escapeMotoko(u)}"`).join(', ');

    const comma = i < batch.length - 1 ? ',' : '';
    lines.push(`    {`);
    lines.push(`      categoryId = ${categoryId};`);
    lines.push(`      name = "${name}";`);
    lines.push(`      description = "${description}";`);
    lines.push(`      moq = "${moq}";`);
    lines.push(`      imageUrls = [${imageUrlsStr}];`);
    lines.push(`      sku = ${sku};`);
    lines.push(`      subcategory = ${subcategory};`);
    lines.push(`      color = ${color};`);
    lines.push(`      keyFeatures = ${keyFeatures};`);
    lines.push(`    }${comma}`);
  }

  lines.push(`  ];`);
  lines.push(`};`);

  const outPath = `/home/ubuntu/workspace/app/src/backend/kanhaiSeed${fileNum}.mo`;
  writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`Written: kanhaiSeed${fileNum}.mo (${batch.length} products)`);
}

// Generate index file listing all batch modules
const indexLines = [];
for (let i = 0; i < batches.length; i++) {
  indexLines.push(`import KanhaiSeed${i + 1} "kanhaiSeed${i + 1}";`);
}
indexLines.push('');
indexLines.push('module {');
indexLines.push('  public type ProductSeed = KanhaiSeed1.ProductSeed;');
indexLines.push('  public let allBatches : [[ProductSeed]] = [');
for (let i = 0; i < batches.length; i++) {
  const comma = i < batches.length - 1 ? ',' : '';
  indexLines.push(`    KanhaiSeed${i + 1}.products${comma}`);
}
indexLines.push('  ];');
indexLines.push('};');

const indexPath = `/home/ubuntu/workspace/app/src/backend/kanhaiSeedIndex.mo`;
writeFileSync(indexPath, indexLines.join('\n'), 'utf8');
console.log(`Written: kanhaiSeedIndex.mo`);
console.log(`Done! Generated ${batches.length} seed files + index.`);
