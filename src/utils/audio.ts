/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynth {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private bgmOscillator: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;
  private isMuted: boolean = false;
  private bgmIsPlaying: boolean = false;

  constructor() {
    // Lazy initialized on first user gesture
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(0.3, this.ctx.currentTime); // Standard comfortable volume
      this.masterVolume.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API is not supported in this environment.", e);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterVolume && this.ctx) {
      this.masterVolume.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuteStatus() {
    return this.isMuted;
  }

  // Play a retro action ping/jump sound
  public playPing() {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterVolume) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Play cute character speak beeps (frequency custom to pitch)
  public playSpeak(freq: number = 440) {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterVolume) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    // Add rapid vibrato to sound extremely cute/chippy
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.05);
    osc.frequency.linearRampToValueAtTime(freq * 0.95, now + 0.1);
    osc.frequency.linearRampToValueAtTime(freq, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc.stop(now + 0.18);
  }

  // Retro sword slash / weapon attack
  public playSlash() {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterVolume) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc.stop(now + 0.2);
  }

  // Play retro coin chime
  public playCoin() {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterVolume) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    osc2.frequency.setValueAtTime(1174.66, now); // D6
    osc2.frequency.setValueAtTime(1567.98, now + 0.08); // G6

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterVolume);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  // Play retro damage / weed pull error buzz
  public playBuzz() {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterVolume) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.setValueAtTime(100, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc.stop(now + 0.25);
  }

  // Play level complete fanfare
  public playFanfare() {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterVolume) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const tempo = 0.1;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * tempo);

      gain.gain.setValueAtTime(0.12, now + idx * tempo);
      gain.gain.linearRampToValueAtTime(0.01, now + idx * tempo + 0.25);

      osc.connect(gain);
      gain.connect(this.masterVolume!);

      osc.start(now + idx * tempo);
      osc.stop(now + idx * tempo + 0.3);
    });
  }

  // Play continuous background arcade melodies (synthesized!)
  public startBGM() {
    this.init();
    // Resume context if suspended (browser security blocks standard play)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isMuted || !this.ctx || !this.masterVolume || this.bgmIsPlaying) return;

    try {
      this.bgmIsPlaying = true;
      const now = this.ctx.currentTime;

      // Create a gentle pulsing synth bassline BGM
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.03, now); // Very quiet backdrop
      this.bgmGain.connect(this.masterVolume);

      // Play soft arpeggio series
      let step = 0;
      // Arpeggio notes: CMajor, FMajor, GMajor, AMinor
      const chordNotes = [
        [261.63, 329.63, 392.00], // C4, E4, G4
        [261.63, 349.23, 440.00], // C4, F4, A4
        [293.66, 392.00, 493.88], // D4, G4, B4
        [440.00, 523.25, 659.25]  // A4, C5, E5
      ];

      const playNextClip = () => {
        if (!this.bgmIsPlaying || this.isMuted || !this.ctx || !this.bgmGain) return;

        const chordIdx = Math.floor(step / 6) % chordNotes.length;
        const noteIdx = step % 3;
        const baseFreq = chordNotes[chordIdx][noteIdx];

        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

        g.gain.setValueAtTime(0.03, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        o.connect(g);
        g.connect(this.bgmGain);

        o.start();
        o.stop(this.ctx.currentTime + 0.4);

        step++;
        setTimeout(playNextClip, 400);
      };

      playNextClip();
    } catch (e) {
      console.warn("BGM launch failed", e);
    }
  }

  public stopBGM() {
    this.bgmIsPlaying = false;
    if (this.bgmGain) {
      try {
        this.bgmGain.disconnect();
      } catch (e) {}
      this.bgmGain = null;
    }
  }
}

export const audio = new AudioSynth();
