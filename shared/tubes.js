// Tube puzzles — one engine, three rule sets. Load after kit.js, with tubes.css.
//
//   KidsTubes.start({
//     id:    'ball-sort',            // localStorage key for the level reached
//     mode:  'ball' | 'water' | 'rings',
//     level: n => ({ n: colours-or-rings, cap: pieces per tube, empties }),
//     intro: 'spoken + shown instruction',
//     junior: true                   // name colours aloud, show where a ball can go
//   })
//
//   ball  — move the top ball onto the same colour or into an empty tube
//   water — same, but every touching layer of that colour pours together
//   rings — Tower of Hanoi: a ring may only sit on a bigger ring
//
// Every level is checked by a solver before it is shown, so none is
// impossible, and the same solver powers the 💡 hint.
(function () {
  const K = window.KidsKit, A = window.KidsAudio, U = window.KidsUtil;
  const COLOURS = [['red', '#ef4444'], ['blue', '#3b82f6'], ['yellow', '#facc15'], ['green', '#22c55e'],
    ['orange', '#fb923c'], ['purple', '#a855f7'], ['pink', '#f9a8d4'], ['sky blue', '#22d3ee'],
    ['brown', '#a16207'], ['grey', '#cbd5e1']];

  function start(o) {
    const rings = o.mode === 'rings', water = o.mode === 'water', junior = !!o.junior;
    const ui = K.setup();
    const sub = K.el('div', 'av-sub av-hint', o.intro);
    const board = K.el('div', 'tb-board ' + o.mode);
    const bar = K.el('div', 'av-bar');
    ui.stage.append(sub, board, bar);
    ui.stage.classList.add('av-puzzle');

    let ts = [], init = [], cap = 4, n = 0, hist = [], sel = -1, plan = null, hint = -1, extra = false;
    let moves = 0, locked = false, misses = 0, timer = null, idle = null, landed = -1, landedK = 0, perRow = 1, first = true;

    const btn = (label, fn) => { const b = K.el('button', 'av-btn', label); b.onclick = () => { K.wake(); fn(); }; bar.appendChild(b); return b; };
    const undoB = btn('↩ Undo', undo);
    btn('🔄 Again', () => load(init));
    btn('💡 Hint', showHint);
    const tubeB = rings || junior ? null : btn('➕ Tube', addTube);
    sub.onclick = () => { K.wake(); K.say(o.intro); };

    // ---------- rules ----------
    const top = t => t[t.length - 1];
    const clone = s => s.map(t => t.slice());
    function run(t) { let k = 1; while (k < t.length && t[t.length - 1 - k] === top(t)) k++; return k; }
    function can(s, a, b) {
      if (a === b || !s[a].length || s[b].length >= cap) return false;
      if (!s[b].length) return true;
      return rings ? top(s[b]) > top(s[a]) : top(s[b]) === top(s[a]);
    }
    const amount = (s, a, b) => water ? Math.min(run(s[a]), cap - s[b].length) : 1;
    const full = t => t.length === cap && t.every(x => x === t[0]);
    const solved = s => rings ? s[s.length - 1].length === n : s.every(t => !t.length || full(t));

    // ---------- solver ----------
    function solve(src, limit) {
      const t = clone(src);
      if (rings) {                                   // tiny state space: shortest path
        const k0 = JSON.stringify(t), prev = new Map([[k0, null]]), q = [t];
        while (q.length) {
          const s = q.shift(), ks = JSON.stringify(s);
          if (solved(s)) { const path = []; let k = ks; while (prev.get(k)) { path.unshift(prev.get(k)[1]); k = prev.get(k)[0]; } return path; }
          for (let a = 0; a < s.length; a++) for (let b = 0; b < s.length; b++) {
            if (!can(s, a, b)) continue;
            const c = clone(s); c[b].push(c[a].pop());
            const kc = JSON.stringify(c);
            if (!prev.has(kc)) { prev.set(kc, [ks, [a, b]]); q.push(c); }
          }
        }
        return null;
      }
      const seen = new Set(), path = []; let nodes = 0;
      function rec() {
        if (solved(t)) return true;
        if (++nodes > (limit || 60000) || path.length > 400) return false;
        const key = t.map(x => x.join('.')).sort().join('|');
        if (seen.has(key)) return false;
        seen.add(key);
        const mv = [];
        for (let a = 0; a < t.length; a++) {
          if (!t[a].length || full(t[a])) continue;
          const uniform = run(t[a]) === t[a].length; let usedEmpty = false;
          for (let b = 0; b < t.length; b++) {
            if (!can(t, a, b)) continue;
            if (t[b].length) mv.push([a, b, 0]);
            else if (!uniform && !usedEmpty) { usedEmpty = true; mv.push([a, b, 1]); }   // one empty tube is as good as another
          }
        }
        mv.sort((p, q) => p[2] - q[2]);
        for (const m of mv) {
          const k = amount(t, m[0], m[1]);
          t[m[1]].push(...t[m[0]].splice(-k)); path.push([m[0], m[1]]);
          if (rec()) return true;
          path.pop(); t[m[0]].push(...t[m[1]].splice(-k));
        }
        return false;
      }
      return rec() ? path.slice() : null;
    }

    // ---------- levels ----------
    function deal(cfg) {
      let s;
      for (let tries = 0; tries < 60; tries++) {
        const pieces = [];
        for (let c = 0; c < cfg.n; c++) for (let i = 0; i < cfg.cap; i++) pieces.push(c);
        const mix = U.shuffle(pieces);
        s = [];
        for (let c = 0; c < cfg.n; c++) s.push(mix.slice(c * cfg.cap, (c + 1) * cfg.cap));
        for (let e = 0; e < cfg.empties; e++) s.push([]);
        if (s.some(full)) continue;                  // start with nothing already sorted
        const p = solve(s);
        if (p) { plan = p; return s; }
      }
      return s;
    }
    function startLevel(lv) {
      const cfg = o.level(lv);
      cap = cfg.cap; n = cfg.n; plan = null;
      if (rings) { const peg = []; for (let i = n; i >= 1; i--) peg.push(i); load([peg, [], []]); }
      else load(deal(cfg), plan);
      K.say(first ? o.intro : 'Level ' + (lv + 1));
      first = false;
    }
    function load(s, keepPlan) {
      clearTimeout(timer);
      init = clone(s); ts = clone(s); hist = []; sel = -1; hint = -1; extra = false; moves = 0; locked = false; misses = 0;
      plan = keepPlan || null;
      render(); nudge();
    }

    // ---------- drawing ----------
    function layout() {
      const W = board.clientWidth, H = board.clientHeight, T = ts.length;
      let s = 0;
      if (rings) { perRow = T; s = Math.min(W / (T * 4.3), H / (cap + 2.5), 100); }
      else {
        for (let rows = 1; rows <= 3; rows++) {
          const per = Math.ceil(T / rows), fit = Math.min(W / (per * 1.62), H / (rows * (cap + 1.75)));
          if (fit > s) { s = fit; perRow = per; }
        }
        s = Math.min(s, 110);
      }
      board.style.setProperty('--s', Math.max(14, Math.floor(s)) + 'px');
      board.style.setProperty('--cap', cap);
    }
    function render() {
      layout();
      board.innerHTML = '';
      let row;
      ts.forEach((t, i) => {
        if (i % perRow === 0) { row = K.el('div', 'tb-row'); board.appendChild(row); }
        const b = K.el('button', 'tb-tube'), g = K.el('div', 'tb-glass');
        b.type = 'button';
        t.forEach((x, j) => {
          const p = K.el('div', rings ? 'tb-ring' : water ? 'tb-water' : 'tb-ball');
          p.style.setProperty('--c', COLOURS[(rings ? x - 1 : x) % COLOURS.length][1]);
          if (rings) p.style.width = (30 + 70 * x / n) + '%';
          if (i === sel && !water && j === t.length - 1) p.style.transform = 'translateY(calc(var(--s) * ' + -(cap - t.length + 1.05) + '))';
          if (i === landed && !water && j >= t.length - landedK) p.classList.add('av-pop');
          g.appendChild(p);
        });
        if (i === sel) b.classList.add('sel');
        if (i === hint) b.classList.add('hint');
        if (junior && sel >= 0 && can(ts, sel, i)) b.classList.add('ok');
        if (!rings && full(t)) b.classList.add('done');
        b.onclick = () => tap(i, b);
        b.appendChild(g);
        if (rings) b.appendChild(K.el('div', 'tb-flag', i === ts.length - 1 ? '🏁' : ''));
        row.appendChild(b);
      });
      landed = -1;
      undoB.disabled = !hist.length || locked;
      if (tubeB) tubeB.disabled = extra || locked;
      if (rings) sub.textContent = 'Moves: ' + moves + ' · fewest possible: ' + (Math.pow(2, n) - 1);
    }
    addEventListener('resize', render);

    // ---------- play ----------
    function nudge() {                               // junior: never leave a small child stuck
      clearTimeout(idle);
      if (junior) idle = setTimeout(() => { if (!locked) showHint(); }, 9000);
    }
    function tap(i, node) {
      if (locked) return;
      K.wake(); nudge();
      const t = ts[i];
      if (sel < 0) {
        if (!t.length || (!rings && full(t))) return;
        sel = i; hint = -1; A.playPop();
        if (junior) K.say(COLOURS[top(t)][0]);
        return render();
      }
      if (sel === i) { sel = -1; return render(); }
      if (can(ts, sel, i)) return move(sel, i);
      // Not allowed. Older players just pick the other tube up instead.
      if (!junior && !rings && t.length && !full(t)) { sel = i; hint = -1; A.playPop(); return render(); }
      misses++;
      node.classList.add('wrong'); A.playChime('uhoh');
      setTimeout(() => { node.classList.remove('wrong'); if (misses >= 2 && !locked) showHint(); }, 400);
      if (rings) K.say('Too big! A big ring can not sit on a small ring.');
      else if (t.length >= cap) K.say('That tube is full.');
      else { const c = COLOURS[top(ts[sel])][0]; K.say('That one is ' + COLOURS[top(t)][0] + '. Put ' + c + ' with ' + c + '.'); }
    }
    function move(a, b) {
      hist.push(clone(ts));
      const k = amount(ts, a, b);
      ts[b].push(...ts[a].splice(-k));
      if (plan && plan.length && plan[0][0] === a && plan[0][1] === b) plan.shift(); else plan = null;
      moves++; sel = -1; hint = -1; misses = 0; landed = b; landedK = k;
      A.playPop();
      if (solved(ts)) return win();
      render();
      if (!rings && full(ts[b])) {
        K.confetti(8);
        K.say(junior ? 'All the ' + COLOURS[ts[b][0]][0] + ' ones together!' : 'One tube done!');
      } else if (!ts.some((_, x) => ts.some((_, y) => can(ts, x, y)))) {
        K.say('No moves left. Tap undo' + (tubeB && !extra ? ', or add a tube.' : '.'));
      }
    }
    function win() {
      locked = true; clearTimeout(idle);
      render();
      K.star(); A.playChime('yay'); K.confetti();
      const best = Math.pow(2, n) - 1;
      const line = rings ? (moves === best ? 'Perfect! ' + moves + ' moves. That is the fewest possible!' : 'You did it in ' + moves + ' moves!')
        : junior ? 'Hooray! You sorted all the colours!' : 'Sorted! Well done!';
      K.say(line);
      timer = setTimeout(() => L.win(), K.speakMs(line) + 900);
    }
    function undo() {
      if (locked || !hist.length) return;
      ts = hist.pop(); moves++; sel = -1; hint = -1; plan = null;
      render();
    }
    function addTube() {
      if (locked || extra) return;
      extra = true; ts.push([]); plan = null; hint = -1;
      render();
    }
    function showHint() {
      if (locked) return;
      if (!plan || !plan.length) plan = solve(ts, 200000);
      if (!plan || !plan.length) { K.say('I can not see a way from here. Tap undo' + (tubeB && !extra ? ', or add a tube.' : '.')); return; }
      const [a, b] = plan[0];
      if (sel >= 0 && sel !== a) sel = -1;
      hint = sel === a ? b : a;
      render(); nudge();
    }

    const L = K.levels(o.id, ui, startLevel);
    L.begin();
    return L;
  }

  window.KidsTubes = { start, COLOURS };
})();
