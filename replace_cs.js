const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory() && !p.includes('node_modules')) {
      walk(p, callback);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      callback(p);
    }
  });
}

const targetDir = 'src';
let count = 0;
walk(targetDir, (p) => {
  let c = fs.readFileSync(p, 'utf8');
  if (c.includes('import { cs } from "laser-utils"')) {
    c = c.replace(/import \{ cs \} from "laser-utils"/g, 'import { cs } from "@/utils/cs"');
    fs.writeFileSync(p, c);
    console.log('replaced:', p);
    count++;
  }
});
console.log('total:', count);
