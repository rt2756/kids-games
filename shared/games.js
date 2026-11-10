// Single source of truth for the games library.
// Add a new game = add one entry to KIDS_GAMES below; the hub (index.html),
// the offline cache (sw.js) and the NEW ribbon all read this file.
// Game folders stay flat (games/NN-slug/) — age and subject are metadata
// here, not folder locations, so nothing ever needs renumbering.
//
// Entry fields:
//   n        folder number            slug   folder name under games/
//   bucket   age shelf (KIDS_BUCKETS id)
//   min      youngest age the game suits — sorts games inside a shelf and
//            shows on the tile as "3+"
//   subject  one of KIDS_SUBJECTS   topic  finer grouping inside a subject
//   grad     the tile's two gradient colours
//   added    'YYYY-MM' — the tile wears a NEW ribbon until it is first played

// Age shelves, youngest first.
window.KIDS_BUCKETS = [
  { id: 'little', label: 'Little Ones',      age: '1–5',  emoji: '🧸' },
  { id: 'kinder', label: 'Kindergarten',     age: '5–6',  emoji: '📚' },
  { id: 'early',  label: 'Early Elementary', age: '6–8',  emoji: '✏️' },
  { id: 'upper',  label: 'Upper Elementary', age: '8–10', emoji: '🧠' },
];

// The shelf the hub opens on, and the age the "Great to start with" row
// is tuned to. Bump KIDS_PLAY_AGE as the child grows — nothing else needs editing.
window.KIDS_DEFAULT_BUCKET = 'little';
window.KIDS_PLAY_AGE = 3;

// Subjects, in the order the hub lists them.
window.KIDS_SUBJECTS = [
  { id: 'Math',     label: 'Maths',              emoji: '🔢' },
  { id: 'Literacy', label: 'Reading & Phonics',  emoji: '🔤' },
  { id: 'Language', label: 'Words & Language',   emoji: '🗣️' },
  { id: 'Hindi',    label: 'Hindi',              emoji: 'अ' },
  { id: 'Logic',    label: 'Thinking & Puzzles', emoji: '🧩' },
  { id: 'Science',  label: 'Science',            emoji: '🔬' },
  { id: 'World',    label: 'My World',           emoji: '🌍' },
  { id: 'Feelings', label: 'Feelings',           emoji: '😊' },
  { id: 'Music',    label: 'Music',              emoji: '🎵' },
  { id: 'Art',      label: 'Art & Colours',      emoji: '🎨' },
  { id: 'Motor',    label: 'Tap & Play',         emoji: '✋' },
];

