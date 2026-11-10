// Site root, worked out from this script's own address (it lives in shared/).
window.KIDS_ROOT = new URL('../', document.currentScript.src).href;

// Shared helpers for all games.
// Keep this tiny — each game stays self-contained.

// Initialize theme on page load (before render to avoid flash).
(function initializeTheme() {
  const stored = localStorage.getItem('kids-theme');
  const theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

// Inject a "back to hub" button and theme toggle into any page.
(function addButtons() {
  const addIfMissing = (className, label, emoji, callback) => {
    if (document.querySelector('.' + className)) return;
    const btn = document.createElement('button');
    btn.className = className;
    btn.setAttribute('aria-label', label);
    btn.textContent = emoji;
    btn.onclick = callback;
    btn.type = 'button';
    const add = () => document.body.appendChild(btn);
    document.addEventListener('DOMContentLoaded', add);
    if (document.readyState !== 'loading') add();
  };

  addIfMissing('back-btn', 'Back to games', '←', () => { window.location.href = window.KIDS_ROOT; });
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  addIfMissing('theme-toggle', 'Toggle dark mode', isDark ? '☀️' : '🌙', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('kids-theme', next);
    // Update button emoji
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
})();

// Lazy shared AudioContext (browsers require user gesture to start audio).
let _audioCtx = null;
function getAudio() {
  if (!_audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    _audioCtx = new AC();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

// Satisfying cartoon "pop" sound — synthesised, no asset files.
function playPop() {
  const ctx = getAudio();
  const now = ctx.currentTime;

  // Pitched blip that falls fast
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(900, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.5, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);

  // Short noise burst for the "pop" edge
  const bufSize = ctx.sampleRate * 0.05;
  const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  const nGain = ctx.createGain();
  nGain.gain.value = 0.25;
  noise.connect(nGain).connect(ctx.destination);
  noise.start(now);
}

// Play a short musical chime.
// 'yay'  -> cheerful rising arpeggio
// 'uhoh' -> gentle two-note nudge (never harsh)
function playChime(kind = 'yay') {
  const ctx = getAudio();
  const now = ctx.currentTime;
  const notes = kind === 'yay'
    ? [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    : [392.00, 329.63];                 // G4 E4
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = now + i * 0.12;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}

// Speak text with a kid-friendly voice via Web Speech API.
// Cancels any in-flight utterance so rapid taps stay snappy.
// macOS ships a lot of "novelty" voices (Albert, Bad News, Bahh, Bells, …)
// that either make sound effects or refuse to pronounce text — excluded below
// so we never silently fall back to one.
const BAD_VOICE_RE = /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|pipe organ|trinoids|whisper|wobble|zarvox|bahh|fred|ralph/i;

// getVoices() is empty until the speech engine loads voices asynchronously
// (it then fires 'voiceschanged'). If we speak in that window no voice gets
// picked and some engines stay completely silent — which is why the first
// tap of a freshly opened game often said nothing. Warm the list up front
// and cache the best kid-friendly voice so the very first utterance can talk.
let _preferredVoice = null;
let _pendingSpeak = null;
let _pendingTimer = null;
function refreshVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || !voices.length) return;
  // Prefer a clear kid-friendly female English voice; never pick a novelty voice.
  const good = voices.filter(v => v.lang && v.lang.startsWith('en') && !BAD_VOICE_RE.test(v.name));
  _preferredVoice = good.find(v => /samantha|karen|moira|tessa|victoria|allison|ava|serena|fiona|zira|kate|susan|nicky|zoe|google uk english female|google us english/i.test(v.name))
                 || good.find(v => /female/i.test(v.name))
                 || good.find(v => v.default)
                 || good[0]
                 || null;
}
if ('speechSynthesis' in window) {
  refreshVoices();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    refreshVoices();
    // A line may be waiting for voices to arrive (see speak below).
    if (_preferredVoice && _pendingSpeak) flushPendingSpeak();
  });
}

function _speakNow(text, rate, pitch, lang) {
  const synth = window.speechSynthesis;
  // Chrome can leave synthesis 'paused' after a tab switch, which silently
  // swallows new utterances. resume() is harmless when nothing is paused.
  try { synth.resume(); } catch (e) {}
  // Only cancel if something is actually in flight. Calling cancel() then
  // speak() in the same tick can cause the new utterance to be cancelled
  // along with the old one on Chrome/Safari.
  if (synth.speaking || synth.pending) {
    try { synth.cancel(); } catch (e) {}
  }
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.pitch = pitch;
  u.lang = lang;
  if (_preferredVoice) u.voice = _preferredVoice;
  // When this line finishes on its own, play whatever queued up behind it
  // (see the timer-vs-tap logic in speak below).
  u.onend = u.onerror = () => { if (_queuedSpeak) flushQueuedSpeak(); };
  // Keep a reference so the utterance isn't garbage-collected before it
  // starts speaking — a long-standing Chrome bug drops GC'd utterances.
  speak._last = u;
  synth.speak(u);
}

function flushPendingSpeak() {
  if (_pendingTimer) { clearTimeout(_pendingTimer); _pendingTimer = null; }
  const p = _pendingSpeak;
  _pendingSpeak = null;
  if (p) _speakNow(p.text, p.rate, p.pitch, p.lang);
}

// A line that arrived from a timer while another line was still being spoken
// waits here until the current one finishes. Only the newest such line is kept.
let _queuedSpeak = null;
let _queueWatchdog = null;
let _queuedAt = 0;

function flushQueuedSpeak() {
  if (_queueWatchdog) { clearInterval(_queueWatchdog); _queueWatchdog = null; }
  const q = _queuedSpeak;
  _queuedSpeak = null;
  if (q) _speakNow(q.text, q.rate, q.pitch, q.lang);
}

function speak(text, { rate = 0.95, pitch = 1.15, lang = 'en-US' } = {}) {
  if (!('speechSynthesis' in window)) return;
  // Voices may not have loaded yet on the very first call — try again now.
  if (!_preferredVoice) refreshVoices();
  if (!_preferredVoice) {
    // Voices are still loading (they arrive async with 'voiceschanged').
    // Speaking now would use the engine's default — often an unclear male
    // voice — and later lines would then switch to the good female voice.
    // Hold this line until voices arrive (newest request wins, matching the
    // cancel() behaviour). If voices never show up, speak anyway after 2s
    // rather than leaving the game mute.
    _pendingSpeak = { text, rate, pitch, lang };
    if (!_pendingTimer) _pendingTimer = setTimeout(flushPendingSpeak, 2000);
    return;
  }
  const synth = window.speechSynthesis;
  // Lines spoken in response to a tap (window.event is set while an event
  // handler is running) interrupt whatever is playing, so feedback stays
  // snappy. Lines fired by timers — like the next question loading after a
  // win — must NOT cut the celebration off mid-sentence: park them until
  // the current line ends. The utterance's onend flushes the queue; a
  // watchdog poll is the backup because Chrome sometimes drops end events.
  const fromTap = !!window.event;
  if (!fromTap && (synth.speaking || synth.pending)) {
    _queuedSpeak = { text, rate, pitch, lang };
    _queuedAt = Date.now();
    if (!_queueWatchdog) {
      _queueWatchdog = setInterval(() => {
        const stuck = Date.now() - _queuedAt > 12000;
        if (stuck) { try { synth.cancel(); } catch (e) {} }
        if (stuck || (!synth.speaking && !synth.pending)) flushQueuedSpeak();
      }, 250);
    }
    return;
  }
  // A tap-triggered line supersedes anything still parked in the queue.
  _queuedSpeak = null;
  _speakNow(text, rate, pitch, lang);
}

// Tiny utilities
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Speak Hindi text with a Hindi voice (macOS: Lekha; Chrome: Google हिन्दी).
// The English voice cached above cannot pronounce Devanagari, so this picks
// its own. Returns false when no Hindi voice is installed, so a game can
// fall back to speaking a transliteration in English.
function speakHindi(text, opts = {}) {
  const { rate = 0.8, pitch = 1.1 } = opts;
  if (!('speechSynthesis' in window)) return false;
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  const voice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('hi'));
  if (!voice) {
    // Nothing loaded yet (voices arrive async on a fresh page): say the line
    // as soon as they do, rather than falling back to English too early.
    if (!voices.length && !opts._retried) {
      synth.addEventListener('voiceschanged', () => speakHindi(text, Object.assign({}, opts, { _retried: true })), { once: true });
      return true;
    }
    return false;
  }
  try { synth.resume(); } catch (e) {}
  if (synth.speaking || synth.pending) { try { synth.cancel(); } catch (e) {} }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'hi-IN';
  u.voice = voice;
  u.rate = rate;
  u.pitch = pitch;
  speak._last = u;
  synth.speak(u);
  return true;
}

// Remember which games get played, so the hub can offer "Play again" and
// mark games that have never been opened. Stored per slug: { c: count, t: last }.
(function trackPlay() {
  const m = location.pathname.match(/\/games\/([^/]+)\//);
  if (!m) return;
  try {
    const plays = JSON.parse(localStorage.getItem('kids-plays') || '{}');
    const p = plays[m[1]] || { c: 0, t: 0 };
    plays[m[1]] = { c: p.c + 1, t: Date.now() };
    localStorage.setItem('kids-plays', JSON.stringify(plays));
  } catch (e) {}
})();

// Toddler-proofing: a long press or a pinch should never pop up a browser
// menu or zoom the page out from under a game.
document.addEventListener('contextmenu', e => {
  if (!e.target.closest('input, textarea')) e.preventDefault();
});
document.addEventListener('gesturestart', e => e.preventDefault());

// Offline support: sw.js keeps a copy of every page it serves, so the games
// still open with no network (see /sw.js).
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(window.KIDS_ROOT + 'sw.js').catch(() => {});
  });
}

window.KidsAudio = { getAudio, playPop, playChime, speak, speakHindi };
window.KidsUtil = { rand, shuffle };
