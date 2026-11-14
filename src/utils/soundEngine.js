// Procedural Aerospace Sound Engine using Web Audio API
// 100% self-contained, no external audio files required

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.masterGain = null;
    this.rocketSource = null;
    this.rocketGain = null;
    this.isRocketPlaying = false;

    // Load mute preference
    try {
      const savedMute = localStorage.getItem('orbital_muted');
      this.muted = savedMute === 'true';
    } catch (e) {
      this.muted = false;
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.4, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(mute) {
    this.muted = mute;
    try {
      localStorage.setItem('orbital_muted', mute ? 'true' : 'false');
    } catch (e) {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.4, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // UI Click Sound
  playClick() {
    this.init();
    if (this.muted || !this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  // Component selected / switch toggle
  playToggle(high = true) {
    this.init();
    if (this.muted || !this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const freq = high ? 1200 : 600;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  // Countdown Beep
  playBeep(isGo = false) {
    this.init();
    if (this.muted || !this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const freq = isGo ? 1200 : 750;
      const duration = isGo ? 0.45 : 0.15;

      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration + 0.02);
    } catch (e) {}
  }

  // Warning Siren
  playWarning() {
    this.init();
    if (this.muted || !this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(650, this.ctx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(450, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);
    } catch (e) {}
  }

  // Scientific Scan Telemetry Ping
  playScan() {
    this.init();
    if (this.muted || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.2); // E6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1975.53, now); // B6
      osc2.frequency.exponentialRampToValueAtTime(2637.02, now + 0.2);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.52);
      osc2.stop(now + 0.52);
    } catch (e) {}
  }

  // Rocket Engine Rumble (Continuous Brownian-like Noise with Filter)
  startRocketRumble() {
    this.init();
    if (!this.ctx || this.isRocketPlaying) return;

    try {
      // Create white noise buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter approximation
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      this.rocketSource = this.ctx.createBufferSource();
      this.rocketSource.buffer = noiseBuffer;
      this.rocketSource.loop = true;

      // Low pass filter for deep aerospace roar
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, this.ctx.currentTime);

      // Low shelf boost
      const bassBoost = this.ctx.createBiquadFilter();
      bassBoost.type = 'lowshelf';
      bassBoost.frequency.setValueAtTime(80, this.ctx.currentTime);
      bassBoost.gain.setValueAtTime(12, this.ctx.currentTime);

      this.rocketGain = this.ctx.createGain();
      this.rocketGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.rocketGain.gain.exponentialRampToValueAtTime(0.7, this.ctx.currentTime + 1.2);

      this.rocketSource.connect(filter);
      filter.connect(bassBoost);
      bassBoost.connect(this.rocketGain);
      this.rocketGain.connect(this.masterGain);

      this.rocketSource.start();
      this.isRocketPlaying = true;
    } catch (e) {
      console.warn('Audio engine error:', e);
    }
  }

  stopRocketRumble() {
    if (!this.ctx || !this.isRocketPlaying || !this.rocketGain) return;
    try {
      const now = this.ctx.currentTime;
      this.rocketGain.gain.setValueAtTime(this.rocketGain.gain.value, now);
      this.rocketGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      setTimeout(() => {
        if (this.rocketSource) {
          try {
            this.rocketSource.stop();
            this.rocketSource.disconnect();
          } catch (e) {}
          this.rocketSource = null;
        }
        this.isRocketPlaying = false;
      }, 1600);
    } catch (e) {
      this.isRocketPlaying = false;
    }
  }

  // Mission Complete Fanfare
  playFanfare() {
    this.init();
    if (this.muted || !this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const start = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start + idx * 0.12);

        gain.gain.setValueAtTime(0.25, start + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, start + idx * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start + idx * 0.12);
        osc.stop(start + idx * 0.12 + 0.65);
      });
    } catch (e) {}
  }
}

export const sound = new SoundEngine();

