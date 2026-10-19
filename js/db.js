/* ===================================================================
   DATABASE & PERSISTENCE MANAGER (db.js)
   Stores Tributes, Photos, Candles & Likes in LocalStorage & IndexedDB
   Preloaded with authentic family initial tributes & curated photos
   =================================================================== */

const DB_KEYS = {
  TRIBUTES: 'benson_60th_tributes_v4',
  PHOTOS: 'benson_60th_photos_v5',
  BLESSINGS: 'benson_60th_blessings_v5',
  LIKES: 'benson_60th_likes_v4'
};

// Initial Seed Photos (from curated assets)
const INITIAL_PHOTOS = [
  {
    id: 'photo-1',
    url: 'assets/photos/benson-ajayi-hero.jpg',
    thumbUrl: 'assets/photos/thumb_benson-ajayi-hero.jpg',
    caption: 'Daddy smiling with wisdom and joy in his heart',
    author: 'Tolulope Ajayi',
    category: 'jubilee',
    date: 'October 2026'
  },
  {
    id: 'photo-2',
    url: 'assets/photos/benson-ajayi-regal.jpg',
    thumbUrl: 'assets/photos/thumb_benson-ajayi-regal.jpg',
    caption: 'Regal in agbada — 60 Glorious Years of God\'s goodness',
    author: 'Ajayi Family',
    category: 'jubilee',
    date: 'October 2026'
  },
  {
    id: 'photo-3',
    url: 'assets/photos/benson-ajayi-tradition.jpg',
    thumbUrl: 'assets/photos/thumb_benson-ajayi-tradition.jpg',
    caption: 'Dressed in regal woven Aso-Oke: Daddy Benson sharing joy with family',
    author: 'Family',
    category: 'jubilee',
    date: 'October 2026'
  },
  {
    id: 'photo-4',
    url: 'assets/photos/benson-50th-birthday.jpg',
    thumbUrl: 'assets/photos/thumb_benson-50th-birthday.jpg',
    caption: 'Throwback: Celebrating Daddy\'s 50th Golden Jubilee with family',
    author: 'Tolulope Ajayi',
    category: 'milestones',
    date: 'October 2016'
  },
  {
    id: 'photo-5',
    url: 'assets/photos/benson-ajayi-smile.jpg',
    thumbUrl: 'assets/photos/thumb_benson-ajayi-smile.jpg',
    caption: 'Dapper and joyful, celebrating the diamond anniversary of life',
    author: 'Ajayi Family',
    category: 'jubilee',
    date: 'October 2026'
  },
  {
    id: 'photo-6',
    url: 'assets/photos/benson-ajayi-joy.jpg',
    thumbUrl: 'assets/photos/thumb_benson-ajayi-joy.jpg',
    caption: 'Full of gratitude and praise for six decades of life',
    author: 'Family',
    category: 'jubilee',
    date: 'October 2026'
  },
  {
    id: 'photo-7',
    url: 'assets/photos/benson-family-celebration.jpg',
    thumbUrl: 'assets/photos/thumb_benson-family-celebration.jpg',
    caption: 'Memorable family thanksgiving and praise',
    author: 'Ajayi Children',
    category: 'family',
    date: 'October 2016'
  },
  {
    id: 'photo-8',
    url: 'assets/photos/benson-classic-portrait.jpg',
    thumbUrl: 'assets/photos/thumb_benson-classic-portrait.jpg',
    caption: 'Classic portrait of a leader, father, and mentor',
    author: 'Family',
    category: 'milestones',
    date: 'December 2017'
  },
  {
    id: 'photo-9',
    url: 'assets/photos/benson-joyful-moment.jpg',
    thumbUrl: 'assets/photos/thumb_benson-joyful-moment.jpg',
    caption: 'Laughter and sweet memories shared together',
    author: 'Ajayi Family',
    category: 'family',
    date: 'March 2018'
  },
  {
    id: 'photo-10',
    url: 'assets/photos/benson-ajayi-portrait2.jpg',
    thumbUrl: 'assets/photos/thumb_benson-ajayi-portrait2.jpg',
    caption: 'Honoring a patriarch on his 60th milestone',
    author: 'Children & Grandchildren',
    category: 'jubilee',
    date: 'October 2026'
  }
];

