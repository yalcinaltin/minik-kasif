/**
 * Minik Kaşif - Seviye ve İçerik Tanımları
 * 4 Yaş Çocukların Bilişsel ve Algoritmik Gelişimi İçin Özel Tasarlanmıştır.
 * Toddler Games Online pedagojisine uygun olarak zenginleştirilmiştir.
 */

// 🥕 MODÜL 1: TAVŞANCIK HAVUÇ PEŞİNDE (Algoritmik Kodlama)
const BUNNY_LEVELS = [
    {
        id: 1,
        title: "İlk Adım 🐾",
        instruction: "Tavşancığı sağa doğru 2 adım yürüt ve çıtır havuca ulaştır!",
        gridSize: { cols: 4, rows: 4 },
        start: { x: 0, y: 1 },
        target: { x: 2, y: 1 },
        obstacles: [],
        stars: [],
        pedagogicalFocus: "Tek yönlü ardışık komut oluşturma (Sequence)"
    },
    {
        id: 2,
        title: "Dönüş Vakti 🔄",
        instruction: "Önce sağa, sonra aşağıya! Yolu bulabilir misin?",
        gridSize: { cols: 4, rows: 4 },
        start: { x: 0, y: 0 },
        target: { x: 2, y: 2 },
        obstacles: [],
        stars: [{ x: 1, y: 0 }],
        pedagogicalFocus: "Farklı iki yönü birleştirme ve yıldız toplama"
    },
    {
        id: 3,
        title: "Taşın Etrafından Dolan 🪨",
        instruction: "Yolumuzda koca bir taş var! Taşın yanından dolaşalım.",
        gridSize: { cols: 4, rows: 4 },
        start: { x: 0, y: 1 },
        target: { x: 2, y: 1 },
        obstacles: [{ x: 1, y: 1, type: "rock", emoji: "🪨" }],
        stars: [],
        pedagogicalFocus: "Engel farkındalığı ve alternatif rota planlama"
    },
    {
        id: 4,
        title: "Işıldayan Yıldız ⭐",
        instruction: "Önce yıldızı kap, sonra lezzetli havuca koş!",
        gridSize: { cols: 4, rows: 4 },
        start: { x: 1, y: 3 },
        target: { x: 3, y: 0 },
        obstacles: [{ x: 2, y: 2, type: "bush", emoji: "🌳" }],
        stars: [{ x: 1, y: 1 }],
        pedagogicalFocus: "Ara hedef (yıldız) ve nihai hedef (havuç) sıralaması"
    },
    {
        id: 5,
        title: "Sevimli Çalılar 🌳",
        instruction: "Çalıların arasından zikzak çizerek geç!",
        gridSize: { cols: 4, rows: 4 },
        start: { x: 0, y: 0 },
        target: { x: 3, y: 3 },
        obstacles: [
            { x: 1, y: 0, type: "bush", emoji: "🌳" },
            { x: 2, y: 2, type: "bush", emoji: "🌳" }
        ],
        stars: [{ x: 0, y: 2 }],
        pedagogicalFocus: "Zikzak çizme ve çoklu yön geçişi"
    },
    {
        id: 6,
        title: "Mavi Gölcük 💧",
        instruction: "Tavşan ıslanmak istemiyor! Suyun etrafından geç.",
        gridSize: { cols: 5, rows: 4 },
        start: { x: 0, y: 2 },
        target: { x: 4, y: 2 },
        obstacles: [
            { x: 2, y: 1, type: "pond", emoji: "💧" },
            { x: 2, y: 2, type: "pond", emoji: "💧" }
        ],
        stars: [{ x: 2, y: 0 }],
        pedagogicalFocus: "Geniş engeller etrafında rota optimizasyonu"
    },
    {
        id: 7,
        title: "Yıldız Avcısı ⭐⭐",
        instruction: "İki parlayan yıldızı da toplayıp havuca ulaşabilir misin?",
        gridSize: { cols: 5, rows: 5 },
        start: { x: 0, y: 4 },
        target: { x: 4, y: 0 },
        obstacles: [
            { x: 1, y: 3, type: "rock", emoji: "🪨" },
            { x: 3, y: 1, type: "bush", emoji: "🌳" }
        ],
        stars: [
            { x: 0, y: 1 },
            { x: 4, y: 3 }
        ],
        pedagogicalFocus: "Çoklu ara hedefleri sırayla ziyaret etme algoritması"
    },
    {
        id: 8,
        title: "Büyük Labirent 🧩",
        instruction: "Doğru patikayı takip et ve tavşana yol göster!",
        gridSize: { cols: 5, rows: 5 },
        start: { x: 0, y: 0 },
        target: { x: 4, y: 4 },
        obstacles: [
            { x: 1, y: 1, type: "rock", emoji: "🪨" },
            { x: 3, y: 1, type: "bush", emoji: "🌳" },
            { x: 1, y: 3, type: "pond", emoji: "💧" },
            { x: 3, y: 3, type: "rock", emoji: "🪨" }
        ],
        stars: [{ x: 2, y: 2 }],
        pedagogicalFocus: "Merkezi koridordan geçiş ve simetri algısı"
    },
    {
        id: 9,
        title: "Gizemli Bahçe 🌺",
        instruction: "Engelleri dikkatle incele, adımlarını önceden say!",
        gridSize: { cols: 5, rows: 5 },
        start: { x: 4, y: 4 },
        target: { x: 0, y: 0 },
        obstacles: [
            { x: 3, y: 4, type: "rock", emoji: "🪨" },
            { x: 2, y: 2, type: "bush", emoji: "🌳" },
            { x: 1, y: 0, type: "pond", emoji: "💧" }
        ],
        stars: [{ x: 4, y: 1 }, { x: 0, y: 3 }],
        pedagogicalFocus: "Geriye doğru uzamsal yönelim ve stratejik planlama"
    },
    {
        id: 10,
        title: "Şampiyon Kaşif! 👑",
        instruction: "Büyük final! Bütün yeteneklerini göster ve ödülü kap!",
        gridSize: { cols: 5, rows: 5 },
        start: { x: 0, y: 2 },
        target: { x: 4, y: 2 },
        obstacles: [
            { x: 2, y: 0, type: "rock", emoji: "🪨" },
            { x: 2, y: 2, type: "bush", emoji: "🌳" },
            { x: 2, y: 4, type: "rock", emoji: "🪨" }
        ],
        stars: [{ x: 2, y: 1 }, { x: 2, y: 3 }],
        pedagogicalFocus: "Kapsamlı algoritmik düşünme ve ustalık"
    }
];

