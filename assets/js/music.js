/*
  Background music.
  - Plays song.mp3 if it exists next to index.html (config.js → music.file).
  - Otherwise plays a soft, original piano piece synthesised live with Web Audio (no file needed).
  - Browsers only allow sound after the guest taps; it starts on the first real tap
    (touch *end*, click or key — touch *start* does not count) and keeps retrying until sound is running.
*/
(function () {
  const I = window.Invite, cfg = (I.cfg.music || {});

  /* ---------------- soft piano piece ---------------- */
  const Soft = (() => {
    let ctx = null, master, bus, timer = null, nextBar = 0, bar = 0, loopN = 0, on = false;
    const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
    const BEAT = 60 / 66, BAR = BEAT * 4, VOL = 1.8;
    const CH = { F: [41, 4], C: [36, 4], Dm: [38, 3], Bb: [46, 4], Gm: [43, 3] };
    const PROG = ['F', 'C', 'Dm', 'Bb', 'F', 'C', 'Bb', 'C', 'Dm', 'Bb', 'F', 'C', 'Gm', 'Bb', 'C', 'F'];
    const MEL = [
      [[69, 2], [72, 1], [77, 1]], [[76, 2], [74, 1], [72, 1]], [[74, 3], [69, 1]], [[70, 2], [72, 1], [74, 1]],
      [[72, 2], [69, 1], [72, 1]], [[67, 3], [64, 1]], [[65, 2], [67, 1], [69, 1]], [[67, 4]],
      [[69, 2], [74, 1], [77, 1]], [[77, 2], [74, 1], [70, 1]], [[72, 3], [69, 1]], [[72, 2], [74, 1], [76, 1]],
      [[74, 2], [70, 1], [67, 1]], [[74, 2], [72, 1], [70, 1]], [[72, 2], [76, 1], [79, 1]], [[77, 4]]
    ];
    function impulse(sec, decay) {
      const len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
      return b;
    }
    function build() {
      master = ctx.createGain(); master.gain.value = 0.0001;
      const comp = ctx.createDynamicsCompressor(), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4200;
      const rev = ctx.createConvolver(); rev.buffer = impulse(3.4, 2.6);
      const wet = ctx.createGain(); wet.gain.value = 0.42; const dry = ctx.createGain(); dry.gain.value = 0.72;
      bus = ctx.createGain(); bus.connect(dry); bus.connect(rev); rev.connect(wet);
      dry.connect(lp); wet.connect(lp); lp.connect(comp); comp.connect(master); master.connect(ctx.destination);
    }
    function piano(m, t, dur, vel) {
      const f = mtof(m), g = ctx.createGain(); g.connect(bus);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel, t + 0.012);
      g.gain.exponentialRampToValueAtTime(vel * 0.32, t + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      [[1, 1], [2, 0.3], [3, 0.09], [4, 0.04]].forEach(([k, a], i) => {
        const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'sine'; o.frequency.value = f * k * (1 + i * 0.0007);
        og.gain.value = a; o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + 0.05);
      });
    }
    function pad(notes, t, dur) {
      notes.forEach(m => {
        const o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = mtof(m); lp.type = 'lowpass'; lp.frequency.value = 800;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.016, t + 1.2); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.8);
        o.connect(lp); lp.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 1);
      });
    }
    function scheduleBar(t, i) {
      const [root, third] = CH[PROG[i]], jit = () => (Math.random() - 0.5) * 0.012;
      [0, 7, 12, 12 + third, 19, 12 + third, 12, 7].forEach((o, k) => piano(root + o, t + k * BEAT / 2 + jit(), 1.8, (k ? 0.06 : 0.1) * (0.9 + Math.random() * 0.2)));
      pad([root + 12, root + 12 + third, root + 19], t, BAR);
      let bt = 0;
      MEL[i].forEach(([m, len]) => {
        piano(m, t + bt * BEAT + jit(), Math.max(1.8, len * BEAT + 1), 0.15 * (0.9 + Math.random() * 0.15));
        if (loopN % 2) piano(m + 12, t + bt * BEAT + BEAT / 2, 1.4, 0.03);
        bt += len;
      });
    }
    function tick() { while (nextBar < ctx.currentTime + 1.2) { scheduleBar(nextBar, bar); if (++bar === PROG.length) { bar = 0; loopN++; } nextBar += BAR; } }
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
        on = true; nextBar = ctx.currentTime + 0.2; bar = 0; loopN = 0; ramp(VOL, 3, true); tick(); timer = setInterval(tick, 250); return true;
      },
      isPlaying: () => on && !!ctx && ctx.state === 'running',
      pause() { if (!ctx) return; ramp(0.0001, 0.5); setTimeout(() => ctx.suspend(), 550); },
      resume() { if (!ctx) return; ctx.resume().then(() => ramp(VOL, 1.2, true)).catch(() => {}); }
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
