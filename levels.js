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
        title: "Kayanın Etrafından Dolan ⛰️",
        instruction: "Yolumuzda koca bir kaya var! Kayanın yanından dolaşalım.",
        gridSize: { cols: 4, rows: 4 },
        start: { x: 0, y: 1 },
        target: { x: 2, y: 1 },
        obstacles: [{ x: 1, y: 1, type: "rock", emoji: "⛰️" }],
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
            { x: 1, y: 3, type: "rock", emoji: "⛰️" },
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
            { x: 1, y: 1, type: "rock", emoji: "⛰️" },
            { x: 3, y: 1, type: "bush", emoji: "🌳" },
            { x: 1, y: 3, type: "pond", emoji: "💧" },
            { x: 3, y: 3, type: "rock", emoji: "⛰️" }
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
            { x: 3, y: 4, type: "rock", emoji: "⛰️" },
            { x: 2, y: 2, type: "bush", emoji: "🌳" },
            { x: 1, y: 0, type: "pond", emoji: "💧" }
        ],
        stars: [{ x: 4, y: 1 }, { x: 0, y: 3 }],
        pedagogicalFocus: "Geriye doğru uzamsal yönelim ve stratejik planlama"
    },
    {
        id: 10,
        title: "Şampiyon Kaşif! 👑",
        instruction: "Bütün yeteneklerini göster ve havucu kap!",
        gridSize: { cols: 5, rows: 5 },
        start: { x: 0, y: 2 },
        target: { x: 4, y: 2 },
        obstacles: [
            { x: 2, y: 0, type: "rock", emoji: "⛰️" },
            { x: 2, y: 2, type: "bush", emoji: "🌳" },
            { x: 2, y: 4, type: "rock", emoji: "⛰️" }
        ],
        stars: [{ x: 2, y: 1 }, { x: 2, y: 3 }],
        pedagogicalFocus: "Kapsamlı algoritmik düşünme ve ustalık"
    },
    {
        id: 11,
        title: "Kaya Duvarı ⛰️",
        instruction: "Kayaların üstünden dolaş, havuca git!",
        gridSize: { cols: 5, rows: 5 },
        start: { x: 0, y: 4 },
        target: { x: 4, y: 4 },
        obstacles: [
            { x: 2, y: 2, type: "rock", emoji: "⛰️" },
            { x: 2, y: 3, type: "rock", emoji: "⛰️" },
            { x: 2, y: 4, type: "rock", emoji: "⛰️" }
        ],
        stars: [{ x: 2, y: 1 }],
        pedagogicalFocus: "Uzun bir engeli yukarıdan dolaşma (yukarı-sağ-aşağı dizisi)"
    },
    {
        id: 12,
        title: "Dere Kenarı 💧",
        instruction: "Suya girme! Dereyi dolaş, havuca git.",
        gridSize: { cols: 5, rows: 5 },
        start: { x: 0, y: 0 },
        target: { x: 0, y: 4 },
        obstacles: [
            { x: 0, y: 2, type: "pond", emoji: "💧" },
            { x: 1, y: 2, type: "pond", emoji: "💧" },
            { x: 2, y: 2, type: "pond", emoji: "💧" },
            { x: 2, y: 4, type: "bush", emoji: "🌳" }
        ],
        stars: [{ x: 3, y: 2 }, { x: 1, y: 4 }],
        pedagogicalFocus: "Geçitten geçip geri dönme (sağ-aşağı-sol dizisi)"
    },
    {
        id: 13,
        title: "Orman Yolu 🌲",
        instruction: "Ağaçları ve suyu dolaş, yıldızları da topla!",
        gridSize: { cols: 6, rows: 5 },
        start: { x: 0, y: 0 },
        target: { x: 5, y: 4 },
        obstacles: [
            { x: 2, y: 0, type: "bush", emoji: "🌳" },
            { x: 2, y: 1, type: "bush", emoji: "🌳" },
            { x: 4, y: 3, type: "pond", emoji: "💧" },
            { x: 4, y: 4, type: "pond", emoji: "💧" }
        ],
        stars: [{ x: 3, y: 1 }, { x: 1, y: 2 }],
        pedagogicalFocus: "Daha geniş tahtada iki engel grubunu sırayla aşma"
    },
    {
        id: 14,
        title: "Büyük Bahçe Finali 🏆",
        instruction: "Büyük final! Yıldızları da topla, havuca koş!",
        gridSize: { cols: 6, rows: 6 },
        start: { x: 0, y: 5 },
        target: { x: 5, y: 0 },
        obstacles: [
            { x: 1, y: 0, type: "bush", emoji: "🌳" },
            { x: 2, y: 2, type: "pond", emoji: "💧" },
            { x: 3, y: 2, type: "pond", emoji: "💧" },
            { x: 5, y: 2, type: "rock", emoji: "⛰️" },
            { x: 0, y: 3, type: "bush", emoji: "🌳" },
            { x: 2, y: 3, type: "pond", emoji: "💧" },
            { x: 3, y: 3, type: "pond", emoji: "💧" }
        ],
        stars: [{ x: 2, y: 4 }, { x: 4, y: 1 }],
        pedagogicalFocus: "Büyük tahtada gölün çevresinden ara hedeflerle uzun rota planlama"
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
            { name: "Kırmızı", hex: "#EF4444", emoji: "❤️" },
            { name: "Mavi", hex: "#3B82F6", emoji: "💙" },
            { name: "Sarı", hex: "#FACC15", emoji: "💛" },
            { name: "Yeşil", hex: "#22C55E", emoji: "💚" },
            { name: "Mor", hex: "#A855F7", emoji: "💜" }
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
            { name: "Kırmızı", hex: "#EF4444", emoji: "❤️" },
            { name: "Mavi", hex: "#3B82F6", emoji: "💙" },
            { name: "Sarı", hex: "#FACC15", emoji: "💛" },
            { name: "Yeşil", hex: "#22C55E", emoji: "💚" }
        ]
    },
    {
        id: 3,
        title: "Sarı Güneş Balonları ☀️",
        instruction: "Pırıl pırıl parlayan SARI balonları bul ve patlat!",
        targetCount: 5,
        mode: "color_filter",
        targetColor: "Sarı",
        targetDesc: "Yalnızca Sarı balonları patlat!",
        colors: [
            { name: "Sarı", hex: "#FACC15", emoji: "💛" },
            { name: "Mavi", hex: "#3B82F6", emoji: "💙" },
            { name: "Mor", hex: "#A855F7", emoji: "💜" },
            { name: "Yeşil", hex: "#22C55E", emoji: "💚" }
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
    },
    {
        id: 5,
        title: "Mavi Gökyüzü Balonları 🔵",
        instruction: "Sadece MAVİ balonları patlat!",
        targetCount: 6,
        mode: "color_filter",
        targetColor: "Mavi",
        targetDesc: "Yalnızca Mavi balonları patlat!",
        colors: [
            { name: "Mavi", hex: "#3B82F6", emoji: "💙" },
            { name: "Kırmızı", hex: "#EF4444", emoji: "❤️" },
            { name: "Sarı", hex: "#FACC15", emoji: "💛" },
            { name: "Yeşil", hex: "#22C55E", emoji: "💚" },
            { name: "Mor", hex: "#A855F7", emoji: "💜" }
        ]
    },
    {
        id: 6,
        title: "Sırayla Say: 1, 2, 3 🔢",
        instruction: "Balonları sırayla patlat: bir, iki, üç!",
        targetCount: 3,
        mode: "sequence", // Sayılar sırayla patlatılır; sıradaki sayı rozette görünür
        targetDesc: "Balonları sırayla patlat!",
        items: [
            { label: "1", speech: "Bir!" },
            { label: "2", speech: "İki!" },
            { label: "3", speech: "Üç!" }
        ]
    },
    {
        id: 7,
        title: "Beşe Kadar Sayalım 🔢",
        instruction: "Sırayla patlat! Bir, iki, üç, dört, beş!",
        targetCount: 5,
        mode: "sequence",
        targetDesc: "Balonları sırayla patlat!",
        items: [
            { label: "1", speech: "Bir!" },
            { label: "2", speech: "İki!" },
            { label: "3", speech: "Üç!" },
            { label: "4", speech: "Dört!" },
            { label: "5", speech: "Beş!" }
        ]
    },
    {
        id: 8,
        title: "Kim Böyle Der? 🐶",
        instruction: "Sesi dinle, o hayvanın balonunu patlat!",
        targetCount: 4, // tur sayısı: her tur bir hayvan sesi sorulur
        mode: "animal",
        targetDesc: "Sesi çıkaran hayvanı bul!",
        animals: [
            { id: "dog", name: "Köpek", emoji: "🐶", sound: "Hav hav", bark: true },
            { id: "cat", name: "Kedi", emoji: "🐱", sound: "Miyav miyav" },
            { id: "cow", name: "İnek", emoji: "🐮", sound: "Mööö" },
            { id: "duck", name: "Ördek", emoji: "🦆", sound: "Vak vak" }
        ]
    },
    {
        id: 9,
        title: "Çiftlik Sesleri 🐑",
        instruction: "Kim böyle der? Sesi dinle, doğru balonu patlat!",
        targetCount: 5,
        mode: "animal",
        targetDesc: "Sesi çıkaran hayvanı bul!",
        animals: [
            { id: "dog", name: "Köpek", emoji: "🐶", sound: "Hav hav", bark: true },
            { id: "cat", name: "Kedi", emoji: "🐱", sound: "Miyav miyav" },
            { id: "cow", name: "İnek", emoji: "🐮", sound: "Mööö" },
            { id: "sheep", name: "Koyun", emoji: "🐑", sound: "Meee" },
            { id: "frog", name: "Kurbağa", emoji: "🐸", sound: "Vırak vırak" },
            { id: "chicken", name: "Tavuk", emoji: "🐔", sound: "Gıt gıt gıdak" }
        ]
    },
    {
        id: 10,
        title: "Balonları Say 🔢",
        instruction: "Uçan balonları say! Kaç balon gördün?",
        targetCount: 3, // tur sayısı = rounds adedi
        mode: "count", // Balonlar tek tek uçup gider; sonra üç sayı kartından doğrusu seçilir
        targetDesc: "Balonları say!",
        rounds: [2, 3, 4]
    },
    {
        id: 11,
        title: "Altıya Kadar Say 🎈",
        instruction: "Balonlar uçuyor! Dikkatle say!",
        targetCount: 3,
        mode: "count",
        targetDesc: "Balonları say!",
        rounds: [4, 6, 5]
    },
    {
        id: 12,
        title: "Yıldız Balonlar ⭐",
        instruction: "Sadece yıldız balonları patlat!",
        targetCount: 5,
        mode: "shape", // Balon gövdesi kalp, yıldız ya da yuvarlak çizilir
        targetShape: "star",
        targetDesc: "Yalnızca yıldız balonları patlat!",
        shapes: ["star", "heart", "round"]
    },
    {
        id: 13,
        title: "En Büyük Balon 🎈",
        instruction: "En büyük balonu patlat!",
        targetCount: 4, // tur sayısı: her turda üç farklı boyda balon
        mode: "size",
        targetDesc: "En büyük balonu bul!"
    }
];

