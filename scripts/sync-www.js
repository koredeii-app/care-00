// Capacitor の webDir 用に、既存の静的ファイルを www/ へコピーするだけのスクリプト。
// ルート直下のファイル（index.html, app.js 等）が唯一の正本で、www/ は使い捨ての複製。
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');

const filesToCopy = [
  'index.html',
  'app.js',
  'style.css',
  'manifest.json',
  'service-worker.js',
];

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'icons'), { recursive: true });

filesToCopy.forEach((f) => {
  fs.copyFileSync(path.join(root, f), path.join(www, f));
});

fs.readdirSync(path.join(root, 'icons'))
  .filter((f) => f.endsWith('.png'))
  .forEach((f) => {
    fs.copyFileSync(path.join(root, 'icons', f), path.join(www, 'icons', f));
  });

console.log('www/ を再生成しました。');
