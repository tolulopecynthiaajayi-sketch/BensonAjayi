/* ===================================================================
   MAIN APPLICATION SCRIPT (app.js)
   Interactivity, Form Handling, Real-time Rendering & Event Handlers
   Diamond Jubilee Celebration for Daddy Benson Ajayi (60 Glorious Years)
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Prevent browser from restoring scroll position down the page on reload/refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Initialize helpers
  const confetti = new window.CelebrationConfetti();
  const audioPlayer = new window.AmbientPlayer();
  window.ambientPlayer = audioPlayer;
  const lightbox = new window.GalleryLightbox();

  // State
  let activeFilter = 'all';
  let activeSanctuaryFilter = 'all';
  let searchQuery = '';
  let selectedSymbol = '✦';
  let selectedBlessingType = 'scripture';
  let tributeImageBase64 = null;
  let galleryImageBase64 = null;

  // DOM Elements - Hero & Counters
  const countTributesEl = document.getElementById('count-tributes');
  const countBlessingsEl = document.getElementById('count-blessings') || document.getElementById('count-candles');
  const countPhotosEl = document.getElementById('count-photos');

  // DOM Elements - Navigation & Audio
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioTextEl = document.getElementById('audio-status-text');

  function updateAudioButtonLabel(isPlaying) {
    if (!audioTextEl || !audioToggleBtn) return;
    const isMobile = window.innerWidth <= 480;
    if (isPlaying) {
      audioToggleBtn.classList.add('audio-playing');
      audioTextEl.textContent = isMobile ? 'Sunny Ade' : 'Playing: Sunny Ade';
    } else {
      audioToggleBtn.classList.remove('audio-playing');
      audioTextEl.textContent = isMobile ? 'Music' : 'Sunny Ade Track';
    }
  }

  // Initial compact label on narrow mobile viewports
  if (window.innerWidth <= 480 && audioTextEl) {
    audioTextEl.textContent = 'Music';
  }
  window.addEventListener('resize', () => {
    if (window.audioPlayer) {
      updateAudioButtonLabel(window.audioPlayer.isPlaying);
    }
  }, { passive: true });

  // DOM Elements - Containers
  const tributesContainer = document.getElementById('tributes-container');
  const blessingsContainer = document.getElementById('blessings-container') || document.getElementById('candles-container');
  const galleryContainer = document.getElementById('gallery-container');

  // DOM Elements - Modals
  const tributeModal = document.getElementById('tribute-modal');
  const photoModal = document.getElementById('photo-modal');
  const candleModal = document.getElementById('candle-modal');
  const shareModal = document.getElementById('share-modal');
  const toastNotice = document.getElementById('toast-notice');

  // Form Elements
  const tributeForm = document.getElementById('tribute-form');
  const photoForm = document.getElementById('photo-form');
  const candleForm = document.getElementById('candle-form');

  // Trigger Buttons
  const openTributeBtns = document.querySelectorAll('.trigger-open-tribute');
  const openPhotoBtns = document.querySelectorAll('.trigger-open-photo');
  const openBlessingBtns = document.querySelectorAll('.trigger-open-blessing, .trigger-open-candle');
  const openShareBtns = document.querySelectorAll('.trigger-open-share');
  const heroPortalTrigger = document.getElementById('hero-portal-trigger');

  // ===================================================================
  // 0. GRAND ENTRANCE DOUBLE-DOORS PORTAL INTERACTION
  // ===================================================================
  const jubileePortal = document.getElementById('jubilee-portal');
  const portalOpenBtn = document.getElementById('portal-open-btn');

  function openPortalDoors() {
    if (!jubileePortal || jubileePortal.classList.contains('doors-open')) return;

    // Reset scroll to top (Hero portrait) so doors open directly onto the hero picture
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (err) {}

    jubileePortal.classList.add('doors-open');

    // Play antique wooden door creak, transitioning to King Sunny Ade celebration song
    if (audioPlayer && !audioPlayer.isPlaying) {
      audioPlayer.enterWithDoorCreak();
      updateAudioButtonLabel(true);
    }

    // Launch golden celebratory confetti burst as doors swing wide open and music kicks in
    setTimeout(() => {
      confetti.burst(90);
    }, 1250);

    // Dismiss portal completely after slow 3D door opening animation finishes
    setTimeout(() => {
      jubileePortal.classList.add('portal-dismissed');
    }, 2750);
  }

  if (portalOpenBtn) {
    portalOpenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPortalDoors();
    });
  }

  if (jubileePortal) {
    jubileePortal.addEventListener('click', openPortalDoors);
  }

  // ===================================================================
  // 1. STATS UPDATE
  // ===================================================================
  function updateStats() {
    const stats = window.db.getStats();
    if (countTributesEl) countTributesEl.textContent = stats.tributes;
    if (countBlessingsEl) countBlessingsEl.textContent = stats.blessings;
    if (countPhotosEl) countPhotosEl.textContent = stats.photos;
  }

  // ===================================================================
  // 2. TOAST HELPER
  // ===================================================================
  function showToast(message, icon = '✦') {
    if (!toastNotice) return;
    toastNotice.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4000);
  }

  // ===================================================================
  // 3. TRIBUTES RENDERING
  // ===================================================================
  function renderTributes() {
    if (!tributesContainer) return;
    const tributes = window.db.getTributes();

    // Filter & Search
    const filtered = tributes.filter(t => {
      // Filter by category
      if (activeFilter === 'family') {
        const rel = (t.relation || '').toLowerCase();
        if (!['son', 'daughter', 'wife', 'grandchildren', 'grandchild', 'brother', 'sister', 'in-law'].some(r => rel.includes(r))) {
          return false;
        }
      } else if (activeFilter === 'friends') {
        const rel = (t.relation || '').toLowerCase();
        if (!['friend', 'colleague', 'classmate', 'associate'].some(r => rel.includes(r))) {
          return false;
        }
      } else if (activeFilter === 'church') {
        const rel = (t.relation || '').toLowerCase();
        if (!['church', 'pastor', 'elder', 'deacon', 'ministry', 'fellowship'].some(r => rel.includes(r))) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAuthor = (t.author || '').toLowerCase().includes(q);
        const matchMsg = (t.message || '').toLowerCase().includes(q);
        const matchRel = (t.relation || '').toLowerCase().includes(q);
        if (!matchAuthor && !matchMsg && !matchRel) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      tributesContainer.innerHTML = `
        <div class="tributes-empty" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(37, 10, 17, 0.55); border-radius: var(--radius-md); border: 1px dashed var(--hairline-medium); backdrop-filter: blur(12px);">
          <div style="font-family: var(--font-serif); font-size: 1.8rem; font-style: italic; color: var(--gold-primary); margin-bottom: 12px;">✦ ✦ ✦</div>
          <h4 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--ink-primary); margin-bottom: 6px;">No letters in this category yet</h4>
          <p style="color: var(--ink-muted); font-size: 0.92rem; margin-bottom: 20px;">Be the first to inscribe a letter or prayer for Daddy Benson!</p>
          <button class="btn-masthead-cta trigger-open-tribute">Write a Letter</button>
        </div>
      `;
      const emptyBtn = tributesContainer.querySelector('.trigger-open-tribute');
      if (emptyBtn) emptyBtn.addEventListener('click', () => openModal(tributeModal));
      return;
    }

    tributesContainer.innerHTML = filtered.map(t => {
      const isLiked = window.db.isLiked(t.id);
      const initials = t.avatarInitials || (t.author ? t.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'BA');

      return `
        <div class="tribute-card" data-id="${t.id}">
          <div>
            <div class="tribute-card-header">
              <div class="tribute-author-box">
                <div class="tribute-avatar">${initials}</div>
                <div class="tribute-author-info">
                  <span class="tribute-author-name">${escapeHtml(t.author)}</span>
                  <span class="tribute-author-relation">${escapeHtml(t.relation || 'Family & Well-wisher')}</span>
                </div>
              </div>
              <div class="tribute-seal-stamp" title="Commemorative Seal">${t.symbol || '✦'}</div>
            </div>

            <div class="tribute-body">
              ${escapeHtml(t.message)}
            </div>

            ${t.photoUrl ? `
              <div class="tribute-photo-attachment" title="Click to enlarge photo" aria-label="Enlarge photo" onclick="openPhotoViewer('${escapeHtml(t.photoUrl)}', '${escapeHtml(t.author)}')">
                <img src="${escapeHtml(t.photoUrl)}" alt="Photo memory from ${escapeHtml(t.author)}" loading="lazy">
              </div>
            ` : ''}
          </div>

          <div class="tribute-card-footer">
            <span class="tribute-date-stamp">${t.date || 'October 2026'}</span>
            <button class="tribute-like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${t.id}')" aria-label="Celebrate this tribute">
              <span>${isLiked ? '♥' : '♡'}</span>
              <span class="like-count">${t.likes || 0}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Like Tribute Handler
  window.toggleLike = function(id) {
    const res = window.db.toggleLike(id);
    const card = document.querySelector(`.tribute-card[data-id="${id}"]`);
    if (card) {
      const btn = card.querySelector('.tribute-like-btn');
      const countEl = card.querySelector('.like-count');
      if (btn && countEl) {
        btn.classList.toggle('liked', res.liked);
        btn.querySelector('span:first-child').textContent = res.liked ? '♥' : '♡';
        countEl.textContent = res.count;
      }
    }
    if (res.liked) {
      confetti.burst(35);
      showToast('Tribute appreciated!', '✦');
    }
  };

  // Open photo attachment in lightbox
  window.openPhotoViewer = function(url, author) {
    lightbox.setPhotos([{
      url,
      caption: `Tribute Photo by ${author}`,
      author,
      date: 'October 2026'
    }]);
    lightbox.open(0);
  };

  // ===================================================================
  // 4. SANCTUARY OF PRAISE & THANKSGIVING RENDERING (SCRIPTURES, TOASTS, 60 STICKERS)
  // ===================================================================
  function renderBlessings() {
    if (!blessingsContainer) return;
    const allBlessings = window.db.getBlessings();

    const filtered = allBlessings.filter(b => {
      if (activeSanctuaryFilter === 'all') return true;
      return b.type === activeSanctuaryFilter;
    });

    if (filtered.length === 0) {
      blessingsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 44px 20px; background: rgba(37, 10, 17, 0.55); border-radius: var(--radius-md); border: 1px dashed var(--hairline-medium); backdrop-filter: blur(12px);">
          <div style="font-family: var(--font-serif); font-size: 1.8rem; font-style: italic; color: var(--gold-primary); margin-bottom: 8px;">✦ ✦ ✦</div>
          <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--ink-primary); margin-bottom: 6px;">No offerings in this category yet</h4>
          <p style="color: var(--ink-muted); font-size: 0.9rem; margin-bottom: 18px;">Be the first to dedicate a scripture or jubilee toast for Daddy Benson!</p>
          <button class="btn-masthead-cta trigger-open-blessing">Dedicate Offering</button>
        </div>
      `;
      const btn = blessingsContainer.querySelector('.trigger-open-blessing');
      if (btn) btn.addEventListener('click', () => openModal(candleModal));
      return;
    }

    blessingsContainer.innerHTML = filtered.map(b => {
      const isAmen = window.db.isBlessingAmen(b.id);

      if (b.type === 'scripture') {
        return `
          <div class="offering-card" data-id="${b.id}">
            <div>
              <div class="offering-top">
                <span class="offering-type-tag scripture-tag">Holy Scripture</span>
                <span class="offering-date">${b.date || 'October 2026'}</span>
              </div>
              <div class="scripture-ref-badge">${escapeHtml(b.reference || 'Holy Scripture')}</div>
              <div class="scripture-verse-text">“${escapeHtml(b.verse || '')}”</div>
              ${b.prayer ? `<div class="scripture-prayer-note">${escapeHtml(b.prayer)}</div>` : ''}
            </div>
            <div class="offering-bottom">
              <div>
                <span class="offering-author">${escapeHtml(b.author)}</span>
                <span class="offering-relation">${escapeHtml(b.relation || 'Dedicated to God')}</span>
              </div>
              <button class="btn-amen-cheer ${isAmen ? 'active' : ''}" onclick="toggleAmen('${b.id}')" title="Say Amen to this scripture blessing">
                <span>Amen (${b.amenCount || 1})</span>
              </button>
            </div>
          </div>
        `;
      } else {
        // Jubilee Toast
        return `
          <div class="offering-card" data-id="${b.id}">
            <div>
              <div class="offering-top">
                <span class="offering-type-tag toast-tag">Jubilee Toast</span>
                <span class="offering-date">${b.date || 'October 2026'}</span>
              </div>
              <div class="toast-content-wrap">
                <span class="toast-glass-icon" style="font-family: var(--font-serif); color: var(--gold-primary); font-size: 1.2rem;">✦</span>
                <p class="toast-message-text">“${escapeHtml(b.toast || b.blessing || 'Cheers to 60 glorious years!')}”</p>
              </div>
            </div>
            <div class="offering-bottom">
              <div>
                <span class="offering-author">${escapeHtml(b.author)}</span>
                <span class="offering-relation">${escapeHtml(b.relation || 'Celebration Toast')}</span>
              </div>
              <button class="btn-amen-cheer ${isAmen ? 'active' : ''}" onclick="toggleAmen('${b.id}')" title="Raise a cheer!">
                <span>Cheers (${b.amenCount || 1})</span>
              </button>
            </div>
          </div>
        `;
      }
    }).join('');
  }

  // Backward compatibility alias
  function renderCandles() {
    renderBlessings();
  }

  // Interactive Amen / Cheer Handler
  window.toggleAmen = function(id) {
    const res = window.db.toggleBlessingAmen(id);
    renderBlessings();
    if (res.active) {
      confetti.burst(30);
      showToast('Offering celebrated!', '✦');
    }
  };

  // Sanctuary Filter Buttons
  const sanctuaryFilterBtns = document.querySelectorAll('.sanctuary-filter-btn');
  sanctuaryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sanctuaryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSanctuaryFilter = btn.dataset.sanctuaryFilter || 'all';
      renderBlessings();
    });
  });

  // ===================================================================
  // 5. GALLERY RENDERING
  // ===================================================================
  function renderGallery() {
    if (!galleryContainer) return;
    const photos = window.db.getPhotos();
    lightbox.setPhotos(photos);

    galleryContainer.innerHTML = photos.map((p, index) => {
      const displayImg = p.thumbUrl || p.url;
      return `
        <div class="gallery-item" onclick="openGalleryLightbox(${index})">
          <div class="gallery-thumb-wrap">
            <img class="gallery-thumb" src="${displayImg}" alt="${escapeHtml(p.caption || 'Cherished moment')}" loading="lazy">
          </div>
          <div class="gallery-overlay">
            <h5 class="gallery-caption">${escapeHtml(p.caption || 'Cherished Memory')}</h5>
            <div class="gallery-meta">
              <span>👤 ${escapeHtml(p.author || 'Family')}</span>
              <span>•</span>
              <span>📅 ${p.date || '2026'}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.openGalleryLightbox = function(index) {
    lightbox.open(index);
  };

  // Click on Hero Media to view portrait in Lightbox
  if (heroPortalTrigger) {
    heroPortalTrigger.addEventListener('click', () => {
      lightbox.setPhotos([{
        url: 'assets/photos/hero-wide-benson.jpg',
        caption: 'Daddy Benson Ajayi — Diamond Jubilee Portrait',
        author: 'Diamond Jubilee Archive',
        date: 'October 2026'
      }]);
      lightbox.open(0);
    });
  }

  // ===================================================================
  // 6. MODAL UTILITIES
  // ===================================================================
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind close buttons, cancel buttons & backdrop click
  document.addEventListener('click', (e) => {
    const isBackdrop = e.target.classList.contains('modal-backdrop');
    const closeBtn = e.target.closest('.modal-close-btn');
    const cancelBtn = e.target.closest('.modal-cancel-btn');

    if (isBackdrop || closeBtn || cancelBtn) {
      if (cancelBtn || closeBtn) e.preventDefault();
      const activeModal = e.target.closest('.modal-backdrop') || document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal);
    }
  });

  // Open button event listeners
  openTributeBtns.forEach(btn => btn.addEventListener('click', () => openModal(tributeModal)));
  openPhotoBtns.forEach(btn => btn.addEventListener('click', () => openModal(photoModal)));
  openBlessingBtns.forEach(btn => btn.addEventListener('click', () => openModal(candleModal)));
  openShareBtns.forEach(btn => btn.addEventListener('click', () => openModal(shareModal)));

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal);
    }
  });

  // ===================================================================
  // 7. BLESSING MODAL LOGIC (SCRIPTURES & JUBILEE TOASTS)
  // ===================================================================
  const blessingTypeCards = document.querySelectorAll('.blessing-type-card');
  const sectionScriptureFields = document.getElementById('section-scripture-fields');
  const sectionToastFields = document.getElementById('section-toast-fields');

  blessingTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      blessingTypeCards.forEach(c => {
        c.classList.remove('selected');
        c.style.border = '1px solid var(--hairline-medium)';
        c.style.background = '#FFFFFF';
      });
      card.classList.add('selected');
      card.style.border = '2px solid var(--gold-primary)';
      card.style.background = 'var(--gold-lighter)';

      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedBlessingType = radio.value;
      }

      if (sectionScriptureFields) sectionScriptureFields.style.display = selectedBlessingType === 'scripture' ? 'block' : 'none';
      if (sectionToastFields) sectionToastFields.style.display = selectedBlessingType === 'toast' ? 'block' : 'none';
    });
  });

  // Scripture Preset Chips
  const scriptureChips = document.querySelectorAll('.scripture-preset-chip');
  scriptureChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const refInput = document.getElementById('scripture-ref-input');
      const verseInput = document.getElementById('scripture-verse-input');
      if (refInput && chip.dataset.ref) refInput.value = chip.dataset.ref;
      if (verseInput && chip.dataset.verse) verseInput.value = chip.dataset.verse;
    });
  });

  // Toast Preset Chips
  const toastChips = document.querySelectorAll('.toast-preset-chip');
  toastChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const toastInput = document.getElementById('toast-msg-input');
      if (toastInput && chip.dataset.toast) toastInput.value = chip.dataset.toast;
    });
  });

  // Submit Blessing (Scripture or Toast)
  if (candleForm) {
    candleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorEl = document.getElementById('candle-name');
      const relationEl = document.getElementById('candle-relation');
      const author = authorEl ? authorEl.value.trim() : '';
      const relation = relationEl ? relationEl.value : 'Family';

      if (!author) {
        alert('Please enter your full name.');
        return;
      }

      if (selectedBlessingType === 'scripture') {
        const refEl = document.getElementById('scripture-ref-input');
        const verseEl = document.getElementById('scripture-verse-input');
        const prayerEl = document.getElementById('scripture-prayer-input');

        window.db.addBlessing({
          type: 'scripture',
          author,
          relation,
          reference: refEl ? refEl.value.trim() || 'Psalm 91:16' : 'Psalm 91:16',
          verse: verseEl ? verseEl.value.trim() || 'With long life will I satisfy him, and show him my salvation.' : 'With long life will I satisfy him, and show him my salvation.',
          prayer: prayerEl ? prayerEl.value.trim() : ''
        });
        showToast('Scripture dedication inscribed to God!', '✦');

      } else {
        const toastEl = document.getElementById('toast-msg-input');
        const toastText = toastEl ? toastEl.value.trim() : '';

        window.db.addBlessing({
          type: 'toast',
          author,
          relation,
          toast: toastText || 'Cheers to 60 magnificent years of health, laughter, and grace!'
        });
        showToast('Jubilee Toast raised with joy!', '✦');
      }

      candleForm.reset();
      closeModal(candleModal);
      renderBlessings();
      updateStats();

      confetti.burst(75);

      const target = document.getElementById('thanksgiving-section') || document.getElementById('candle-altar-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===================================================================
  // 8. TRIBUTE & GALLERY FORM SUBMISSIONS
  // ===================================================================

  // Symbol Picker
  const symbolOptions = document.querySelectorAll('.symbol-option');
  symbolOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      symbolOptions.forEach(s => s.classList.remove('selected'));
      opt.classList.add('selected');
      selectedSymbol = opt.dataset.symbol || '✦';
    });
  });

  // Prompt Inspiration Chips
  const promptChips = document.querySelectorAll('.prompt-chip:not(.scripture-preset-chip):not(.toast-preset-chip)');
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const msgInput = document.getElementById('tribute-message');
      if (msgInput) {
        msgInput.value = chip.dataset.prompt || '';
        msgInput.focus();
      }
    });
  });

  // File Upload Helper: Convert file to Base64
  function handleImageUpload(inputEl, previewEl, callback) {
    if (!inputEl) return;
    inputEl.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        alert('Image is larger than 8MB. Please choose a smaller image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        callback(base64, file.name);

        if (previewEl) {
          const img = previewEl.querySelector('img');
          if (img) img.src = base64;
          previewEl.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Tribute Photo upload handling
  const tributePhotoInput = document.getElementById('tribute-photo-input');
  const tributePhotoPreview = document.getElementById('tribute-photo-preview');
  const tributePhotoFilename = document.getElementById('tribute-photo-filename');
  const removeTributePhotoBtn = document.getElementById('remove-tribute-photo');

  handleImageUpload(tributePhotoInput, tributePhotoPreview, (base64, name) => {
    tributeImageBase64 = base64;
    if (tributePhotoFilename) tributePhotoFilename.textContent = name;
  });

  if (removeTributePhotoBtn) {
    removeTributePhotoBtn.addEventListener('click', () => {
      tributeImageBase64 = null;
      if (tributePhotoInput) tributePhotoInput.value = '';
      if (tributePhotoPreview) tributePhotoPreview.style.display = 'none';
      if (tributePhotoFilename) tributePhotoFilename.textContent = 'No file chosen';
    });
  }

  // Gallery Photo upload handling
  const galleryPhotoInput = document.getElementById('gallery-photo-input');
  const galleryPhotoPreview = document.getElementById('gallery-photo-preview');
  const removeGalleryPhotoBtn = document.getElementById('remove-gallery-photo');

  handleImageUpload(galleryPhotoInput, galleryPhotoPreview, (base64) => {
    galleryImageBase64 = base64;
  });

  if (removeGalleryPhotoBtn) {
    removeGalleryPhotoBtn.addEventListener('click', () => {
      galleryImageBase64 = null;
      if (galleryPhotoInput) galleryPhotoInput.value = '';
      if (galleryPhotoPreview) galleryPhotoPreview.style.display = 'none';
    });
  }

  // Submit Tribute Form
  if (tributeForm) {
    tributeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('tribute-name').value.trim();
      const relation = document.getElementById('tribute-relation').value;
      const message = document.getElementById('tribute-message').value.trim();

      if (!author || !message) {
        alert('Please fill out your name and tribute message.');
        return;
      }

      window.db.addTribute({
        author,
        relation,
        message,
        symbol: selectedSymbol,
        photoUrl: tributeImageBase64
      });

      // Reset
      tributeForm.reset();
      tributeImageBase64 = null;
      if (tributePhotoPreview) tributePhotoPreview.style.display = 'none';
      if (tributePhotoFilename) tributePhotoFilename.textContent = 'No file chosen';

      closeModal(tributeModal);
      renderTributes();
      updateStats();

      confetti.burst(80);
      showToast('Your letter of tribute has been inscribed!', '✦');

      const target = document.getElementById('tributes-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Submit Gallery Photo Form
  if (photoForm) {
    photoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const caption = document.getElementById('gallery-caption').value.trim();
      const author = document.getElementById('gallery-author').value.trim();

      if (!galleryImageBase64) {
        alert('Please select a photo to contribute to the archive.');
        return;
      }

      window.db.addPhoto({
        url: galleryImageBase64,
        caption,
        author
      });

      photoForm.reset();
      galleryImageBase64 = null;
      if (galleryPhotoPreview) galleryPhotoPreview.style.display = 'none';

      closeModal(photoModal);
      renderGallery();
      updateStats();

      confetti.burst(60);
      showToast('Photo successfully added to visual archive!', '✦');

      const target = document.getElementById('gallery-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===================================================================
  // 9. FILTERS & SEARCH
  // ===================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter || 'all';
      renderTributes();
    });
  });

  const searchInput = document.getElementById('tribute-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTributes();
    });
  }

  // ===================================================================
  // 10. AUDIO TOGGLE
  // ===================================================================
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const isNowPlaying = audioPlayer.toggle();
      updateAudioButtonLabel(isNowPlaying);
      if (isNowPlaying) {
        showToast('Playing King Sunny Ade Birthday Celebration', '✦');
      }
    });
  }

  // ===================================================================
  // 11. SHARE ACTIONS (WHATSAPP, COPY LINK)
  // ===================================================================
  const shareWhatsAppBtn = document.getElementById('share-whatsapp-btn') || document.getElementById('whatsapp-share-btn');
  if (shareWhatsAppBtn) {
    shareWhatsAppBtn.addEventListener('click', () => {
      const pageUrl = window.location.href;
      const text = encodeURIComponent(
        `Celebrating 60 Glorious Years of Daddy Benson Ajayi — Diamond Jubilee Celebration\n\n` +
        `Join us in celebrating his Diamond Jubilee: read his biography, inscribe your heartfelt letters, dedicate scriptures, and share photos:\n${pageUrl}\n\n` +
        `Please share with extended family and friends!`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });
  }

  const copyLinkBtn = document.getElementById('copy-link-btn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Celebration link copied to clipboard!', '✦');
        copyLinkBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyLinkBtn.innerHTML = '<span>Copy Direct Link to Celebration</span>';
        }, 3000);
      } catch (err) {
        showToast('Link: ' + window.location.href, '✦');
      }
    });
  }

  // ===================================================================
  // 12. SCROLL SPY FOR NAVIGATION
  // ===================================================================
  const chapterNavLinks = document.querySelectorAll('.chapter-nav-link');
  const chapterSections = [
    document.getElementById('foreword-section'),
    document.getElementById('tributes-section'),
    document.getElementById('thanksgiving-section'),
    document.getElementById('gallery-section'),
    document.getElementById('biography-section') || document.getElementById('story-section')
  ].filter(Boolean);

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 180;
    chapterSections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      chapterNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentId) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });

  // Confetti on initial page arrival
  setTimeout(() => {
    confetti.burst(60);
  }, 800);

  // Helper escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial Renders
  updateStats();
  renderTributes();
  renderBlessings();
  renderGallery();

  // Real-time Cloud Synchronization Listener (Firebase Cloud Firestore)
  if (window.db && typeof window.db.on === 'function') {
    window.db.on('change', () => {
      updateStats();
      renderTributes();
      renderBlessings();
      renderGallery();
    });
  }
});
