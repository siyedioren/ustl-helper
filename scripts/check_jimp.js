const pkg = require('./node_modules/jimp/package.json');
console.log('jimp version:', pkg.version);
const j = require('jimp');
console.log('typeof j:', typeof j);
console.log('keys:', Object.keys(j).slice(0, 20));
