// assets/js/carousel.js
// Build the projects carousel from lib/projects.json (flex layout) and wire controls
(async function initCarousel () {
  const viewport = document.querySelector('.caro-viewport');
  const track    = document.getElementById('caro-track');
  if (!viewport || !track) return;

  // ---- Fetch data -----------------------------------------------------------
  let projects = [];
  try {
    const res = await fetch('lib/projects.json', { cache: 'no-store' });
    projects = await res.json();
  } catch (e) {
    console.warn('Could not load lib/projects.json', e);
  }
  if (!Array.isArray(projects) || projects.length === 0) return;

  // ---- Render cards (uses your .card styles) --------------------------------
  track.innerHTML = '';
  projects.slice(0, 50).forEach(p => {
    const art = document.createElement('article');
    art.className = 'card project-card caro-card';

    const imgSrc = p.image || 'images/projects.jpg';
    art.innerHTML = `
      <img class="thumb" src="${imgSrc}" alt="${p.title || 'Project'}" loading="lazy">
      <div class="card-body">
        <div class="project-meta">
          <h3>${p.title || 'Project'}</h3>
          ${p.year ? `<span class="year badge">${p.year}</span>` : ''}
        </div>
        <p>${p.description || ''}</p>
        <div class="project-actions">
          ${p.link ? `<a class="btn ghost" href="${p.link}" target="_blank" rel="noopener">View project</a>` : ''}
        </div>
      </div>
    `;

    // fallback if image fails
    const img = art.querySelector('img.thumb');
    img.addEventListener('error', () => { img.src = 'images/projects.jpg'; });

    track.appendChild(art);
  });

  // ---- Equal-height cards (after images load) -------------------------------
  function equalizeProjectHeights () {
    const cards = Array.from(track.querySelectorAll('.caro-card'));
    if (!cards.length) return;
    // reset then measure tallest
    cards.forEach(c => (c.style.height = 'auto'));
    const max = Math.max(...cards.map(c => c.getBoundingClientRect().height));
    cards.forEach(c => (c.style.height = max + 'px'));
  }

  async function whenImagesSettled (scope) {
    const imgs = Array.from((scope || document).querySelectorAll('.caro-card img'));
    if (!imgs.length) return;
    await Promise.all(
      imgs.map(img =>
        img.complete
          ? Promise.resolve()
          : new Promise(res => {
              img.addEventListener('load', res, { once: true });
              img.addEventListener('error', res, { once: true });
            })
      )
    );
  }

  const debounce = (fn, ms = 150) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  };

  await whenImagesSettled(track);
  equalizeProjectHeights();
  window.addEventListener('resize', debounce(equalizeProjectHeights, 150));
  // re-equalize if any image src changes later
  new MutationObserver(debounce(equalizeProjectHeights, 50))
    .observe(track, { subtree: true, attributes: true, attributeFilter: ['src'] });

  // ---- Arrows: move exactly one card ---------------------------------------
  const prev = document.querySelector('.caro-btn.prev');
  const next = document.querySelector('.caro-btn.next');

  const oneStep = () => {
    const first = track.querySelector('.caro-card');
    if (!first) return viewport.clientWidth * 0.9;
    const rect = first.getBoundingClientRect();
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return rect.width + gap;
  };

  prev?.addEventListener('click', () =>
    viewport.scrollBy({ left: -oneStep(), behavior: 'smooth' })
  );
  next?.addEventListener('click', () =>
    viewport.scrollBy({ left:  oneStep(), behavior: 'smooth' })
  );

  // ---- Drag to scroll (mouse/touch) ----------------------------------------
  let isDown = false, startX = 0, startScroll = 0;
  viewport.addEventListener('pointerdown', (e) => {
    isDown = true;
    startX = e.clientX;
    startScroll = viewport.scrollLeft;
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    viewport.scrollLeft = startScroll - dx;
  });
  const end = () => { isDown = false; viewport.classList.remove('dragging'); };
  viewport.addEventListener('pointerup', end);
  viewport.addEventListener('pointerleave', end);
})();

// // Build the projects carousel from lib/projects.json and wire controls
// (async function initCarousel(){
//   const viewport = document.querySelector('.caro-viewport');
//   const track = document.getElementById('caro-track');
//   if (!viewport || !track) return;

//   // Make sure columns are 1-up on small screens and 2-up otherwise
//   const setCols = () => {
//     const twoUp = window.matchMedia('(min-width: 700px)').matches;
//     track.style.gridAutoColumns = twoUp ? 'calc(50% - 0.75rem)' : '92%';
//   };
//   setCols();
//   window.addEventListener('resize', setCols);

//   let projects = [];
//   try {
//     const res = await fetch('lib/projects.json', { cache: 'no-store' });
//     projects = await res.json();
//   } catch (e) {
//     console.warn('Could not load projects.json', e);
//     projects = [];
//   }

//   if (!Array.isArray(projects) || projects.length === 0) return;

//   // Render compact cards (reuse existing card styles)
//   track.innerHTML = '';
//   projects.slice(0, 20).forEach((p) => {
//     const art = document.createElement('article');
//     art.className = 'card project-card caro-card';

//     const imgSrc = p.image || 'images/projects.jpg';

//     art.innerHTML = `
//       <img class="thumb" src="${imgSrc}" alt="${p.title || 'Project'}" loading="lazy">
//       <div class="card-body">
//         <div class="project-meta">
//           <h3>${p.title || 'Project'}</h3>
//           ${p.year ? `<span class="year badge">${p.year}</span>` : ''}
//         </div>
//         <p>${p.description || ''}</p>
//         <div class="project-actions">
//           ${p.link ? `<a class="btn ghost" href="${p.link}" target="_blank" rel="noopener">View project</a>` : ''}
//         </div>
//       </div>`;

//     // image fallback if a URL 404s
//     const img = art.querySelector('img.thumb');
//     img.addEventListener('error', () => { img.src = 'images/projects.jpg'; });

//     track.appendChild(art);
//   });

//   // ... keep the rest of your file as-is

//     const prev = document.querySelector('.caro-btn.prev');
//   const next = document.querySelector('.caro-btn.next');

//   // Move by exactly one card (its width + the flex gap)
//   const oneStep = () => {
//     const first = track.querySelector('.caro-card');
//     if (!first) return viewport.clientWidth * 0.9;
//     const rect = first.getBoundingClientRect();
//     const styles = getComputedStyle(track);
//     const gap = parseFloat(styles.columnGap || styles.gap) || 0;
//     return rect.width + gap;
//   };

//   prev?.addEventListener('click', () =>
//     viewport.scrollBy({ left: -oneStep(), behavior: 'smooth' })
//   );
//   next?.addEventListener('click', () =>
//     viewport.scrollBy({ left:  oneStep(), behavior: 'smooth' })
//   );
// })();
// // --- Make all certificate cards the same height ---
// function equalizeCertHeights() {
//   const cards = Array.from(document.querySelectorAll('.cert-card'));
//   if (!cards.length) return;
//   // reset to auto before measuring
//   cards.forEach(c => (c.style.height = 'auto'));
//   const max = Math.max(...cards.map(c => c.offsetHeight));
//   cards.forEach(c => (c.style.height = max + 'px'));
// }

// // run once after render + on resize (debounced)
// equalizeCertHeights();

// let resizeTimer;
// window.addEventListener('resize', () => {
//   clearTimeout(resizeTimer);
//   resizeTimer = setTimeout(equalizeCertHeights, 150);
// });
