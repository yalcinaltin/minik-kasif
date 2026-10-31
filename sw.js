/**
 * Minik Kaşif - Service Worker (internetsiz oynama + her zaman güncel dosya)
 *
 * - Sayfa açılışı: ÖNCE İNTERNET (4 sn). Ağdan gelirse en yeni sürüm, gelmezse cihazdaki kopya.
 * - Sayfanın dosyaları (js/css/simge) açılışın kararını izler: sayfa ağdan geldiyse dosyalar da ağdan
 *   (yeni sürüm bir arada), önbellekten geldiyse dosyalar da önbellekten (eski sürüm bir arada).
 *   Böylece yavaş bağlantıda yeni index.html ile eski game.js karışmaz.
 * - Google yazı tipleri: önce önbellek, arka planda yenile (internetsiz de aynı yazı tipi).
 * - Önbellek adını değiştirmek (CACHE_VERSION) eski kopyaları siler.
 */

const CACHE_VERSION = 'v5';
const APP_CACHE = `minik-kasif-app-${CACHE_VERSION}`;
const FONT_CACHE = `minik-kasif-fonts-${CACHE_VERSION}`;
const NETWORK_TIMEOUT_MS = 4000;

// Kurulumda önceden indirilen uygulama kabuğu (ilk açılıştan sonra internetsiz oynanabilsin)
const APP_SHELL = [
    'index.html',
    'style.css',
    'game.js',
    'games/realmaze.js',
    'games/balltoss.js',
    'games/bubbles.js',
    'games/bunny.js',
    'games/balloon.js',
    'games/shape.js',
    'games/memory.js',
    'games/pattern.js',
    'games/size.js',
    'games/finder.js',
    'games/coloring.js',
    'games/jigsaw.js',
    'games/melody.js',
    'games/sorting.js',
    'games/dots.js',
    'games/oddone.js',
    'games/missing.js',
    'games/pump.js',
    'levels.js',
    'audio.js',
    'manifest.webmanifest',
    'icons/icon.svg',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/icon-maskable-512.png',
    'icons/apple-touch-icon.png',
    'icons/favicon-32.png'
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// Hangi sayfa (client) ağdan, hangisi önbellekten açıldı: 'network' | 'cache'
const pageSource = new Map();

// Sayfa açılışlarının tek önbellek anahtarı: kapsamın kökü ("…/minik-kasif/"), sorgu dizesi yok.
// ?utm=… gibi adresler ayrı kopya olarak birikmez; çevrimdışı hep son sürüm açılır.
const PAGE_KEY = new URL('./', self.registration.scope).href;

function cacheKey(request) {
    if (request.mode === 'navigate') return PAGE_KEY;
    const url = new URL(request.url);
    url.search = '';
    url.hash = '';
    return url.href;
}

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(APP_CACHE);
        // cache: 'reload' → tarayıcının HTTP önbelleğindeki eski kopya değil, sunucudaki güncel dosya alınır
        await cache.addAll(APP_SHELL.map(url => new Request(url, { cache: 'reload' })));
        // Sayfa anahtarı index.html'in kopyası
        const page = await cache.match(new URL('index.html', self.registration.scope).href);
        if (page) await cache.put(PAGE_KEY, page);
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key.startsWith('minik-kasif-') && key !== APP_CACHE && key !== FONT_CACHE)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin === self.location.origin) {
        event.respondWith(request.mode === 'navigate' ? handlePage(event) : handleAsset(event));
    } else if (FONT_HOSTS.includes(url.hostname)) {
        event.respondWith(staleWhileRevalidate(event, FONT_CACHE));
    }
    // Diğer adreslere (ör. ses tanıma servisi) dokunulmaz
});

function timeout(ms) {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}

