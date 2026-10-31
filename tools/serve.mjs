// Testler ve yerel deneme için bağımlılıksız statik sunucu: node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, relative, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.argv[2] || 8765);
const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png'
};

createServer(async (req, res) => {
    let path;
    try {
        path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
        res.writeHead(400).end();
        return;
    }
    const file = normalize(join(ROOT, path.endsWith('/') ? path + 'index.html' : path));
    // Proje klasörünün dışı (minik-kasif-yedek gibi benzer adlı kardeş klasörler dahil) verilmez
    const rel = relative(ROOT, file);
    if (rel.startsWith('..') || isAbsolute(rel)) {
        res.writeHead(403).end();
        return;
    }
    try {
        const body = await readFile(file);
        // Testlerde hep güncel dosya: tarayıcı önbelleği kullanılmasın
        res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
        res.end(body);
    } catch {
        res.writeHead(404).end('Bulunamadı');
    }
}).listen(PORT, '127.0.0.1', () => console.log(`Minik Kaşif: http://localhost:${PORT}/`));