// 🧩 MODÜL 3: ŞEKİL VE GÖLGE EŞLEŞTİRME (Sürükle/Dokun Eşleştirme)
const SHAPE_MATCH_LEVELS = [
    {
        id: 1,
        title: "Geometrik Şekiller 🔺🔵⬛⭐",
        instruction: "Renkli şekilleri doğru gölgelerine yerleştir!",
        items: [
            { id: "circle", symbol: "🔵", label: "Mavi Daire" },
            { id: "triangle", symbol: "🔺", label: "Kırmızı Üçgen" },
            { id: "square", symbol: "⬛", label: "Siyah Kare" },
            { id: "star", symbol: "⭐", label: "Sarı Yıldız" }
        ]
    },
    {
        id: 2,
        title: "Sevimli Hayvan Dostlarımız 🐶🐱🐰🦊",
        instruction: "Hayvanları gölgeleriyle eşleştir!",
        items: [
            { id: "dog", symbol: "🐶", label: "Köpekçik" },
            { id: "cat", symbol: "🐱", label: "Kediciğim" },
            { id: "rabbit", symbol: "🐰", label: "Tavşancık" },
            { id: "fox", symbol: "🦊", label: "Tilkicik" }
        ]
    },
    {
        id: 3,
        title: "Hızlı Araçlar 🚗✈️🚂⛵",
        instruction: "Araçları kendi silüetlerine yerleştir!",
        items: [
            { id: "car", symbol: "🚗", label: "Otomobil" },
            { id: "plane", symbol: "✈️", label: "Uçak" },
            { id: "train", symbol: "🚂", label: "Tren" },
            { id: "boat", symbol: "⛵", label: "Yelkenli" }
        ]
    },
    {
        id: 4,
        title: "Vitamin Deposu Meyveler 🍎🍌🍓🍇",
        instruction: "Meyveleri doğru gölgelere bırak!",
        items: [
            { id: "apple", symbol: "🍎", label: "Kırmızı Elma" },
            { id: "banana", symbol: "🍌", label: "Muz" },
            { id: "strawberry", symbol: "🍓", label: "Çilek" },
            { id: "grapes", symbol: "🍇", label: "Üzüm" }
        ]
    },
    {
        id: 5,
        title: "Deniz Dostları 🐟🐙🐢🦀",
        instruction: "Deniz canlılarını gölgeleriyle eşleştir!",
        items: [
            { id: "fish", symbol: "🐟", label: "Balık" },
            { id: "octopus", symbol: "🐙", label: "Ahtapot" },
            { id: "turtle", symbol: "🐢", label: "Kaplumbağa" },
            { id: "crab", symbol: "🦀", label: "Yengeç" }
        ]
    },
    {
        id: 6,
        title: "Orman Dostları 🐻🐿️🦔🦌",
        instruction: "Orman hayvanlarını gölgelerine yerleştir!",
        items: [
            { id: "bear", symbol: "🐻", label: "Ayıcık" },
            { id: "squirrel", symbol: "🐿️", label: "Sincap" },
            { id: "hedgehog", symbol: "🦔", label: "Kirpi" },
            { id: "deer", symbol: "🦌", label: "Geyik" }
        ]
    },
    {
        id: 7,
        title: "Kanatlı Kuşlar 🐔🐧🦆🦉",
        instruction: "Kuşların gölgeleri çok benzer, dikkatli bak!",
        items: [
            { id: "chicken", symbol: "🐔", label: "Tavuk" },
            { id: "penguin", symbol: "🐧", label: "Penguen" },
            { id: "duck", symbol: "🦆", label: "Ördek" },
            { id: "owl", symbol: "🦉", label: "Baykuş" }
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
    },
    {
        id: 5,
        title: "Gökyüzü (8 Kart) ☀️🌙⭐☁️",
        instruction: "Gökyüzündeki çiftleri bul!",
        pairs: [
            { id: "sun", symbol: "☀️", label: "Güneş" },
            { id: "moon", symbol: "🌙", label: "Ay" },
            { id: "star", symbol: "⭐", label: "Yıldız" },
            { id: "cloud", symbol: "☁️", label: "Bulut" }
        ]
    },
    {
        id: 6,
        title: "Çiftlik Hayvanları (10 Kart) 🐮🐔🐑",
        instruction: "Çiftlik hayvanlarının eşlerini bul!",
        pairs: [
            { id: "cow", symbol: "🐮", label: "İnek" },
            { id: "chicken", symbol: "🐔", label: "Tavuk" },
            { id: "sheep", symbol: "🐑", label: "Koyun" },
            { id: "horse", symbol: "🐴", label: "At" },
            { id: "duck", symbol: "🦆", label: "Ördek" }
        ]
    },
    {
        id: 7,
        title: "Oyuncak Kutusu (12 Kart) ⚽🎈🧸",
        instruction: "Oyuncak çiftlerini bul, hepsini topla!",
        pairs: [
            { id: "ball", symbol: "⚽", label: "Top" },
            { id: "balloon", symbol: "🎈", label: "Balon" },
            { id: "teddy", symbol: "🧸", label: "Ayıcık" },
            { id: "drum", symbol: "🥁", label: "Davul" },
            { id: "rocket", symbol: "🚀", label: "Roket" },
            { id: "gift", symbol: "🎁", label: "Hediye" }
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
            { symbol: "⚪", label: "Beyaz Top" },
            { symbol: "🔴", label: "Kırmızı Top" },
            { symbol: "⚫", label: "Siyah Top" }
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
        title: "Geometrik Şekiller 🔵🔺",
        instruction: "Daire, Üçgen, Daire, Üçgen... Şimdi hangisi gelmeli?",
        pattern: [
            { symbol: "🔵", label: "Mavi Daire" },
            { symbol: "🔺", label: "Kırmızı Üçgen" },
            { symbol: "🔵", label: "Mavi Daire" },
            { symbol: "🔺", label: "Kırmızı Üçgen" }
        ],
        correct: { symbol: "🔵", label: "Mavi Daire" },
        options: [
            { symbol: "⬛", label: "Kare" },
            { symbol: "🔺", label: "Kırmızı Üçgen" },
            { symbol: "🔵", label: "Mavi Daire" }
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
    },
    {
        id: 9,
        title: "Bulutlu Gökyüzü ☀️☁️",
        instruction: "Güneş, bulut, bulut... Sırada ne var?",
        pattern: [
            { symbol: "☀️", label: "Güneş" },
            { symbol: "☁️", label: "Bulut" },
            { symbol: "☁️", label: "Bulut" },
            { symbol: "☀️", label: "Güneş" },
            { symbol: "☁️", label: "Bulut" },
            { symbol: "☁️", label: "Bulut" }
        ],
        correct: { symbol: "☀️", label: "Güneş" },
        options: [
            { symbol: "☁️", label: "Bulut" },
            { symbol: "☀️", label: "Güneş" },
            { symbol: "🌈", label: "Gökkuşağı" }
        ],
        patternType: "ABB Örüntüsü"
    },
    {
        id: 10,
        title: "Çilek ve Limon 🍓🍋",
        instruction: "Çilek, çilek, limon, limon... Sonra hangisi?",
        pattern: [
            { symbol: "🍓", label: "Çilek" },
            { symbol: "🍓", label: "Çilek" },
            { symbol: "🍋", label: "Limon" },
            { symbol: "🍋", label: "Limon" },
            { symbol: "🍓", label: "Çilek" },
            { symbol: "🍓", label: "Çilek" }
        ],
        correct: { symbol: "🍋", label: "Limon" },
        options: [
            { symbol: "🍓", label: "Çilek" },
            { symbol: "🍋", label: "Limon" },
            { symbol: "🍇", label: "Üzüm" },
            { symbol: "🍊", label: "Portakal" }
        ],
        patternType: "AABB Örüntüsü (4 seçenek)"
    },
    {
        id: 11,
        title: "Dört Arkadaş 🐶🐱🐰🐻",
        instruction: "Köpek, kedi, tavşan, ayı... Sıradaki kim?",
        pattern: [
            { symbol: "🐶", label: "Köpek" },
            { symbol: "🐱", label: "Kedi" },
            { symbol: "🐰", label: "Tavşan" },
            { symbol: "🐻", label: "Ayı" },
            { symbol: "🐶", label: "Köpek" },
            { symbol: "🐱", label: "Kedi" },
            { symbol: "🐰", label: "Tavşan" }
        ],
        correct: { symbol: "🐻", label: "Ayı" },
        options: [
            { symbol: "🐶", label: "Köpek" },
            { symbol: "🐻", label: "Ayı" },
            { symbol: "🐸", label: "Kurbağa" }
        ],
        patternType: "ABCD Dörtlü Döngü"
    },
    {
        id: 12,
        title: "Meyve Treni 🍎🍌🍇🍉",
        instruction: "Elma, muz, üzüm, karpuz... Sıradaki hangisi?",
        pattern: [
            { symbol: "🍎", label: "Elma" },
            { symbol: "🍌", label: "Muz" },
            { symbol: "🍇", label: "Üzüm" },
            { symbol: "🍉", label: "Karpuz" },
            { symbol: "🍎", label: "Elma" },
            { symbol: "🍌", label: "Muz" },
            { symbol: "🍇", label: "Üzüm" }
        ],
        correct: { symbol: "🍉", label: "Karpuz" },
        options: [
            { symbol: "🍎", label: "Elma" },
            { symbol: "🍌", label: "Muz" },
            { symbol: "🍇", label: "Üzüm" },
            { symbol: "🍉", label: "Karpuz" }
        ],
        patternType: "ABCD Dörtlü Döngü (4 seçenek)"
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
        title: "Gök Cisimleri 🌑🌍☀️",
        instruction: "Küçük Ay'dan Dünya'ya, oradan sıcacık dev Güneş'e doğru!",
        items: [
            { id: "ay", symbol: "🌑", label: "Ay", rank: 1, sizeText: "En Küçük", scale: 0.75 },
            { id: "dunya", symbol: "🌍", label: "Dünyamız", rank: 2, sizeText: "Orta Boy", scale: 1.2 },
            { id: "gunes", symbol: "☀️", label: "Güneş", rank: 3, sizeText: "En Büyük", scale: 1.65 }
        ],
        pedagogicalFocus: "Geniş ölçekli kavramsal düşünme"
    },
    {
        id: 7,
        title: "Dört Hayvan Dostu 🐭🐱🐴🐘",
        instruction: "Dört hayvanı en küçükten en büyüğe diz!",
        items: [
            { id: "fare", symbol: "🐭", label: "Fare", rank: 1, sizeText: "En Küçük", scale: 0.7 },
            { id: "kedi", symbol: "🐱", label: "Kedi", rank: 2, sizeText: "Küçük", scale: 0.95 },
            { id: "at", symbol: "🐴", label: "At", rank: 3, sizeText: "Büyük", scale: 1.2 },
            { id: "fil", symbol: "🐘", label: "Fil", rank: 4, sizeText: "En Büyük", scale: 1.45 }
        ],
        pedagogicalFocus: "Dört nesneyle sıralama (Seriation)"
    },
    {
        id: 8,
        title: "Tersine Sırala 🌳🌷🐞",
        instruction: "Bu kez tersine! En büyükten en küçüğe diz!",
        order: "desc", // İsteğe bağlı: büyükten küçüğe sıralama (yoksa küçükten büyüğe)
        items: [
            { id: "agac", symbol: "🌳", label: "Ağaç", rank: 3, sizeText: "En Büyük", scale: 1.6 },
            { id: "cicek", symbol: "🌷", label: "Çiçek", rank: 2, sizeText: "Orta Boy", scale: 1.15 },
            { id: "ugurbocegi", symbol: "🐞", label: "Uğur Böceği", rank: 1, sizeText: "En Küçük", scale: 0.75 }
        ],
        pedagogicalFocus: "Ters yönde sıralama (büyükten küçüğe)"
    },
    {
        id: 9,
        title: "Deniz Canlıları 🐳🐬🐟🦐",
        instruction: "Koca balinadan minik karidese doğru diz!",
        order: "desc",
        items: [
            { id: "balina", symbol: "🐳", label: "Balina", rank: 4, sizeText: "En Büyük", scale: 1.45 },
            { id: "yunus", symbol: "🐬", label: "Yunus", rank: 3, sizeText: "Büyük", scale: 1.2 },
            { id: "balik", symbol: "🐟", label: "Balık", rank: 2, sizeText: "Küçük", scale: 0.95 },
            { id: "karides", symbol: "🦐", label: "Karides", rank: 1, sizeText: "En Küçük", scale: 0.7 }
        ],
        pedagogicalFocus: "Dört nesneyle ters yönde sıralama"
    }
];

// 🐶 MODÜL 7: CANLI YÖN OKLU LABİRENT (ekran okları / klavye ok tuşları)
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
        instruction: "Oklarla dikkatlice ilerle, yıldızları toplayıp lezzetli kemiği yakala!",
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
    },
    {
        id: 4,
        title: "Zikzak Patika 🐾",
        instruction: "Yolu takip et, kemiğe koş!",
        cols: 7,
        rows: 6,
        start: { x: 0, y: 0 },
        goal: { x: 6, y: 5 },
        walls: [
            { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 6, y: 1 },
            { x: 0, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }
        ],
        stars: [{ x: 6, y: 0 }, { x: 0, y: 2 }, { x: 3, y: 4 }]
    },
    {
        id: 5,
        title: "Kaktüs Çölü 🌵",
        instruction: "Kaktüslerin arasından kemiğe koş!",
        cols: 7,
        rows: 5,
        start: { x: 0, y: 0 },
        goal: { x: 6, y: 0 },
        wallEmoji: "🌵",
        walls: [
            { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
            { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 },
            { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }
        ],
        stars: [{ x: 0, y: 4 }, { x: 2, y: 0 }, { x: 4, y: 4 }]
    },
    {
        id: 6,
        title: "Karlı Orman ⛄",
        instruction: "Kardan adamların arasından geç, kemiği bul!",
        cols: 7,
        rows: 7,
        start: { x: 0, y: 0 },
        goal: { x: 6, y: 6 },
        wallEmoji: "⛄",
        walls: [
            { x: 3, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 },
            { x: 5, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 },
            { x: 3, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
            { x: 5, y: 5 }, { x: 5, y: 6 }
        ],
        stars: [{ x: 3, y: 2 }, { x: 1, y: 4 }, { x: 0, y: 6 }]
    },
    {
        id: 7,
        title: "Ayçiçeği Tarlası 🌻",
        instruction: "Dört yıldızı da toplayabilir misin? Sonra kemiğe koş!",
        cols: 7,
        rows: 7,
        start: { x: 0, y: 0 },
        goal: { x: 6, y: 6 },
        wallEmoji: "🌻",
        walls: [
            { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 },
            { x: 5, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 4 },
            { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 },
            { x: 4, y: 6 }
        ],
        stars: [{ x: 3, y: 0 }, { x: 3, y: 2 }, { x: 0, y: 4 }, { x: 3, y: 6 }]
    },
    {
        id: 8,
        title: "Büyük Orman Labirenti 🌲",
        instruction: "Yıldızları toplayabilir misin? Sonra kemiği yakala!",
        cols: 7,
        rows: 7,
        start: { x: 0, y: 0 },
        goal: { x: 6, y: 6 },
        wallEmoji: "🌲",
        walls: [
            { x: 3, y: 0 }, { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 }, { x: 1, y: 2 },
            { x: 5, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 },
            { x: 3, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
            { x: 5, y: 5 }
        ],
        stars: [{ x: 6, y: 0 }, { x: 4, y: 2 }, { x: 0, y: 4 }, { x: 0, y: 6 }]
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
    },
    {
        id: 4,
        title: "Muz Sever Maymun 🐵",
        instruction: "Maymun küçüldü! Dikkatle nişan al, muzu at!",
        targetEmoji: "🐵",
        targetLabel: "Maymuncuk",
        ballEmoji: "🍌",
        ballLabel: "Muz",
        targetCount: 5,
        targetSpeed: 0.2,
        targetScale: 0.8 // İsteğe bağlı: hedef %80 boyutunda (yoksa tam boy)
    },
    {
        id: 5,
        title: "Penguene Balık 🐧",
        instruction: "Penguen kayıyor! Balığı tam ona at!",
        targetEmoji: "🐧",
        targetLabel: "Penguen",
        ballEmoji: "🐟",
        ballLabel: "Balık",
        targetCount: 6,
        targetSpeed: 0.3,
        targetScale: 0.85
    },
    {
        id: 6,
        title: "Aç Filcik 🐘",
        instruction: "Filcik çok hızlı! Meyveleri ona fırlat!",
        targetEmoji: "🐘",
        targetLabel: "Filcik",
        ballEmoji: "🍎",
        ballLabel: "Meyve",
        ballEmojis: ["🍎", "🍌", "🍉", "🍇"], // İsteğe bağlı: her atışta sıradaki meyve
        targetCount: 6,
        targetSpeed: 0.34,
        targetScale: 0.8
    }
];

// 🧼 MODÜL 9: SİHİRLİ SABUN KÖPÜĞÜ (Magic Soap Bubble Pop & Reveal)
const SOAP_BUBBLE_LEVELS = [
    {
        id: 1,
        title: "Deniz Canlısı Baloncukları 🧼🐬",
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
        title: "Sürpriz Oyuncak Köpükleri 🧼🧸",
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
        title: "Lezzetli Meyve Köpükleri 🧼🍓",
        instruction: "Köpükleri patlat ve meyveleri keşfet!",
        targetCount: 8,
        surprises: [
            { symbol: "🍓", label: "Çilek" },
            { symbol: "🍌", label: "Muz" },
            { symbol: "🍎", label: "Elma" },
            { symbol: "🍇", label: "Üzüm" },
            { symbol: "🍉", label: "Karpuz" }
        ]
    },
    {
        id: 4,
        title: "Balıklı Köpükler 🧼🐠",
        instruction: "Sadece içinde balık olan köpükleri patlat!",
        targetCount: 6,
        // İsteğe bağlı: yalnız bu sürprizler sayılır; diğer köpükler sallanır, patlamaz
        goalSymbols: ["🐠", "🐟"],
        goalHint: "Balığı bul!",
        surprises: [
            { symbol: "🐠", label: "Renkli Balık" },
            { symbol: "🐟", label: "Balık" },
            { symbol: "🐙", label: "Ahtapot" },
            { symbol: "🦀", label: "Yengeç" },
            { symbol: "🐢", label: "Kaplumbağa" }
        ]
    },
    {
        id: 5,
        title: "Minik Hızlı Köpükler 🧼🐰",
        instruction: "Köpükler küçüldü ve hızlandı! Hepsini yakala!",
        targetCount: 10,
        bubbleScale: 0.8, // İsteğe bağlı: köpük boyutu (yoksa 1)
        floatSpeed: 1.4, // İsteğe bağlı: yükselme hızı çarpanı (yoksa 1)
        surprises: [
            { symbol: "🐶", label: "Köpek" },
            { symbol: "🐱", label: "Kedi" },
            { symbol: "🐰", label: "Tavşan" },
            { symbol: "🐥", label: "Civciv" },
            { symbol: "🐮", label: "İnek" }
        ]
    },
    {
        id: 6,
        title: "Yıldızlı Gece Köpükleri 🧼⭐",
        instruction: "Sadece yıldızlı köpükleri patlat!",
        targetCount: 8,
        goalSymbols: ["⭐"],
        goalHint: "Yıldızı bul!",
        bubbleScale: 0.85,
        floatSpeed: 1.2,
        surprises: [
            { symbol: "⭐", label: "Yıldız" },
            { symbol: "🌙", label: "Ay" },
            { symbol: "☁️", label: "Bulut" },
            { symbol: "🚀", label: "Roket" },
            { symbol: "☀️", label: "Güneş" }
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
        items: ['🔴 Halka', '🍎 Elma', '🚗 Araba', '🍓 Çilek']
    },
    blue: {
        id: 'blue',
        name: 'Mavi',
        colorHex: '#2563EB',
        cardBg: '#EFF6FF',
        borderHex: '#1D4ED8',
        emoji: '🌊',
        items: ['🔵 Halka', '🌊 Dalga', '🚙 Araba', '🐬 Yunus']
    },
    yellow: {
        id: 'yellow',
        name: 'Sarı',
        colorHex: '#EAB308',
        cardBg: '#FEFCE8',
        borderHex: '#CA8A04',
        emoji: '☀️',
        items: ['💛 Kalp', '☀️ Güneş', '🍌 Muz', '🐥 Civciv']
    },
    green: {
        id: 'green',
        name: 'Yeşil',
        colorHex: '#16A34A',
        cardBg: '#F0FDF4',
        borderHex: '#15803D',
        emoji: '🐸',
        items: ['💚 Kalp', '🍏 Yeşil Elma', '🐸 Kurbağa', '🌳 Ağaç']
    },
    orange: {
        id: 'orange',
        name: 'Turuncu',
        colorHex: '#EA580C',
        cardBg: '#FFF7ED',
        borderHex: '#C2410C',
        emoji: '🥕',
        items: ['🧡 Kalp', '🥕 Havuç', '🍊 Portakal', '🦊 Tilki']
    },
    purple: {
        id: 'purple',
        name: 'Mor',
        colorHex: '#9333EA',
        cardBg: '#FAF5FF',
        borderHex: '#7E22CE',
        emoji: '🍇',
        items: ['💜 Kalp', '🍇 Üzüm', '🍆 Patlıcan', '🔮 Küre']
    },
    pink: {
        id: 'pink',
        name: 'Pembe',
        colorHex: '#DB2777',
        cardBg: '#FDF2F8',
        borderHex: '#BE185D',
        emoji: '🌸',
        items: ['🌸 Çiçek', '🐷 Domuzcuk', '🎀 Kurdele', '🍧 Dondurma']
    },
    brown: {
        id: 'brown',
        name: 'Kahverengi',
        colorHex: '#78350F',
        cardBg: '#FEF3C7',
        borderHex: '#451A03',
        emoji: '🐻',
        items: ['🥔 Patates', '🐻 Ayıcık', '🌰 Kestane', '🍫 Çikolata']
    },
    white: {
        id: 'white',
        name: 'Beyaz',
        colorHex: '#475569',
        cardBg: '#FFFFFF',
        borderHex: '#94A3B8',
        emoji: '🐇',
        items: ['⚪ Halka', '🐇 Tavşan', '☁️ Bulut', '⛄ Kardan Adam']
    },
    black: {
        id: 'black',
        name: 'Siyah',
        colorHex: '#0F172A',
        cardBg: '#F8FAFC',
        borderHex: '#334155',
        emoji: '🎩',
        items: ['⚫ Halka', '🦇 Yarasa', '🎩 Şapka', '🕶️ Gözlük']
    }
};

// cardStyle (isteğe bağlı): 'object' = kartta renk zemini/adı yok, yalnız o renkteki nesne resmi
const COLOR_FINDER_LEVELS = [
    {
        id: 1,
        title: "Ana Renkler Dünyası 🎨",
        instruction: "Hangi rengi istediğimi dinle, o renkteki karta dokun!",
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
        instruction: "Doğanın renkleri! Dinle ve doğru renkteki kartı bul!",
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
        instruction: "Renk adını dikkatle dinle, sonra o karta dokun!",
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
        instruction: "Harika bir renk ustasısın! Bir sürü renk arasından istediğimi bul!",
        rounds: [
            { target: 'red', options: ['red', 'blue', 'yellow', 'green', 'orange', 'purple'] },
            { target: 'green', options: ['blue', 'green', 'yellow', 'pink', 'orange', 'brown'] },
            { target: 'yellow', options: ['yellow', 'red', 'green', 'blue', 'purple', 'black'] },
            { target: 'purple', options: ['purple', 'pink', 'blue', 'orange', 'green', 'red'] },
            { target: 'blue', options: ['blue', 'red', 'yellow', 'green', 'purple', 'white'] }
        ]
    },
    {
        id: 5,
        title: "Bütün Renkler Karışık 🎨",
        instruction: "Bir sürü renk var! Söylediğim rengi bul!",
        rounds: [
            { target: 'pink', options: ['red', 'pink', 'purple', 'orange', 'blue', 'yellow'] },
            { target: 'brown', options: ['orange', 'black', 'brown', 'green', 'yellow', 'red'] },
            { target: 'orange', options: ['yellow', 'red', 'pink', 'orange', 'brown', 'purple'] },
            { target: 'white', options: ['white', 'yellow', 'pink', 'blue', 'green', 'black'] },
            { target: 'black', options: ['brown', 'purple', 'blue', 'white', 'black', 'green'] }
        ]
    },
    {
        id: 6,
        title: "Renkli Resimler 🍎🐸",
        instruction: "Bu kez kartlarda resim var! Söylediğim renkteki resme dokun!",
        cardStyle: 'object',
        rounds: [
            { target: 'yellow', options: ['yellow', 'red', 'green', 'purple'] },
            { target: 'green', options: ['orange', 'green', 'blue', 'pink'] },
            { target: 'red', options: ['blue', 'purple', 'red', 'yellow'] },
            { target: 'orange', options: ['green', 'orange', 'brown', 'blue'] },
            { target: 'purple', options: ['purple', 'yellow', 'red', 'green'] }
        ]
    }
];

// ==========================================
// 🔢 MODÜL 11: SAYI BULUCU VERİLERİ (SESLİ & DOKUNMATİK)
// ==========================================
const ALL_NUMBERS = {
    1: { num: 1, word: 'BİR', emoji: '🦁', countLabel: '1 Sevimli Aslan', countVisual: '🦁' },
    2: { num: 2, word: 'İKİ', emoji: '🍎', countLabel: '2 Kırmızı Elma', countVisual: '🍎 🍎' },
    3: { num: 3, word: 'ÜÇ', emoji: '⭐', countLabel: '3 Parlayan Yıldız', countVisual: '⭐ ⭐ ⭐' },
    4: { num: 4, word: 'DÖRT', emoji: '🦆', countLabel: '4 Neşeli Ördek', countVisual: '🦆 🦆 🦆 🦆' },
    5: { num: 5, word: 'BEŞ', emoji: '🎈', countLabel: '5 Renkli Balon', countVisual: '🎈 🎈 🎈 🎈 🎈' },
    6: { num: 6, word: 'ALTI', emoji: '🍓', countLabel: '6 Tatlı Çilek', countVisual: '🍓 🍓 🍓 🍓 🍓 🍓' },
    7: { num: 7, word: 'YEDİ', emoji: '🦋', countLabel: '7 Kelebek', countVisual: '🦋 🦋 🦋 🦋 🦋 🦋 🦋' },
    8: { num: 8, word: 'SEKİZ', emoji: '🐟', countLabel: '8 Sevimli Balık', countVisual: '🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟' },
    9: { num: 9, word: 'DOKUZ', emoji: '🍪', countLabel: '9 Kurabiye', countVisual: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    10: { num: 10, word: 'ON', emoji: '🏆', countLabel: '10 Şampiyon Kupa', countVisual: '🏆 🏆 🏆 🏆 🏆 🏆 🏆 🏆 🏆 🏆' }
};

// cardStyle (isteğe bağlı): 'count' = kartta rakam/yazı yok, countEmoji'den sayı kadar (çocuk sayar)
// ask (isteğe bağlı): 'most' = "En çok olanı bul!" (hedef seçeneklerdeki en büyük sayı olmalı)
const NUMBER_FINDER_LEVELS = [
    {
        id: 1,
        title: "1'den 3'e İlk Sayılar 🔢",
        instruction: "Hangi sayıyı istediğimi dinle, o sayının kartına dokun!",
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
        instruction: "Dinle ve say! Doğru sayının kartını bul!",
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
        instruction: "Büyük sayılar! Dinle ve doğru kartı hemen bul!",
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
        instruction: "Sen tam bir sayı dahisisin! Karışık sayılardan istediğimi bul!",
        rounds: [
            { target: 7, options: [3, 5, 7, 8, 9, 10] },
            { target: 3, options: [1, 2, 3, 4, 6, 8] },
            { target: 9, options: [4, 6, 7, 8, 9, 10] },
            { target: 4, options: [2, 4, 5, 6, 7, 9] },
            { target: 10, options: [5, 6, 7, 8, 9, 10] }
        ]
    },
    {
        id: 5,
        title: "Say ve Bul 🍎",
        instruction: "Kartlardaki elmaları say!",
        cardStyle: 'count',
        countEmoji: '🍎',
        rounds: [
            { target: 2, options: [1, 2, 4] },
            { target: 3, options: [3, 1, 5] },
            { target: 1, options: [3, 1, 4] },
            { target: 4, options: [2, 4, 1] },
            { target: 5, options: [5, 2, 3] }
        ]
    },
    {
        id: 6,
        title: "En Çok Hangisinde? 🍓",
        instruction: "Kartlardaki çilekleri say!",
        cardStyle: 'count',
        countEmoji: '🍓',
        ask: 'most',
        rounds: [
            { target: 4, options: [1, 4, 2] },
            { target: 5, options: [5, 2, 3] },
            { target: 6, options: [3, 6, 1] },
            { target: 4, options: [2, 1, 4] },
            { target: 6, options: [6, 3, 4] }
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
            <circle class="paint-region" cx="96" cy="78" r="17"/>
            <circle class="paint-region" cx="78" cy="46" r="14"/>
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
            <circle class="paint-region" cx="324" cy="168" r="14"/>
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
            <path class="paint-region" d="M193 138 H209 V252 H193 Z"/>
            <path class="paint-region" d="M198 212 Q158 190 146 216 Q174 232 198 222 Z"/>
            <path class="paint-region" d="M204 192 Q242 170 254 196 Q228 212 204 202 Z"/>
            <circle class="paint-region" cx="200" cy="72" r="27"/>
            <circle class="paint-region" cx="236" cy="98" r="27"/>
            <circle class="paint-region" cx="222" cy="140" r="27"/>
            <circle class="paint-region" cx="178" cy="140" r="27"/>
            <circle class="paint-region" cx="164" cy="98" r="27"/>
            <circle class="paint-region" cx="200" cy="110" r="23"/>
            <g transform="rotate(-20 304 62)"><ellipse class="paint-region" cx="304" cy="62" rx="24" ry="30"/></g>
            <g transform="rotate(20 346 62)"><ellipse class="paint-region" cx="346" cy="62" rx="24" ry="30"/></g>
            <rect class="paint-fixed" x="320" y="38" width="10" height="52" rx="5" fill="#334155"/>
        `
    },
    {
        id: 5,
        title: "Sevimli Kedi 🐱",
        instruction: "Kediyi, yumağı ve odayı boya!",
        svg: `
            <rect class="paint-region" x="0" y="0" width="400" height="232"/>
            <rect class="paint-region" x="0" y="230" width="400" height="70"/>
            <rect class="paint-region" x="34" y="36" width="84" height="74"/>
            <path class="paint-region" d="M250 222 C300 222 322 182 300 140 L314 134 C342 184 312 238 254 238 Z"/>
            <ellipse class="paint-region" cx="200" cy="200" rx="70" ry="50"/>
            <polygon class="paint-region" points="150,92 160,40 192,78"/>
            <polygon class="paint-region" points="208,78 240,40 250,92"/>
            <circle class="paint-region" cx="200" cy="110" r="52"/>
            <circle class="paint-region" cx="324" cy="242" r="28"/>
            <path class="paint-fixed" d="M76 36 V110 M34 73 H118" fill="none"/>
            <circle class="paint-fixed" cx="182" cy="102" r="6" fill="#1E293B"/>
            <circle class="paint-fixed" cx="218" cy="102" r="6" fill="#1E293B"/>
            <polygon class="paint-fixed" points="193,118 207,118 200,127" fill="#F472B6"/>
            <path class="paint-fixed" d="M200 127 Q193 137 185 131 M200 127 Q207 137 215 131" fill="none"/>
            <path class="paint-fixed" d="M168 122 H138 M168 130 L140 138 M232 122 H262 M232 130 L260 138" fill="none"/>
            <path class="paint-fixed" d="M302 230 Q324 242 346 230 M298 250 Q324 264 350 250" fill="none"/>
        `
    },
    {
        id: 6,
        title: "Elma Ağacı 🌳",
        instruction: "Ağacı, elmaları ve güneşi boya!",
        svg: `
            <rect class="paint-region" x="0" y="0" width="400" height="232"/>
            <rect class="paint-region" x="0" y="230" width="400" height="70"/>
            <circle class="paint-region" cx="56" cy="54" r="30"/>
            <path class="paint-region" d="M292 64 a20 20 0 0 1 30 -16 a24 24 0 0 1 44 6 a18 18 0 0 1 2 34 h-70 a16 16 0 0 1 -6 -24z"/>
            <path class="paint-region" d="M180 252 L190 150 H214 L224 252 Z"/>
            <path class="paint-region" d="M200 36 C252 36 284 76 272 112 C306 128 294 182 252 176 C232 198 168 198 148 176 C106 182 94 128 128 112 C116 76 148 36 200 36 Z"/>
            <circle class="paint-region" cx="164" cy="112" r="15"/>
            <circle class="paint-region" cx="236" cy="96" r="15"/>
            <circle class="paint-region" cx="214" cy="152" r="15"/>
            <path class="paint-fixed" d="M164 97 V89 M236 81 V73 M214 137 V129" fill="none"/>
        `
    },
    {
        id: 7,
        title: "Gökkuşağı 🌈",
        instruction: "Gökkuşağının renklerini sen seç!",
        svg: `
            <rect class="paint-region" x="0" y="0" width="400" height="264"/>
            <rect class="paint-region" x="0" y="262" width="400" height="38"/>
            <circle class="paint-region" cx="346" cy="54" r="28"/>
            <path class="paint-region" d="M30 240 A170 170 0 0 1 370 240 H344 A144 144 0 0 0 56 240 Z"/>
            <path class="paint-region" d="M56 240 A144 144 0 0 1 344 240 H318 A118 118 0 0 0 82 240 Z"/>
            <path class="paint-region" d="M82 240 A118 118 0 0 1 318 240 H292 A92 92 0 0 0 108 240 Z"/>
            <path class="paint-region" d="M108 240 A92 92 0 0 1 292 240 H266 A66 66 0 0 0 134 240 Z"/>
            <path class="paint-region" d="M24 250 a22 22 0 0 1 20 -30 a30 30 0 0 1 54 -6 a24 24 0 0 1 34 22 a18 18 0 0 1 -6 30 h-92 a16 16 0 0 1 -10 -16z"/>
            <path class="paint-region" d="M376 250 a22 22 0 0 0 -20 -30 a30 30 0 0 0 -54 -6 a24 24 0 0 0 -34 22 a18 18 0 0 0 6 30 h92 a16 16 0 0 0 10 -16z"/>
        `
    },
    {
        id: 8,
        title: "Uzay Roketi 🚀",
        instruction: "Roketi, gezegeni ve yıldızı boya!",
        svg: `
            <rect class="paint-region" x="0" y="0" width="400" height="300"/>
            <circle class="paint-region" cx="76" cy="226" r="48"/>
            <circle class="paint-region" cx="332" cy="62" r="30"/>
            <polygon class="paint-region" points="96,30 105,52 128,54 110,68 116,90 96,78 76,90 82,68 64,54 87,52"/>
            <path class="paint-region" d="M186 206 Q188 248 210 280 Q232 248 234 206 Z"/>
            <polygon class="paint-region" points="182,150 148,214 182,204"/>
            <polygon class="paint-region" points="238,150 272,214 238,204"/>
            <rect class="paint-region" x="180" y="84" width="60" height="126"/>
            <path class="paint-region" d="M180 86 Q182 54 210 28 Q238 54 240 86 Z"/>
            <circle class="paint-region" cx="210" cy="132" r="17"/>
            <ellipse class="paint-fixed" cx="76" cy="226" rx="72" ry="13" fill="none"/>
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
    { id: 6, title: "Neşeli Tren 🚂", instruction: "Şampiyon yapbozcu! Treni tamamla.", hero: '🚂', heroLabel: 'Tren', cols: 3, rows: 3, colors: ['#FED7AA', '#FB923C'], guide: 0.1 },
    { id: 7, title: "Bilge Baykuş 🦉", instruction: "Baykuşun dokuz parçasını yerleştir!", hero: '🦉', heroLabel: 'Baykuş', cols: 3, rows: 3, colors: ['#DDD6FE', '#8B5CF6'], guide: 0.1 },
    { id: 8, title: "Neşeli Ahtapot 🐙", instruction: "12 parçalık dev yapboz! Köşelerden başla.", hero: '🐙', heroLabel: 'Ahtapot', cols: 3, rows: 4, colors: ['#A5F3FC', '#0891B2'], guide: 0.14 },
    { id: 9, title: "Uzay Roketi 🚀", instruction: "Yapboz şampiyonu! Roketi tamamla.", hero: '🚀', heroLabel: 'Roket', cols: 3, rows: 4, colors: ['#C7D2FE', '#312E81'], guide: 0.14 }
];

// 12 süs: 3x4'lük yapbozda bile her parçanın süsü farklı olsun
const JIGSAW_DECORATIONS = ['☀️', '☁️', '🌈', '🌼', '🍄', '⭐', '🦋', '🌷', '🍀', '🌙', '🎈', '🍎'];

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
// tempo (isteğe bağlı): notalar arası bekleme (ms); verilmezse 700
const MELODY_LEVELS = [
    { id: 1, title: "Serbest Ksilofon 🎹", instruction: "Renkli tuşlara dokun, kendi şarkını çal!", mode: 'free', notes: ['do', 're', 'mi', 'fa', 'sol', 'la'], goal: 10 },
    { id: 2, title: "İki Nota Yankısı 🐱🐰", instruction: "Önce dinle! Sonra aynı iki notayı sırayla çal.", mode: 'echo', notes: ['do', 'mi', 'sol'], length: 2, rounds: 4 },
    { id: 3, title: "Üç Nota Yankısı 🎶", instruction: "Üç notayı dikkatle dinle ve aynı sırayla çal!", mode: 'echo', notes: ['do', 're', 'mi', 'sol'], length: 3, rounds: 4 },
    { id: 4, title: "Melodi Ustası 🏆", instruction: "Dört notalık melodiyi hatırlayabilir misin?", mode: 'echo', notes: ['do', 're', 'mi', 'fa', 'sol', 'la'], length: 4, rounds: 4 },
    { id: 5, title: "Beş Nota Yankısı 🐱🐰🐳", instruction: "Beş nota geliyor! Dinle ve aynısını çal.", mode: 'echo', notes: ['do', 'mi', 'sol'], length: 5, rounds: 3 },
    { id: 6, title: "Hızlı Melodi 🚀", instruction: "Bu melodi çok hızlı! Dikkatle dinle ve çal.", mode: 'echo', notes: ['do', 're', 'mi', 'fa', 'sol'], length: 5, rounds: 3, tempo: 520 }
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
            { symbol: '🧢', label: 'Mavi Şapka', basket: 'blue' },
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
    },
    {
        id: 5,
        title: "Gündüz mü, Gece mi? ☀️🌙",
        instruction: "Gündüz mü, gece mi? Doğru sepete koy!",
        baskets: [
            { id: 'day', label: 'Gündüz', icon: '☀️', color: '#F59E0B' },
            { id: 'night', label: 'Gece', icon: '🌙', color: '#4338CA' }
        ],
        items: [
            { symbol: '🌈', label: 'Gökkuşağı', basket: 'day' },
            { symbol: '🐓', label: 'Horoz', basket: 'day' },
            { symbol: '🌻', label: 'Ayçiçeği', basket: 'day' },
            { symbol: '🦋', label: 'Kelebek', basket: 'day' },
            { symbol: '⭐', label: 'Yıldız', basket: 'night' },
            { symbol: '🦉', label: 'Baykuş', basket: 'night' },
            { symbol: '🌕', label: 'Dolunay', basket: 'night' },
            { symbol: '🦇', label: 'Yarasa', basket: 'night' }
        ]
    },
    {
        id: 6,
        title: "Yiyecek mi, Oyuncak mı? 🍕🧸",
        instruction: "Yiyecekler bir sepete, oyuncaklar öbür sepete!",
        baskets: [
            { id: 'food', label: 'Yiyecekler', icon: '🍴', color: '#16A34A' },
            { id: 'toy', label: 'Oyuncaklar', icon: '🧸', color: '#DB2777' }
        ],
        items: [
            { symbol: '🍕', label: 'Pizza', basket: 'food' },
            { symbol: '🍞', label: 'Ekmek', basket: 'food' },
            { symbol: '🧀', label: 'Peynir', basket: 'food' },
            { symbol: '🍰', label: 'Pasta', basket: 'food' },
            { symbol: '⚽', label: 'Top', basket: 'toy' },
            { symbol: '🎈', label: 'Balon', basket: 'toy' },
            { symbol: '🧩', label: 'Yapboz', basket: 'toy' },
            { symbol: '🤖', label: 'Robot', basket: 'toy' }
        ]
    },
    {
        id: 7,
        title: "Büyük mü, Küçük mü? 🐘🐜",
        instruction: "Büyük hayvanlar bir sepete, küçükler öbürüne!",
        baskets: [
            { id: 'big', label: 'Büyük', icon: '🐘', color: '#7C3AED' },
            { id: 'small', label: 'Küçük', icon: '🐜', color: '#0D9488' }
        ],
        items: [
            { symbol: '🐋', label: 'Balina', basket: 'big' },
            { symbol: '🦒', label: 'Zürafa', basket: 'big' },
            { symbol: '🦏', label: 'Gergedan', basket: 'big' },
            { symbol: '🐫', label: 'Deve', basket: 'big' },
            { symbol: '🐞', label: 'Uğur Böceği', basket: 'small' },
            { symbol: '🐭', label: 'Fare', basket: 'small' },
            { symbol: '🐝', label: 'Arı', basket: 'small' },
            { symbol: '🐌', label: 'Salyangoz', basket: 'small' }
        ]
    },
    {
        id: 8,
        title: "Kırmızı, Sarı, Yeşil ❤️💛💚",
        instruction: "Üç renk sepeti var! Her şeyi kendi rengine koy.",
        baskets: [
            { id: 'red', label: 'Kırmızı', icon: '❤️', color: '#EF4444' },
            { id: 'yellow', label: 'Sarı', icon: '💛', color: '#CA8A04' },
            { id: 'green', label: 'Yeşil', icon: '💚', color: '#16A34A' }
        ],
        items: [
            { symbol: '🍎', label: 'Elma', basket: 'red' },
            { symbol: '🍅', label: 'Domates', basket: 'red' },
            { symbol: '🍓', label: 'Çilek', basket: 'red' },
            { symbol: '🍌', label: 'Muz', basket: 'yellow' },
            { symbol: '🍋', label: 'Limon', basket: 'yellow' },
            { symbol: '🐥', label: 'Civciv', basket: 'yellow' },
            { symbol: '🐸', label: 'Kurbağa', basket: 'green' },
            { symbol: '🍀', label: 'Yonca', basket: 'green' },
            { symbol: '🥒', label: 'Salatalık', basket: 'green' }
        ]
    }
];

// 🔍 Farklı Olanı Bul: her turda 3-4 kart, biri tek bir özelliğiyle farklı.
// Tur: base = aynı kartlar, odd = farklı kart (yoksa base), oddStyle = 'big' | 'small' | 'flip' | 'upside',
// count = kart sayısı (3-4), say = doğru seçimde söylenecek kısa açıklama
const ODDONE_LEVELS = [
    {
        id: 1,
        title: "Hayvanlar 🐶🐱",
        instruction: "Biri farklı! Ona dokun.",
        rounds: [
            { base: '🐶', odd: '🐱', count: 3, say: "Kedi! Ötekiler köpek." },
            { base: '🐮', odd: '🐷', count: 3, say: "Domuz! Ötekiler inek." },
            { base: '🐔', odd: '🐟', count: 3, say: "Balık! Ötekiler tavuk." }
        ]
    },
    {
        id: 2,
        title: "Meyveler 🍎🍌",
        instruction: "Hangi meyve farklı? Ona dokun.",
        rounds: [
            { base: '🍎', odd: '🍌', count: 3, say: "Muz! Ötekiler elma." },
            { base: '🍓', odd: '🍇', count: 3, say: "Üzüm! Ötekiler çilek." },
            { base: '🍊', odd: '🍉', count: 3, say: "Karpuz! Ötekiler portakal." }
        ]
    },
    {
        id: 3,
        title: "Dört Kart 🚗🚀",
        instruction: "Dört kart var. Farklı olan hangisi?",
        rounds: [
            { base: '🚗', odd: '🚀', count: 4, say: "Roket! Ötekiler araba." },
            { base: '🌸', odd: '🍄', count: 4, say: "Mantar! Ötekiler çiçek." },
            { base: '⚽', odd: '🎈', count: 4, say: "Balon! Ötekiler top." },
            { base: '🐰', odd: '🐻', count: 4, say: "Ayı! Ötekiler tavşan." }
        ]
    },
    {
        id: 4,
        title: "Renkler ❤️💙",
        instruction: "Biri başka renk! Hangisi?",
        rounds: [
            { base: '❤️', odd: '💙', count: 3, say: "Mavi! Ötekiler kırmızı." },
            { base: '🍎', odd: '🍏', count: 3, say: "Yeşil elma! Ötekiler kırmızı." },
            { base: '💛', odd: '💚', count: 3, say: "Yeşil! Ötekiler sarı." },
            { base: '🔵', odd: '🔴', count: 3, say: "Kırmızı! Ötekiler mavi." }
        ]
    },
    {
        id: 5,
        title: "Dört Renk Kartı 💚❤️",
        instruction: "Dört kart var. Hangisi başka renk?",
        rounds: [
            { base: '💚', odd: '❤️', count: 4, say: "Kırmızı! Ötekiler yeşil." },
            { base: '🍏', odd: '🍎', count: 4, say: "Kırmızı elma! Ötekiler yeşil." },
            { base: '⚪', odd: '⚫', count: 4, say: "Siyah! Ötekiler beyaz." },
            { base: '💙', odd: '💜', count: 4, say: "Mor! Ötekiler mavi." }
        ]
    },
    {
        id: 6,
        title: "Büyük Olan 🐘",
        instruction: "Biri daha büyük! Hangisi?",
        rounds: [
            { base: '🐘', oddStyle: 'big', count: 3, say: "Bu fil daha büyük!" },
            { base: '⭐', oddStyle: 'big', count: 3, say: "Bu yıldız daha büyük!" },
            { base: '🍎', oddStyle: 'big', count: 3, say: "Bu elma daha büyük!" }
        ]
    },
    {
        id: 7,
        title: "Ters Duran 🙃",
        instruction: "Biri ters duruyor! Hangisi?",
        rounds: [
            { base: '🌳', oddStyle: 'upside', count: 3, say: "Bu ağaç ters duruyor!" },
            { base: '🏠', oddStyle: 'upside', count: 3, say: "Bu ev ters duruyor!" },
            { base: '🚗', oddStyle: 'upside', count: 3, say: "Bu araba ters duruyor!" }
        ]
    },
    {
        id: 8,
        title: "Karışık 🔍",
        instruction: "Hepsine iyi bak! Farklı olanı bul.",
        rounds: [
            { base: '🐟', oddStyle: 'flip', count: 4, say: "Bu balık öbür yöne bakıyor!" },
            { base: '🐶', oddStyle: 'small', count: 4, say: "Bu köpek daha küçük!" },
            { base: '🌻', odd: '🌷', count: 4, say: "Lale! Ötekiler ayçiçeği." },
            { base: '💙', odd: '💚', count: 4, say: "Yeşil! Ötekiler mavi." }
        ]
    }
];

// 🙈 Kim Kayboldu?: kartlar gösterilir, perde iner, biri kaybolur; seçeneklerden kaybolan bulunur.
// pool = karışık seçilecek kartlar (etiketler benzersiz), show = gösterilen kart (3-5),
// options = seçenek sayısı (3-4, show'dan büyük olamaz), rounds = tur sayısı,
// gap = kaybolanın yeri ❓ ile boş kalır (kolay), shuffle = kalanların yeri de karışır (zor),
// memorizeMs = bakma süresi (isteğe bağlı; yoksa 1800 + 700 × show)
const MISSING_LEVELS = [
    {
        id: 1,
        title: "Üç Hayvan 🐶🐱🐰",
        instruction: "Hayvanlara iyi bak! Biri saklanacak.",
        show: 3, options: 3, rounds: 3, gap: true,
        pool: [
            { symbol: '🐶', label: 'Köpek' },
            { symbol: '🐱', label: 'Kedi' },
            { symbol: '🐰', label: 'Tavşan' },
            { symbol: '🐮', label: 'İnek' },
            { symbol: '🐷', label: 'Domuz' },
            { symbol: '🐔', label: 'Tavuk' },
            { symbol: '🐴', label: 'At' },
            { symbol: '🐑', label: 'Koyun' }
        ]
    },
    {
        id: 2,
        title: "Üç Meyve 🍎🍌🍇",
        instruction: "Meyvelere iyi bak! Biri saklanacak.",
        show: 3, options: 3, rounds: 3, gap: true,
        pool: [
            { symbol: '🍎', label: 'Elma' },
            { symbol: '🍌', label: 'Muz' },
            { symbol: '🍇', label: 'Üzüm' },
            { symbol: '🍓', label: 'Çilek' },
            { symbol: '🍊', label: 'Portakal' },
            { symbol: '🍉', label: 'Karpuz' },
            { symbol: '🍒', label: 'Kiraz' },
            { symbol: '🍐', label: 'Armut' }
        ]
    },
    {
        id: 3,
        title: "Dört Oyuncak ⚽🎈",
        instruction: "Oyuncaklara iyi bak! Biri saklanacak.",
        show: 4, options: 3, rounds: 3, gap: true,
        pool: [
            { symbol: '⚽', label: 'Top' },
            { symbol: '🧸', label: 'Ayıcık' },
            { symbol: '🎈', label: 'Balon' },
            { symbol: '🚂', label: 'Tren' },
            { symbol: '🥁', label: 'Davul' },
            { symbol: '🎁', label: 'Hediye' },
            { symbol: '🚗', label: 'Araba' },
            { symbol: '🎺', label: 'Trompet' }
        ]
    },
    {
        id: 4,
        title: "Dört Taşıt 🚌🚲",
        instruction: "Taşıtlara iyi bak! Biri gidecek.",
        show: 4, options: 4, rounds: 3, gap: false,
        pool: [
            { symbol: '🚗', label: 'Araba' },
            { symbol: '🚌', label: 'Otobüs' },
            { symbol: '🚲', label: 'Bisiklet' },
            { symbol: '🚂', label: 'Tren' },
            { symbol: '✈️', label: 'Uçak' },
            { symbol: '🚀', label: 'Roket' },
            { symbol: '🚁', label: 'Helikopter' },
            { symbol: '🚢', label: 'Gemi' }
        ]
    },
    {
        id: 5,
        title: "Beş Deniz Hayvanı 🐟🐙",
        instruction: "Deniz hayvanlarına iyi bak! Biri saklanacak.",
        show: 5, options: 3, rounds: 3, gap: true,
        pool: [
            { symbol: '🐟', label: 'Balık' },
            { symbol: '🐙', label: 'Ahtapot' },
            { symbol: '🦀', label: 'Yengeç' },
            { symbol: '🐬', label: 'Yunus' },
            { symbol: '🐳', label: 'Balina' },
            { symbol: '🐢', label: 'Kaplumbağa' },
            { symbol: '🦈', label: 'Köpekbalığı' },
            { symbol: '🐚', label: 'Deniz Kabuğu' }
        ]
    },
    {
        id: 6,
        title: "Hayvanat Bahçesi 🦁🐻",
        instruction: "Hayvanlara iyi bak! Biri gidecek.",
        show: 5, options: 4, rounds: 3, gap: false,
        pool: [
            { symbol: '🦁', label: 'Aslan' },
            { symbol: '🐯', label: 'Kaplan' },
            { symbol: '🐻', label: 'Ayı' },
            { symbol: '🐵', label: 'Maymun' },
            { symbol: '🦊', label: 'Tilki' },
            { symbol: '🐘', label: 'Fil' },
            { symbol: '🐨', label: 'Koala' },
            { symbol: '🐼', label: 'Panda' }
        ]
    },
    {
        id: 7,
        title: "Lezzetli Yiyecekler 🍕🍦",
        instruction: "Yiyeceklere iyi bak! Sonra yerleri karışacak.",
        show: 5, options: 4, rounds: 3, gap: false, shuffle: true,
        pool: [
            { symbol: '🍕', label: 'Pizza' },
            { symbol: '🍔', label: 'Hamburger' },
            { symbol: '🍦', label: 'Dondurma' },
            { symbol: '🍰', label: 'Pasta' },
            { symbol: '🍪', label: 'Kurabiye' },
            { symbol: '🥕', label: 'Havuç' },
            { symbol: '🧀', label: 'Peynir' },
            { symbol: '🍞', label: 'Ekmek' }
        ]
    },
    {
        id: 8,
        title: "Büyük Karışık 🌙⭐",
        instruction: "Hepsine iyi bak! Sonra yerleri karışacak.",
        show: 5, options: 4, rounds: 4, gap: false, shuffle: true,
        pool: [
            { symbol: '🐶', label: 'Köpek' },
            { symbol: '🍎', label: 'Elma' },
            { symbol: '🚗', label: 'Araba' },
            { symbol: '⚽', label: 'Top' },
            { symbol: '🌸', label: 'Çiçek' },
            { symbol: '⭐', label: 'Yıldız' },
            { symbol: '🎈', label: 'Balon' },
            { symbol: '🐟', label: 'Balık' },
            { symbol: '🌙', label: 'Ay' },
            { symbol: '☀️', label: 'Güneş' }
        ]
    }
];

// ✏️ NOKTALARI BİRLEŞTİR: noktalar 1'den sırayla birleştirilir, şekil kapanınca gizli resim çıkar.
// points: [x, y] (0-100 arası tahta koordinatı), sıra = noktanın numarası.
// picture/pictureLabel: bitince çıkan resim ve adı ("Bu bir ev!"). color: çizgi ve dolgu rengi.
// İsteğe bağlı: closed: false → son noktadan ilke çizgi çekilmez; pictureAt: [x, y] → resmin yeri.
const DOTS_LEVELS = [
    {
        id: 1,
        title: "Üç Nokta ✏️",
        instruction: "Bir numaradan başla! Noktalara sırayla dokun.",
        picture: '⛺',
        pictureLabel: 'çadır',
        color: '#F97316',
        points: [[50, 12], [88, 84], [12, 84]]
    },
    {
        id: 2,
        title: "Dört Nokta ✏️",
        instruction: "Noktaları sırayla birleştir: bir, iki, üç, dört!",
        picture: '💎',
        pictureLabel: 'elmas',
        color: '#0EA5E9',
        points: [[50, 10], [86, 50], [50, 90], [14, 50]]
    },
    {
        id: 3,
        title: "Beş Nokta ✏️",
        instruction: "Beş noktayı sırayla birleştir! Gizli resim ne?",
        picture: '🏠',
        pictureLabel: 'ev',
        color: '#EF4444',
        points: [[50, 10], [88, 44], [88, 90], [12, 90], [12, 44]]
    },
    {
        id: 4,
        title: "Altı Nokta ✏️",
        instruction: "Altı noktayı sırayla birleştir!",
        picture: '⛵',
        pictureLabel: 'yelkenli',
        color: '#2563EB',
        points: [[50, 8], [76, 60], [92, 60], [76, 86], [24, 86], [8, 60]]
    },
    {
        id: 5,
        title: "Yedi Nokta ✏️",
        instruction: "Yedi noktayı birleştir! Parmağını kaydırabilirsin.",
        picture: '🐟',
        pictureLabel: 'balık',
        color: '#F59E0B',
        points: [[8, 50], [36, 24], [64, 42], [92, 22], [92, 78], [64, 58], [36, 76]],
        pictureAt: [40, 50]
    },
    {
        id: 6,
        title: "Sekiz Nokta ✏️",
        instruction: "Sekiz noktayı sırayla birleştir!",
        picture: '❤️',
        pictureLabel: 'kalp',
        color: '#EC4899',
        points: [[50, 28], [66, 14], [86, 20], [92, 40], [50, 88], [8, 40], [14, 20], [34, 14]],
        pictureAt: [50, 48]
    },
    {
        id: 7,
        title: "Dokuz Nokta ✏️",
        instruction: "Dokuz noktayı birleştir! Gizli resim ne?",
        picture: '🚀',
        pictureLabel: 'roket',
        color: '#8B5CF6',
        points: [[50, 6], [66, 28], [66, 62], [82, 84], [58, 78], [42, 78], [18, 84], [34, 62], [34, 28]],
        pictureAt: [50, 46]
    },
    {
        id: 8,
        title: "On Nokta ✏️",
        instruction: "On noktayı birleştir! Bakalım ne çıkacak?",
        picture: '⭐',
        pictureLabel: 'yıldız',
        color: '#EAB308',
        points: [[50, 12], [61, 39], [90, 41], [67, 60], [75, 88], [50, 72], [25, 88], [33, 60], [10, 41], [39, 39]],
        pictureAt: [50, 56]
    }
];

// 🎁 BALON ŞİŞİR: balon renkleri (renk bölümlerinde adı söylenir) ve bölümler
// mode: tap (dokun, şişir) | count (noktalar + sesli sayma) | choose (iki balon, söylenen renk) |
//       line (çizgiye kadar şişir, dur; fazlası nazikçe patlar ve yine sayılır)
// taps: balonun patlaması (ya da çizgiye gelmesi) için dokunuş; balloons: bölümdeki balon sayısı
const PUMP_COLORS = [
    { name: 'kırmızı', color: '#EF4444' },
    { name: 'mavi', color: '#3B82F6' },
    { name: 'sarı', color: '#FACC15' },
    { name: 'yeşil', color: '#22C55E' },
    { name: 'mor', color: '#A855F7' },
    { name: 'turuncu', color: '#F97316' },
    { name: 'pembe', color: '#EC4899' }
];

const PUMP_LEVELS = [
    {
        id: 1,
        title: "Balonu Şişir 🎈",
        instruction: "Pompaya dokun, balonu şişir!",
        mode: 'tap',
        taps: 3,
        balloons: 3,
        surprises: [
            { symbol: '🐶', label: 'köpek' },
            { symbol: '🐱', label: 'kedi' },
            { symbol: '🐰', label: 'tavşan' }
        ]
    },
    {
        id: 2,
        title: "Üç Kez Dokun 🎈",
        instruction: "Üç kez dokun! Balon patlasın.",
        mode: 'count',
        taps: 3,
        balloons: 3,
        surprises: [
            { symbol: '🐻', label: 'ayı' },
            { symbol: '🐥', label: 'civciv' },
            { symbol: '🚗', label: 'araba' }
        ]
    },
    {
        id: 3,
        title: "Dört Kez Dokun 🎈",
        instruction: "Dört kez dokun! Birlikte sayalım.",
        mode: 'count',
        taps: 4,
        balloons: 4,
        surprises: [
            { symbol: '🐸', label: 'kurbağa' },
            { symbol: '🐧', label: 'penguen' },
            { symbol: '⚽', label: 'top' },
            { symbol: '🐼', label: 'panda' }
        ]
    },
    {
        id: 4,
        title: "Renkli Balonlar 🎈",
        instruction: "Söylenen renkteki balonu şişir!",
        mode: 'choose',
        taps: 4,
        balloons: 4,
        colors: ['kırmızı', 'mavi', 'sarı', 'yeşil'],
        surprises: [
            { symbol: '🦁', label: 'aslan' },
            { symbol: '🐢', label: 'kaplumbağa' },
            { symbol: '🧸', label: 'oyuncak ayı' },
            { symbol: '🐵', label: 'maymun' }
        ]
    },
    {
        id: 5,
        title: "Beş Kez Dokun 🎈",
        instruction: "Beş kez dokun! Birlikte sayalım.",
        mode: 'count',
        taps: 5,
        balloons: 4,
        surprises: [
            { symbol: '🐠', label: 'balık' },
            { symbol: '🦋', label: 'kelebek' },
            { symbol: '🚀', label: 'roket' },
            { symbol: '🐮', label: 'inek' }
        ]
    },
    {
        id: 6,
        title: "Çizgiye Kadar 🎈",
        instruction: "Çizgiye kadar şişir, sonra dur!",
        mode: 'line',
        taps: 5,
        balloons: 4,
        surprises: [
            { symbol: '🦒', label: 'zürafa' },
            { symbol: '🐨', label: 'koala' },
            { symbol: '🚂', label: 'tren' },
            { symbol: '🐞', label: 'uğur böceği' }
        ]
    },
    {
        id: 7,
        title: "Renk Ustası 🎈",
        instruction: "Söylenen renkteki balonu şişir!",
        mode: 'choose',
        taps: 6,
        balloons: 5,
        colors: ['kırmızı', 'mavi', 'sarı', 'yeşil', 'mor', 'turuncu'],
        surprises: [
            { symbol: '🦓', label: 'zebra' },
            { symbol: '🐯', label: 'kaplan' },
            { symbol: '🦔', label: 'kirpi' },
            { symbol: '🐳', label: 'balina' },
            { symbol: '🐙', label: 'ahtapot' }
        ]
    },
    {
        id: 8,
        title: "Tam Çizgide 🎈",
        instruction: "Çizgiye kadar şişir, sonra dur!",
        mode: 'line',
        taps: 6,
        balloons: 5,
        surprises: [
            { symbol: '🦊', label: 'tilki' },
            { symbol: '🐘', label: 'fil' },
            { symbol: '🦉', label: 'baykuş' },
            { symbol: '🐬', label: 'yunus' },
            { symbol: '🦕', label: 'dinozor' }
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
    DOTS_LEVELS,
    SORTING_LEVELS,
    ODDONE_LEVELS,
    MISSING_LEVELS,
    PUMP_COLORS,
    PUMP_LEVELS
};
