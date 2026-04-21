// PROJECT DATA
const PROJECTS = [
  {
    emoji: '',
    thumbs: ['images/STARSdashboard.png', 'images/STARSsearch.png', 'images/STARSlogin.png', 'images/STARSedit.png'],
    tags: ['React Native', 'Supabase', 'Expo'],
    name: 'UWA STARS App',
    year: '2025',
    shortDesc: 'React Native app helping nursing students track internship prerequisites and deadlines.',
    fullDesc: "Led a team of five to build a cross-platform mobile app for UWA's nursing department. Served as project lead with full client communication responsibilities. Stack: React Native, Expo, Supabase. Tracks vaccination requirements, placement deadlines, and clinical hours.",
    github: 'https://github.com/ZenFlamex/STARS-App',
  },
  {
    emoji: '',
    thumbs: ['images/BookCornerHome.png', 'images/BookCornerHome2.png', 'images/BookCornerAdd.png', 'images/BookCornerLogin.png', 'images/BookCornerAccount.png', 'images/BookCornerBook.png', 'images/BookCornerBook2.png'],
    tags: ['Python', 'Flask', 'JavaScript', 'SQL', 'HTML', 'CSS'],
    name: 'Book Corner',
    year: '2025',
    shortDesc: 'Full-stack book tracking web app with reading analytics, social features, and privacy controls.',
    fullDesc: 'Built a comprehensive book tracking platform for managing reading progress, ratings, and reading goals. Users can add books via OpenLibrary API or manually, track progress through reading sessions, and view analytics such as reading speed and genre distribution. The system includes social features like friend connections, selective book sharing, and privacy controls for individual books and profiles. Developed using Flask with a modular application structure, SQLite database, and frontend built with HTML, CSS, and JavaScript. Includes authentication, dashboards, and data visualisation features for reading insights.',
    github: 'https://github.com/ZenFlamex/CITS3403-Group-36',
  },
  {
    emoji: '',
    thumbs: ['images/NewSite.png', 'images/OldSite.png'],
    tags: ['HTML/CSS', 'JavaScript', 'UI/UX'],
    name: 'Portfolio Website',
    year: '2025',
    shortDesc: 'This site — built from scratch with vanilla HTML, CSS, and JavaScript.',
    fullDesc: "My personal portfolio website, redesigned from scratch. My very first site was built two years ago during CFC's beginner project, when I was just starting out in web development and I think it's time for a refresh.",
    github: 'https://github.com/ZenFlamex/ZenFlamex.github.io',
    live: 'v1.html',
    liveLabel: 'Old Site',
  },
  {
    emoji: '',
    thumbs: ['images/battleship.png'],
    tags: ['C', 'Networking', 'Sockets'],
    name: 'Multiplayer Battleship',
    year: '2024',
    shortDesc: 'Multiplayer Battleship over network sockets with client-server architecture.',
    fullDesc: 'Implemented in C using network sockets and client-server communication. Players connect over TCP, coordinate ship placement and attacks in real time. Built as part of CITS3002 Computer Networks at UWA.',
    github: 'https://github.com/ZenFlamex/CITS3002-Networks-Project',
  },
  {
    emoji: '',
    thumbs: ['images/2.png'],
    tags: ['Python', 'Pygame'],
    name: 'Python Snake',
    year: '2024',
    shortDesc: 'Classic Snake game built in Python with Pygame.',
    fullDesc: 'A simple lil happy snake game, small self experiment. Features score tracking, increasing speed, and collision detection.',
    github: 'https://github.com/ZenFlamex/Py-Snake',
  },
];