// 🎈 MODÜL 2: BALON PATLATMA (Refleks, Renkler & Sayılar - Toddler Games Online Klasiği)
const BALLOON_LEVELS = [
    {
        id: 1,
        title: "Gökkuşağı Balonları 🎈",
        instruction: "Uçan renkli balonlara dokun ve patlat!",
        targetCount: 8,
        mode: "free",
        targetDesc: "Herhangi bir balonu patlat!",
        colors: [
            { name: "Kırmızı", hex: "#EF4444", emoji: "🔴" },
            { name: "Mavi", hex: "#3B82F6", emoji: "🔵" },
            { name: "Sarı", hex: "#FACC15", emoji: "🟡" },
            { name: "Yeşil", hex: "#22C55E", emoji: "🟢" },
            { name: "Mor", hex: "#A855F7", emoji: "🟣" }
        ]
    },
    {
        id: 2,
        title: "Kırmızı Balon Görevi 🔴",
        instruction: "Dikkatle bak! Sadece KIRMIZI balonları patlat!",
        targetCount: 5,
        mode: "color_filter",
        targetColor: "Kırmızı",
        targetDesc: "Yalnızca Kırmızı balonları patlat!",
        colors: [
            { name: "Kırmızı", hex: "#EF4444", emoji: "🔴" },
            { name: "Mavi", hex: "#3B82F6", emoji: "🔵" },
            { name: "Sarı", hex: "#FACC15", emoji: "🟡" },
            { name: "Yeşil", hex: "#22C55E", emoji: "🟢" }
        ]
    },
    {
        id: 3,
        title: "Sarı Güneş Balonları 🟡",
        instruction: "Pırıl pırıl parlayan SARI balonları bul ve patlat!",
        targetCount: 5,
        mode: "color_filter",
        targetColor: "Sarı",
        targetDesc: "Yalnızca Sarı balonları patlat!",
        colors: [
            { name: "Sarı", hex: "#FACC15", emoji: "🟡" },
            { name: "Mavi", hex: "#3B82F6", emoji: "🔵" },
            { name: "Mor", hex: "#A855F7", emoji: "🟣" },
            { name: "Yeşil", hex: "#22C55E", emoji: "🟢" }
        ]
    },
    {
        id: 4,
        title: "Neşeli Sayılar 1️⃣2️⃣3️⃣",
        instruction: "Üzerinde sayı olan balonları patlatarak saymayı öğrenelim!",
        targetCount: 6,
        mode: "numbers",
        targetDesc: "Balonları patlat ve sayıları dinle!",
        items: [
            { label: "1", speech: "Bir!" },
            { label: "2", speech: "İki!" },
            { label: "3", speech: "Üç!" },
            { label: "4", speech: "Dört!" },
            { label: "5", speech: "Beş!" }
        ]
    }
];

// 🧩 MODÜL 3: ŞEKİL VE GÖLGE EŞLEŞTİRME (Sürükle/Dokun Eşleştirme)
const SHAPE_MATCH_LEVELS = [
    {
        id: 1,
        title: "Geometrik Şekiller 🔺🟡⬛⭐",
        instruction: "Renkli şekilleri doğru gölgelerine yerleştir!",
        items: [
            { id: "circle", symbol: "🟡", label: "Sarı Daire", silhouette: "⚫" },
            { id: "triangle", symbol: "🔺", label: "Kırmızı Üçgen", silhouette: "▲" },
            { id: "square", symbol: "🟦", label: "Mavi Kare", silhouette: "⬛" },
            { id: "star", symbol: "⭐", label: "Sarı Yıldız", silhouette: "★" }
        ]
    },
    {
        id: 2,
        title: "Sevimli Hayvan Dostlarımız 🐶🐱🐰🦊",
        instruction: "Hayvanları gölgeleriyle eşleştir!",
        items: [
            { id: "dog", symbol: "🐶", label: "Köpekçik", silhouette: "🐾" },
            { id: "cat", symbol: "🐱", label: "Kediciğim", silhouette: "🐾" },
            { id: "rabbit", symbol: "🐰", label: "Tavşancık", silhouette: "🐾" },
            { id: "fox", symbol: "🦊", label: "Tilkicik", silhouette: "🐾" }
        ]
    },
    {
        id: 3,
        title: "Hızlı Araçlar 🚗✈️🚂⛵",
        instruction: "Araçları kendi silüetlerine yerleştir!",
        items: [
            { id: "car", symbol: "🚗", label: "Otomobil", silhouette: "🚘" },
            { id: "plane", symbol: "✈️", label: "Uçak", silhouette: "🛩️" },
            { id: "train", symbol: "🚂", label: "Tren", silhouette: "🚆" },
            { id: "boat", symbol: "⛵", label: "Yelkenli", silhouette: "🛥️" }
        ]
    },
    {
        id: 4,
        title: "Vitamin Deposu Meyveler 🍎🍌🍓🍇",
        instruction: "Meyveleri doğru gölgelere bırak!",
        items: [
            { id: "apple", symbol: "🍎", label: "Kırmızı Elma", silhouette: "🍏" },
            { id: "banana", symbol: "🍌", label: "Muz", silhouette: "🍌" },
            { id: "strawberry", symbol: "🍓", label: "Çilek", silhouette: "🍓" },
            { id: "grapes", symbol: "🍇", label: "Üzüm", silhouette: "🍇" }
        ]
    }
];

// 🧠 MODÜL 4: HAFIZA KARTLARI (Çalışma Belleği & Eşleştirme)
const MEMORY_LEVELS = [
    {
        id: 1,
        title: "Sevimli Hayvanlar (4 Kart) 🐱🐶",
        instruction: "Kartlara dokun, aynı olan çiftleri bul!",
        pairs: [
            { id: "cat", symbol: "🐱", label: "Kedi" },
            { id: "dog", symbol: "🐶", label: "Köpek" }
        ]
    },
    {
        id: 2,
        title: "Renkli Araçlar (4 Kart) 🚗✈️",
        instruction: "İki kart çevir ve araç çiftlerini yakala!",
        pairs: [
            { id: "car", symbol: "🚗", label: "Araba" },
            { id: "plane", symbol: "✈️", label: "Uçak" }
        ]
    },
    {
        id: 3,
        title: "Meyve Bahçesi (6 Kart) 🍎🍌🍓",
        instruction: "6 kart arasında meyve çiftlerini eşleştir!",
        pairs: [
            { id: "apple", symbol: "🍎", label: "Elma" },
            { id: "banana", symbol: "🍌", label: "Muz" },
            { id: "strawberry", symbol: "🍓", label: "Çilek" }
        ]
    },
    {
        id: 4,
        title: "Vahşi Doğa (6 Kart) 🦁🐘🐼",
        instruction: "Aslan, Fil ve Panda çiftlerini bulabilecek misin?",
        pairs: [
            { id: "lion", symbol: "🦁", label: "Aslan" },
            { id: "elephant", symbol: "🐘", label: "Fil" },
            { id: "panda", symbol: "🐼", label: "Panda" }
        ]
    }
];