// Initial Seed Tributes
const INITIAL_TRIBUTES = [
  {
    id: 'trib-1',
    author: 'Tolulope Ajayi',
    relation: 'Son',
    avatarInitials: 'TA',
    symbol: '✦',
    date: 'October 24, 2026',
    message: 'Happy 60th Birthday, Daddy! Words cannot fully capture the depth of my gratitude to God for giving us a father like you. Your wisdom, patience, integrity, and unconditional love have been our greatest foundation. You lead by example in faith, humility, and excellence. May your next 60 years be filled with even greater peace, health, joy, and prosperity. We celebrate you today and forever!',
    likes: 18,
    photoUrl: 'assets/photos/benson-ajayi-hero.jpg'
  },
  {
    id: 'trib-2',
    author: 'Ololade Hannah Benson-Ajayi',
    relation: 'Wife',
    avatarInitials: 'OA',
    symbol: '♥',
    date: 'October 24, 2026',
    message: 'To my dearest husband Benson, my partner, prayer warrior, and best friend. Celebrating 60 years of your extraordinary life is such a profound blessing. Thank you for being the pillar of our home, a loving father to our children, and a man after God\'s own heart. May the Almighty continue to renew your strength like the eagle\'s. Happy 60th Diamond Jubilee, my love!',
    likes: 24,
    photoUrl: 'assets/photos/benson-ajayi-regal.jpg'
  },
  {
    id: 'trib-3',
    author: 'The Children',
    relation: 'Children',
    avatarInitials: 'AJ',
    symbol: '60',
    date: 'October 24, 2026',
    message: 'Happy 60th Birthday Daddy! Thank you for the unconditional sacrifice, the warmest guidance, the laughter, and always being our safe haven. You are the finest father anyone could ever pray for! We love and cherish you beyond measure!',
    likes: 20,
    photoUrl: 'assets/photos/benson-ajayi-tradition.jpg'
  },
  {
    id: 'trib-4',
    author: 'Pastor & Mrs. Adebayo',
    relation: 'Church Family',
    avatarInitials: 'PA',
    symbol: '✦',
    date: 'October 24, 2026',
    message: 'Hearty congratulations to our beloved brother, Elder Benson Ajayi, on the auspicious occasion of your 60th birthday! Your dedication to the house of God and selfless service to humanity continue to inspire everyone around you. As your days are, so shall your strength and grace be in Jesus\' name. Cheers to a diamond jubilee well deserved!',
    likes: 12,
    photoUrl: null
  },
  {
    id: 'trib-5',
    author: 'Engr. Femi & Family',
    relation: 'Friend',
    avatarInitials: 'EF',
    symbol: 'BA',
    date: 'October 24, 2026',
    message: 'Benson, my brother and trusted friend of decades! Seeing you hit this milestone of 60 years in sound health, vibrancy, and honor gives me immense joy. You are a dependable friend, an upright gentleman, and a rare gem. May this milestone herald new seasons of divine favor and peace. Happy 60th birthday!',
    likes: 9,
    photoUrl: null
  }
];

