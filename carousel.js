// Build the projects carousel from lib/projects.json and wire controls
(async function initCarousel(){
  const viewport = document.querySelector('.caro-viewport');
  const track = document.getElementById('caro-track');
  if (!viewport || !track) return;

  let projects = [];
  try {
    const res = await fetch('lib/projects.json', { cache: 'no-store' });
    projects = await res.json();
  } catch (e) {
    console.warn('Could not load projects.json', e);
    projects = [];
  }

  // Fallback: if no projects, do nothing
  if (!Array.isArray(projects) || projects.length === 0) return;

  // Render compact cards (reuse existing card styles)
  projects.slice(0, 20).forEach((p) => {
    const art = document.createElement('article');
    art.className = 'card project-card caro-card';

    art.innerHTML = `
      <img class="thumb" src="${p.image || 'images/projects.jpg'}" alt="${p.title || 'Project'}" loading="lazy">
      <div class="card-body">
        <div class="project-meta">
          <h3>${p.title || 'Project'}</h3>
          ${p.year ? `<span class="year badge">${p.year}</span>` : ''}
        </div>
        <p>${p.description || ''}</p>
        <div class="project-actions">
          ${p.link ? `<a class="btn ghost" href="${p.link}" target="_blank" rel="noopener">View project</a>` : ''}
        </div>
      </div>`;

    track.appendChild(art);
  });

  const prev = document.querySelector('.caro-btn.prev');
  const next = document.querySelector('.caro-btn.next');

  const scrollAmount = () => Math.min(viewport.clientWidth * 0.9, 900);

  prev?.addEventListener('click', () => viewport.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  next?.addEventListener('click', () => viewport.scrollBy({ left:  scrollAmount(), behavior: 'smooth' }));

  // Drag to scroll
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