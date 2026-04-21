// BOOK PHYSICS
setTimeout(function initBook() {
  if (window.innerWidth < 768) return;
  const { Engine, Runner, Bodies, Body, World, Events } = Matter;

  const BOOK_W = 90;
  const BOOK_D = 115;

  // ENGINE
  const engine = Engine.create();
  engine.gravity.y = 2;
  const world = engine.world;

  // FLOOR + WALLS
  let floor = Bodies.rectangle(
    window.innerWidth / 2, window.innerHeight + 25,
    window.innerWidth * 3, 50,
    { isStatic: true, label: 'floor', friction: 0.8 }
  );
  let wallL = Bodies.rectangle(
    -25, window.innerHeight / 2,
    50, window.innerHeight * 3,
    { isStatic: true, label: 'wall' }
  );
  let wallR = Bodies.rectangle(
    window.innerWidth + 25, window.innerHeight / 2,
    50, window.innerHeight * 3,
    { isStatic: true, label: 'wall' }
  );
  let ceiling = Bodies.rectangle(
    window.innerWidth / 2, -25,
    window.innerWidth * 3, 50,
    { isStatic: true, label: 'ceiling' }
  );
  World.add(world, [floor, wallL, wallR, ceiling]);

  // DOM COLLISION BODIES
  const COLLIDABLE_SELECTORS = [
    '#home-title',
    '#home-sub',
    '#home-nav',
    '.win.open',
  ];

  let domBodies = [];

  function buildDomBodies() {
    domBodies.forEach(b => World.remove(world, b));
    domBodies = [];
    COLLIDABLE_SELECTORS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;
        const b = Bodies.rectangle(
          r.left + r.width  / 2,
          r.top  + r.height / 2,
          r.width, r.height,
          { isStatic: true, label: 'dom', friction: 0.5, restitution: 0.1 }
        );
        World.add(world, b);
        domBodies.push(b);
      });
    });
  }

  setInterval(buildDomBodies, 300);
  buildDomBodies();

  // BOOK BODY
  const bookBody = Bodies.rectangle(
    window.innerWidth * 0.72,
    window.innerHeight * 0.25,
    BOOK_W, BOOK_D,
    { restitution: 0.12, friction: 0.65, density: 0.004, label: 'book' }
  );
  Body.setAngle(bookBody, Math.PI / 2);
  World.add(world, bookBody);

  // BOOK DOM
  const bookEl = document.createElement('div');
  bookEl.id = 'physics-book';
  bookEl.innerHTML = `
    <div class="book-inner">
      <div class="book-pages-side"></div>
      <div class="book-cover">
        <div class="book-cover-decoration">
          <div class="book-cover-border"></div>
          <div class="book-cover-title">Toss me!</div>
          <div class="book-cover-subtitle">go on, i won't break</div>
          <div class="book-cover-ornament">✦</div>
        </div>
      </div>
      <div class="book-spine-side">
        <span>Toss me</span>
      </div>
    </div>
  `;
  document.body.appendChild(bookEl);

  // Expose book transform for rain deflection + instant DOM rebuild
  window._bookPhysics = { body: bookBody, w: BOOK_W, h: BOOK_D, active: true, rebuild: buildDomBodies };

  // VELOCITY TRACKING
  const velHistory  = [];
  const VEL_SAMPLES = 6;
  let lastMouseX    = 0;
  let lastMouseY    = 0;
  let lastMouseTime = 0;

  function recordVelocity(x, y) {
    const now = performance.now();
    const dt  = Math.max(now - lastMouseTime, 1);
    velHistory.push({ vx: (x - lastMouseX) / dt, vy: (y - lastMouseY) / dt });
    if (velHistory.length > VEL_SAMPLES) velHistory.shift();
    lastMouseX    = x;
    lastMouseY    = y;
    lastMouseTime = now;
  }

  function getThrowVelocity() {
    if (!velHistory.length) return { vx: 0, vy: 0 };
    const avg = velHistory.reduce((a, v) => ({ vx: a.vx + v.vx, vy: a.vy + v.vy }), { vx: 0, vy: 0 });
    const scale = 16 * 0.45;
    return {
      vx: (avg.vx / velHistory.length) * scale,
      vy: (avg.vy / velHistory.length) * scale,
    };
  }

  // THUD SOUND
  let lastThudTime = 0;
  let audioUnlocked = false;
  document.addEventListener('click', () => { audioUnlocked = true; }, { once: true });

  function playThud(speed) {
    if (!audioUnlocked) return;
    if (typeof soundOn !== 'undefined' && !soundOn) return;
    const now = Date.now();
    if (now - lastThudTime < 180) return;
    if (speed < 1.5) return;
    lastThudTime = now;
    try {
      const sfx = new Audio('sound/thud.mp3');
      sfx.volume = Math.min(speed / 12, 1) * 0.5;
      sfx.play();
    } catch (e) {}
  }

  // COLLISION → THUD
  Events.on(engine, 'collisionStart', (e) => {
    e.pairs.forEach(pair => {
      const isBook = pair.bodyA.label === 'book' || pair.bodyB.label === 'book';
      if (!isBook) return;
      const vel = bookBody.velocity;
      playThud(Math.sqrt(vel.x * vel.x + vel.y * vel.y));
    });
  });

  // DRAG
  let dragging    = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function releaseBook() {
    if (!dragging) return;
    dragging = false;
    bookEl.classList.remove('held');
    document.body.style.cursor = '';
    const { vx, vy } = getThrowVelocity();
    Body.setStatic(bookBody, false);
    Body.setVelocity(bookBody, { x: vx, y: vy });
    velHistory.length = 0;
  }

  bookEl.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragging = true;
    bookEl.classList.add('held');
    Body.setStatic(bookBody, true);
    velHistory.length = 0;

    const rect    = bookEl.getBoundingClientRect();
    dragOffsetX   = e.clientX - (rect.left + BOOK_W / 2);
    dragOffsetY   = e.clientY - (rect.top  + BOOK_D / 2);
    lastMouseX    = e.clientX;
    lastMouseY    = e.clientY;
    lastMouseTime = performance.now();

    document.body.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    recordVelocity(e.clientX, e.clientY);
    const hw = BOOK_W / 2;
    const hh = BOOK_D / 2;
    const cx = Math.max(hw, Math.min(window.innerWidth  - hw, e.clientX - dragOffsetX));
    const cy = Math.max(hh, Math.min(window.innerHeight - hh, e.clientY - dragOffsetY));
    Body.setPosition(bookBody, { x: cx, y: cy });
  });

  document.addEventListener('mouseup',     releaseBook);
  document.addEventListener('contextmenu', releaseBook);
  window.addEventListener('mouseleave',    releaseBook);
  window.addEventListener('blur',          releaseBook);

  // SYNC DOM
  function syncBook() {
    const { x, y } = bookBody.position;
    const angle     = bookBody.angle;
    bookEl.style.left      = (x - BOOK_W / 2) + 'px';
    bookEl.style.top       = (y - BOOK_D / 2) + 'px';
    bookEl.style.width     = BOOK_W + 'px';
    bookEl.style.height    = BOOK_D + 'px';
    bookEl.style.transform = `rotate(${angle}rad)`;
  }

  // RUNNER + LOOP
  Runner.run(Runner.create(), engine);
  (function loop() { syncBook(); requestAnimationFrame(loop); })();

  // RESIZE
  window.addEventListener('resize', () => {
    World.remove(world, floor);
    World.remove(world, wallL);
    World.remove(world, wallR);
    World.remove(world, ceiling);
    floor   = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth * 3, 50, { isStatic: true, label: 'floor', friction: 0.8 });
    wallL   = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight * 3, { isStatic: true, label: 'wall' });
    wallR   = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight * 3, { isStatic: true, label: 'wall' });
    ceiling = Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth * 3, 50, { isStatic: true, label: 'ceiling' });
    World.add(world, [floor, wallL, wallR, ceiling]);
    buildDomBodies();
  });

}, 0);