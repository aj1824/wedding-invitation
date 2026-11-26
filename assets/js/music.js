/*
  Background music.
  - Plays song.mp3 if it exists next to index.html (config.js → music.file).
  - Otherwise plays a soft, original piano piece synthesised live with Web Audio (no file needed).
  - Browsers only allow sound after the guest taps; it starts on the first real tap
    (touch *end*, click or key — touch *start* does not count) and keeps retrying until sound is running.
*/
(function () {
  const I = window.Invite, cfg = (I.cfg.music || {});

  /* ---------------- "Rajab Evening": an original, gentle piece for felt piano and soft strings ----------------
     Written to be easy on the ears: slow (58 bpm), warm D major, mid-range melody with space to breathe,
     round piano tone with the top end filtered off, a quiet string bed and a soft dark room reverb.
     Overall level is deliberately low (it sits under conversation). */
  const Soft = (() => {
    let ctx = null, master, pianoBus, padBus, timer = null, nextBar = 0, bar = 0, on = false;
    const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
    const BEAT = 60 / 58, BAR = BEAT * 4;
    const VOL = 0.62;                 // final loudness (was far louder before)

    // chords: [root (octave 3), third interval]
    const CH = { D: [50, 4], Bm: [47, 3], G: [43, 4], A: [45, 4], 'F#m': [42, 3] };
    const PROG = ['D', 'Bm', 'G', 'A', 'D', 'F#m', 'G', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A', 'D', 'A'];
    // melody per bar: [midi note or null for a rest, length in beats]
    const MEL = [
      [[69, 1.5], [66, .5], [69, 1], [74, 1]],
      [[74, 1.5], [73, .5], [71, 2]],
      [[71, 1], [69, 1], [67, 1], [71, 1]],
      [[69, 3], [null, 1]],
      [[74, 1.5], [76, .5], [78, 1], [76, 1]],
      [[73, 2], [69, 2]],
      [[71, 1], [74, 1], [71, 1], [69, 1]],
      [[69, 1.5], [71, .5], [73, 2]],
      [[66, 1], [71, 1], [74, 1.5], [73, .5]],
      [[71, 2], [67, 2]],
      [[69, 1], [66, 1], [69, 1], [74, 1]],
      [[73, 3], [null, 1]],
      [[71, 1.5], [73, .5], [74, 1], [71, 1]],
      [[69, 2], [76, 2]],
      [[78, 1.5], [76, .5], [74, 2]],
      [[null, 2], [69, 1], [73, 1]]
    ];

    // smooth, dark room reverb (filtered noise so the tail has no hiss)
    function impulse(sec) {
      const len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = b.getChannelData(c); let y = 0;
        for (let i = 0; i < len; i++) { y = y * 0.55 + (Math.random() * 2 - 1) * 0.45; d[i] = y * Math.pow(1 - i / len, 3.2); }
      }
      return b;
    }
    function build() {
      master = ctx.createGain(); master.gain.value = 0.0001;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -26; comp.knee.value = 18; comp.ratio.value = 3; comp.attack.value = 0.02; comp.release.value = 0.4;
      const tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 3000; tone.Q.value = 0.4;
      const rev = ctx.createConvolver(); rev.buffer = impulse(3.2);
      const wet = ctx.createGain(); wet.gain.value = 0.5;
      const dry = ctx.createGain(); dry.gain.value = 0.62;
      pianoBus = ctx.createBiquadFilter(); pianoBus.type = 'lowpass'; pianoBus.frequency.value = 2200; pianoBus.Q.value = 0.3;
      padBus = ctx.createBiquadFilter(); padBus.type = 'lowpass'; padBus.frequency.value = 750; padBus.Q.value = 0.5;
      [pianoBus, padBus].forEach(n => { n.connect(dry); n.connect(rev); });
      rev.connect(wet); dry.connect(tone); wet.connect(tone); tone.connect(comp); comp.connect(master); master.connect(ctx.destination);
    }
    const pan = (node, p) => {
      if (!ctx.createStereoPanner) return node;
      const s = ctx.createStereoPanner(); s.pan.value = p; s.connect(node); return s;
    };
    // felt piano: fundamental + gentle low overtones, soft attack, long natural decay
    function piano(m, t, dur, vel, p = 0) {
      const f = mtof(m), g = ctx.createGain(); g.connect(pan(pianoBus, p));
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel, t + 0.018);
      g.gain.exponentialRampToValueAtTime(vel * 0.42, t + 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      [[1, 1], [2, 0.16], [3, 0.035]].forEach(([k, a]) => {
        const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'sine'; o.frequency.value = f * k;
        og.gain.value = a; o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + 0.05);
      });
    }
    // soft string bed: two slightly detuned voices per note, slow swell, very quiet
    function strings(notes, t, dur) {
      notes.forEach((m, i) => [-5, 5].forEach(cents => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = cents;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.0065, t + 1.6);
        g.gain.setValueAtTime(0.0065, t + dur - 0.4); g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.4);
        o.connect(g); g.connect(pan(padBus, i === 0 ? -0.25 : i === 2 ? 0.25 : 0)); o.start(t); o.stop(t + dur + 1.5);
      }));
    }
    function scheduleBar(t, i) {
      const [root, third] = CH[PROG[i]], jit = () => (Math.random() - 0.5) * 0.02, v = () => 0.88 + Math.random() * 0.2;
      // left hand: low root, then a gentle broken chord in quarter notes
      piano(root - 12, t + jit(), BAR + 1.6, 0.085 * v(), -0.15);
      [[7, 0.04], [12, 0.034], [12 + third, 0.03]].forEach(([o, vel], k) => piano(root + o, t + (k + 1) * BEAT + jit(), 2.6, vel * v(), -0.2));
      strings([root + 12, root + 12 + third, root + 19], t, BAR);
      // right hand: the melody
      let bt = 0;
      MEL[i].forEach(([m, len]) => {
        if (m != null) piano(m, t + bt * BEAT + jit(), Math.max(2.2, len * BEAT + 1.4), 0.1 * v(), 0.12);
        bt += len;
      });
    }
    function tick() { while (nextBar < ctx.currentTime + 1.5) { scheduleBar(nextBar, bar); bar = (bar + 1) % PROG.length; nextBar += BAR; } }
    function ramp(v, s, lin) {
      const n = ctx.currentTime; master.gain.cancelScheduledValues(n); master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), n);
      lin ? master.gain.linearRampToValueAtTime(v, n + s) : master.gain.exponentialRampToValueAtTime(v, n + s);
    }
    return {
      onstate: null,
      unlock() {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
        if (!ctx) { ctx = new AC(); build(); ctx.onstatechange = () => this.onstate && this.onstate(ctx.state); }
        if (ctx.state !== 'running') ctx.resume().catch(() => {});
        return true;
      },
      running: () => !!ctx && ctx.state === 'running',
      start() {
        if (on) return true; if (!this.unlock()) return false;
        on = true; nextBar = ctx.currentTime + 0.25; bar = 0; ramp(VOL, 5, true); tick(); timer = setInterval(tick, 300); return true;
      },
      isPlaying: () => on && !!ctx && ctx.state === 'running',
      pause() { if (!ctx) return; ramp(0.0001, 0.6); setTimeout(() => ctx.suspend(), 650); },
      resume() { if (!ctx) return; ctx.resume().then(() => ramp(VOL, 1.5, true)).catch(() => {}); }
    };
  })();
  /* ---------------- player ---------------- */
  const audio = I.$('#bgm'), btn = I.$('#musicBtn');
  if (!audio || !btn) return;
  let mode = null, musicOn = false, fileFailed = !cfg.file, fadeT, hiddenPaused = false, userPaused = false, silentEl = null;
  const showBtn = playing => { btn.hidden = false; btn.classList.toggle('playing', playing); };
  Soft.onstate = s => { if (mode === 'synth' && !userPaused && !hiddenPaused) showBtn(s === 'running'); };

  // iPhone: a silent looping <audio> puts the phone in "media playback" mode so the silent switch doesn't mute Web Audio
  function iosUnmute() {
    if (silentEl || !I.isIOS) return;
    const n = 4000, b = new Uint8Array(44 + n), v = new DataView(b.buffer), w = (o, s) => [...s].forEach((c, i) => (b[o + i] = c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true); b.fill(128, 44);
    silentEl = new Audio(URL.createObjectURL(new Blob([b], { type: 'audio/wav' }))); silentEl.loop = true; silentEl.volume = 0.01;
    silentEl.setAttribute('playsinline', ''); silentEl.play().catch(() => { silentEl = null; });
  }
  function startSynth() { if (musicOn || !cfg.softSong) return; if (Soft.start()) { musicOn = true; mode = 'synth'; showBtn(Soft.running()); } }
  function start(fromTap) {
    if (musicOn) return;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (_) {}
    if (fromTap && cfg.softSong) { iosUnmute(); Soft.unlock(); }
    if (!fileFailed) {
      if (!audio.src) audio.src = cfg.file;
      const p = audio.play();
      if (p && p.then) p.then(() => {
        if (musicOn) { audio.pause(); return; }
        musicOn = true; mode = 'file'; showBtn(true);
        let vol = 0; audio.volume = 0; clearInterval(fadeT);
        fadeT = setInterval(() => { vol = Math.min(0.55, vol + 0.03); audio.volume = vol; if (vol >= 0.55) clearInterval(fadeT); }, 150);
      }).catch(err => {
        if (err && err.name === 'NotAllowedError') return;   // needs a tap first — retried on the next tap
        fileFailed = true;                                    // no song.mp3 → built-in piece
        if (fromTap || Soft.running()) startSynth();
      });
      return;
    }
    if (fromTap || Soft.running()) startSynth();
  }
  audio.addEventListener('error', () => { fileFailed = true; });

  // try on open (works only where the browser allows autoplay)…
  if (cfg.softSong && fileFailed) { Soft.unlock(); setTimeout(() => { if (Soft.running()) startSynth(); }, 300); }
  start(false);
  // …otherwise on the first real tap anywhere, retrying until sound is actually running
  const onTap = e => {
    if (e.target && e.target.closest && e.target.closest('#musicBtn')) return;
    if (userPaused) return;
    if (mode === 'synth') { if (!Soft.running()) { iosUnmute(); Soft.unlock(); } return; }
    if (mode === 'file') { if (audio.paused) audio.play().catch(() => {}); return; }
    start(true);
  };
  ['touchend', 'click', 'mousedown', 'keydown'].forEach(ev => document.addEventListener(ev, onTap, { capture: true, passive: true }));

  btn.addEventListener('click', () => {
    if (mode === 'file') { if (audio.paused) { userPaused = false; audio.play().catch(() => {}); showBtn(true); } else { userPaused = true; audio.pause(); showBtn(false); } }
    else if (mode === 'synth') { if (Soft.isPlaying() && !userPaused) { userPaused = true; Soft.pause(); showBtn(false); } else { userPaused = false; iosUnmute(); Soft.unlock(); Soft.resume(); showBtn(true); } }
  });
  document.addEventListener('visibilitychange', () => {
    const playing = mode === 'file' ? !audio.paused : mode === 'synth' && Soft.isPlaying() && btn.classList.contains('playing');
    if (document.hidden && playing) { hiddenPaused = true; mode === 'file' ? audio.pause() : Soft.pause(); }
    else if (!document.hidden && hiddenPaused) { hiddenPaused = false; mode === 'file' ? audio.play().catch(() => {}) : Soft.resume(); }
  });

  I.music = { start };
})();
