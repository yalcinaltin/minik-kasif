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
    // Bütün yıldızları toplayıp havuca varan en kısa tur da komut sınırına sığmalı
    // (yıldızlar arası yürüyüşte havuç kapalı sayılır: havuca basınca yürüyüş biter)
    const blocked = new Set(l.obstacles.map(key));
    const viaStars = new Set([...blocked, key(l.target)]);
    const orders = (a) => a.length <= 1 ? [a] : a.flatMap((s, i) => orders([...a.slice(0, i), ...a.slice(i + 1)]).map(o => [s, ...o]));
    let best = Infinity;
    for (const order of orders(l.stars)) {
        let cur = l.start, total = 0;
        for (const s of order) {
            const d = distances(l.gridSize.cols, l.gridSize.rows, cur, viaStars).get(key(s));
            total += d === undefined ? Infinity : d;
            cur = s;
        }
        const last = distances(l.gridSize.cols, l.gridSize.rows, cur, blocked).get(key(l.target));
        best = Math.min(best, total + (last === undefined ? Infinity : last));
    }
    if (l.stars.length && best > MAX_COMMANDS) fail(where, `yıldızlı tur ${best} adım > ${MAX_COMMANDS}`);
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
    // "En çok" bölümünde hedef tek ve en büyük olmalı
    if (l.ask === 'most' && (r.target !== Math.max(...r.options) || r.options.filter(o => o === r.target).length !== 1)) fail(where, 'hedef en büyük sayı değil');
}));
D.COLOR_FINDER_LEVELS.forEach(l => { if (l.cardStyle && l.cardStyle !== 'object') fail(`Renk Bulucu ${l.id}`, `bilinmeyen cardStyle ${l.cardStyle}`); });
D.NUMBER_FINDER_LEVELS.forEach(l => {
    if (l.cardStyle && l.cardStyle !== 'count') fail(`Sayı Bulucu ${l.id}`, `bilinmeyen cardStyle ${l.cardStyle}`);
    if (l.ask && l.ask !== 'most') fail(`Sayı Bulucu ${l.id}`, `bilinmeyen ask ${l.ask}`);
    // Sayma kartları en çok 6 emoji (kart alanına sığsın)
    if (l.cardStyle === 'count' && l.rounds.some(r => r.options.some(o => o > 6))) fail(`Sayı Bulucu ${l.id}`, 'sayma kartında en çok 6 olabilir');
});

// Örüntü: doğru cevap seçenekler arasında
D.PATTERN_LEVELS.forEach(l => {
    if (!l.options.some(o => o.symbol === l.correct.symbol)) fail(`Örüntü ${l.id}`, 'doğru cevap seçeneklerde yok');
});

// Boyut: sıralar 1..n, benzersiz; podyum 3 ya da 4 nesne alır; order yoksa küçükten büyüğe
D.SIZE_LEVELS.forEach(l => {
    const ranks = l.items.map(i => i.rank).sort((a, b) => a - b);
    if (ranks.some((r, i) => r !== i + 1)) fail(`Boyut ${l.id}`, `sıralar 1..${l.items.length} değil`);
    if (![3, 4].includes(l.items.length)) fail(`Boyut ${l.id}`, 'podyum 3 ya da 4 nesne alır');
    if (l.order !== undefined && !['asc', 'desc'].includes(l.order)) fail(`Boyut ${l.id}`, `bilinmeyen order ${l.order}`);
    uniqueIds(`Boyut ${l.id}`, l.items);
});

// Balon: renk görevinde hedef renk balonlarda var; sırayla saymada hedef = sayı adedi
D.BALLOON_LEVELS.forEach(l => {
    const where = `Balon ${l.id}`;
    if (!(l.targetCount >= 1)) fail(where, 'targetCount eksik');
    if (l.mode === 'color_filter' && !l.colors.some(c => c.name === l.targetColor)) fail(where, `${l.targetColor} balonu hiç çıkmaz`);
    if ((l.mode === 'numbers' || l.mode === 'sequence') && !(l.items && l.items.length)) fail(where, 'sayı balonu yok');
    if (l.mode === 'sequence' && l.items && l.targetCount !== l.items.length) fail(where, 'sırayla saymada targetCount sayı adedi olmalı');
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
    if (l.tempo !== undefined && !(l.tempo >= 400 && l.tempo <= 1000)) fail(where, 'tempo 400-1000 ms olmalı');
});

// Sepetler: her nesnenin sepeti var, her sepette en az bir nesne
D.SORTING_LEVELS.forEach(l => {
    const where = `Sepetler ${l.id}`;
    const baskets = new Set(l.baskets.map(b => b.id));
    l.items.forEach(i => { if (!baskets.has(i.basket)) fail(where, `${i.label} için sepet yok`); });
    baskets.forEach(b => { if (!l.items.some(i => i.basket === b)) fail(where, `${b} sepeti boş kalır`); });
});

