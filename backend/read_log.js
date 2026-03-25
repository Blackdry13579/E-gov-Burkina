const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'server_status.log');
try {
  let content;
  if (fs.existsSync(file)) {
    const buf = fs.readFileSync(file);
    content = buf.toString('utf16le');
    if (content.includes('\uFFFD') || content.trim().length === 0) {
      content = buf.toString('utf8');
    }
    const lines = content.split('\n');
    const logsAfterRestart = lines.filter((_, i) => i > lines.length - 200).join('\n');
    fs.writeFileSync(path.join(__dirname, 'error.txt'), logsAfterRestart, 'utf8');
  }
} catch (e) {
  console.error(e);
}