// 🚂 MODÜL 5: ÖRÜNTÜ TRENİ (Örüntü Algılama ve Zihinsel Tahmin)
const PATTERN_LEVELS = [
    {
        id: 1,
        title: "Lezzetli Meyveler 🍎🍌",
        instruction: "Sırada hangi lezzetli meyve gelmeli?",
        pattern: [
            { symbol: "🍎", label: "Elma" },
            { symbol: "🍌", label: "Muz" },
            { symbol: "🍎", label: "Elma" },
            { symbol: "🍌", label: "Muz" }
        ],
        correct: { symbol: "🍎", label: "Elma" },
        options: [
            { symbol: "🍎", label: "Elma" },
            { symbol: "🍌", label: "Muz" },
            { symbol: "🍇", label: "Üzüm" }
        ],
        patternType: "AB Örüntüsü (İkili Tekrar)"
    },
    {
        id: 2,
        title: "Renkli Toplar 🔴🔵",
        instruction: "Kırmızı, Mavi, Kırmızı, Mavi... Sıradaki top hangisi?",
        pattern: [
            { symbol: "🔴", label: "Kırmızı Top" },
            { symbol: "🔵", label: "Mavi Top" },
            { symbol: "🔴", label: "Kırmızı Top" },
            { symbol: "🔵", label: "Mavi Top" }
        ],
        correct: { symbol: "🔴", label: "Kırmızı Top" },
        options: [
            { symbol: "🟡", label: "Sarı Top" },
            { symbol: "🔴", label: "Kırmızı Top" },
            { symbol: "🟢", label: "Yeşil Top" }
        ],
        patternType: "Renk Değişimi Örüntüsü"
    },
    {
        id: 3,
        title: "Sevimli Hayvan Dostlarımız 🐱🐶",
        instruction: "Kedi, Kedi, Köpek... Bakalım sıradakini bulabilecek misin?",
        pattern: [
            { symbol: "🐱", label: "Kedi" },
            { symbol: "🐱", label: "Kedi" },
            { symbol: "🐶", label: "Köpek" },
            { symbol: "🐱", label: "Kedi" },
            { symbol: "🐱", label: "Kedi" }
        ],
        correct: { symbol: "🐶", label: "Köpek" },
        options: [
            { symbol: "🐭", label: "Fare" },
            { symbol: "🐶", label: "Köpek" },
            { symbol: "🐱", label: "Kedi" }
        ],
        patternType: "AAB Örüntüsü"
    },
    {
        id: 4,
        title: "Geometrik Şekiller 🟡🔺",
        instruction: "Daire, Üçgen, Daire, Üçgen... Şimdi hangisi gelmeli?",
        pattern: [
            { symbol: "🟡", label: "Sarı Daire" },
            { symbol: "🔺", label: "Kırmızı Üçgen" },
            { symbol: "🟡", label: "Sarı Daire" },
            { symbol: "🔺", label: "Kırmızı Üçgen" }
        ],
        correct: { symbol: "🟡", label: "Sarı Daire" },
        options: [
            { symbol: "⬛", label: "Kare" },
            { symbol: "🔺", label: "Kırmızı Üçgen" },
            { symbol: "🟡", label: "Sarı Daire" }
        ],
        patternType: "Şekil ve Form Örüntüsü"
    },
    {
        id: 5,
        title: "Doğa Harikaları 🌸🌻🍀",
        instruction: "Pembe Çiçek, Sarı Ayçiçeği, Yonca... Sırada hangisi var?",
        pattern: [
            { symbol: "🌸", label: "Çiçek" },
            { symbol: "🌻", label: "Ayçiçeği" },
            { symbol: "🍀", label: "Yonca" },
            { symbol: "🌸", label: "Çiçek" },
            { symbol: "🌻", label: "Ayçiçeği" }
        ],
        correct: { symbol: "🍀", label: "Yonca" },
        options: [
            { symbol: "🍀", label: "Yonca" },
            { symbol: "🌸", label: "Çiçek" },
            { symbol: "🍄", label: "Mantar" }
        ],
        patternType: "ABC Üçlü Döngü Örüntüsü"
    },
    {
        id: 6,
        title: "Hızlı Araçlar 🚗✈️",
        instruction: "Araba, Araba, Uçak, Uçak, Araba, Araba... Sonra?",
        pattern: [
            { symbol: "🚗", label: "Araba" },
            { symbol: "🚗", label: "Araba" },
            { symbol: "✈️", label: "Uçak" },
            { symbol: "✈️", label: "Uçak" },
            { symbol: "🚗", label: "Araba" },
            { symbol: "🚗", label: "Araba" }
        ],
        correct: { symbol: "✈️", label: "Uçak" },
        options: [
            { symbol: "🚲", label: "Bisiklet" },
            { symbol: "✈️", label: "Uçak" },
            { symbol: "⛵", label: "Yelkenli" }
        ],
        patternType: "AABB İkili Küme Örüntüsü"
    },
    {
        id: 7,
        title: "Çiftlik Sesleri 🐮🐑",
        instruction: "Mööö ve Meee! Sırada hangi çiftlik dostumuz var?",
        pattern: [
            { symbol: "🐮", label: "İnek" },
            { symbol: "🐑", label: "Koyun" },
            { symbol: "🐮", label: "İnek" },
            { symbol: "🐑", label: "Koyun" },
            { symbol: "🐮", label: "İnek" }
        ],
        correct: { symbol: "🐑", label: "Koyun" },
        options: [
            { symbol: "🐴", label: "At" },
            { symbol: "🐑", label: "Koyun" },
            { symbol: "🐮", label: "İnek" }
        ],
        patternType: "Ritmik Tekrar"
    },
    {
        id: 8,
        title: "Uzay Yolculuğu 🚀⭐🌕",
        instruction: "Roket, Yıldız, Dolunay... Trenin son vagonunu tamamla!",
        pattern: [
            { symbol: "🚀", label: "Roket" },
            { symbol: "⭐", label: "Yıldız" },
            { symbol: "🌕", label: "Dolunay" },
            { symbol: "🚀", label: "Roket" },
            { symbol: "⭐", label: "Yıldız" }
        ],
        correct: { symbol: "🌕", label: "Dolunay" },
        options: [
            { symbol: "☀️", label: "Güneş" },
            { symbol: "🌕", label: "Dolunay" },
            { symbol: "🛸", label: "UFO" }
        ],
        patternType: "Gelişmiş Sıralı Mantık"
    }
];