// Initial Seed Blessings (Scriptures dedicated to God & Jubilee Toasts)
const INITIAL_BLESSINGS = [
  {
    id: 'bless-1',
    type: 'scripture',
    author: 'Pastor & Mrs. Adebayo',
    relation: 'Church Family',
    reference: 'Psalm 92:12-14',
    verse: 'The righteous shall flourish like the palm tree; he shall grow like a cedar in Lebanon. Those that be planted in the house of the LORD shall flourish in the courts of our God. They shall still bring forth fruit in old age; they shall be fat and flourishing.',
    prayer: 'Beloved Elder Benson, may the Lord continuously renew your youth and grant you endless seasons of fruitful vigor!',
    amenCount: 24,
    date: 'October 24, 2026'
  },
  {
    id: 'bless-2',
    type: 'toast',
    author: 'Ololade Hannah Benson-Ajayi',
    relation: 'Wife',
    toast: 'Raising a diamond toast to my partner of destiny! Cheers to 60 magnificent years of divine health, peace of mind, sound wisdom, and unwavering joy. Here is to our best years yet!',
    amenCount: 32,
    date: 'October 24, 2026'
  },
  {
    id: 'bless-3',
    type: 'scripture',
    author: 'The Children',
    relation: 'Family',
    reference: '3 John 1:2',
    verse: 'Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth.',
    prayer: 'To our wonderful father! May the Lord crown your 60th year with overflowing health, divine peace, and perpetual laughter!',
    amenCount: 29,
    date: 'October 24, 2026'
  },
  {
    id: 'bless-4',
    type: 'scripture',
    author: 'Tolulope Ajayi',
    relation: 'Son',
    reference: 'Psalm 91:16',
    verse: 'With long life will I satisfy him, and show him my salvation.',
    prayer: 'Dedicated in adoration to God for sustaining my father with divine vitality, sound mind, and unwavering favor.',
    amenCount: 27,
    date: 'October 24, 2026'
  },
  {
    id: 'bless-5',
    type: 'toast',
    author: 'Ajayi Extended Family',
    relation: 'Extended Family',
    toast: 'A resounding jubilee toast to our beloved patriarch! Sixty glorious years of uncompromising integrity, warmth, and steady leadership that guides our entire lineage. Cheers to long life!',
    amenCount: 21,
    date: 'October 24, 2026'
  },
  {
    id: 'bless-6',
    type: 'toast',
    author: 'Engr. Femi & Old Friends',
    relation: 'Friend',
    toast: 'A resounding toast to Benson! A loyal friend of over 40 years. At 60 you remain as energetic, sharp, and upright as ever. Long life and prosperity in abundance!',
    amenCount: 15,
    date: 'October 24, 2026'
  },
  {
    id: 'bless-7',
    type: 'scripture',
    author: 'Church Elders Board',
    relation: 'Church Community',
    reference: 'Isaiah 46:4',
    verse: 'Even to your old age and gray hairs I am he, I am he who will sustain you. I have made you and I will carry you; I will sustain you and I will rescue you.',
    prayer: 'Elder Benson, the Lord who called you into His vineyard will preserve your going out and your coming in for decades to come.',
    amenCount: 18,
    date: 'October 24, 2026'
  }
];

