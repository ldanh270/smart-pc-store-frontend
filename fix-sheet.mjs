import { readFileSync, writeFileSync } from 'fs';

let lines = readFileSync('components/admin/products/ProductEditSheet.tsx', 'utf8').split('\n');

// Find and fix the onClassificationSubmit block
// Replace lines 253-264 (0-indexed: 252-263)
// Find the line with "const newCategoryName ="
const startIdx = lines.findIndex(l => l.includes('const newCategoryName ='));
if (startIdx === -1) { console.log('NOT FOUND'); process.exit(1); }

// Find the closing }); of the updateProduct call - it's the line with just "\t\t\t});"
// that comes after categoryName line
let endIdx = startIdx;
for (let i = startIdx; i < lines.length; i++) {
  if (lines[i].trimEnd() === '\t\t\t});') {
    endIdx = i;
    break;
  }
}

console.log(`Replacing lines ${startIdx + 1} to ${endIdx + 1}`);
console.log('Start:', JSON.stringify(lines[startIdx]));
console.log('End:', JSON.stringify(lines[endIdx]));

const replacement = [
  '\t\t\tconst success = await updateProduct(fetched.id, {',
  '\t\t\t\tproductName: fetched.productName,',
  '\t\t\t\tdescription: fetched.description || undefined,',
  '\t\t\t\timageUrl: fetched.imageUrl || undefined,',
  '\t\t\t\tcurrentPrice: fetched.currentPrice,',
  '\t\t\t\tquantity: fetched.quantity,',
  '\t\t\t\tsupplierId: changed.supplierId ?? fetched.supplierId,',
  '\t\t\t\tcategoryId: changed.categoryId ?? fetched.categoryId,',
  '\t\t\t\tstatus: fetched.status,',
  '\t\t\t});',
];

lines.splice(startIdx, endIdx - startIdx + 1, ...replacement);

writeFileSync('components/admin/products/ProductEditSheet.tsx', lines.join('\n'));
console.log('Done');