// RAIN
(function initRain() {
  const canvas = document.getElementById('rain-canvas');
  const ctx = canvas.getContext('2d');
  let drops = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = [];
    const count = Math.floor(canvas.width / 7);
    for (let i = 0; i < count; i++) {
      drops.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        len:     Math.random() * 24 + 12,
        speed:   Math.random() * 2.4 + 1.4,
        opacity: Math.random() * 0.5 + 0.18,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(d => {
      ctx.strokeStyle = `rgba(122,92,71,${d.opacity})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 1, d.y + d.len);
      ctx.stroke();

      d.y += d.speed;
      if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();

// SOUND
let soundOn = true;

// RAIN BG
const rainBg = new Audio('sound/rain-bg.mp3');
rainBg.loop = true;
rainBg.volume = 0.15;

document.addEventListener('click', function startRain() {
  if (soundOn) rainBg.play().catch(() => {});
  document.removeEventListener('click', startRain);
}, { once: true });

document.getElementById('sound-toggle').classList.add('active');
document.getElementById('sound-toggle').addEventListener('click', function () {
  soundOn = !soundOn;
  this.classList.toggle('active', soundOn);
  if (soundOn) {
    rainBg.play().catch(() => {});
  } else {
    rainBg.pause();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    rainBg.pause();
  } else if (soundOn) {
    rainBg.play().catch(() => {});
  }
});

function playClick() {
  if (!soundOn) return;
  try {
    const sfx = new Audio('sound/click.mp3');
    sfx.volume = 0.25;
    sfx.play();
  } catch (e) {}
}

// MUSIC EMBEDS
let rainPausedBySpotify = false;
let activeTrackId = null;
let IFrameAPIRef = null;
const spotifyControllers = new Map(); // trackId -> EmbedController
const pendingTargets = [];            // targets queued before API ready

window.onSpotifyIframeApiReady = (IFrameAPI) => {
  IFrameAPIRef = IFrameAPI;
  pendingTargets.forEach(initSpotifyEmbed);
  pendingTargets.length = 0;
};

(function loadSpotifyAPI() {
  const s = document.createElement('script');
  s.src = 'https://open.spotify.com/embed/iframe-api/v1';
  s.async = true;
  document.head.appendChild(s);
})();

function initSpotifyEmbed(target) {
  const trackId = target.dataset.trackId;
  if (spotifyControllers.has(trackId)) return;

  IFrameAPIRef.createController(target, {
    uri: 'spotify:track:' + trackId,
    height: '80',
  }, (controller) => {
    spotifyControllers.set(trackId, controller);
    controller.addListener('playback_update', ({ data }) => {
      // Only care about the currently active embed
      if (trackId !== activeTrackId) return;
      if (!data.isPaused) {
        // Song started playing — pause rain
        if (soundOn && !rainBg.paused) {
          rainBg.pause();
          rainPausedBySpotify = true;
        }
      } else {
        // Song paused or ended — resume rain
        if (rainPausedBySpotify && soundOn) {
          rainBg.play().catch(() => {});
          rainPausedBySpotify = false;
        }
      }
    });
  });
}

function toggleMusicEmbed(btn) {
  const item = btn.closest('.music-item');
  const embed = item.querySelector('.music-embed');
  const target = embed.querySelector('.spotify-target');
  const isOpen = embed.classList.contains('open');

  // Close all embeds and deactivate buttons
  document.querySelectorAll('.music-embed.open').forEach(e => e.classList.remove('open'));
  document.querySelectorAll('.music-play-btn.active').forEach(b => b.classList.remove('active'));

  if (!isOpen) {
    embed.classList.add('open');
    btn.classList.add('active');
    activeTrackId = target.dataset.trackId;
    if (IFrameAPIRef) {
      initSpotifyEmbed(target);
    } else {
      pendingTargets.push(target);
    }
  } else {
    // Collapsing — resume rain if this embed had paused it
    activeTrackId = null;
    if (rainPausedBySpotify && soundOn) {
      rainBg.play().catch(() => {});
      rainPausedBySpotify = false;
    }
  }
}

// WINDOW MANAGER
let zTop = 200;

// Default sizes per window id
const WIN_SIZES = {
  about:    { w: 680, h: 560, fixedH: true },
  projects: { w: 720, h: 580, fixedH: true, autoH: true },
  skills:   { w: 620, h: 540, autoH: true },
  links:    { w: 520, h: 460, autoH: true },
  contact:  { w: 540, h: 480, autoH: true },
  music:    { w: 440, h: 560, fixedH: true },
};

// Staggered offset so windows don't all stack perfectly
const OFFSETS = [
  [0, 0], [30, 30], [-30, 20], [20, -30], [-20, 40], [40, -20],
];
let offsetIdx = 0;

function getOffset() {
  const o = OFFSETS[offsetIdx % OFFSETS.length];
  offsetIdx++;
  return o;
}

function isMobile() {
  return window.innerWidth <= 768;
}

function buildWindow(id, triggerEl) {
  const el = document.getElementById('win-' + id);
  const title = el.getAttribute('data-title');

  // Tab bar
  const tabbar = document.createElement('div');
  tabbar.className = 'win-tabbar';

  const tabTitle = document.createElement('span');
  tabTitle.className = 'win-tab-title';
  tabTitle.textContent = title;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'win-close-btn';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', e => { e.stopPropagation(); closeWindow(id); });

  // Mobile: down-chevron close button
  const mobileCloseBtn = document.createElement('button');
  mobileCloseBtn.className = 'win-mobile-close';
  mobileCloseBtn.setAttribute('aria-label', 'Close');
  mobileCloseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/><polyline points="6 3 12 9 18 3"/></svg>`;
  mobileCloseBtn.addEventListener('click', e => { e.stopPropagation(); closeWindow(id); });

  tabbar.append(tabTitle, closeBtn, mobileCloseBtn);
  el.prepend(tabbar);

  el.addEventListener('mousedown', () => focusWindow(el));
  el.dataset.built = '1';

  if (isMobile()) return;

  // Desktop only — drag + position
  makeDraggable(el, tabbar);

  const sz = WIN_SIZES[id] || { w: 560, h: 460 };
  const [ox, oy] = getOffset();
  const maxH = Math.floor(window.innerHeight * 0.88);
  const h = Math.min(sz.h, maxH);

  const left = Math.max(8, Math.min((window.innerWidth  - sz.w) / 2 + ox, window.innerWidth  - sz.w - 8));
  const top = Math.max(8, Math.min((window.innerHeight - h) / 2 + oy, window.innerHeight - h - 8));
  el.style.left = left + 'px';
  el.style.top = top  + 'px';
  el.style.width = sz.w + 'px';
  if (sz.fixedH) el.style.height = h + 'px';

  if (triggerEl) {
    const tr = triggerEl.getBoundingClientRect();
    const originX = tr.left + tr.width  / 2 - left;
    const originY = tr.top  + tr.height / 2 - top;
    el.style.transformOrigin = `${originX}px ${originY}px`;
  } else {
    el.style.transformOrigin = 'center center';
  }
}


function openWindow(id, triggerEl) {
  const el = document.getElementById('win-' + id);
  const sz = WIN_SIZES[id] || {};

  if (!el.dataset.built) buildWindow(id, triggerEl);

  if (el.classList.contains('open')) {
    focusWindow(el);
    return;
  }

  if (isMobile()) {
    // Close any other open sheet first
    document.querySelectorAll('.win.mobile-sheet.open').forEach(w => {
      w.classList.remove('open', 'closing', 'mobile-sheet', 'mobile-auto-h');
    });
    el.classList.remove('closing');
    el.style.animation = '';
    el.style.transform = '';
    el.style.transition = '';
    el.classList.add('mobile-sheet', 'open');
    if (sz.autoH) el.classList.add('mobile-auto-h');
    document.getElementById('mobile-backdrop').classList.add('open');
    focusWindow(el);
    playClick();
    return;
  }

  // Desktop — reset transform-origin toward trigger
  if (triggerEl && el.dataset.built) {
    const tr = triggerEl.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const originX = tr.left + tr.width  / 2 - rect.left;
    const originY = tr.top  + tr.height / 2 - rect.top;
    el.style.transformOrigin = `${originX}px ${originY}px`;
  }

  el.classList.remove('closing');
  el.classList.add('open');
  focusWindow(el);
  playClick();
  if (window._bookPhysics) {
    window._bookPhysics.rebuild();
    setTimeout(window._bookPhysics.rebuild, 0);
  }
}

function closeWindow(id) {
  const el = document.getElementById('win-' + id);
  // Clear any inline drag styles so CSS closing animation takes over cleanly
  el.style.transform = '';
  el.style.transition = '';
  el.style.animation = '';
  el.classList.add('closing');
  el.addEventListener('animationend', function handler() {
    el.classList.remove('open', 'closing', 'mobile-sheet', 'mobile-auto-h');
    el.style.transform = '';
    el.removeEventListener('animationend', handler);
    if (!document.querySelector('.win.mobile-sheet.open')) {
      document.getElementById('mobile-backdrop').classList.remove('open');
    }
  });
  playClick();
}

function focusWindow(el) {
  document.querySelectorAll('.win').forEach(w => w.classList.remove('focused'));
  el.classList.add('focused');
  el.style.zIndex = ++zTop;
}

// DRAG
function makeDraggable(el, handle) {
  let startX, startY, startL, startT;

  handle.addEventListener('mousedown', e => {
    if (e.target === handle.querySelector('.win-close-btn')) return;
    e.preventDefault();
    focusWindow(el);
    const rect = el.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    startL = rect.left;  startT = rect.top;

    function onMove(e) {
      el.style.left = Math.max(0, startL + e.clientX - startX) + 'px';
      el.style.top = Math.max(0, startT + e.clientY - startY) + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  });

  // Touch
  handle.addEventListener('touchstart', e => {
    if (e.target === handle.querySelector('.win-close-btn')) return;
    const t = e.touches[0];
    const rect = el.getBoundingClientRect();
    startX = t.clientX; startY = t.clientY;
    startL = rect.left;  startT = rect.top;

    function onMove(e) {
      const t = e.touches[0];
      el.style.left = Math.max(0, startL + t.clientX - startX) + 'px';
      el.style.top = Math.max(0, startT + t.clientY - startY) + 'px';
    }
    function onEnd() {
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onEnd);
    }
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend',  onEnd);
  }, { passive: true });
}

// MOBILE NOTICE
(function () {
  const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);;
  if (isMobile && !sessionStorage.getItem('mobile-notice-dismissed')) {
    const notice = document.getElementById('mobile-notice');
    notice.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => notice.classList.add('visible')));
    document.getElementById('mobile-notice-ok').addEventListener('click', () => {
      notice.classList.remove('visible');
      notice.addEventListener('transitionend', () => notice.style.display = 'none', { once: true });
      sessionStorage.setItem('mobile-notice-dismissed', '1');
    });
  }
})();

// HOME NAV
document.querySelectorAll('.nav-icon-btn').forEach(btn => {
  btn.addEventListener('click', () => openWindow(btn.dataset.window, btn));
});

document.getElementById('music-dock-btn').addEventListener('click', function () {
  openWindow('music', this);
});

document.querySelectorAll('#social-dock .dock-icon').forEach(a => {
  a.addEventListener('click', () => playClick());
});

// MOBILE BACKDROP DISMISS
document.getElementById('mobile-backdrop').addEventListener('click', () => {
  const open = document.querySelector('.win.mobile-sheet.open');
  if (open) closeWindow(open.id.replace('win-', ''));
});

// PROJECTS GRID
(function buildProjects() {
  const grid = document.getElementById('projects-grid');
  PROJECTS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'proj-card';
    const cardThumb = p.thumbs?.[0];
    card.innerHTML = `
      <div class="proj-thumb">
        ${cardThumb ? `<img src="${cardThumb}" alt="${p.name}" />` : p.emoji}
      </div>
      <div class="proj-body">
        <div class="proj-tags">${p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}</div>
        <div class="proj-name">${p.name}</div>
        <div class="proj-desc">${p.shortDesc}</div>
      </div>
      <div class="proj-footer">
        <span>${p.year}</span>
      </div>
    `;
    card.addEventListener('click', () => openLightbox(i));
    grid.appendChild(card);
  });
})();

