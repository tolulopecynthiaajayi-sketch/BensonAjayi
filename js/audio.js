/* ===================================================================
   KING SUNNY ADE BIRTHDAY CELEBRATION MUSIC ENGINE (audio.js)
   Plays King Sunny Ade's signature Jùjú birthday celebration music
   Features:
   1. Realistic antique wooden door creaking sound as the doors open
   2. Seamless transition directly into King Sunny Ade's celebration song
   3. Automatic HTML5 Audio detection (supports assets/sunny-ade-birthday.mp3,
      assets/sunny-ade.mp3, etc.)
   4. High-fidelity Web Audio Jùjú synthesizer (Hawaiian steel guitar,
      talking drum Gangan glides, Agogo bell, walking bass)
   =================================================================== */

class AmbientPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.stepIndex = 0;
    this.audioEl = null;
    this.useHtmlAudio = false;

    // Frequencies (Hz) for Jùjú Lead Guitar (Key of G / D)
    const D3 = 146.83, G3 = 196.00, A3 = 220.00, B3 = 246.94;
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, FS4 = 369.99, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, FS5 = 739.99, G5 = 783.99, A5 = 880.00;

    // King Sunny Ade Birthday Celebration Melody & Jùjú Festive Sequence
    // Phrase 1: "Happy Birthday to you"
    // Phrase 2: "Happy Birthday to you"
    // Phrase 3: "Happy Birthday dear Daddy Benson"
    // Phrase 4: "Happy Birthday to you"
    // Phrase 5 & 6: King Sunny Ade's Festive Jùjú Praise Groove ("E ba mi jo, e ba mi yo!")
    this.leadScore = [
      // Bar 1 - "Happy Birthday"
      { note: D4, len: 1.2, bass: G3, drum: 'low' },
      { note: D4, len: 0.8, bass: null, drum: 'high' },
      { note: E4, len: 1.8, bass: G3, drum: 'glide' },
      { note: D4, len: 1.8, bass: null, drum: 'tap' },
      { note: G4, len: 2.2, bass: D3, drum: 'glide' },
      { note: FS4, len: 3.0, bass: D3, drum: 'accent' },

      // Bar 2 - "Happy Birthday to you"
      { note: D4, len: 1.2, bass: G3, drum: 'low' },
      { note: D4, len: 0.8, bass: null, drum: 'high' },
      { note: E4, len: 1.8, bass: G3, drum: 'glide' },
      { note: D4, len: 1.8, bass: null, drum: 'tap' },
      { note: A4, len: 2.2, bass: D3, drum: 'glide' },
      { note: G4, len: 3.0, bass: G3, drum: 'accent' },

      // Bar 3 - "Happy Birthday dear Daddy Benson"
      { note: D4, len: 1.2, bass: G3, drum: 'low' },
      { note: D4, len: 0.8, bass: null, drum: 'high' },
      { note: D5, len: 2.2, bass: B3, drum: 'glide' },
      { note: B4, len: 1.8, bass: null, drum: 'tap' },
      { note: G4, len: 2.0, bass: E4, drum: 'glide' },
      { note: FS4, len: 1.8, bass: null, drum: 'tap' },
      { note: E4, len: 2.6, bass: C4, drum: 'accent' },

      // Bar 4 - "Happy Birthday to you"
      { note: C5, len: 1.4, bass: C4, drum: 'low' },
      { note: C5, len: 0.9, bass: null, drum: 'high' },
      { note: B4, len: 2.0, bass: G3, drum: 'glide' },
      { note: G4, len: 1.8, bass: null, drum: 'tap' },
      { note: A4, len: 2.2, bass: D3, drum: 'glide' },
      { note: G4, len: 3.4, bass: G3, drum: 'accent' },

      // Jùjú Celebration Riff 1 - King Sunny Ade Guitar Lick ("E ba mi jo")
      { note: G4, len: 1.0, bass: G3, drum: 'glide' },
      { note: B4, len: 1.0, bass: null, drum: 'high' },
      { note: D5, len: 1.4, bass: G3, drum: 'accent' },
      { note: D5, len: 1.0, bass: null, drum: 'tap' },
      { note: E5, len: 1.6, bass: C4, drum: 'glide' },
      { note: D5, len: 1.2, bass: null, drum: 'tap' },
      { note: B4, len: 1.4, bass: G3, drum: 'glide' },
      { note: G4, len: 1.8, bass: D3, drum: 'accent' },

      // Jùjú Celebration Riff 2 - "E ba mi yo"
      { note: A4, len: 1.0, bass: D3, drum: 'low' },
      { note: B4, len: 1.0, bass: null, drum: 'high' },
      { note: C5, len: 1.4, bass: D3, drum: 'glide' },
      { note: B4, len: 1.0, bass: null, drum: 'tap' },
      { note: A4, len: 1.2, bass: G3, drum: 'glide' },
      { note: G4, len: 1.4, bass: null, drum: 'tap' },
      { note: E4, len: 1.4, bass: C4, drum: 'accent' },
      { note: G4, len: 2.4, bass: G3, drum: 'glide' },

      // Jùjú Steel Guitar Flourish
      { note: D5, len: 0.9, bass: G3, drum: 'low' },
      { note: E5, len: 0.9, bass: null, drum: 'high' },
      { note: G5, len: 2.0, bass: G3, drum: 'glide' },
      { note: E5, len: 1.0, bass: null, drum: 'tap' },
      { note: D5, len: 1.4, bass: D3, drum: 'glide' },
      { note: B4, len: 1.2, bass: null, drum: 'tap' },
      { note: A4, len: 1.4, bass: D3, drum: 'glide' },
      { note: G4, len: 3.2, bass: G3, drum: 'accent' }
    ];

    this.initAudioElements();
  }

  // Attempts to load MP3 files from the assets folder
  initAudioElements() {
    const candidateFiles = [
      'Congratulations (Happy Birthday).mp3',
      'assets/Congratulations (Happy Birthday).mp3',
      'assets/sunny-ade-birthday.mp3',
      'assets/sunny-ade.mp3',
      'assets/birthday-song.mp3',
      'assets/king-sunny-ade.mp3'
    ];

    const tryLoad = (idx) => {
      if (idx >= candidateFiles.length) {
        this.useHtmlAudio = false;
        return;
      }

      const audio = new Audio();
      audio.src = candidateFiles[idx];
      audio.loop = true;
      audio.preload = 'auto';

      audio.addEventListener('canplaythrough', () => {
        this.audioEl = audio;
        this.useHtmlAudio = true;
      }, { once: true });

      audio.addEventListener('error', () => {
        tryLoad(idx + 1);
      }, { once: true });
    };

    tryLoad(0);
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesizes an authentic antique wooden door creak
  playDoorCreak(onComplete) {
    this.initContext();
    if (!this.ctx) {
      if (onComplete) onComplete();
      return;
    }

    const now = this.ctx.currentTime;

    // 1. Primary groaning friction oscillator (simulating heavy oak/mahogany door movement)
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Friction flutter LFO (22Hz stick-slip dry hinge chatter)
    const flutter = this.ctx.createOscillator();
    const flutterGain = this.ctx.createGain();
    flutter.frequency.setValueAtTime(22, now);
    flutterGain.gain.setValueAtTime(16, now);
    flutter.connect(osc.frequency);
    flutter.start(now);
    flutter.stop(now + 1.45);

    osc.type = 'sawtooth';
    // Pitch rises with initial push friction, then slides down as door swings free
    osc.frequency.setValueAtTime(85, now);
    osc.frequency.exponentialRampToValueAtTime(165, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.85);
    osc.frequency.exponentialRampToValueAtTime(75, now + 1.35);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(45, now);
    subOsc.frequency.exponentialRampToValueAtTime(85, now + 0.35);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 1.35);

    // Bandpass acoustic cavity resonance (the wooden chamber sound)
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(540, now);
    filter.frequency.exponentialRampToValueAtTime(780, now + 0.4);
    filter.frequency.exponentialRampToValueAtTime(440, now + 1.35);
    filter.Q.setValueAtTime(3.4, now);

    // Creak volume envelope: swells slightly, holds groan, then smoothly tapers off
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.15);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.38);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 1.4);
    subOsc.stop(now + 1.4);

    // 2. Micro wood friction clicks (snapping wood fibers & dry hinge contact)
    const clickTimes = [0.06, 0.18, 0.38, 0.65, 0.92];
    clickTimes.forEach(tOffset => {
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(260 + Math.random() * 120, now + tOffset);
      clickGain.gain.setValueAtTime(0.05, now + tOffset);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + tOffset + 0.035);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now + tOffset);
      clickOsc.stop(now + tOffset + 0.04);
    });

    // Schedule callback to transition to King Sunny Ade celebration song
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 1250);
    }
  }

  // Called when entering via the grand door portal
  enterWithDoorCreak() {
    this.initContext();
    this.playDoorCreak(() => {
      this.start();
    });
  }

  // Plucks King Sunny Ade's signature bright Stratocaster / pedal steel guitar
  playGuitarNote(freq, duration = 0.8) {
    if (!this.ctx || !freq) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Steel guitar vibrato LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(5.2, now); // 5.2 Hz Hawaiian vibrato
    lfoGain.gain.setValueAtTime(freq * 0.015, now);
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + duration + 0.2);

    // Warm, bright electric guitar timbre (sawtooth + triangle blend)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 2, now); // Octave chime overtone

    // Lowpass filter with snappy guitar pick bite
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + duration);
    filter.Q.setValueAtTime(3.5, now);

    // Guitar volume envelope: instant plucked attack, singing sustain, smooth decay
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);
  }

  // Deep walking Jùjú bass guitar
  playBassNote(freq, duration = 0.9) {
    if (!this.ctx || !freq) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Traditional Yoruba Talking Drum (Gangan) pitch glide
  playTalkingDrum(style = 'glide') {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';

    if (style === 'glide') {
      // Classic Gangan upward squeeze and release
      osc.frequency.setValueAtTime(125, now);
      osc.frequency.exponentialRampToValueAtTime(235, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.24);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    } else if (style === 'accent') {
      // Sharp high tension slap
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    } else if (style === 'high') {
      // High talking drum tap
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    } else {
      // Low base thump
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(95, now + 0.12);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Agogo Bell / Clapper polyrhythmic accent
  playBell() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1280, now);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Check if HTML5 audio file is ready
    if (this.audioEl && this.useHtmlAudio) {
      this.audioEl.currentTime = 0;
      this.audioEl.play().catch(() => {
        // Fall back to Web Audio on mobile or autoplay restrictions
        this.startSynthesizer();
      });
    } else {
      this.startSynthesizer();
    }
  }

  startSynthesizer() {
    this.initContext();
    this.step();
  }

  step() {
    if (!this.isPlaying) return;

    const current = this.leadScore[this.stepIndex % this.leadScore.length];

    // Play Lead Guitar note
    this.playGuitarNote(current.note, current.len * 0.36);

    // Play Jùjú Bassline
    if (current.bass) {
      this.playBassNote(current.bass, 0.45);
    }

    // Play Talking Drum (Gangan)
    if (current.drum) {
      this.playTalkingDrum(current.drum);
    }

    // Agogo bell polyrhythm on off-beats
    if (this.stepIndex % 2 === 1) {
      this.playBell();
    }

    this.stepIndex++;

    // King Sunny Ade typical tempo: ~112-118 BPM (approx 275ms per 8th note)
    const stepDurationMs = 275;
    this.timer = setTimeout(() => this.step(), stepDurationMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.audioEl) {
      try { this.audioEl.pause(); } catch (e) {}
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

window.AmbientPlayer = AmbientPlayer;
