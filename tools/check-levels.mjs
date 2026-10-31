// Bölüm verisi denetimi: node tools/check-levels.mjs
// levels.js'i tarayıcıdaki gibi yükler ve oyunların çözülebilir/tutarlı olduğunu kontrol eder.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const window = {};
vm.runInNewContext(readFileSync(new URL('../levels.js', import.meta.url), 'utf8'), { window });
const D = window.GAME_DATA;
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const key = (p) => `${p.x},${p.y}`;

// Izgarada başlangıçtan her hücreye en kısa adım sayısı (engeller hariç)
function distances(cols, rows, start, blocked) {
    const dist = new Map([[key(start), 0]]);
    const queue = [start];
    while (queue.length) {
        const cur = queue.shift();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const next = { x: cur.x + dx, y: cur.y + dy };
            if (next.x < 0 || next.y < 0 || next.x >= cols || next.y >= rows) continue;
            if (blocked.has(key(next)) || dist.has(key(next))) continue;
            dist.set(key(next), dist.get(key(cur)) + 1);
            queue.push(next);
        }
    }
    return dist;
}

function uniqueIds(where, list, field = 'id') {
    const ids = list.map(x => x[field]);
    if (new Set(ids).size !== ids.length) fail(where, `yinelenen ${field}`);
}

// Canlı labirent: kemik ve yıldızlar ulaşılabilir
D.REALTIME_MAZE_LEVELS.forEach(l => {
    const where = `Labirent ${l.id}`;
    const dist = distances(l.cols, l.rows, l.start, new Set(l.walls.map(key)));
    if (!dist.has(key(l.goal))) fail(where, 'kemiğe ulaşılamıyor');
    l.stars.forEach(s => { if (!dist.has(key(s))) fail(where, `yıldız ${key(s)} ulaşılamaz`); });
});

// Tavşancık: havuca komut sınırı (14) içinde ulaşılabilir
const MAX_COMMANDS = 14;
D.BUNNY_LEVELS.forEach(l => {
    const where = `Tavşancık ${l.id}`;
    const dist = distances(l.gridSize.cols, l.gridSize.rows, l.start, new Set(l.obstacles.map(key)));
    const d = dist.get(key(l.target));
    if (d === undefined) fail(where, 'havuca ulaşılamıyor');
    else if (d > MAX_COMMANDS) fail(where, `en kısa yol ${d} adım > ${MAX_COMMANDS}`);
    l.stars.forEach(s => { if (!dist.has(key(s))) fail(where, `yıldız ${key(s)} ulaşılamaz`); });
});

// Renk / Sayı Bulucu: hedef seçeneklerde ve tanımlı
D.COLOR_FINDER_LEVELS.forEach(l => l.rounds.forEach((r, i) => {
    const where = `Renk Bulucu ${l.id}/${i + 1}`;
    if (!r.options.includes(r.target)) fail(where, 'hedef seçeneklerde yok');
    [r.target, ...r.options].forEach(id => { if (!D.ALL_COLORS[id]) fail(where, `tanımsız renk ${id}`); });
}));
D.NUMBER_FINDER_LEVELS.forEach(l => l.rounds.forEach((r, i) => {
    const where = `Sayı Bulucu ${l.id}/${i + 1}`;
    if (!r.options.includes(r.target)) fail(where, 'hedef seçeneklerde yok');
    [r.target, ...r.options].forEach(id => { if (!D.ALL_NUMBERS[id]) fail(where, `tanımsız sayı ${id}`); });
}));

// Örüntü: doğru cevap seçenekler arasında
D.PATTERN_LEVELS.forEach(l => {
    if (!l.options.some(o => o.symbol === l.correct.symbol)) fail(`Örüntü ${l.id}`, 'doğru cevap seçeneklerde yok');
});

// Boyut: sıralar 1..n, benzersiz
D.SIZE_LEVELS.forEach(l => {
    const ranks = l.items.map(i => i.rank).sort((a, b) => a - b);
    if (ranks.some((r, i) => r !== i + 1)) fail(`Boyut ${l.id}`, `sıralar 1..${l.items.length} değil`);
    uniqueIds(`Boyut ${l.id}`, l.items);
});

D.SHAPE_MATCH_LEVELS.forEach(l => uniqueIds(`Şekil ${l.id}`, l.items));
D.MEMORY_LEVELS.forEach(l => uniqueIds(`Hafıza ${l.id}`, l.pairs));

// Melodi: tanımlı notalar; tekrar bölümlerinde en az 2 nota (tek notada dizi üreteci sonsuza döner)
const noteIds = new Set(D.MELODY_NOTES.map(n => n.id));
D.MELODY_LEVELS.forEach(l => {
    const where = `Melodi ${l.id}`;
    l.notes.forEach(n => { if (!noteIds.has(n)) fail(where, `tanımsız nota ${n}`); });
    if (l.mode === 'echo' && l.notes.length < 2) fail(where, 'tekrar bölümünde en az 2 nota olmalı');
    if (l.mode === 'echo' && !(l.length >= 1 && l.rounds >= 1)) fail(where, 'length/rounds eksik');
    if (l.mode === 'free' && !(l.goal >= 1)) fail(where, 'goal eksik');
});

// Sepetler: her nesnenin sepeti var, her sepette en az bir nesne
D.SORTING_LEVELS.forEach(l => {
    const where = `Sepetler ${l.id}`;
    const baskets = new Set(l.baskets.map(b => b.id));
    l.items.forEach(i => { if (!baskets.has(i.basket)) fail(where, `${i.label} için sepet yok`); });
    baskets.forEach(b => { if (!l.items.some(i => i.basket === b)) fail(where, `${b} sepeti boş kalır`); });
});

D.JIGSAW_LEVELS.forEach(l => {
    if (!(l.cols >= 1 && l.rows >= 1 && l.hero)) fail(`Yapboz ${l.id}`, 'cols/rows/hero eksik');
});
D.COLORING_PAGES.forEach(p => {
    if (!p.svg.includes('paint-region')) fail(`Boyama ${p.id}`, 'boyanacak bölge yok');
});

// Her oyunda bölüm id'leri 1'den sırayla
Object.entries(D).filter(([, v]) => Array.isArray(v) && v.length && v[0].id !== undefined && v[0].title).forEach(([name, list]) => {
    list.forEach((l, i) => { if (l.id !== i + 1) fail(name, `${i + 1}. bölümün id'si ${l.id}`); });
});

if (errors.length) {
    console.error(`❌ ${errors.length} bölüm verisi sorunu:\n  - ${errors.join('\n  - ')}`);
    process.exit(1);
}
console.log('✅ Bölüm verisi tutarlı: bütün labirentler çözülebilir, bütün oyunlarda cevaplar ve sepetler yerinde.');