class TributeDB {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(DB_KEYS.TRIBUTES)) {
      localStorage.setItem(DB_KEYS.TRIBUTES, JSON.stringify(INITIAL_TRIBUTES));
    }
    const storedPhotos = localStorage.getItem(DB_KEYS.PHOTOS);
    if (!storedPhotos || !storedPhotos.includes('thumbUrl')) {
      localStorage.setItem(DB_KEYS.PHOTOS, JSON.stringify(INITIAL_PHOTOS));
    }
    // Migrate or initialize blessings
    if (!localStorage.getItem(DB_KEYS.BLESSINGS)) {
      localStorage.setItem(DB_KEYS.BLESSINGS, JSON.stringify(INITIAL_BLESSINGS));
    }
    if (!localStorage.getItem(DB_KEYS.LIKES)) {
      localStorage.setItem(DB_KEYS.LIKES, JSON.stringify({}));
    }
  }

  // Tributes
  getTributes() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.TRIBUTES)) || INITIAL_TRIBUTES;
    } catch (e) {
      return INITIAL_TRIBUTES;
    }
  }

  addTribute(tribute) {
    const list = this.getTributes();
    const newTribute = {
      id: 'trib-' + Date.now(),
      likes: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...tribute
    };
    list.unshift(newTribute);
    localStorage.setItem(DB_KEYS.TRIBUTES, JSON.stringify(list));
    return newTribute;
  }

  toggleLike(tributeId) {
    const likesMap = JSON.parse(localStorage.getItem(DB_KEYS.LIKES) || '{}');
    const tributes = this.getTributes();
    const target = tributes.find(t => t.id === tributeId);
    if (!target) return { liked: false, count: 0 };

    const alreadyLiked = !!likesMap[tributeId];
    if (alreadyLiked) {
      target.likes = Math.max(0, (target.likes || 1) - 1);
      delete likesMap[tributeId];
    } else {
      target.likes = (target.likes || 0) + 1;
      likesMap[tributeId] = true;
    }

    localStorage.setItem(DB_KEYS.TRIBUTES, JSON.stringify(tributes));
    localStorage.setItem(DB_KEYS.LIKES, JSON.stringify(likesMap));
    return { liked: !alreadyLiked, count: target.likes };
  }

  isLiked(tributeId) {
    const likesMap = JSON.parse(localStorage.getItem(DB_KEYS.LIKES) || '{}');
    return !!likesMap[tributeId];
  }

  // Photos
  getPhotos() {
    try {
      const stored = JSON.parse(localStorage.getItem(DB_KEYS.PHOTOS));
      if (stored && Array.isArray(stored) && stored.length > 0) {
        return stored.map(p => {
          if (!p.thumbUrl && p.id && p.id.startsWith('photo-')) {
            const seed = INITIAL_PHOTOS.find(s => s.id === p.id);
            if (seed) return { ...p, thumbUrl: seed.thumbUrl };
          }
          return p;
        });
      }
      return INITIAL_PHOTOS;
    } catch (e) {
      return INITIAL_PHOTOS;
    }
  }

  addPhoto(photo) {
    const list = this.getPhotos();
    const newPhoto = {
      id: 'photo-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      category: 'guest',
      ...photo
    };
    list.unshift(newPhoto);
    localStorage.setItem(DB_KEYS.PHOTOS, JSON.stringify(list));
    return newPhoto;
  }

  // Blessings (Scriptures, Toasts, 60 Stickers)
  getBlessings() {
    try {
      const stored = JSON.parse(localStorage.getItem(DB_KEYS.BLESSINGS));
      if (stored && Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
      return INITIAL_BLESSINGS;
    } catch (e) {
      return INITIAL_BLESSINGS;
    }
  }

  addBlessing(blessing) {
    const list = this.getBlessings();
    const newBlessing = {
      id: 'bless-' + Date.now(),
      amenCount: 1,
      date: 'Just now',
      ...blessing
    };
    list.unshift(newBlessing);
    localStorage.setItem(DB_KEYS.BLESSINGS, JSON.stringify(list));
    return newBlessing;
  }

  toggleBlessingAmen(blessingId) {
    const likesMap = JSON.parse(localStorage.getItem(DB_KEYS.LIKES) || '{}');
    const blessings = this.getBlessings();
    const target = blessings.find(b => b.id === blessingId);
    if (!target) return { active: false, count: 0 };

    const key = 'amen_' + blessingId;
    const alreadyClicked = !!likesMap[key];
    if (alreadyClicked) {
      target.amenCount = Math.max(0, (target.amenCount || 1) - 1);
      delete likesMap[key];
    } else {
      target.amenCount = (target.amenCount || 0) + 1;
      likesMap[key] = true;
    }

    localStorage.setItem(DB_KEYS.BLESSINGS, JSON.stringify(blessings));
    localStorage.setItem(DB_KEYS.LIKES, JSON.stringify(likesMap));
    return { active: !alreadyClicked, count: target.amenCount };
  }

  isBlessingAmen(blessingId) {
    const likesMap = JSON.parse(localStorage.getItem(DB_KEYS.LIKES) || '{}');
    return !!likesMap['amen_' + blessingId];
  }

  // Backward-compatibility aliases
  getCandles() {
    return this.getBlessings();
  }

  addCandle(candle) {
    return this.addBlessing(candle);
  }

  // Stats
  getStats() {
    return {
      tributes: this.getTributes().length,
      photos: this.getPhotos().length,
      blessings: this.getBlessings().length,
      candles: this.getBlessings().length
    };
  }

  // Export / Backup
  exportData() {
    return JSON.stringify({
      tributes: this.getTributes(),
      photos: this.getPhotos(),
      blessings: this.getBlessings(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.tributes) localStorage.setItem(DB_KEYS.TRIBUTES, JSON.stringify(data.tributes));
      if (data.photos) localStorage.setItem(DB_KEYS.PHOTOS, JSON.stringify(data.photos));
      if (data.blessings) localStorage.setItem(DB_KEYS.BLESSINGS, JSON.stringify(data.blessings));
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}

window.db = new TributeDB();
