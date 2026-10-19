/* ===================================================================
   DATABASE & REAL-TIME CLOUD PERSISTENCE MANAGER (db.js)
   Powered by Google Cloud Firestore & LocalStorage Cache
   Synchronizes Tributes, Blessings & Photos across all visitors in real time!
   =================================================================== */

const DB_KEYS = {
  TRIBUTES: 'benson_60th_tributes_v6',
  PHOTOS: 'benson_60th_photos_v6',
  BLESSINGS: 'benson_60th_blessings_v6',
  LIKES: 'benson_60th_likes_v6'
};

// Official Firebase Config for BensonAjayi-Web
const firebaseConfig = {
  projectId: "bensonajayi-c8295",
  appId: "1:340504259298:web:05d8774fd0300718fcccbb",
  storageBucket: "bensonajayi-c8295.firebasestorage.app",
  apiKey: "AIzaSyAMpZlKBrRmsplnroyD4WYjAcjpXWSW9yk",
  authDomain: "bensonajayi-c8295.firebaseapp.com",
  messagingSenderId: "340504259298"
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
    date: 'October 22, 2026',
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
    date: 'October 22, 2026',
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
    date: 'October 22, 2026',
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
    date: 'October 22, 2026',
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
    date: 'October 22, 2026',
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
    date: 'October 22, 2026'
  },
  {
    id: 'bless-2',
    type: 'toast',
    author: 'Ololade Hannah Benson-Ajayi',
    relation: 'Wife',
    toast: 'Raising a diamond toast to my partner of destiny! Cheers to 60 magnificent years of divine health, peace of mind, sound wisdom, and unwavering joy. Here is to our best years yet!',
    amenCount: 32,
    date: 'October 22, 2026'
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
    date: 'October 22, 2026'
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
    date: 'October 22, 2026'
  },
  {
    id: 'bless-5',
    type: 'toast',
    author: 'Ajayi Extended Family',
    relation: 'Extended Family',
    toast: 'A resounding jubilee toast to our beloved patriarch! Sixty glorious years of uncompromising integrity, warmth, and steady leadership that guides our entire lineage. Cheers to long life!',
    amenCount: 21,
    date: 'October 22, 2026'
  },
  {
    id: 'bless-6',
    type: 'toast',
    author: 'Engr. Femi & Old Friends',
    relation: 'Friend',
    toast: 'A resounding toast to Benson! A loyal friend of over 40 years. At 60 you remain as energetic, sharp, and upright as ever. Long life and prosperity in abundance!',
    amenCount: 15,
    date: 'October 22, 2026'
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
    date: 'October 22, 2026'
  }
];

class TributeDB {
  constructor() {
    this.listeners = [];
    this.firestoreDb = null;
    this.isCloudConnected = false;
    this.init();
  }

  // Event subscription for real-time reactivity
  on(event, callback) {
    this.listeners.push({ event, callback });
  }

  emit(event, data) {
    this.listeners.filter(l => l.event === event).forEach(l => {
      try { l.callback(data); } catch (e) { console.error('Listener error:', e); }
    });
  }

  init() {
    // 1. Ensure LocalStorage fallback has baseline data
    if (!localStorage.getItem(DB_KEYS.TRIBUTES)) {
      localStorage.setItem(DB_KEYS.TRIBUTES, JSON.stringify(INITIAL_TRIBUTES));
    }
    if (!localStorage.getItem(DB_KEYS.PHOTOS)) {
      localStorage.setItem(DB_KEYS.PHOTOS, JSON.stringify(INITIAL_PHOTOS));
    }
    if (!localStorage.getItem(DB_KEYS.BLESSINGS)) {
      localStorage.setItem(DB_KEYS.BLESSINGS, JSON.stringify(INITIAL_BLESSINGS));
    }
    if (!localStorage.getItem(DB_KEYS.LIKES)) {
      localStorage.setItem(DB_KEYS.LIKES, JSON.stringify({}));
    }

    // 2. Initialize Firebase Cloud Firestore
    this.initFirebase();
  }