// LIGHTBOX
const overlay = document.getElementById('lightbox-overlay');

// GALLERY DRAG-TO-SCROLL
let _galleryWasDragged = false;

(function () {
  const gallery = document.getElementById('lb-gallery');
  let active = false, startX = 0, scrollStart = 0;

  gallery.addEventListener('mousedown', e => {
    active = true;
    _galleryWasDragged = false;
    startX = e.clientX;
    scrollStart = gallery.scrollLeft;
    gallery.classList.add('dragging');
  });

  document.addEventListener('mousemove', e => {
    if (!active) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) _galleryWasDragged = true;
    gallery.scrollLeft = scrollStart - dx;
  });

  document.addEventListener('mouseup', () => {
    active = false;
    gallery.classList.remove('dragging');
    setTimeout(() => { _galleryWasDragged = false; }, 0);
  });
})();

function openLightbox(i) {
  const p = PROJECTS[i];

  // build gallery
  const gallery = document.getElementById('lb-gallery');
  gallery.innerHTML = '';
  gallery.scrollLeft = 0;

  if (p.thumbs && p.thumbs.length > 0) {
    p.thumbs.forEach((src, j) => {
      const wrap = document.createElement('div');
      wrap.className = 'lb-img-wrap';
      const img = document.createElement('img');
      img.src = src;
      img.alt = p.name;
      wrap.appendChild(img);
      wrap.addEventListener('click', () => {
        if (!_galleryWasDragged) openImageViewer(src, p.name, p.thumbs, j);
      });
      gallery.appendChild(wrap);
    });
  } else {
    gallery.innerHTML = `<div class="lb-no-img">${p.name}</div>`;
  }

  document.getElementById('lb-year').textContent = p.year || '';

  document.getElementById('lb-tags').innerHTML = p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');
  document.getElementById('lb-title').textContent = p.name;
  document.getElementById('lb-desc').textContent = p.fullDesc;

  let actions = '';
  if (p.github) actions += `<a class="btn-primary" href="${p.github}" target="_blank">GitHub</a>`;
  if (p.live)   actions += `<a class="btn-primary" href="${p.live}"   target="_blank">${p.liveLabel || 'Live Site'}</a>`;
  actions += `<button class="btn-secondary" id="lb-close-inner">Close</button>`;
  document.getElementById('lb-actions').innerHTML = actions;
  document.getElementById('lb-close-inner').addEventListener('click', closeLightbox);

  overlay.classList.add('open');
  playClick();
}

