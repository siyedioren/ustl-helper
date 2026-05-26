const fs = require('fs');
const path = 'D:\\111\\基米小站\\ustl helper\\src\\pages\\func\\campus\\map\\index.tsx';
let c = fs.readFileSync(path, 'utf8');
c = c.replace(/iconPath: "\/static\/index\.png"/g, 'iconPath: "/static/marker.png"');
fs.writeFileSync(path, c);
console.log('done');
