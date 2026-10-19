/* ===================================================================
   PHOTO LIGHTBOX (lightbox.js)
   Full-screen gallery viewing modal with navigation & captions
   =================================================================== */

class GalleryLightbox {
  constructor() {
    this.modal = document.getElementById('lightbox-modal');
    this.img = document.getElementById('lightbox-img');
    this.caption = document.getElementById('lightbox-caption');
    this.author = document.getElementById('lightbox-author');
    this.prevBtn = document.getElementById('lightbox-prev') || document.querySelector('.lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next') || document.querySelector('.lightbox-next');
    this.closeBtn = document.getElementById('lightbox-close') || document.querySelector('.lightbox-close');

    this.photos = [];
    this.currentIndex = 0;

    this.bindEvents();
  }

  setPhotos(photoList) {
    this.photos = photoList;
  }

  open(index) {
    if (!this.photos || this.photos.length === 0 || !this.modal) return;
    this.currentIndex = Math.max(0, Math.min(index, this.photos.length - 1));
    this.updateContent();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.photos.length - 1;
    }
    this.updateContent();
  }

  next() {
    if (this.currentIndex < this.photos.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateContent();
  }

  updateContent() {
    const photo = this.photos[this.currentIndex];
    if (!photo) return;

    if (this.img) this.img.src = photo.url;
    if (this.caption) this.caption.textContent = photo.caption || 'Cherished Memory';
    if (this.author) {
      this.author.textContent = photo.author ? `Shared by ${photo.author} • ${photo.date || ''}` : '';
    }
  }

  bindEvents() {
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.prevBtn) this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
    if (this.nextBtn) this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }
}

window.GalleryLightbox = GalleryLightbox;