// IMAGE VIEWER
let _viewerImages = [];
let _viewerIdx = 0;

function openImageViewer(src, alt, images, idx) {
  _viewerImages = images && images.length ? images : [src];
  _viewerIdx = idx !== undefined ? idx : Math.max(0, _viewerImages.indexOf(src));

  const img = document.getElementById('img-viewer-img');
  img.src = _viewerImages[_viewerIdx];
  img.alt = alt;

  const multi = _viewerImages.length > 1;
  document.getElementById('img-viewer-prev').classList.toggle('hidden', !multi);
  document.getElementById('img-viewer-next').classList.toggle('hidden', !multi);

  document.getElementById('img-viewer').classList.add('open');
}

function _viewerNav(dir) {
  const img = document.getElementById('img-viewer-img');

  img.classList.add('fade-out');

  setTimeout(() => {
    _viewerIdx = (_viewerIdx + dir + _viewerImages.length) % _viewerImages.length;
    img.src = _viewerImages[_viewerIdx];

    img.classList.remove('fade-out');
    img.classList.add('fade-in');

    setTimeout(() => {
      img.classList.remove('fade-in');
    }, 150);
  }, 150);
}

function closeImageViewer() {
  document.getElementById('img-viewer').classList.remove('open');
}

document.getElementById('img-viewer').addEventListener('click', e => {
  if (e.target === document.getElementById('img-viewer')) closeImageViewer();
});

document.getElementById('img-viewer-prev').addEventListener('click', e => { e.stopPropagation(); _viewerNav(-1); });
document.getElementById('img-viewer-next').addEventListener('click', e => { e.stopPropagation(); _viewerNav(1); });

// Mobile swipe in image viewer
(function () {
  const viewer = document.getElementById('img-viewer');
  let swipeStartX = 0;
  viewer.addEventListener('touchstart', e => {
    swipeStartX = e.touches[0].clientX;
  }, { passive: true });
  viewer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - swipeStartX;
    if (Math.abs(dx) < 50) return; // ignore taps
    _viewerNav(dx < 0 ? 1 : -1);
  }, { passive: true });
})();

function closeLightbox() {
  overlay.classList.remove('open');
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (document.getElementById('img-viewer').classList.contains('open')) {
    if      (e.key === 'Escape')      closeImageViewer();
    else if (e.key === 'ArrowLeft')   _viewerNav(-1);
    else if (e.key === 'ArrowRight')  _viewerNav(1);
  } else if (e.key === 'Escape') {
    closeLightbox();
  }
});

// COPY EMAIL
function copyEmail(btn) {
  navigator.clipboard.writeText('altonwong888@gmail.com').then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied! ✓';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

window.copyEmail = copyEmail;