// ⚖️ MODÜL 6: BOYUT DÜNYASI (Küçükten Büyüğe Sıralama & Bilişsel Mantık)
const SIZE_LEVELS = [
    {
        id: 1,
        title: "Minik Hayvanlardan Devlere 🐾",
        instruction: "Hayvanları EN KÜÇÜKTEN EN BÜYÜĞE doğru podyuma yerleştir!",
        items: [
            { id: "karinca", symbol: "🐜", label: "Karınca", rank: 1, sizeText: "En Küçük", scale: 0.75 },
            { id: "tavsan", symbol: "🐇", label: "Tavşancık", rank: 2, sizeText: "Orta Boy", scale: 1.15 },
            { id: "fil", symbol: "🐘", label: "Fil", rank: 3, sizeText: "En Büyük", scale: 1.6 }
        ],
        pedagogicalFocus: "Somut boyut karşılaştırması (Seriation)"
    },
    {
        id: 2,
        title: "Kuşlar Alemi 🐥🦆🦢",
        instruction: "Küçük civcivden büyük kuğuya doğru sıralayalım!",
        items: [
            { id: "civciv", symbol: "🐥", label: "Civciv", rank: 1, sizeText: "En Küçük", scale: 0.8 },
            { id: "ordek", symbol: "🦆", label: "Ördek", rank: 2, sizeText: "Orta Boy", scale: 1.15 },
            { id: "kugu", symbol: "🦢", label: "Kuğu", rank: 3, sizeText: "En Büyük", scale: 1.55 }
        ],
        pedagogicalFocus: "Benzer türler arasında bağıl boyut analizi"
    },
    {
        id: 3,
        title: "Meyve Bahçesi 🍓🍎🍉",
        instruction: "Meyveleri küçücük çilekten koca karpuza doğru diz!",
        items: [
            { id: "cilek", symbol: "🍓", label: "Çilek", rank: 1, sizeText: "En Küçük", scale: 0.8 },
            { id: "elma", symbol: "🍎", label: "Elma", rank: 2, sizeText: "Orta Boy", scale: 1.15 },
            { id: "karpuz", symbol: "🍉", label: "Karpuz", rank: 3, sizeText: "En Büyük", scale: 1.6 }
        ],
        pedagogicalFocus: "Günlük yaşam nesneleriyle hacim kavramı"
    },
    {
        id: 4,
        title: "Ulaşım Araçları 🛴🚗✈️",
        instruction: "Küçük scooter'dan dev yolcu uçağına doğru sırala!",
        items: [
            { id: "scooter", symbol: "🛴", label: "Scooter", rank: 1, sizeText: "En Küçük", scale: 0.8 },
            { id: "araba", symbol: "🚗", label: "Otomobil", rank: 2, sizeText: "Orta Boy", scale: 1.2 },
            { id: "ucak", symbol: "✈️", label: "Uçak", rank: 3, sizeText: "En Büyük", scale: 1.65 }
        ],
        pedagogicalFocus: "Soyutlama ve gerçek dünya büyüklük algısı"
    },
    {
        id: 5,
        title: "Doğadaki Su Miktarı 💧🥛🌊",
        instruction: "Tek bir damladan koca dalgalara doğru sırala!",
        items: [
            { id: "damla", symbol: "💧", label: "Su Damlası", rank: 1, sizeText: "En Küçük", scale: 0.75 },
            { id: "bardak", symbol: "🥛", label: "Bir Bardak Su", rank: 2, sizeText: "Orta Boy", scale: 1.15 },
            { id: "deniz", symbol: "🌊", label: "Büyük Deniz", rank: 3, sizeText: "En Büyük", scale: 1.6 }
        ],
        pedagogicalFocus: "Miktar ve hacim kavramının zihinsel hiyerarşisi"
    },
    {
        id: 6,
        title: "Gök Cisimleri 🪨🌍☀️",
        instruction: "Küçük bir taştan sıcacık dev Güneş'e doğru!",
        items: [
            { id: "tas", symbol: "🪨", label: "Çakıl Taşı", rank: 1, sizeText: "En Küçük", scale: 0.75 },
            { id: "dunya", symbol: "🌍", label: "Dünyamız", rank: 2, sizeText: "Orta Boy", scale: 1.2 },
            { id: "gunes", symbol: "☀️", label: "Güneş", rank: 3, sizeText: "En Büyük", scale: 1.65 }
        ],
        pedagogicalFocus: "Geniş ölçekli kavramsal düşünme"
    }
];

