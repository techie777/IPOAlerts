/**
 * Audio Notifier using Web Audio API
 * Generates an elegant, high-definition chime chord without relying on external media files.
 */

class SoundPlayer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Play a melodious crystal chime notification sound
   */
  public playChime(volume = 0.25): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: Fundamental A5 (880 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // Note 2: Harmonic Fifth E6 (1318.5 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.5, now + 0.06);
      gain2.gain.setValueAtTime(0, now + 0.06);
      gain2.gain.linearRampToValueAtTime(volume * 0.7, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      // Note 3: High Sparkle A6 (1760 Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(1760, now + 0.12);
      gain3.gain.setValueAtTime(0, now + 0.12);
      gain3.gain.linearRampToValueAtTime(volume * 0.4, now + 0.14);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.85);

      osc2.start(now + 0.06);
      osc2.stop(now + 0.95);

      osc3.start(now + 0.12);
      osc3.stop(now + 1.15);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

const player = new SoundPlayer();

/**
 * Checks whether notification sound is enabled in user preferences and plays it
 */
export function playNotificationSound(force = false): void {
  if (typeof window === 'undefined') return;

  if (!force) {
    try {
      const savedUser = localStorage.getItem('ipo_user_profile');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.soundEnabled === false) {
          return;
        }
      }
      const savedPrefs = localStorage.getItem('ipo_alerts_prefs');
      if (savedPrefs) {
        const parsedPrefs = JSON.parse(savedPrefs);
        if (parsedPrefs.soundEnabled === false) {
          return;
        }
      }
    } catch {}
  }

  player.playChime();
}