  initFirebase() {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not loaded, running in offline LocalStorage mode.');
      return;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      this.firestoreDb = firebase.firestore();
      this.isCloudConnected = true;
      console.log('✦ Firebase Firestore Connected for Benson Ajayi Diamond Jubilee!');

      // Set up Real-Time Listeners
      this.listenToTributes();
      this.listenToBlessings();
      this.listenToPhotos();
    } catch (err) {
      console.warn('Firebase connection error, falling back to local mode:', err);
    }
  }

  // -------------------------------------------------------------
  // REAL-TIME FIRESTORE LISTENERS (NO AUTO-SEEDING ON DELETION)
  // -------------------------------------------------------------
  listenToTributes() {
    if (!this.firestoreDb) return;

    this.firestoreDb.collection('tributes').orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const cloudTributes = [];
        snapshot.forEach(doc => {
          cloudTributes.push({
            id: doc.id,
            ...doc.data()
          });
        });

        localStorage.setItem(DB_KEYS.TRIBUTES, JSON.stringify(cloudTributes));
        this.emit('change', { type: 'tributes', data: cloudTributes });
      }, err => {
        console.warn('Tributes live sync fallback:', err);
      });
  }

  listenToBlessings() {
    if (!this.firestoreDb) return;

    this.firestoreDb.collection('blessings').orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const cloudBlessings = [];
        snapshot.forEach(doc => {
          cloudBlessings.push({
            id: doc.id,
            ...doc.data()
          });
        });

        localStorage.setItem(DB_KEYS.BLESSINGS, JSON.stringify(cloudBlessings));
        this.emit('change', { type: 'blessings', data: cloudBlessings });
      }, err => {
        console.warn('Blessings live sync fallback:', err);
      });
  }

  listenToPhotos() {
    if (!this.firestoreDb) return;

    this.firestoreDb.collection('photos').orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const cloudPhotos = [];
        snapshot.forEach(doc => {
          cloudPhotos.push({
            id: doc.id,
            ...doc.data()
          });
        });

        localStorage.setItem(DB_KEYS.PHOTOS, JSON.stringify(cloudPhotos));
        this.emit('change', { type: 'photos', data: cloudPhotos });
      }, err => {
        console.warn('Photos live sync fallback:', err);
      });
  }

  // Seed functions if database is brand new
  async seedInitialTributes() {
    if (!this.firestoreDb) return;
    try {
      for (const t of [...INITIAL_TRIBUTES].reverse()) {
        await this.firestoreDb.collection('tributes').doc(t.id).set({
          author: t.author,
          relation: t.relation,
          avatarInitials: t.avatarInitials,
          symbol: t.symbol,
          message: t.message,
          likes: t.likes || 0,
          photoUrl: t.photoUrl || null,
          date: t.date,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (e) {
      console.warn('Error seeding tributes to Firestore:', e);
    }
  }

  async seedInitialBlessings() {
    if (!this.firestoreDb) return;
    try {
      for (const b of [...INITIAL_BLESSINGS].reverse()) {
        await this.firestoreDb.collection('blessings').doc(b.id).set({
          type: b.type,
          author: b.author,
          relation: b.relation,
          reference: b.reference || '',
          verse: b.verse || '',
          toast: b.toast || '',
          prayer: b.prayer || '',
          amenCount: b.amenCount || 1,
          date: b.date,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (e) {
      console.warn('Error seeding blessings to Firestore:', e);
    }
  }

  async seedInitialPhotos() {
    if (!this.firestoreDb) return;
    try {
      for (const p of INITIAL_PHOTOS) {
        await this.firestoreDb.collection('photos').doc(p.id).set({
          url: p.url,
          thumbUrl: p.thumbUrl || p.url,
          caption: p.caption || '',
          author: p.author || 'Family',
          category: p.category || 'jubilee',
          date: p.date || 'October 2026',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (e) {
      console.warn('Error seeding photos to Firestore:', e);
    }
  }

  // -------------------------------------------------------------
  // TRIBUTES CRUD
  // -------------------------------------------------------------
  getTributes() {
    try {
      const stored = localStorage.getItem(DB_KEYS.TRIBUTES);
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  async addTribute(tribute) {
    const list = this.getTributes();
    const tempId = 'trib-' + Date.now();
    const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newTribute = {
      id: tempId,
      author: String(tribute.author || 'Well-wisher').trim().substring(0, 100),
      relation: String(tribute.relation || 'Family & Friend').trim().substring(0, 100),
      avatarInitials: String(tribute.avatarInitials || (tribute.author ? tribute.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'BA')).substring(0, 4),
      symbol: String(tribute.symbol || '✦').substring(0, 20),
      message: String(tribute.message || '').trim().substring(0, 50000),
      likes: 0,
      photoUrl: tribute.photoUrl ? String(tribute.photoUrl) : null,
      date: dateFormatted
    };

    // Optimistic local update
    list.unshift(newTribute);
    localStorage.setItem(DB_KEYS.TRIBUTES, JSON.stringify(list));
    this.emit('change', { type: 'tributes', data: list });

    // Sync to Cloud Firestore
    if (this.firestoreDb && typeof firebase !== 'undefined') {
      try {
        const payload = {
          author: newTribute.author,
          relation: newTribute.relation || '',
          avatarInitials: newTribute.avatarInitials || 'BA',
          symbol: newTribute.symbol || '✦',
          message: newTribute.message,
          likes: 0,
          date: newTribute.date,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (newTribute.photoUrl) {
          payload.photoUrl = newTribute.photoUrl;
        }
        const docRef = await this.firestoreDb.collection('tributes').add(payload);
        newTribute.id = docRef.id;
      } catch (err) {
        console.warn('Error saving tribute to Cloud Firestore, saved locally:', err);
      }
    }

    return newTribute;
  }

  toggleLike(tributeId) {
    const likesMap = JSON.parse(localStorage.getItem(DB_KEYS.LIKES) || '{}');
    const tributes = this.getTributes();
    const target = tributes.find(t => t.id === tributeId);
    if (!target) return { liked: false, count: 0 };

    const alreadyLiked = !!likesMap[tributeId];
    const delta = alreadyLiked ? -1 : 1;

    target.likes = Math.max(0, (target.likes || 0) + delta);
    if (alreadyLiked) {
      delete likesMap[tributeId];
    } else {
      likesMap[tributeId] = true;
    }

    localStorage.setItem(DB_KEYS.TRIBUTES, JSON.stringify(tributes));
    localStorage.setItem(DB_KEYS.LIKES, JSON.stringify(likesMap));

    // Cloud increment/decrement
    if (this.firestoreDb && typeof firebase !== 'undefined') {
      try {
        this.firestoreDb.collection('tributes').doc(tributeId).update({
          likes: firebase.firestore.FieldValue.increment(delta)
        }).catch(() => {
          // If document was a local tempId, it will sync when re-fetched
        });
      } catch (err) {
        console.warn('Like update error:', err);
      }
    }

    return { liked: !alreadyLiked, count: target.likes };
  }

  isLiked(tributeId) {
    const likesMap = JSON.parse(localStorage.getItem(DB_KEYS.LIKES) || '{}');
    return !!likesMap[tributeId];
  }

  // -------------------------------------------------------------
  // PHOTOS CRUD
  // -------------------------------------------------------------
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

  async addPhoto(photo) {
    const list = this.getPhotos();
    const tempId = 'photo-' + Date.now();
    const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const newPhoto = {
      id: tempId,
      url: photo.url,
      thumbUrl: photo.thumbUrl || photo.url,
      caption: String(photo.caption || 'Cherished moment').trim().substring(0, 500),
      author: String(photo.author || 'Family & Friend').trim().substring(0, 100),
      category: photo.category || 'guest',
      date: dateFormatted
    };

    list.unshift(newPhoto);
    localStorage.setItem(DB_KEYS.PHOTOS, JSON.stringify(list));
    this.emit('change', { type: 'photos', data: list });

    if (this.firestoreDb && typeof firebase !== 'undefined') {
      try {
        const payload = {
          url: newPhoto.url,
          thumbUrl: newPhoto.thumbUrl,
          caption: newPhoto.caption,
          author: newPhoto.author,
          category: newPhoto.category,
          date: newPhoto.date,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await this.firestoreDb.collection('photos').add(payload);
        newPhoto.id = docRef.id;
      } catch (err) {
        console.warn('Error saving photo to Cloud Firestore, saved locally:', err);
      }
    }

    return newPhoto;
  }

  // -------------------------------------------------------------
  // BLESSINGS & TOASTS CRUD
  // -------------------------------------------------------------
  getBlessings() {
    try {
      const stored = localStorage.getItem(DB_KEYS.BLESSINGS);
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  async addBlessing(blessing) {
    const list = this.getBlessings();
    const tempId = 'bless-' + Date.now();

    const newBlessing = {
      id: tempId,
      type: blessing.type || 'scripture',
      author: String(blessing.author || 'Church Family').trim().substring(0, 100),
      relation: String(blessing.relation || 'Family & Well-wisher').trim().substring(0, 100),
      reference: blessing.reference ? String(blessing.reference).trim().substring(0, 500) : '',
      verse: blessing.verse ? String(blessing.verse).trim().substring(0, 10000) : '',
      toast: blessing.toast ? String(blessing.toast).trim().substring(0, 10000) : '',
      prayer: blessing.prayer ? String(blessing.prayer).trim().substring(0, 10000) : '',
      amenCount: 1,
      date: 'Just now'
    };

    list.unshift(newBlessing);
    localStorage.setItem(DB_KEYS.BLESSINGS, JSON.stringify(list));
    this.emit('change', { type: 'blessings', data: list });

    if (this.firestoreDb && typeof firebase !== 'undefined') {
      try {
        const payload = {
          type: newBlessing.type,
          author: newBlessing.author,
          relation: newBlessing.relation,
          reference: newBlessing.reference,
          verse: newBlessing.verse,
          toast: newBlessing.toast,
          prayer: newBlessing.prayer,
          amenCount: 1,
          date: 'October 2026',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await this.firestoreDb.collection('blessings').add(payload);
        newBlessing.id = docRef.id;
      } catch (err) {
        console.warn('Error saving blessing to Cloud Firestore, saved locally:', err);
      }
    }

    return newBlessing;
  }

  toggleBlessingAmen(blessingId) {
    const likesMap = JSON.parse(localStorage.getItem(DB_KEYS.LIKES) || '{}');
    const blessings = this.getBlessings();
    const target = blessings.find(b => b.id === blessingId);
    if (!target) return { active: false, count: 0 };

    const key = 'amen_' + blessingId;
    const alreadyClicked = !!likesMap[key];
    const delta = alreadyClicked ? -1 : 1;

    target.amenCount = Math.max(0, (target.amenCount || 0) + delta);
    if (alreadyClicked) {
      delete likesMap[key];
    } else {
      likesMap[key] = true;
    }

    localStorage.setItem(DB_KEYS.BLESSINGS, JSON.stringify(blessings));
    localStorage.setItem(DB_KEYS.LIKES, JSON.stringify(likesMap));

    if (this.firestoreDb && typeof firebase !== 'undefined') {
      try {
        this.firestoreDb.collection('blessings').doc(blessingId).update({
          amenCount: firebase.firestore.FieldValue.increment(delta)
        }).catch(() => {});
      } catch (err) {
        console.warn('Amen update error:', err);
      }
    }

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
}

window.db = new TributeDB();