window.KIDS_GAMES = [
  // --- Little Ones (1–5) ---
  { n: 1, slug: '01-pop-bubbles', title: 'Pop the Bubbles', emoji: '🫧', bucket: 'little', min: 1, subject: 'Motor', topic: 'Tap & pop', grad: '#ff5e62,#ff9966' },
  { n: 2, slug: '02-animal-sounds', title: 'Animal Sounds', emoji: '🐮', bucket: 'little', min: 1, subject: 'Language', topic: 'Animals', grad: '#56ab2f,#a8e063' },
  { n: 5, slug: '05-body-parts', title: "Where's Your Nose?", emoji: '🧸', bucket: 'little', min: 1, subject: 'Language', topic: 'My body', grad: '#11998e,#38ef7d' },
  { n: 7, slug: '07-paint-splash', title: 'Paint Splash', emoji: '🎨', bucket: 'little', min: 1, subject: 'Art', topic: 'Drawing', grad: '#8e2de2,#4a00e0' },
  { n: 11, slug: '11-peekaboo-barn', title: 'Peekaboo Barn', emoji: '🙈', bucket: 'little', min: 1, subject: 'Language', topic: 'Animals', grad: '#e53935,#e35d5b' },
  { n: 12, slug: '12-vehicle-sounds', title: 'Vehicle Sounds', emoji: '🚗', bucket: 'little', min: 1, subject: 'Language', topic: 'Vehicles', grad: '#36d1dc,#5b86e5' },
  { n: 14, slug: '14-tower-smash', title: 'Build & Smash', emoji: '🧱', bucket: 'little', min: 1, subject: 'Motor', topic: 'Tap & pop', grad: '#00b09b,#96c93d' },
  { n: 15, slug: '15-bath-time', title: 'Bath Time', emoji: '🛁', bucket: 'little', min: 1, subject: 'Motor', topic: 'Tap & pop', grad: '#56ccf2,#2f80ed' },
  { n: 16, slug: '16-xylophone', title: 'Baby Xylophone', emoji: '🎵', bucket: 'little', min: 1, subject: 'Music', topic: 'Instruments', grad: '#b24592,#f15f79' },
  { n: 50, slug: '50-touch-giggle', title: 'Touch & Giggle', emoji: '✨', bucket: 'little', min: 1, subject: 'Motor', topic: 'Tap & pop', grad: '#ff9a9e,#a18cd1' },
  { n: 51, slug: '51-balloon-pop', title: 'Balloon Pop', emoji: '🎈', bucket: 'little', min: 1, subject: 'Motor', topic: 'Tap & pop', grad: '#4facfe,#00f2fe' },
  { n: 52, slug: '52-drum-pad', title: 'Drum Pad', emoji: '🥁', bucket: 'little', min: 1, subject: 'Music', topic: 'Instruments', grad: '#6a11cb,#2575fc' },
  { n: 53, slug: '53-knock-knock', title: 'Knock Knock', emoji: '🚪', bucket: 'little', min: 1, subject: 'Language', topic: 'Animals', grad: '#d76d77,#3a1c71' },
  { n: 54, slug: '54-light-switch', title: 'Light Switch', emoji: '💡', bucket: 'little', min: 1, subject: 'Motor', topic: 'Cause & effect', grad: '#1e3c72,#2a5298' },
  { n: 3, slug: '03-alphabet-keys', title: 'Alphabet Keys', emoji: '🔤', bucket: 'little', min: 2, subject: 'Literacy', topic: 'Letters', grad: '#4568dc,#b06ab3' },
  { n: 4, slug: '04-color-sorter', title: 'Color Sorter', emoji: '🍎', bucket: 'little', min: 2, subject: 'Art', topic: 'Colours', grad: '#f7971e,#ffd200' },
  { n: 8, slug: '08-wheres-cat', title: "Where's the Cat?", emoji: '🐱', bucket: 'little', min: 2, subject: 'Logic', topic: 'Memory', grad: '#f953c6,#b91d73' },
  { n: 9, slug: '09-learn-play', title: 'Learn & Play', emoji: '🎓', bucket: 'little', min: 2, subject: 'Language', topic: 'First words', grad: '#00c6ff,#0072ff' },
  { n: 10, slug: '10-feed-monster', title: 'Feed the Monster', emoji: '👾', bucket: 'little', min: 2, subject: 'Motor', topic: 'Drag & drop', grad: '#7f00ff,#e100ff' },
  { n: 13, slug: '13-shape-sorter', title: 'Shape Sorter', emoji: '🔷', bucket: 'little', min: 2, subject: 'Math', topic: 'Shapes', grad: '#fc4a1a,#f7b733' },
  { n: 17, slug: '17-big-small', title: 'Big or Small?', emoji: '🐘', bucket: 'little', min: 2, subject: 'Math', topic: 'Comparing', grad: '#fa709a,#fee140' },
  { n: 18, slug: '18-find-same', title: 'Find the Same One', emoji: '🔍', bucket: 'little', min: 2, subject: 'Logic', topic: 'Matching', grad: '#43e97b,#38f9d7' },
  { n: 19, slug: '19-day-night', title: 'Day & Night', emoji: '🌙', bucket: 'little', min: 2, subject: 'World', topic: 'Day & calendar', grad: '#141e30,#4a69bd' },
  { n: 55, slug: '55-fruit-names', title: 'Fruit Names', emoji: '🍓', bucket: 'little', min: 2, subject: 'Language', topic: 'First words', grad: '#11998e,#38ef7d' },
  { n: 104, slug: '104-shadow-match', title: 'Shadow Match', emoji: '👤', bucket: 'little', min: 2, subject: 'Logic', topic: 'Matching', grad: '#434343,#8e9eab', added: '2026-11' },
  { n: 107, slug: '107-colour-hunt', title: 'Colour Hunt', emoji: '🔴', bucket: 'little', min: 2, subject: 'Art', topic: 'Colours', grad: '#ff5f6d,#ffc371', added: '2026-11' },
  { n: 111, slug: '111-who-eats-what', title: 'Who Eats What?', emoji: '🥕', bucket: 'little', min: 2, subject: 'Science', topic: 'Animals', grad: '#56ab2f,#a8e063', added: '2026-11' },
  { n: 6, slug: '06-counting-cats', title: 'Counting Cats', emoji: '🐱', bucket: 'little', min: 3, subject: 'Math', topic: 'Counting', grad: '#ee0979,#ff6a00' },
  { n: 20, slug: '20-catch-fruit', title: 'Catch the Fruit', emoji: '🧺', bucket: 'little', min: 3, subject: 'Motor', topic: 'Drag & drop', grad: '#ff8008,#ffc837' },
  { n: 21, slug: '21-memory-flip', title: 'Memory Match', emoji: '🎴', bucket: 'little', min: 3, subject: 'Logic', topic: 'Memory', grad: '#614385,#516395' },
  { n: 22, slug: '22-alphabet-train', title: 'ABC Sounds', emoji: '🔤', bucket: 'little', min: 3, subject: 'Literacy', topic: 'Letters', grad: '#2193b0,#6dd5ed' },
  { n: 24, slug: '24-feelings-faces', title: 'Feelings Faces', emoji: '😊', bucket: 'little', min: 3, subject: 'Feelings', topic: 'Emotions', grad: '#ffa99f,#ff719a' },
  { n: 56, slug: '56-hindi-swar', title: 'Hindi Swar', emoji: 'अ', bucket: 'little', min: 3, subject: 'Hindi', topic: 'Letters', grad: '#ff9966,#ff5e62' },
  { n: 58, slug: '58-animal-homes', title: 'Animal Homes', emoji: '🏠', bucket: 'little', min: 3, subject: 'Science', topic: 'Animals', grad: '#f6d365,#fda085' },
  { n: 60, slug: '60-transport', title: 'Land, Water, Air', emoji: '🚂', bucket: 'little', min: 3, subject: 'World', topic: 'Transport', grad: '#2980b9,#6dd5fa' },
  { n: 72, slug: '72-opposites', title: 'Opposites', emoji: '🔄', bucket: 'little', min: 3, subject: 'Language', topic: 'Opposites', grad: '#fbc2eb,#a6c1ee' },
  { n: 73, slug: '73-sort-by-size', title: 'Small to Big', emoji: '🐘', bucket: 'little', min: 3, subject: 'Math', topic: 'Comparing', grad: '#fddb92,#d1fdff' },
  { n: 74, slug: '74-weather-wear', title: 'Weather Wear', emoji: '🧥', bucket: 'little', min: 3, subject: 'World', topic: 'Weather', grad: '#89f7fe,#66a6ff' },
  { n: 75, slug: '75-in-on-under', title: 'In, On, Under', emoji: '📦', bucket: 'little', min: 3, subject: 'Language', topic: 'Position words', grad: '#ffecd2,#fcb69f' },
  { n: 76, slug: '76-color-mixing', title: 'Color Mixing', emoji: '🌈', bucket: 'little', min: 3, subject: 'Art', topic: 'Colours', grad: '#ff9a9e,#fecfef' },
  { n: 105, slug: '105-count-out', title: 'Count It Out', emoji: '🧺', bucket: 'little', min: 3, subject: 'Math', topic: 'Counting', grad: '#f6d365,#fda085', added: '2026-11' },
  { n: 106, slug: '106-more-or-fewer', title: 'More or Fewer?', emoji: '🍪', bucket: 'little', min: 3, subject: 'Math', topic: 'Comparing', grad: '#ff9a9e,#fad0c4', added: '2026-11' },
  { n: 108, slug: '108-hindi-ginti', title: 'Hindi Ginti', emoji: '१', bucket: 'little', min: 3, subject: 'Hindi', topic: 'Numbers', grad: '#f7971e,#ffd200', added: '2026-11' },
  { n: 112, slug: '112-sink-or-float', title: 'Sink or Float?', emoji: '🛟', bucket: 'little', min: 3, subject: 'Science', topic: 'Materials', grad: '#2193b0,#6dd5ed', added: '2026-11' },
  { n: 113, slug: '113-how-do-you-feel', title: 'How Do You Feel?', emoji: '🤗', bucket: 'little', min: 3, subject: 'Feelings', topic: 'Emotions', grad: '#ffafbd,#ffc3a0', added: '2026-11' },
  { n: 114, slug: '114-copy-the-tune', title: 'Copy the Tune', emoji: '🎶', bucket: 'little', min: 3, subject: 'Music', topic: 'Listening', grad: '#8e2de2,#4a00e0', added: '2026-11' },
  { n: 115, slug: '115-shape-hunt', title: 'Shape Hunt', emoji: '🔵', bucket: 'little', min: 3, subject: 'Math', topic: 'Shapes', grad: '#36d1dc,#5b86e5', added: '2026-11' },
  { n: 120, slug: '120-ball-sort-junior', title: 'Sort the Balls', emoji: '🔴', bucket: 'little', min: 3, subject: 'Logic', topic: 'Sorting', grad: '#2b5876,#4e4376', added: '2026-11' },
  { n: 23, slug: '23-count-to-twenty', title: 'Count to 20', emoji: '🎈', bucket: 'little', min: 4, subject: 'Math', topic: 'Counting', grad: '#f857a6,#ff5858' },
  { n: 25, slug: '25-what-comes-next', title: "What's Next?", emoji: '🧩', bucket: 'little', min: 4, subject: 'Logic', topic: 'Patterns', grad: '#43cea2,#185a9d' },
  { n: 26, slug: '26-connect-dots', title: 'Connect the Dots', emoji: '✏️', bucket: 'little', min: 4, subject: 'Math', topic: 'Counting', grad: '#c471f5,#fa71cd' },
  { n: 27, slug: '27-days-of-week', title: 'Days of the Week', emoji: '📅', bucket: 'little', min: 4, subject: 'World', topic: 'Day & calendar', grad: '#FC466B,#3F5EFB' },
  { n: 28, slug: '28-months-of-year', title: 'Months of the Year', emoji: '🗓️', bucket: 'little', min: 4, subject: 'World', topic: 'Day & calendar', grad: '#c33764,#1d2671' },
  { n: 57, slug: '57-plant-parts', title: 'Parts of a Plant', emoji: '🌱', bucket: 'little', min: 4, subject: 'Science', topic: 'Plants', grad: '#a8e063,#56ab2f' },
  { n: 59, slug: '59-five-senses', title: 'Five Senses', emoji: '👀', bucket: 'little', min: 4, subject: 'Science', topic: 'My body', grad: '#b06ab3,#4568dc' },
  { n: 61, slug: '61-number-names', title: 'Number Names', emoji: '🔢', bucket: 'little', min: 4, subject: 'Math', topic: 'Numbers', grad: '#ff6a88,#ff99ac' },
  { n: 109, slug: '109-hindi-vyanjan', title: 'Hindi Vyanjan', emoji: 'क', bucket: 'little', min: 4, subject: 'Hindi', topic: 'Letters', grad: '#ee0979,#ff6a00', added: '2026-11' },
  { n: 110, slug: '110-first-sound', title: 'First Sound', emoji: '👂', bucket: 'little', min: 4, subject: 'Literacy', topic: 'Phonics', grad: '#00c6ff,#0072ff', added: '2026-11' },

  // --- Kindergarten (5–6) ---
  { n: 29, slug: '29-sound-it-out', title: 'Sound It Out', emoji: '🔡', bucket: 'kinder', min: 5, subject: 'Literacy', topic: 'Phonics', grad: '#f6d365,#fda085' },
  { n: 30, slug: '30-sight-words', title: 'Sight Word Pop', emoji: '💬', bucket: 'kinder', min: 5, subject: 'Literacy', topic: 'Sight words', grad: '#43c6ac,#191654' },
  { n: 31, slug: '31-add-to-ten', title: 'Add to 10', emoji: '➕', bucket: 'kinder', min: 5, subject: 'Math', topic: 'Add & subtract', grad: '#56ab2f,#43cea2' },
  { n: 32, slug: '32-greater-less', title: 'Hungry Gator', emoji: '🐊', bucket: 'kinder', min: 5, subject: 'Math', topic: 'Comparing', grad: '#2af598,#009efd' },
  { n: 33, slug: '33-shape-builder', title: 'Shape Builder', emoji: '🔺', bucket: 'kinder', min: 5, subject: 'Math', topic: 'Shapes', grad: '#7f7fd5,#4a00e0' },
  { n: 34, slug: '34-clock-oclock', title: "What's the Time?", emoji: '🕐', bucket: 'kinder', min: 5, subject: 'Math', topic: 'Time & money', grad: '#ec008c,#fc6767' },
  { n: 62, slug: '62-tens-ones', title: 'Tens & Ones', emoji: '🔟', bucket: 'kinder', min: 5, subject: 'Math', topic: 'Place value', grad: '#4facfe,#00f2fe' },
  { n: 63, slug: '63-before-after', title: 'Before & After', emoji: '↔️', bucket: 'kinder', min: 5, subject: 'Math', topic: 'Numbers', grad: '#f7971e,#ffd200' },
  { n: 64, slug: '64-our-helpers', title: 'Our Helpers', emoji: '👩‍⚕️', bucket: 'kinder', min: 5, subject: 'World', topic: 'People & places', grad: '#00cdac,#02aab0' },
  { n: 65, slug: '65-festivals', title: 'Festivals of India', emoji: '🪔', bucket: 'kinder', min: 5, subject: 'World', topic: 'India', grad: '#f857a6,#ff5858' },
  { n: 77, slug: '77-take-away', title: 'Take Away', emoji: '➖', bucket: 'kinder', min: 5, subject: 'Math', topic: 'Add & subtract', grad: '#ff758c,#ff7eb3' },
  { n: 78, slug: '78-rhyme-time', title: 'Rhyme Time', emoji: '🎤', bucket: 'kinder', min: 5, subject: 'Literacy', topic: 'Phonics', grad: '#a18cd1,#fbc2eb' },
  { n: 79, slug: '79-word-families', title: 'Word Builder', emoji: '🧩', bucket: 'kinder', min: 5, subject: 'Literacy', topic: 'Phonics', grad: '#84fab0,#8fd3f4' },
  { n: 80, slug: '80-pattern-puzzles', title: 'Pattern Puzzles', emoji: '🔁', bucket: 'kinder', min: 5, subject: 'Logic', topic: 'Patterns', grad: '#fa709a,#fee140' },
  { n: 81, slug: '81-heavy-light', title: 'Heavy or Light?', emoji: '⚖️', bucket: 'kinder', min: 5, subject: 'Math', topic: 'Measurement', grad: '#30cfd0,#5b6ee8' },
  { n: 82, slug: '82-healthy-plate', title: 'Healthy Plate', emoji: '🥗', bucket: 'kinder', min: 5, subject: 'Science', topic: 'Food & health', grad: '#96fbc4,#f9f586' },
  { n: 83, slug: '83-odd-one-out', title: 'Odd One Out', emoji: '🕵️', bucket: 'kinder', min: 5, subject: 'Logic', topic: 'Sorting', grad: '#667eea,#764ba2' },
  { n: 116, slug: '116-aa-match', title: 'Big & Small Letters', emoji: '🔠', bucket: 'kinder', min: 5, subject: 'Literacy', topic: 'Letters', grad: '#11998e,#38ef7d', added: '2026-11' },
  { n: 123, slug: '123-ring-tower', title: 'Ring Tower', emoji: '🗼', bucket: 'kinder', min: 5, subject: 'Logic', topic: 'Puzzles', grad: '#355c7d,#6c5b7b', added: '2026-11' },
  { n: 127, slug: '127-colour-flood', title: 'Colour Flood', emoji: '🌊', bucket: 'kinder', min: 5, subject: 'Logic', topic: 'Puzzles', grad: '#232526,#414345', added: '2026-11' },

  // --- Early Elementary (6–8) ---
  { n: 35, slug: '35-quick-math', title: 'Quick Math', emoji: '⚡', bucket: 'early', min: 6, subject: 'Math', topic: 'Add & subtract', grad: '#ff512f,#f09819' },
  { n: 37, slug: '37-build-sentence', title: 'Build a Sentence', emoji: '📝', bucket: 'early', min: 6, subject: 'Literacy', topic: 'Sentences', grad: '#11998e,#38ef7d' },
  { n: 38, slug: '38-spelling-bee', title: 'Spelling Bee', emoji: '🐝', bucket: 'early', min: 6, subject: 'Literacy', topic: 'Spelling', grad: '#f7b733,#fc4a1a' },
  { n: 66, slug: '66-3d-shapes', title: '3D Shapes', emoji: '🧊', bucket: 'early', min: 6, subject: 'Math', topic: 'Shapes', grad: '#c471f5,#6a8dff' },
  { n: 68, slug: '68-national-symbols', title: 'National Symbols', emoji: '🇮🇳', bucket: 'early', min: 6, subject: 'World', topic: 'India', grad: '#ff9933,#138808' },
  { n: 69, slug: '69-long-short', title: 'Long or Short?', emoji: '📏', bucket: 'early', min: 6, subject: 'Math', topic: 'Measurement', grad: '#ffd86f,#fc6262' },
  { n: 84, slug: '84-skip-counting', title: 'Skip Counting', emoji: '🦘', bucket: 'early', min: 6, subject: 'Math', topic: 'Numbers', grad: '#f83600,#f9d423' },
  { n: 85, slug: '85-odd-even', title: 'Odd or Even?', emoji: '🎲', bucket: 'early', min: 6, subject: 'Math', topic: 'Numbers', grad: '#12c2e9,#c471ed' },
  { n: 87, slug: '87-plural-play', title: 'One or Many?', emoji: '🐑', bucket: 'early', min: 6, subject: 'Language', topic: 'Grammar', grad: '#56ab2f,#a8e063' },
  { n: 88, slug: '88-life-cycles', title: 'Life Cycles', emoji: '🐛', bucket: 'early', min: 6, subject: 'Science', topic: 'Animals', grad: '#22c1c3,#fdbb2d' },
  { n: 117, slug: '117-magnet-magic', title: 'Magnet Magic', emoji: '🧲', bucket: 'early', min: 6, subject: 'Science', topic: 'Materials', grad: '#cb2d3e,#ef473a', added: '2026-11' },
  { n: 121, slug: '121-ball-sort', title: 'Ball Sort', emoji: '🧪', bucket: 'early', min: 6, subject: 'Logic', topic: 'Puzzles', grad: '#141e30,#35577d', added: '2026-11' },
  { n: 124, slug: '124-slide-puzzle', title: 'Slide Puzzle', emoji: '🔲', bucket: 'early', min: 6, subject: 'Logic', topic: 'Puzzles', grad: '#134e5e,#3a7d6b', added: '2026-11' },
  { n: 36, slug: '36-times-tables', title: 'Times Tables', emoji: '✖️', bucket: 'early', min: 7, subject: 'Math', topic: 'Multiply & divide', grad: '#654ea3,#eaafc8' },
  { n: 39, slug: '39-money-market', title: 'Money Market', emoji: '🪙', bucket: 'early', min: 7, subject: 'Math', topic: 'Time & money', grad: '#f12711,#f5af19' },
  { n: 40, slug: '40-fraction-pizza', title: 'Fraction Pizza', emoji: '🍕', bucket: 'early', min: 7, subject: 'Math', topic: 'Fractions & decimals', grad: '#ff9a44,#ff5e62' },
  { n: 67, slug: '67-naming-action', title: 'Naming & Action', emoji: '📝', bucket: 'early', min: 7, subject: 'Language', topic: 'Grammar', grad: '#43e97b,#38f9d7' },
  { n: 86, slug: '86-share-equally', title: 'Share Equally', emoji: '🍪', bucket: 'early', min: 7, subject: 'Math', topic: 'Multiply & divide', grad: '#f46b45,#eea849' },
  { n: 89, slug: '89-water-cycle', title: 'Water Cycle', emoji: '💧', bucket: 'early', min: 7, subject: 'Science', topic: 'Earth & space', grad: '#005bea,#00c6fb' },
  { n: 90, slug: '90-states-of-matter', title: 'Solid, Liquid, Gas', emoji: '🧊', bucket: 'early', min: 7, subject: 'Science', topic: 'Materials', grad: '#83a4d4,#b6fbff' },
  { n: 91, slug: '91-clock-master', title: 'Clock Master', emoji: '🕰️', bucket: 'early', min: 7, subject: 'Math', topic: 'Time & money', grad: '#355c7d,#6c5b7b' },
  { n: 126, slug: '126-fix-the-pipes', title: 'Fix the Pipes', emoji: '🚰', bucket: 'early', min: 7, subject: 'Logic', topic: 'Puzzles', grad: '#1f4037,#3c8d7d', added: '2026-11' },

  // --- Upper Elementary (8–10) ---
  { n: 42, slug: '42-mult-div-dash', title: 'Multiply Dash', emoji: '🏁', bucket: 'upper', min: 8, subject: 'Math', topic: 'Multiply & divide', grad: '#203a43,#2c5364' },
  { n: 43, slug: '43-fraction-match', title: 'Fraction Match', emoji: '🟰', bucket: 'upper', min: 8, subject: 'Math', topic: 'Fractions & decimals', grad: '#36d1dc,#5b86e5' },
  { n: 44, slug: '44-word-wizard', title: 'Word Wizard', emoji: '🧙', bucket: 'upper', min: 8, subject: 'Language', topic: 'Vocabulary', grad: '#8e2de2,#4a00e0' },
  { n: 45, slug: '45-grammar-fix', title: 'Grammar Fix', emoji: '✍️', bucket: 'upper', min: 8, subject: 'Language', topic: 'Grammar', grad: '#00b09b,#96c93d' },
  { n: 46, slug: '46-geo-quiz', title: 'Geo Quiz', emoji: '🌍', bucket: 'upper', min: 8, subject: 'World', topic: 'Geography', grad: '#1d976c,#2193b0' },
  { n: 47, slug: '47-mini-sudoku', title: 'Mini Sudoku', emoji: '🔢', bucket: 'upper', min: 8, subject: 'Logic', topic: 'Puzzles', grad: '#614385,#516395' },
  { n: 48, slug: '48-typing-dash', title: 'Typing Dash', emoji: '⌨️', bucket: 'upper', min: 8, subject: 'Literacy', topic: 'Typing', grad: '#141e30,#243b55' },
  { n: 70, slug: '70-data-handling', title: 'Data Handling', emoji: '📊', bucket: 'upper', min: 8, subject: 'Math', topic: 'Data & graphs', grad: '#2193b0,#6dd5ed' },
  { n: 71, slug: '71-symmetry', title: 'Symmetry', emoji: '🦋', bucket: 'upper', min: 8, subject: 'Math', topic: 'Shapes', grad: '#5f72bd,#9b23ea' },
  { n: 97, slug: '97-roman-numerals', title: 'Roman Numerals', emoji: '🏛️', bucket: 'upper', min: 8, subject: 'Math', topic: 'Numbers', grad: '#c79081,#dfa579' },
  { n: 98, slug: '98-rounding-rocket', title: 'Rounding Rocket', emoji: '🚀', bucket: 'upper', min: 8, subject: 'Math', topic: 'Numbers', grad: '#4568dc,#b06ab3' },
  { n: 100, slug: '100-robot-coder', title: 'Code the Robot', emoji: '🤖', bucket: 'upper', min: 8, subject: 'Logic', topic: 'Coding', grad: '#396afc,#2948ff' },
  { n: 101, slug: '101-human-body', title: 'Human Body', emoji: '🫀', bucket: 'upper', min: 8, subject: 'Science', topic: 'My body', grad: '#d31027,#ea384d' },
  { n: 102, slug: '102-solar-system', title: 'Solar System', emoji: '🪐', bucket: 'upper', min: 8, subject: 'Science', topic: 'Earth & space', grad: '#0f0c29,#302b63' },
  { n: 103, slug: '103-synonym-snap', title: 'Synonym Snap', emoji: '🤝', bucket: 'upper', min: 8, subject: 'Language', topic: 'Vocabulary', grad: '#1f4037,#99f2c8' },
  { n: 118, slug: '118-treasure-grid', title: 'Treasure Grid', emoji: '🗺️', bucket: 'upper', min: 8, subject: 'Math', topic: 'Data & graphs', grad: '#c79081,#dfa579', added: '2026-11' },
  { n: 119, slug: '119-food-chain', title: 'Food Chain', emoji: '🦅', bucket: 'upper', min: 8, subject: 'Science', topic: 'Animals', grad: '#134e5e,#71b280', added: '2026-11' },
  { n: 122, slug: '122-water-sort', title: 'Water Sort', emoji: '💧', bucket: 'upper', min: 8, subject: 'Logic', topic: 'Puzzles', grad: '#0f2027,#2c5364', added: '2026-11' },
  { n: 125, slug: '125-light-up', title: 'Light Up', emoji: '💡', bucket: 'upper', min: 8, subject: 'Logic', topic: 'Puzzles', grad: '#0f0c29,#302b63', added: '2026-11' },
  { n: 92, slug: '92-decimal-dash', title: 'Decimal Dash', emoji: '🎯', bucket: 'upper', min: 9, subject: 'Math', topic: 'Fractions & decimals', grad: '#e96443,#904e95' },
  { n: 93, slug: '93-percent-painter', title: 'Percent Painter', emoji: '💯', bucket: 'upper', min: 9, subject: 'Math', topic: 'Fractions & decimals', grad: '#ff416c,#ff4b2b' },
  { n: 94, slug: '94-area-perimeter', title: 'Area & Perimeter', emoji: '📐', bucket: 'upper', min: 9, subject: 'Math', topic: 'Measurement', grad: '#1a2980,#26d0ce' },
  { n: 95, slug: '95-angle-explorer', title: 'Angle Explorer', emoji: '📏', bucket: 'upper', min: 9, subject: 'Math', topic: 'Shapes', grad: '#6190e8,#a7bfe8' },
  { n: 96, slug: '96-prime-hunt', title: 'Prime Hunt', emoji: '💎', bucket: 'upper', min: 9, subject: 'Math', topic: 'Numbers', grad: '#16bffd,#cb3066' },
  { n: 99, slug: '99-bodmas-blitz', title: 'BODMAS Blitz', emoji: '🧮', bucket: 'upper', min: 9, subject: 'Math', topic: 'Mixed operations', grad: '#ed213a,#93291e' },
];
