// High-Fidelity Web Audio Synthesizer & Speech Engine for Railway Alerts
// Zero external mp3 dependencies - 100% offline resilient

class RailwayAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.volume = 0.85;
  }

  // Ensure AudioContext is initialized on user gesture
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Authentic Indian Railways / Airport 4-tone chime
  // (F4 -> A4 -> C5 -> F5 harmonic progression)
  playStationChime() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [
      { freq: 349.23, time: 0.00, dur: 0.45 }, // F4
      { freq: 440.00, time: 0.35, dur: 0.45 }, // A4
      { freq: 523.25, time: 0.70, dur: 0.50 }, // C5
      { freq: 698.46, time: 1.05, dur: 0.90 }  // F5 (lingering resolution)
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      // Warm chime tone blending sine with gentle overtone
      osc.type = "sine";
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      // Bell envelope (instant attack, exponential decay)
      const startTime = ctx.currentTime + note.time;
      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.6, startTime + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.dur);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + note.dur + 0.1);

      // Add soft warm harmonic overtone
      const harmonic = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmonic.type = "sine";
      harmonic.frequency.setValueAtTime(note.freq * 2, startTime);
      harmGain.gain.setValueAtTime(0.001, startTime);
      harmGain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, startTime + (note.dur * 0.7));

      harmonic.connect(harmGain);
      harmGain.connect(masterGain);

      harmonic.start(startTime);
      harmonic.stop(startTime + note.dur);
    });
  }

  // Urgent 10-Minute Reminder Alert Alarm (Double Pulse Chime)
  playUrgentArrivalAlarm() {
    this.playStationChime();
    setTimeout(() => {
      this.playStationChime();
    }, 1800);
  }

  // Text-To-Speech Railway Station PA Voice
  speakAnnouncement(message, language = "en-IN") {
    if (this.isMuted) return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Clear any queued utterances

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.95; // Slightly measured railway PA cadence
    utterance.pitch = 1.05;
    utterance.volume = this.volume;

    const voices = window.speechSynthesis.getVoices();
    let preferredVoice = null;

    if (language.startsWith("ta")) {
      preferredVoice = voices.find(v => v.lang.includes("ta") || v.lang.includes("Tamil"));
    }
    if (!preferredVoice) {
      preferredVoice = voices.find(v => v.lang === "en-IN" || v.name.includes("India") || v.name.includes("Tamil"));
    }
    if (!preferredVoice) {
      preferredVoice = voices.find(v => v.lang.startsWith("en"));
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Full Commuter Alert Sequence: Chime + Voice + Haptic
  triggerCommuterAlert(stationName, minutesLeft, platformNo, isTamil = false) {
    this.playUrgentArrivalAlarm();
    this.triggerHaptic();

    setTimeout(() => {
      if (isTamil) {
        const tamilText = `கவனத்திற்கு! ரயில் எண் 49007 ஏ.சி லோக்கல் இன்னும் ${minutesLeft} நிமிடங்களில் ${stationName} நடைமேடை எண் ${platformNo} ஐ அடையும். தயவுசெய்து தயாராக இருங்கள்!`;
        this.speakAnnouncement(tamilText, "ta-IN");
      } else {
        const engText = `Attention commuter! Train 49007 AC Local will reach ${stationName} in ${minutesLeft} minutes on Platform ${platformNo}. Please be ready on the platform!`;
        this.speakAnnouncement(engText, "en-IN");
      }
    }, 1200);
  }

  // Mobile Device Haptic Feedback
  triggerHaptic() {
    if ("vibrate" in navigator) {
      try {
        // High-low-high alert pulse
        navigator.vibrate([350, 150, 350, 150, 700]);
      } catch (e) {
        console.warn("Vibration not permitted", e);
      }
    }
  }
}

const railwayAudio = new RailwayAudioEngine();
