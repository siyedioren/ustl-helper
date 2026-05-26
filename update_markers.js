const fs = require('fs');
const markers = fs.readFileSync('markers_excel.txt', 'utf8').trim();
let content = fs.readFileSync('src/pages/func/campus/map/index.tsx', 'utf8');
const start = content.indexOf('const MARKERS = [');
const end = content.indexOf('];', start) + 2;
content = content.substring(0, start) + 'const MARKERS = [\n' + markers + '\n];' + content.substring(end);
fs.writeFileSync('src/pages/func/campus/map/index.tsx', content);
console.log('updated');