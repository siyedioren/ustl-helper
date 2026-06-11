const fs = require('fs');
const p = 'D:\\111\\基米小站\\ustl helper\\src\\pages\\func\\campus\\map\\index.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/display: "ALWAYS"/g, 'display: "BYCLICK"');
fs.writeFileSync(p, c);
console.log('done');