// Ağdan indirir; başarılı yanıt tamamen önbelleğe yazıldıktan sonra döner
// (böylece zaman aşımı, gövdenin yarıda takılmasını da kapsar ve yazma işlemi yarıda kalmaz)
function fetchAndCache(cache, request) {
    const init = { cache: 'no-cache', credentials: 'same-origin' };
    // Sayfa açılışında yönlendirmeyi tarayıcıya bırak (yanıt opaqueredirect olur, önbelleğe alınmaz)
    if (request.mode === 'navigate') init.redirect = 'manual';

    return fetch(request.url, init).then(async (response) => {
        if (response.ok && response.type === 'basic') {
            try {
                await cache.put(cacheKey(request), response.clone());
            } catch (e) {
                // Depolama dolu vb.: yanıtı yine de sayfaya ver
            }
        }
        return response;
    });
}

function remember(clientId, source) {
    if (!clientId) return;
    pageSource.set(clientId, source);
    // Kapanan sayfaların kayıtlarını ara ara temizle
    if (pageSource.size > 20) {
        self.clients.matchAll().then(list => {
            const alive = new Set(list.map(c => c.id));
            [...pageSource.keys()].forEach(id => { if (!alive.has(id)) pageSource.delete(id); });
        });
    }
}

async function handlePage(event) {
    const { request } = event;
    const cache = await caches.open(APP_CACHE);
    const network = fetchAndCache(cache, request);
    // Zaman aşımında önbellekten açılsa bile indirme sürer ve bir sonraki açılış için önbelleği tazeler
    event.waitUntil(network.then(() => undefined, () => undefined));

    try {
        const response = await Promise.race([network, timeout(NETWORK_TIMEOUT_MS)]);
        if (!response.ok && response.type !== 'opaqueredirect') {
            // Sunucu hata verdi (ör. GitHub Pages geçici 404/503): iyi bir kopya varsa onu aç
            const cached = await cache.match(PAGE_KEY);
            if (cached) {
                remember(event.resultingClientId, 'cache');
                return cached;
            }
        }
        remember(event.resultingClientId, 'network');
        return response;
    } catch (err) {
        const cached = await cache.match(PAGE_KEY);
        if (cached) {
            remember(event.resultingClientId, 'cache');
            return cached;
        }
        // Önbellekte de yok: zaman aşımıysa ağın bitmesini bekle, ağ hatasıysa hatayı ilet
        remember(event.resultingClientId, 'network');
        return network;
    }
}

async function handleAsset(event) {
    const { request } = event;
    const cache = await caches.open(APP_CACHE);
    const source = pageSource.get(event.clientId);

    if (source === 'cache') {
        // Sayfa eski (önbellekteki) sürüm: dosyalar da aynı sürümden gelsin, arka planda tazelensin
        const cached = await cache.match(cacheKey(request));
        const refresh = fetchAndCache(cache, request);
        event.waitUntil(refresh.then(() => undefined, () => undefined));
        return cached || refresh;
    }

    if (source === 'network') {
        // Sayfa yeni sürüm: dosyaların da yenisi beklenir (zaman aşımı yok); yalnızca gerçek ağ hatasında kopya
        try {
            const response = await fetchAndCache(cache, request);
            if (response.ok) return response;
            return (await cache.match(cacheKey(request))) || response;
        } catch (err) {
            const cached = await cache.match(cacheKey(request));
            if (cached) return cached;
            throw err;
        }
    }

    // Sayfanın kaynağı bilinmiyor (ör. service worker yeniden başladı): önce internet, 4 sn sonra kopya
    const network = fetchAndCache(cache, request);
    event.waitUntil(network.then(() => undefined, () => undefined));
    try {
        const response = await Promise.race([network, timeout(NETWORK_TIMEOUT_MS)]);
        if (response.ok) return response;
        return (await cache.match(cacheKey(request))) || response;
    } catch (err) {
        return (await cache.match(cacheKey(request))) || network;
    }
}

async function staleWhileRevalidate(event, cacheName) {
    const { request } = event;
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const refresh = fetch(request)
        .then(async (response) => {
            // Yazı tipi CSS'i <link> ile "opaque" gelir (durum 0); o da önbelleğe alınabilir
            if (response.ok || response.type === 'opaque') {
                try {
                    await cache.put(request, response.clone());
                } catch (e) {
                    // Depolama dolu: yine de yanıtı ver
                }
            }
            return response;
        });
    event.waitUntil(refresh.then(() => undefined, () => undefined));

    return cached || refresh;
}