// 🐶 MODÜL 7: CANLI YÖN TUŞLU LABİRENT (Real-Time Arrow Keys Maze Runner)
const REALTIME_MAZE_LEVELS = [
    {
        id: 1,
        title: "Köpekçiğin Kemik Yolu 🐾",
        instruction: "Yön oklarıyla köpekçiği kemiğe ulaştır!",
        cols: 5,
        rows: 5,
        start: { x: 0, y: 0 },
        goal: { x: 4, y: 4 },
        walls: [
            { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
            { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }
        ],
        stars: [{ x: 4, y: 0 }, { x: 0, y: 4 }]
    },
    {
        id: 2,
        title: "Bahçe Çitleri 🌳",
        instruction: "Çitlerin arasından canlı canlı yürü ve çıkışa koş!",
        cols: 6,
        rows: 5,
        start: { x: 0, y: 0 },
        goal: { x: 5, y: 4 },
        walls: [
            { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 },
            { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 },
            { x: 4, y: 1 }
        ],
        stars: [{ x: 2, y: 1 }, { x: 4, y: 3 }]
    },
    {
        id: 3,
        title: "Büyük Macera Labirenti 🏰",
        instruction: "Yön tuşlarıyla dikkatlice ilerle, yıldızları toplayıp lezzetli kemiği yakala!",
        cols: 7,
        rows: 6,
        start: { x: 0, y: 0 },
        goal: { x: 6, y: 5 },
        walls: [
            { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 0 }, { x: 4, y: 1 },
            { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
            { x: 2, y: 4 }, { x: 2, y: 5 }
        ],
        stars: [{ x: 0, y: 3 }, { x: 3, y: 1 }, { x: 6, y: 1 }]
    }
];

// 🏀 MODÜL 8: NEŞELİ TOP ATMA (Ball Toss & Target Physics)
const BALL_TOSS_LEVELS = [
    {
        id: 1,
        title: "Sevimli Ayıyı Doyur 🐻",
        instruction: "Ayıcığa dokun ya da elmayı ayıcığa doğru kaydır, aç ayıcığı besle!",
        targetEmoji: "🐻",
        targetLabel: "Aç Ayıcık",
        ballEmoji: "🍎",
        ballLabel: "Kırmızı Elma",
        targetCount: 5,
        targetSpeed: 0 // Hedef durur; her isabetten sonra yeni bir yere geçer
    },
    {
        id: 2,
        title: "Renkli Sepete Basket 🏀",
        instruction: "Pota yavaşça kayıyor! Karşına gelince topa dokun ve sayı yap!",
        targetEmoji: "🗑️",
        targetLabel: "Basket Potası",
        ballEmoji: "🏀",
        ballLabel: "Basketbol Topu",
        targetCount: 5,
        targetSpeed: 0.16 // Saniyede alan genişliğinin %16'sı kadar kayar
    },
    {
        id: 3,
        title: "Aç Aslancık 🦁",
        instruction: "Aslancık hızlı koşuyor! Doğru anı bekle ve karpuzu fırlat!",
        targetEmoji: "🦁",
        targetLabel: "Aslancık",
        ballEmoji: "🍉",
        ballLabel: "Sulu Karpuz",
        targetCount: 5,
        targetSpeed: 0.28
    }
];

// 🫧 MODÜL 9: SİHİRLİ SABUN KÖPÜĞÜ (Magic Soap Bubble Pop & Reveal)
const SOAP_BUBBLE_LEVELS = [
    {
        id: 1,
        title: "Deniz Canlısı Baloncukları 🫧🐬",
        instruction: "Uçuşan sihirli sabun köpüklerine dokun ve içindeki deniz dostlarını kurtar!",
        targetCount: 8,
        surprises: [
            { symbol: "🐬", label: "Yunus" },
            { symbol: "🐠", label: "Renkli Balık" },
            { symbol: "🐙", label: "Ahtapot" },
            { symbol: "🦀", label: "Yengeç" },
            { symbol: "🐢", label: "Kaplumbağa" },
            { symbol: "⭐", label: "Deniz Yıldızı" }
        ]
    },
    {
        id: 2,
        title: "Sürpriz Oyuncak Köpükleri 🫧🧸",
        instruction: "Köpükleri pıt diye patlat, oyuncakları sepetine topla!",
        targetCount: 8,
        surprises: [
            { symbol: "🧸", label: "Oyuncak Ayı" },
            { symbol: "🚗", label: "Yarış Arabası" },
            { symbol: "🚀", label: "Uzay Roketi" },
            { symbol: "🚂", label: "Tren" },
            { symbol: "🎈", label: "Uçan Balon" },
            { symbol: "🎁", label: "Hediye Paketi" }
        ]
    },
    {
        id: 3,
        title: "Lezzetli Meyve Köpükleri 🫧🍓",
        instruction: "Köpükleri patlat ve meyveleri keşfet!",
        targetCount: 8,
        surprises: [
            { symbol: "🍓", label: "Çilek" },
            { symbol: "🍌", label: "Muz" },
            { symbol: "🍎", label: "Elma" },
            { symbol: "🍇", label: "Üzüm" },
            { symbol: "🍉", label: "Karpuz" }
        ]
    }
];

// ==========================================
// 🎨 MODÜL 10: RENK BULUCU VERİLERİ (SESLİ & DOKUNMATİK)
// ==========================================
const ALL_COLORS = {
    red: {
        id: 'red',
        name: 'Kırmızı',
        colorHex: '#EF4444',
        cardBg: '#FEF2F2',
        borderHex: '#DC2626',
        emoji: '🍎',
        items: ['🔴 Halka', '🍎 Elma', '🚗 Araba', '🍓 Çilek'],
        synonyms: ['kırmızı', 'kirmizi', 'al', 'red', 'kırmızı renk', 'kırmızı kart', 'elma']
    },
    blue: {
        id: 'blue',
        name: 'Mavi',
        colorHex: '#2563EB',
        cardBg: '#EFF6FF',
        borderHex: '#1D4ED8',
        emoji: '🌊',
        items: ['🔵 Halka', '🌊 Dalga', '🚙 Araba', '🐬 Yunus'],
        synonyms: ['mavi', 'gök mavisi', 'blue', 'mavi renk', 'mavi kart', 'deniz']
    },
    yellow: {
        id: 'yellow',
        name: 'Sarı',
        colorHex: '#EAB308',
        cardBg: '#FEFCE8',
        borderHex: '#CA8A04',
        emoji: '☀️',
        items: ['🟡 Halka', '☀️ Güneş', '🍌 Muz', '🐥 Civciv'],
        synonyms: ['sarı', 'sari', 'yellow', 'sarı renk', 'sarı kart', 'güneş', 'civciv']
    },
    green: {
        id: 'green',
        name: 'Yeşil',
        colorHex: '#16A34A',
        cardBg: '#F0FDF4',
        borderHex: '#15803D',
        emoji: '🐸',
        items: ['🟢 Halka', '🍏 Yeşil Elma', '🐸 Kurbağa', '🌳 Ağaç'],
        synonyms: ['yeşil', 'yesil', 'green', 'yeşil renk', 'yeşil kart', 'kurbağa']
    },
    orange: {
        id: 'orange',
        name: 'Turuncu',
        colorHex: '#EA580C',
        cardBg: '#FFF7ED',
        borderHex: '#C2410C',
        emoji: '🥕',
        items: ['🟠 Halka', '🥕 Havuç', '🍊 Portakal', '🦊 Tilki'],
        synonyms: ['turuncu', 'portakal', 'orange', 'turuncu renk', 'turuncu kart', 'havuç']
    },
    purple: {
        id: 'purple',
        name: 'Mor',
        colorHex: '#9333EA',
        cardBg: '#FAF5FF',
        borderHex: '#7E22CE',
        emoji: '🍇',
        items: ['🟣 Halka', '🍇 Üzüm', '🍆 Patlıcan', '🔮 Küre'],
        synonyms: ['mor', 'purple', 'mor renk', 'mor kart', 'üzüm', 'leylak']
    },
    pink: {
        id: 'pink',
        name: 'Pembe',
        colorHex: '#DB2777',
        cardBg: '#FDF2F8',
        borderHex: '#BE185D',
        emoji: '🌸',
        items: ['🌸 Çiçek', '🦩 Flamingo', '🎀 Kurdele', '🍧 Dondurma'],
        synonyms: ['pembe', 'penbe', 'pink', 'pembe renk', 'pembe kart', 'çiçek']
    },
    brown: {
        id: 'brown',
        name: 'Kahverengi',
        colorHex: '#78350F',
        cardBg: '#FEF3C7',
        borderHex: '#451A03',
        emoji: '🐻',
        items: ['🟤 Halka', '🐻 Ayıcık', '🌰 Kestane', '🍫 Çikolata'],
        synonyms: ['kahverengi', 'kahve', 'brown', 'kahverengi kart', 'ayıcık']
    },
    white: {
        id: 'white',
        name: 'Beyaz',
        colorHex: '#475569',
        cardBg: '#FFFFFF',
        borderHex: '#94A3B8',
        emoji: '🐇',
        items: ['⚪ Halka', '🐇 Tavşan', '☁️ Bulut', '⛄ Kardan Adam'],
        synonyms: ['beyaz', 'ak', 'white', 'beyaz renk', 'beyaz kart', 'tavşan']
    },
    black: {
        id: 'black',
        name: 'Siyah',
        colorHex: '#0F172A',
        cardBg: '#F8FAFC',
        borderHex: '#334155',
        emoji: '🎩',
        items: ['⚫ Halka', '🐈‍⬛ Kara Kedi', '🎩 Şapka', '🕶️ Gözlük'],
        synonyms: ['siyah', 'kara', 'black', 'siyah renk', 'siyah kart', 'kedi']
    }
};

const COLOR_FINDER_LEVELS = [
    {
        id: 1,
        title: "Ana Renkler Dünyası 🎨",
        instruction: "Ekranda yazan rengi yüksek sesle söyle veya dokunarak bul!",
        rounds: [
            { target: 'red', options: ['red', 'blue', 'yellow'] },
            { target: 'blue', options: ['red', 'blue', 'yellow'] },
            { target: 'yellow', options: ['red', 'blue', 'yellow'] },
            { target: 'red', options: ['yellow', 'red', 'blue'] }
        ]
    },
    {
        id: 2,
        title: "Doğanın Canlı Renkleri 🌿",
        instruction: "Ekranda parlayan rengi söyle, sevimli köpekçik senin için tıklasın!",
        rounds: [
            { target: 'green', options: ['green', 'orange', 'purple', 'blue'] },
            { target: 'orange', options: ['yellow', 'orange', 'red', 'green'] },
            { target: 'purple', options: ['purple', 'blue', 'green', 'orange'] },
            { target: 'green', options: ['orange', 'green', 'yellow', 'purple'] }
        ]
    },
    {
        id: 3,
        title: "Tatlı & Zıt Renkler 🌸",
        instruction: "Rengin adını mikrofona söyle veya ekrandan dokun!",
        rounds: [
            { target: 'pink', options: ['pink', 'brown', 'white', 'black'] },
            { target: 'brown', options: ['pink', 'brown', 'white', 'black'] },
            { target: 'white', options: ['black', 'white', 'pink', 'brown'] },
            { target: 'black', options: ['white', 'black', 'brown', 'pink'] }
        ]
    },
    {
        id: 4,
        title: "Gökkuşağı Büyük Şöleni 🌈",
        instruction: "Harika bir renk ustasısın! Tüm renkler arasından hedefi söyle!",
        rounds: [
            { target: 'red', options: ['red', 'blue', 'yellow', 'green', 'orange', 'purple'] },
            { target: 'green', options: ['blue', 'green', 'yellow', 'pink', 'orange', 'brown'] },
            { target: 'yellow', options: ['yellow', 'red', 'green', 'blue', 'purple', 'black'] },
            { target: 'purple', options: ['purple', 'pink', 'blue', 'orange', 'green', 'red'] },
            { target: 'blue', options: ['blue', 'red', 'yellow', 'green', 'purple', 'white'] }
        ]
    }
];

// ==========================================
// 🔢 MODÜL 11: SAYI BULUCU VERİLERİ (SESLİ & DOKUNMATİK)
// ==========================================
const ALL_NUMBERS = {
    1: { num: 1, word: 'BİR', emoji: '🦁', countLabel: '1 Sevimli Aslan', countVisual: '🦁', synonyms: ['1', 'bir', 'tek', 'one', 'aslan'] },
    2: { num: 2, word: 'İKİ', emoji: '🍎', countLabel: '2 Kırmızı Elma', countVisual: '🍎 🍎', synonyms: ['2', 'iki', 'two', 'elma'] },
    3: { num: 3, word: 'ÜÇ', emoji: '⭐', countLabel: '3 Parlayan Yıldız', countVisual: '⭐ ⭐ ⭐', synonyms: ['3', 'üç', 'uc', 'three', 'yıldız'] },
    4: { num: 4, word: 'DÖRT', emoji: '🦆', countLabel: '4 Neşeli Ördek', countVisual: '🦆 🦆 🦆 🦆', synonyms: ['4', 'dört', 'dort', 'four', 'ördek'] },
    5: { num: 5, word: 'BEŞ', emoji: '🎈', countLabel: '5 Renkli Balon', countVisual: '🎈 🎈 🎈 🎈 🎈', synonyms: ['5', 'beş', 'bes', 'five', 'balon'] },
    6: { num: 6, word: 'ALTI', emoji: '🍓', countLabel: '6 Tatlı Çilek', countVisual: '🍓 🍓 🍓 🍓 🍓 🍓', synonyms: ['6', 'altı', 'alti', 'six', 'çilek'] },
    7: { num: 7, word: 'YEDİ', emoji: '🦋', countLabel: '7 Kelebek', countVisual: '🦋 🦋 🦋 🦋 🦋 🦋 🦋', synonyms: ['7', 'yedi', 'seven', 'kelebek'] },
    8: { num: 8, word: 'SEKİZ', emoji: '🐟', countLabel: '8 Sevimli Balık', countVisual: '🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟', synonyms: ['8', 'sekiz', 'eight', 'balık'] },
    9: { num: 9, word: 'DOKUZ', emoji: '🍪', countLabel: '9 Kurabiye', countVisual: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', synonyms: ['9', 'dokuz', 'nine', 'kurabiye'] },
    10: { num: 10, word: 'ON', emoji: '🏆', countLabel: '10 Şampiyon Kupa', countVisual: '🏆 🏆 🏆 🏆 🏆 🏆 🏆 🏆 🏆 🏆', synonyms: ['10', 'on', 'ten', 'kupa'] }
};

const NUMBER_FINDER_LEVELS = [
    {
        id: 1,
        title: "1'den 3'e İlk Sayılar 🔢",
        instruction: "Ekranda yazan sayıyı yüksek sesle söyle veya dokunarak bul!",
        rounds: [
            { target: 1, options: [1, 2, 3] },
            { target: 2, options: [1, 2, 3] },
            { target: 3, options: [1, 2, 3] },
            { target: 2, options: [3, 2, 1] }
        ]
    },
    {
        id: 2,
        title: "1'den 5'e Minik Sayılar 🖐️",
        instruction: "Ekranda parlayan sayıyı söyle, sevimli maskot senin için tıklasın!",
        rounds: [
            { target: 4, options: [1, 2, 3, 4] },
            { target: 5, options: [2, 3, 4, 5] },
            { target: 3, options: [1, 3, 4, 5] },
            { target: 1, options: [1, 2, 4, 5] },
            { target: 5, options: [3, 4, 2, 5] }
        ]
    },
    {
        id: 3,
        title: "6'dan 10'a Büyük Sayılar 🚀",
        instruction: "Büyük sayıları söyle veya dokunarak hemen bul!",
        rounds: [
            { target: 6, options: [6, 7, 8, 9] },
            { target: 7, options: [6, 7, 8, 10] },
            { target: 8, options: [7, 8, 9, 10] },
            { target: 9, options: [6, 8, 9, 10] },
            { target: 10, options: [7, 8, 9, 10] }
        ]
    },
    {
        id: 4,
        title: "1'den 10'a Sayı Şampiyonu 🏆",
        instruction: "Sen tam bir sayı dahisisin! Karışık sayılardan hedefi söyle!",
        rounds: [
            { target: 7, options: [3, 5, 7, 8, 9, 10] },
            { target: 3, options: [1, 2, 3, 4, 6, 8] },
            { target: 9, options: [4, 6, 7, 8, 9, 10] },
            { target: 4, options: [2, 4, 5, 6, 7, 9] },
            { target: 10, options: [5, 6, 7, 8, 9, 10] }
        ]
    }
];

// ==========================================
// 🖍️ MODÜL 12: BOYAMA KİTABI
// ==========================================
// Boyanabilir her parça class="paint-region"; sabit çizgiler/gözler class="paint-fixed".
// Tüm sayfalar viewBox="0 0 400 300" üzerine çizilir.
const COLORING_PALETTE = [
    { name: 'Kırmızı', hex: '#EF4444' },
    { name: 'Turuncu', hex: '#F97316' },
    { name: 'Sarı', hex: '#FACC15' },
    { name: 'Yeşil', hex: '#22C55E' },
    { name: 'Açık Mavi', hex: '#7DD3FC' },
    { name: 'Mavi', hex: '#2563EB' },
    { name: 'Mor', hex: '#9333EA' },
    { name: 'Pembe', hex: '#F472B6' },
    { name: 'Kahverengi', hex: '#92400E' },
    { name: 'Siyah', hex: '#1E293B' },
    { name: 'Silgi', hex: '#FFFFFF', isEraser: true }
];

const COLORING_PAGES = [
    {
        id: 1,
        title: "Sevimli Evimiz 🏠",
        instruction: "Bir renk seç, sonra evin bir parçasına dokun ve boya!",
        svg: `
            <rect class="paint-region" x="0" y="0" width="400" height="212"/>
            <rect class="paint-region" x="0" y="210" width="400" height="90"/>
            <circle class="paint-region" cx="342" cy="56" r="32"/>
            <path class="paint-region" d="M48 82 a20 20 0 0 1 30 -16 a24 24 0 0 1 44 6 a18 18 0 0 1 2 34 h-70 a16 16 0 0 1 -6 -24z"/>
            <rect class="paint-region" x="240" y="68" width="26" height="50"/>
            <rect class="paint-region" x="112" y="130" width="168" height="110"/>
            <polygon class="paint-region" points="94,134 196,58 298,134"/>
            <rect class="paint-region" x="176" y="180" width="40" height="60"/>
            <rect class="paint-region" x="128" y="152" width="34" height="34"/>
            <rect class="paint-region" x="230" y="152" width="34" height="34"/>
            <circle class="paint-fixed" cx="207" cy="212" r="3.5" fill="#334155"/>
        `
    },
    {
        id: 2,
        title: "Neşeli Balık 🐟",
        instruction: "Denizi, balığı ve yosunları istediğin renge boya!",
        svg: `
            <rect class="paint-region" x="0" y="0" width="400" height="245"/>
            <path class="paint-region" d="M0 240 Q100 218 200 240 T400 240 V300 H0 Z"/>
            <path class="paint-region" d="M48 300 C28 262 70 240 50 196 L64 192 C86 238 46 262 68 300 Z"/>
            <path class="paint-region" d="M332 300 C312 258 354 236 334 188 L348 184 C370 234 330 260 352 300 Z"/>
            <polygon class="paint-region" points="266,130 330,88 330,172"/>
            <ellipse class="paint-region" cx="188" cy="130" rx="86" ry="52"/>
            <path class="paint-region" d="M168 82 Q196 46 228 84 Z"/>
            <circle class="paint-region" cx="96" cy="78" r="11"/>
            <circle class="paint-region" cx="78" cy="46" r="7"/>
            <circle class="paint-fixed" cx="140" cy="118" r="12" fill="#FFFFFF"/>
            <circle class="paint-fixed" cx="137" cy="118" r="5" fill="#1E293B"/>
            <path class="paint-fixed" d="M118 146 Q130 154 142 146" fill="none"/>
        `
    },
    {
        id: 3,
        title: "Hızlı Araba 🚗",
        instruction: "Arabayı, tekerlekleri ve yolu boya!",
        svg: `
            <rect class="paint-region" x="0" y="0" width="400" height="202"/>
            <rect class="paint-region" x="0" y="200" width="400" height="100"/>
            <path class="paint-region" d="M262 64 a18 18 0 0 1 28 -14 a22 22 0 0 1 40 6 a16 16 0 0 1 2 30 h-64 a14 14 0 0 1 -6 -22z"/>
            <path class="paint-region" d="M58 200 V160 Q58 144 74 144 H120 L150 104 H250 L290 144 H326 Q342 144 342 160 V200 Z"/>
            <polygon class="paint-region" points="158,114 194,114 194,144 134,144"/>
            <polygon class="paint-region" points="206,114 244,114 274,144 206,144"/>
            <circle class="paint-region" cx="122" cy="204" r="27"/>
            <circle class="paint-region" cx="280" cy="204" r="27"/>
            <circle class="paint-region" cx="330" cy="168" r="8"/>
            <circle class="paint-fixed" cx="122" cy="204" r="8" fill="#CBD5E1"/>
            <circle class="paint-fixed" cx="280" cy="204" r="8" fill="#CBD5E1"/>
            <rect class="paint-fixed" x="20" y="262" width="50" height="8" rx="4" fill="#FFFFFF"/>
            <rect class="paint-fixed" x="175" y="262" width="50" height="8" rx="4" fill="#FFFFFF"/>
            <rect class="paint-fixed" x="330" y="262" width="50" height="8" rx="4" fill="#FFFFFF"/>
        `
    },
    {
        id: 4,
        title: "Çiçek ve Kelebek 🌸🦋",
        instruction: "Taç yapraklarını, kelebeğin kanatlarını ve çimenleri boya!",
        svg: `
            <rect class="paint-region" x="0" y="0" width="400" height="222"/>
            <rect class="paint-region" x="0" y="220" width="400" height="80"/>
            <path class="paint-region" d="M196 138 H206 V252 H196 Z"/>
            <path class="paint-region" d="M198 212 Q158 190 146 216 Q174 232 198 222 Z"/>
            <path class="paint-region" d="M204 192 Q242 170 254 196 Q228 212 204 202 Z"/>
            <circle class="paint-region" cx="200" cy="72" r="27"/>
            <circle class="paint-region" cx="236" cy="98" r="27"/>
            <circle class="paint-region" cx="222" cy="140" r="27"/>
            <circle class="paint-region" cx="178" cy="140" r="27"/>
            <circle class="paint-region" cx="164" cy="98" r="27"/>
            <circle class="paint-region" cx="200" cy="110" r="23"/>
            <ellipse class="paint-region" cx="304" cy="62" rx="24" ry="30" transform="rotate(-20 304 62)"/>
            <ellipse class="paint-region" cx="346" cy="62" rx="24" ry="30" transform="rotate(20 346 62)"/>
            <rect class="paint-fixed" x="320" y="38" width="10" height="52" rx="5" fill="#334155"/>
        `
    }
];

// ==========================================
// 🖼️ MODÜL 13: YAPBOZ (PARÇA - BÜTÜN)
// ==========================================
// Resim tarayıcıda canvas'a çizilir: renkli zemin + her parçada farklı küçük süs + ortada büyük kahraman.
// guide: tahtadaki silik ipucu resminin görünürlüğü (zorlaştıkça azalır)
const JIGSAW_LEVELS = [
    { id: 1, title: "Sevimli Kaplumbağa 🐢", instruction: "4 parçayı yerleştir, kaplumbağayı tamamla!", hero: '🐢', heroLabel: 'Kaplumbağa', cols: 2, rows: 2, colors: ['#BAE6FD', '#FDE68A'], guide: 0.3 },
    { id: 2, title: "Kral Aslan 🦁", instruction: "Aslanın parçalarını doğru yerlere koy!", hero: '🦁', heroLabel: 'Aslan', cols: 2, rows: 2, colors: ['#FEF08A', '#F59E0B'], guide: 0.25 },
    { id: 3, title: "Koca Fil 🐘", instruction: "6 parça var! Önce köşeleri bulalım.", hero: '🐘', heroLabel: 'Fil', cols: 3, rows: 2, colors: ['#BAE6FD', '#38BDF8'], guide: 0.22 },
    { id: 4, title: "Mavi Balina 🐳", instruction: "Balinayı denizde tamamla!", hero: '🐳', heroLabel: 'Balina', cols: 3, rows: 2, colors: ['#C7D2FE', '#6366F1'], guide: 0.18 },
    { id: 5, title: "Tatlı Panda 🐼", instruction: "9 parçalık büyük yapboz! Süslere dikkat et.", hero: '🐼', heroLabel: 'Panda', cols: 3, rows: 3, colors: ['#FBCFE8', '#F472B6'], guide: 0.14 },
    { id: 6, title: "Neşeli Tren 🚂", instruction: "Şampiyon yapbozcu! Treni tamamla.", hero: '🚂', heroLabel: 'Tren', cols: 3, rows: 3, colors: ['#FED7AA', '#FB923C'], guide: 0.1 }
];

const JIGSAW_DECORATIONS = ['☀️', '☁️', '🌈', '🌼', '🍄', '⭐', '🦋', '🌷', '🍀'];

// ==========================================
// 🎹 MODÜL 14: MELODİ TEKRARLA (KSİLOFON)
// ==========================================
const MELODY_NOTES = [
    { id: 'do', name: 'Do', freq: 261.63, color: '#EF4444', dark: '#B91C1C', emoji: '🐱' },
    { id: 're', name: 'Re', freq: 293.66, color: '#F97316', dark: '#C2410C', emoji: '🐶' },
    { id: 'mi', name: 'Mi', freq: 329.63, color: '#FACC15', dark: '#CA8A04', emoji: '🐰' },
    { id: 'fa', name: 'Fa', freq: 349.23, color: '#22C55E', dark: '#15803D', emoji: '🐸' },
    { id: 'sol', name: 'Sol', freq: 392.0, color: '#3B82F6', dark: '#1D4ED8', emoji: '🐳' },
    { id: 'la', name: 'La', freq: 440.0, color: '#A855F7', dark: '#7E22CE', emoji: '🐙' }
];

// mode 'free': serbest çalma (goal kadar notaya dokununca biter)
// mode 'echo': dinlenen 'length' notalık diziyi aynı sırayla tekrar et, 'rounds' tur
const MELODY_LEVELS = [
    { id: 1, title: "Serbest Ksilofon 🎹", instruction: "Renkli tuşlara dokun, kendi şarkını çal!", mode: 'free', notes: ['do', 're', 'mi', 'fa', 'sol', 'la'], goal: 10 },
    { id: 2, title: "İki Nota Yankısı 🐱🐰", instruction: "Önce dinle! Sonra aynı iki notayı sırayla çal.", mode: 'echo', notes: ['do', 'mi', 'sol'], length: 2, rounds: 4 },
    { id: 3, title: "Üç Nota Yankısı 🎶", instruction: "Üç notayı dikkatle dinle ve aynı sırayla çal!", mode: 'echo', notes: ['do', 're', 'mi', 'sol'], length: 3, rounds: 4 },
    { id: 4, title: "Melodi Ustası 🏆", instruction: "Dört notalık melodiyi hatırlayabilir misin?", mode: 'echo', notes: ['do', 're', 'mi', 'fa', 'sol', 'la'], length: 4, rounds: 4 }
];

// ==========================================
// 🧺 MODÜL 15: SEPETLERE AYIR (SINIFLANDIRMA)
// ==========================================
// 3-5 yaş tek özelliğe göre ayırabilir; her bölüm tek kurallıdır.
const SORTING_LEVELS = [
    {
        id: 1,
        title: "Kırmızı mı, Mavi mi? 🔴🔵",
        instruction: "Kırmızıları kırmızı sepete, mavileri mavi sepete koy!",
        baskets: [
            { id: 'red', label: 'Kırmızı', icon: '🔴', color: '#EF4444' },
            { id: 'blue', label: 'Mavi', icon: '🔵', color: '#3B82F6' }
        ],
        items: [
            { symbol: '🍎', label: 'Elma', basket: 'red' },
            { symbol: '🍓', label: 'Çilek', basket: 'red' },
            { symbol: '🍒', label: 'Kiraz', basket: 'red' },
            { symbol: '🚒', label: 'İtfaiye', basket: 'red' },
            { symbol: '🐳', label: 'Balina', basket: 'blue' },
            { symbol: '🫐', label: 'Yaban Mersini', basket: 'blue' },
            { symbol: '🚙', label: 'Mavi Araba', basket: 'blue' },
            { symbol: '💧', label: 'Su Damlası', basket: 'blue' }
        ]
    },
    {
        id: 2,
        title: "Hayvanlar ve Meyveler 🐶🍌",
        instruction: "Hayvanları bir sepete, meyveleri öbür sepete ayır!",
        baskets: [
            { id: 'animal', label: 'Hayvanlar', icon: '🐾', color: '#D97706' },
            { id: 'fruit', label: 'Meyveler', icon: '🍉', color: '#16A34A' }
        ],
        items: [
            { symbol: '🐶', label: 'Köpek', basket: 'animal' },
            { symbol: '🐱', label: 'Kedi', basket: 'animal' },
            { symbol: '🐰', label: 'Tavşan', basket: 'animal' },
            { symbol: '🐮', label: 'İnek', basket: 'animal' },
            { symbol: '🍌', label: 'Muz', basket: 'fruit' },
            { symbol: '🍇', label: 'Üzüm', basket: 'fruit' },
            { symbol: '🍐', label: 'Armut', basket: 'fruit' },
            { symbol: '🍊', label: 'Portakal', basket: 'fruit' }
        ]
    },
    {
        id: 3,
        title: "Karada mı, Denizde mi? 🌳🌊",
        instruction: "Karada yaşayanlar ve denizde yaşayanlar ayrı sepete!",
        baskets: [
            { id: 'land', label: 'Karada', icon: '🌳', color: '#65A30D' },
            { id: 'sea', label: 'Denizde', icon: '🌊', color: '#0284C7' }
        ],
        items: [
            { symbol: '🐘', label: 'Fil', basket: 'land' },
            { symbol: '🦁', label: 'Aslan', basket: 'land' },
            { symbol: '🐄', label: 'İnek', basket: 'land' },
            { symbol: '🐿️', label: 'Sincap', basket: 'land' },
            { symbol: '🐙', label: 'Ahtapot', basket: 'sea' },
            { symbol: '🐠', label: 'Balık', basket: 'sea' },
            { symbol: '🦀', label: 'Yengeç', basket: 'sea' },
            { symbol: '🐬', label: 'Yunus', basket: 'sea' }
        ]
    },
    {
        id: 4,
        title: "Uçan, Yürüyen, Yüzen 🦅🐕🐟",
        instruction: "Üç sepet var! Uçanlar, yürüyenler ve yüzenler.",
        baskets: [
            { id: 'fly', label: 'Uçanlar', icon: '☁️', color: '#0EA5E9' },
            { id: 'walk', label: 'Yürüyenler', icon: '🐾', color: '#D97706' },
            { id: 'swim', label: 'Yüzenler', icon: '🌊', color: '#2563EB' }
        ],
        items: [
            { symbol: '🦅', label: 'Kartal', basket: 'fly' },
            { symbol: '🦋', label: 'Kelebek', basket: 'fly' },
            { symbol: '🐝', label: 'Arı', basket: 'fly' },
            { symbol: '🐕', label: 'Köpek', basket: 'walk' },
            { symbol: '🐎', label: 'At', basket: 'walk' },
            { symbol: '🐘', label: 'Fil', basket: 'walk' },
            { symbol: '🐟', label: 'Balık', basket: 'swim' },
            { symbol: '🐋', label: 'Balina', basket: 'swim' },
            { symbol: '🦈', label: 'Köpekbalığı', basket: 'swim' }
        ]
    }
];

// Dışarı aktarma (tarayıcı ortamı için global nesneler)
window.GAME_DATA = {
    BUNNY_LEVELS,
    BALLOON_LEVELS,
    SHAPE_MATCH_LEVELS,
    MEMORY_LEVELS,
    PATTERN_LEVELS,
    SIZE_LEVELS,
    REALTIME_MAZE_LEVELS,
    BALL_TOSS_LEVELS,
    SOAP_BUBBLE_LEVELS,
    ALL_COLORS,
    COLOR_FINDER_LEVELS,
    ALL_NUMBERS,
    NUMBER_FINDER_LEVELS,
    COLORING_PALETTE,
    COLORING_PAGES,
    JIGSAW_LEVELS,
    JIGSAW_DECORATIONS,
    MELODY_NOTES,
    MELODY_LEVELS,
    SORTING_LEVELS
};