// Top Atma: isteğe bağlı küçük hedef ve top listesi
D.BALL_TOSS_LEVELS.forEach(l => {
    const where = `Top Atma ${l.id}`;
    if (!(l.targetCount >= 1)) fail(where, 'targetCount eksik');
    if (l.targetScale !== undefined && !(l.targetScale >= 0.6 && l.targetScale <= 1)) fail(where, 'targetScale 0.6-1 arası olmalı');
    if (l.ballEmojis !== undefined && !(Array.isArray(l.ballEmojis) && l.ballEmojis.length)) fail(where, 'ballEmojis boş');
});

// Köpük: hedef sürprizler listede, ipucu var, boyut/hız makul
D.SOAP_BUBBLE_LEVELS.forEach(l => {
    const where = `Köpük ${l.id}`;
    if (!(l.targetCount >= 1 && l.surprises.length)) fail(where, 'targetCount/surprises eksik');
    if (l.goalSymbols) {
        const symbols = new Set(l.surprises.map(s => s.symbol));
        if (!l.goalSymbols.length) fail(where, 'goalSymbols boş');
        l.goalSymbols.forEach(g => { if (!symbols.has(g)) fail(where, `${g} sürprizlerde yok`); });
        if (!l.goalHint) fail(where, 'goalSymbols varken goalHint gerekli');
    }
    if (l.bubbleScale !== undefined && !(l.bubbleScale >= 0.7 && l.bubbleScale <= 1)) fail(where, 'bubbleScale 0.7-1 arası olmalı');
    if (l.floatSpeed !== undefined && !(l.floatSpeed >= 0.5 && l.floatSpeed <= 2)) fail(where, 'floatSpeed 0.5-2 arası olmalı');
});

// Farklı Olanı Bul: 3-4 kart, farklı kart tanımlı (odd emoji ya da oddStyle)
const ODD_STYLES = ['big', 'small', 'flip', 'upside'];
D.ODDONE_LEVELS.forEach(l => l.rounds.forEach((r, i) => {
    const where = `Farklı Olanı Bul ${l.id}/${i + 1}`;
    if (!(r.count >= 3 && r.count <= 4)) fail(where, 'kart sayısı 3-4 olmalı');
    if (!r.base) fail(where, 'base eksik');
    if (r.oddStyle !== undefined && !ODD_STYLES.includes(r.oddStyle)) fail(where, `bilinmeyen oddStyle ${r.oddStyle}`);
    if (!r.oddStyle && (!r.odd || r.odd === r.base)) fail(where, 'farklı kart yok (odd ya da oddStyle gerekli)');
}));

// Kim Kayboldu: havuzda yeterli kart, seçenekler gösterilenden fazla değil, etiketler benzersiz
// (ipucu ve konuşma etikete göre çalışır)
D.MISSING_LEVELS.forEach(l => {
    const where = `Kim Kayboldu ${l.id}`;
    if (!(l.show >= 3 && l.show <= 5)) fail(where, 'show 3-5 olmalı (ekrana sığma)');
    if (!(l.options >= 3 && l.options <= 4)) fail(where, 'options 3-4 olmalı');
    if (l.options > l.show) fail(where, 'seçenek sayısı gösterilen karttan fazla olamaz');
    if (!(l.pool.length >= l.show)) fail(where, 'havuzda yeterli kart yok');
    if (!(l.rounds >= 1)) fail(where, 'rounds eksik');
    uniqueIds(where, l.pool, 'label');
    uniqueIds(where, l.pool, 'symbol');
});

D.JIGSAW_LEVELS.forEach(l => {
    if (!(l.cols >= 1 && l.rows >= 1 && l.hero)) fail(`Yapboz ${l.id}`, 'cols/rows/hero eksik');
});
D.COLORING_PAGES.forEach(p => {
    if (!p.svg.includes('paint-region')) fail(`Boyama ${p.id}`, 'boyanacak bölge yok');
});

// Noktaları Birleştir: 3-12 nokta, tahtada (0-100), birbirine çok yakın değil, resim ve renk tanımlı
(D.DOTS_LEVELS || []).forEach(l => {
    const where = `Noktalar ${l.id}`;
    if (!Array.isArray(l.points) || l.points.length < 3 || l.points.length > 12) { fail(where, '3-12 nokta olmalı'); return; }
    l.points.forEach((p, i) => {
        if (!(Array.isArray(p) && p.length === 2 && p.every(v => typeof v === 'number' && v >= 0 && v <= 100))) fail(where, `${i + 1}. nokta 0-100 dışında`);
    });
    l.points.forEach((p, i) => l.points.forEach((q, j) => {
        if (j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < 14) fail(where, `${i + 1}. ve ${j + 1}. nokta çok yakın`);
    }));
    if (!l.picture || !l.pictureLabel || !l.color) fail(where, 'picture/pictureLabel/color eksik');
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
