(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (fine) document.documentElement.classList.add('has-cursor');

  // Loader: fills while the page prepares, then reveals the Enter button
  const fill = document.getElementById('fill'), pct = document.getElementById('pct');
  const loader = document.getElementById('loader'), btns = document.getElementById('enterBtns');
  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(100, p + (reduce ? 100 : 2 + Math.random() * 4));
    fill.style.width = p + '%'; pct.textContent = Math.floor(p);
    if (p >= 100) { clearInterval(tick); btns.classList.add('show'); }
  }, reduce ? 0 : 35);
  document.querySelectorAll('[data-enter]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); loader.classList.add('done'); document.body.classList.remove('locked');
  }));
  if (reduce) { loader.classList.add('done'); document.body.classList.remove('locked'); }

  // Custom cursor
  const cursor = document.getElementById('cursor');
  if (fine) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
    const loop = () => {
      cx += (x - cx) * .2; cy += (y - cy) * .2;
      cursor.style.transform = `translate(${cx}px,${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a, button, .exp-row, .svc-row, .tile, .case').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('big'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
    });
  } else cursor.style.display = 'none';

  // Hero name letters: stagger the rise
  document.querySelectorAll('.hero-name .ch').forEach((c, i) => c.style.animationDelay = (0.5 + i * 0.07) + 's');

  // 3D tilt on the portrait disc and tech tiles
  function tilt(el, s) {
    if (!fine || reduce) return;
    el.addEventListener('mousemove', e => {
      const b = el.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      el.style.transform = `rotateY(${x * s}deg) rotateX(${-y * s}deg)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  }
  tilt(document.getElementById('disc'), 18);
  document.querySelectorAll('.tile').forEach(t => tilt(t, 12));

  // Floating preview for experience and skills rows
  const preview = document.createElement('div');
  preview.className = 'exp-preview';
  preview.textContent = 'Infosys';
  document.body.appendChild(preview);
  document.querySelectorAll('.exp-row').forEach(r => {
    r.addEventListener('mouseenter', () => { preview.textContent = r.dataset.prev || ''; preview.classList.add('on'); });
    r.addEventListener('mouseleave', () => preview.classList.remove('on'));
    r.addEventListener('mousemove', e => { preview.style.left = e.clientX + 'px'; preview.style.top = e.clientY + 'px'; });
  });

  // Reveal on scroll
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    }
  }), { threshold: .2 });
  document.querySelectorAll('.rv, .stat').forEach(el => io.observe(el));

  // Count-up numbers
  function countUp(el) {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
    if (reduce) { el.textContent = end.toFixed(dec); return; }
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (end * e).toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  document.querySelectorAll('.stat b').forEach(b => {
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { countUp(b); o.disconnect(); } }, { threshold: .5 }).observe(b);
  });

  // Manifesto: words light up as you scroll past them
  const man = document.getElementById('manifesto');
  if (man) {
    const words = man.textContent.trim().split(/\s+/);
    man.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    const spans = [...man.querySelectorAll('.w')];
    const onScroll = () => {
      const r = man.getBoundingClientRect();
      const prog = Math.min(1, Math.max(0, (innerHeight * .8 - r.top) / (r.height + innerHeight * .4)));
      const n = Math.floor(prog * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < n || reduce));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Pointer preview for the skills list is handled by the tiles; nav
  // Mumbai clock
  const clock = document.getElementById('clock');
  const tick2 = () => clock.textContent = new Intl.DateTimeFormat('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true, timeZone:'Asia/Kolkata' }).format(new Date());
  tick2(); setInterval(tick2, 30000);


  // Skill bars fill when they scroll into view
  const lvIo = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.querySelectorAll('i[data-w]').forEach(i => i.style.width = i.dataset.w + '%'); lvIo.unobserve(en.target); }
  }), { threshold: .3 });
  document.querySelectorAll('.levels').forEach(el => lvIo.observe(el));

  // Copy email
  const copy = document.getElementById('copyMail');
  if (copy) copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(copy.dataset.email); copy.textContent = 'Copied'; }
    catch { copy.textContent = copy.dataset.email; }
    setTimeout(() => copy.textContent = 'Copy email', 1800);
  });
})();
