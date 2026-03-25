const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.dependencies.puppeteer = '^22.0.0';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('package.json patched with puppeteer');
