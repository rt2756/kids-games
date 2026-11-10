// Game kit — the pieces most games share, so a new game is mostly
// its content. Load after /shared/common.js, with /shared/kit.css.
//
//   KidsKit.setup({ title })        -> builds score pill + title + stage
//   KidsKit.quiz({ title, next })   -> a full "question + choices" game
//   KidsKit.bag(list)               -> draw() without repeats until empty
//   KidsKit.levels(id, ui, start)   -> level picker + saved progress for puzzles
//   KidsKit.star() / .confetti() / .say() / .wrong(el)
//
// Rules baked in (see README): every prompt is spoken, tapping the prompt
// repeats it, wrong answers never end the round, and after two misses the
// right answer starts to glow so a 3-year-old is never stuck.
(function () {
  const A = window.KidsAudio, U = window.KidsUtil;
  let scoreEl = null, score = 0;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function wake() { try { A.getAudio(); } catch (e) {} }

  // line: a string, or { text, hindi: true, roman } for a Devanagari line.
  function say(line, opts) {
    if (!line) return;
    if (typeof line === 'object' && line.hindi) {
      // No Hindi voice on this device? Fall back to the romanised line.
      if (!A.speakHindi(line.text) && line.roman) A.speak(line.roman, opts);
    } else A.speak(typeof line === 'object' ? line.text : line, opts);
  }

  function setup({ title = '' } = {}) {
    document.body.classList.add('av');
    scoreEl = el('div', 'av-score', '⭐ 0');
    const h1 = el('h1', 'av-title', title);
    const stage = el('main', 'av-stage');
    document.body.append(scoreEl, h1, stage);
    return { stage, titleEl: h1, setTitle: t => { h1.innerHTML = t; } };
  }

  function star() {
    score++;
    if (scoreEl) {
      scoreEl.textContent = '⭐ ' + score;
      scoreEl.classList.remove('bump'); void scoreEl.offsetWidth; scoreEl.classList.add('bump');
    }
    return score;
  }

  function confetti(n = 22, bits = ['🎉', '⭐', '✨', '🌈']) {
    for (let i = 0; i < n; i++) {
      const c = el('div', 'av-confetti');
      c.textContent = U.rand(bits);
      c.style.left = Math.random() * 100 + 'vw';
      c.style.animationDelay = (Math.random() * 0.4) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2200);
    }
  }

  function wrong(node) {
    A.playChime('uhoh');
    node.classList.remove('wrong'); void node.offsetWidth; node.classList.add('wrong');
    setTimeout(() => node.classList.remove('wrong'), 400);
  }

  // Shuffled draw without repeats; reshuffles when empty and avoids handing
  // out the same item twice in a row across the reshuffle.
  function bag(list) {
    let pile = [], last;
    return function draw() {
      if (!pile.length) {
        pile = U.shuffle(list);
        if (pile.length > 1 && pile[pile.length - 1] === last) pile.unshift(pile.pop());
      }
      last = pile.pop();
      return last;
    };
  }

  // Roughly how long a line takes to speak, so the next round never cuts it off.
  function speakMs(line) {
    const t = typeof line === 'object' ? line.text : (line || '');
    return Math.max(1500, Math.min(5000, 700 + t.length * 65));
  }

  // next(roundNumber) returns:
  //   { show: html for the prompt, say, choices: [{ html, ok, say? }],
  //     praise, retry?, after?(): called once the right answer is tapped }
  function quiz({ title, next, modes, onMode }) {
    const ui = setup({ title });
    let modeRow = null;
    if (modes) {
      modeRow = el('div', 'av-modes');
      modes.forEach((m, i) => {
        const b = el('button', 'av-btn' + (i === 0 ? ' on' : ''), m.label);
        b.onclick = () => {
          modeRow.querySelectorAll('.av-btn').forEach(x => x.classList.remove('on'));
          b.classList.add('on'); onMode(m.id); clearTimeout(timer); newRound();
        };
        modeRow.appendChild(b);
      });
      ui.stage.appendChild(modeRow);
    }
    const prompt = el('div', 'av-prompt');
    const choices = el('div', 'av-choices');
    ui.stage.append(prompt, choices);
    let round = 0, locked = false, misses = 0, cur = null, timer = null;

    // Tapping the question (or the title) says it again.
    prompt.onclick = ui.titleEl.onclick = () => { wake(); if (cur) say(cur.say); };

    function newRound() {
      locked = false; misses = 0; cur = next(round++);
      if (cur.title) ui.setTitle(cur.title);
      prompt.innerHTML = cur.show || '';
      prompt.classList.remove('av-pop'); void prompt.offsetWidth; prompt.classList.add('av-pop');
      choices.innerHTML = '';
      cur.choices.forEach(c => {
        const b = el('button', 'av-choice', c.html);
        b.onclick = () => pick(c, b);
        c.node = b;
        choices.appendChild(b);
      });
      say(cur.say);
    }

    function pick(c, b) {
      if (locked) return;
      wake();
      if (c.ok) {
        locked = true;
        choices.querySelectorAll('.hint').forEach(x => x.classList.remove('hint'));
        b.classList.add('right');
        A.playChime('yay'); star(); confetti();
        say(cur.praise || 'Yes! Well done!');
        if (cur.after) cur.after(c);
        timer = setTimeout(newRound, speakMs(cur.praise) + 500);
      } else {
        misses++;
        wrong(b);
        say(c.say || cur.retry || 'Try again!');
        if (misses >= 2) cur.choices.filter(x => x.ok).forEach(x => x.node.classList.add('hint'));
      }
    }
    newRound();
    return ui;
  }

  // A two-mode game for "a set of things to know" (letters, numbers, words):
  //   Learn — flip through every item with ◀ ▶, each one spoken;
  //   Find  — hear one, pick it out of three.
  // o = { title, items, card(it)->html, say(it)->line,
  //       ask(it)->{ show, say }, choice(it)->html, praise(it)->line }
  function flashQuiz(o) {
    const ui = setup({ title: o.title });
    const modes = el('div', 'av-modes'), prompt = el('div', 'av-prompt'), row = el('div', 'av-choices');
    ui.stage.append(modes, prompt, row);
    let mode = 'learn', i = 0, cur = null, locked = false, misses = 0, timer = null;
    const draw = bag(o.items), buttons = {};
    [['learn', '📖 Learn'], ['find', '🎯 Find it']].forEach(([id, label]) => {
      const b = buttons[id] = el('button', 'av-btn' + (id === mode ? ' on' : ''), label);
      b.onclick = () => {
        wake(); mode = id; clearTimeout(timer);
        Object.keys(buttons).forEach(k => buttons[k].classList.toggle('on', k === id));
        show();
      };
      modes.appendChild(b);
    });
    prompt.onclick = () => { wake(); A.playPop(); say(mode === 'learn' ? o.say(o.items[i]) : o.ask(cur).say); };

    function step(d) { wake(); i = (i + d + o.items.length) % o.items.length; show(); }
    function show() {
      row.innerHTML = ''; locked = false; misses = 0;
      prompt.classList.remove('av-pop'); void prompt.offsetWidth; prompt.classList.add('av-pop');
      if (mode === 'learn') {
        const it = o.items[i];
        prompt.innerHTML = o.card(it);
        const prev = el('button', 'av-choice nav', '◀'), next = el('button', 'av-choice nav', '▶');
        prev.onclick = () => step(-1); next.onclick = () => step(1);
        row.append(prev, next);
        say(o.say(it));
        return;
      }
      cur = draw();
      const q = o.ask(cur);
      prompt.innerHTML = q.show;
      const others = U.shuffle(o.items.filter(x => x !== cur)).slice(0, 2);
      U.shuffle([cur].concat(others)).forEach(it => {
        const b = el('button', 'av-choice', o.choice(it));
        b.onclick = () => {
          if (locked) return;
          wake();
          if (it === cur) {
            locked = true; b.classList.add('right');
            A.playChime('yay'); star(); confetti();
            const p = o.praise(cur);
            say(p); timer = setTimeout(show, speakMs(p) + 700);
          } else {
            misses++; wrong(b);
            say(o.say(it));   // name what was tapped — a miss still teaches
            if (misses >= 2) row.querySelectorAll('.av-choice').forEach(x => { if (x._ok) x.classList.add('hint'); });
          }
        };
        b._ok = it === cur;
        row.appendChild(b);
      });
      say(q.say);
    }
    show();
    return ui;
  }

  // Convenience: build the html for an emoji (+ optional word) choice.
  function card(emoji, word) {
    return '<span class="e">' + emoji + '</span>' + (word ? '<span class="w">' + word + '</span>' : '');
  }

  // Levels for puzzle games. Puts "◀ Level 3 ▶" in the title, remembers the
  // level reached (per game, in localStorage) and calls start(n) — n from 0 —
  // whenever a level should be set up. ▶ only goes as far as has been reached.
  //   const L = K.levels('my-game', ui, n => { ...build level n... });
  //   L.begin();            // once, to show the saved level
  //   L.win();              // after a level is solved
  function levels(id, ui, start) {
    const key = 'kids-level-' + id, s = { n: 0, max: 0 };
    try { Object.assign(s, JSON.parse(localStorage.getItem(key)) || {}); } catch (e) {}
    const prev = el('button', 'av-lvl', '◀'), next = el('button', 'av-lvl', '▶'), label = el('span', 'av-lvl-name');
    ui.titleEl.innerHTML = '';
    ui.titleEl.append(prev, label, next);
    function go(n) {
      s.n = Math.max(0, n); s.max = Math.max(s.max, s.n);
      try { localStorage.setItem(key, JSON.stringify(s)); } catch (e) {}
      label.textContent = 'Level ' + (s.n + 1);
      prev.disabled = s.n === 0; next.disabled = s.n >= s.max;
      start(s.n);
    }
    prev.onclick = () => { wake(); go(s.n - 1); };
    next.onclick = () => { wake(); go(s.n + 1); };
    return { begin: () => go(s.n), win: () => go(s.n + 1), go, get n() { return s.n; } };
  }

  window.KidsKit = { el, wake, say, setup, star, confetti, wrong, bag, quiz, flashQuiz, card, speakMs, levels };
})();
