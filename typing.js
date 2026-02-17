const gameEl = document.getElementById('game');
const wordsEl = document.getElementById('words');
const infoEl = document.getElementById('info');
const cursor = document.getElementById('cursor');
const newGameBtn = document.getElementById('newGameBtn');

gameEl.addEventListener('keyup', ev => {
  const key = ev.key;
  const cw = document.querySelector('.word.current');
  const cl = document.querySelector('.letter.current');
  const expected = cl?.innerHTML || ' ';
  if (gameEl.classList.contains('over')) return;

  // Start timer
  if (!window.timer && key.length === 1 && key !== ' ') {
    window.timer = setInterval(() => {
      if (!window.gameStart) window.gameStart = Date.now();
      const sLeft = Math.max(Math.round(gameTime/1000 - (Date.now() - window.gameStart)/1000), 0);
      infoEl.innerHTML = sLeft + '';
      if (sLeft <= 0) gameOver();
    }, 1000);
  }

  // Letter typing
  if (key.length === 1 && key !== ' ') {
    if (cl) {
      addClass(cl, key === expected ? 'correct' : 'incorrect');
      removeClass(cl, 'current');
      if (cl.nextSibling) addClass(cl.nextSibling, 'current');
    } else {
      const extra = document.createElement('span');
      extra.innerHTML = key;
      extra.className = 'letter incorrect extra';
      cw.appendChild(extra);
    }
  }

  // Space
  if (key === ' ') {
    [...cw.querySelectorAll('.letter:not(.correct)')].forEach(l => addClass(l,'incorrect'));
    removeClass(cw,'current');
    addClass(cw.nextSibling,'current');
    addClass(cw.nextSibling.firstChild,'current');
    if (cl) removeClass(cl,'current');
  }

  // Backspace
  if (key === 'Backspace') {
    if (cl && cl === cw.firstChild) {
      removeClass(cw,'current'); addClass(cw.previousSibling,'current');
      removeClass(cl,'current'); addClass(cw.previousSibling.lastChild,'current');
      removeClass(cw.previousSibling.lastChild,'incorrect'); removeClass(cw.previousSibling.lastChild,'correct');
    } else if (cl) {
      removeClass(cl,'current'); addClass(cl.previousSibling,'current');
      removeClass(cl.previousSibling,'correct'); removeClass(cl.previousSibling,'incorrect');
    } else {
      addClass(cw.lastChild,'current');
      removeClass(cw.lastChild,'correct'); removeClass(cw.lastChild,'incorrect');
    }
  }

  // Scroll words
  if (cw.getBoundingClientRect().top > 250) {
    wordsEl.style.marginTop = (parseInt(wordsEl.style.marginTop||'0') - 35) + 'px';
  }

  // Move cursor
  const nl = document.querySelector('.letter.current') || document.querySelector('.word.current');
  cursor.style.top = nl.getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = nl.getBoundingClientRect()[nl.classList.contains('letter') ? 'left':'right'] + 'px';
});

// New game button
newGameBtn.addEventListener('click', () => { gameOver(); newGame(); });
