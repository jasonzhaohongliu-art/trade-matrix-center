/**
 * 🖥️ Pages CMS 本地开发服务器
 * 一键启动后台管理面板，无需 Astro 构建
 *
 * 用法：
 *   node scripts/serve-admin.js                    # 同时启动两个站的后台
 *   node scripts/serve-admin.js --site=inconel     # 只启动 1 号站
 *   node scripts/serve-admin.js --site=ccs         # 只启动 2 号站
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT_INCONEL = 8081;
const PORT_CCS = 8082;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function createServer(siteName, port) {
  const publicDir = path.join(ROOT, 'websites', `site-${siteName === 'inconel' ? '01-inconel' : '02-ccs'}`, 'public');

  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/admin/index.html';

    const filePath = path.join(publicDir, urlPath);

    // 安全检查：防止目录穿越
    if (!filePath.startsWith(publicDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(`Not Found: ${urlPath}`);
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });

  server.listen(port, () => {
    console.log(`  ✅ ${siteName.toUpperCase()} 站后台 → http://localhost:${port}/admin/index.html`);
    console.log(`     配置文件 → http://localhost:${port}/admin/config.yml`);
  });

  return server;
}

const args = process.argv.slice(2);
const siteFilter = args.find(a => a.startsWith('--site='))?.split('=')[1];

console.log('');
console.log('╔════════════════════════════════════════════╗');
console.log('║  📦 Pages CMS 本地管理后台启动中...       ║');
console.log('╚════════════════════════════════════════════╝');
console.log('');

const servers = [];

if (!siteFilter || siteFilter === 'inconel') {
  servers.push(createServer('inconel', PORT_INCONEL));
}
if (!siteFilter || siteFilter === 'ccs') {
  servers.push(createServer('ccs', PORT_CCS));
}

console.log('');
console.log('💡 提示：');
console.log('   - Pages CMS 通过 GitHub API 读写内容，需要 config.yml 中配置真实 GitHub 仓库');
console.log('   - 按 Ctrl+C 停止所有服务器');
console.log('');
