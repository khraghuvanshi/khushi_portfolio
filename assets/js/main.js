

// --- Projects Carousel ---
async function initCarousel(){
  let data = [];
  try {
    const res = await fetch('lib/projects.json', {cache:'no-store'});
    if (res.ok) data = await res.json();
  } catch {}
  if (!Array.isArray(data)) data = [];

  const track = document.getElementById('caro-track');
  if (!track) return;
  track.innerHTML = '';

  data.slice(0, 12).forEach(p => {
    const slide = document.createElement('article');
    slide.className = 'card project-card caro-slide';
    slide.innerHTML = `
      <img class="thumb" src="${p.image || 'assets/images/projects.jpg'}" alt="${p.title || 'Project'}" loading="lazy">
      <div class="card-body">
        <div class="project-meta">
          <h3>${p.title || 'Project'}</h3>
          <span class="year badge">${p.year || ''}</span>
        </div>
        <p>${p.description || ''}</p>
        <div class="project-actions">
          <a class="btn ghost" href="${p.link || '#'}" target="_blank" rel="noopener">View project</a>
        </div>
      </div>`;
    track.appendChild(slide);
  });

  const prev = document.querySelector('.caro-btn.prev');
  const next = document.querySelector('.caro-btn.next');
  const scrollBy = () => Math.min(track.clientWidth * 0.9, 520);

  prev?.addEventListener('click', () => track.scrollBy({left: -scrollBy(), behavior:'smooth'}));
  next?.addEventListener('click', () => track.scrollBy({left: scrollBy(), behavior:'smooth'}));

  // Drag to scroll
  let isDown=false, startX=0, startLeft=0;
  track.addEventListener('mousedown', e=>{ isDown=true; startX=e.clientX; startLeft=track.scrollLeft; track.classList.add('dragging'); });
  window.addEventListener('mouseup', ()=>{ isDown=false; track.classList.remove('dragging'); });
  window.addEventListener('mousemove', e=>{ if(!isDown) return; const dx = e.clientX - startX; track.scrollLeft = startLeft - dx; });
}
initCarousel();

// --- FAQ ---
document.querySelectorAll('.faq-item .faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    item.classList.toggle('expanded', !expanded);
  });
});

// --- Certificates ---
async function loadCertificates(){
  const grid = document.getElementById('cert-grid');
  if (!grid) return;
  let certs = [];
  try{
    const res = await fetch('lib/certificates.json', {cache:'no-store'});
    if (res.ok) certs = await res.json();
  } catch{}

  if (!Array.isArray(certs) || !certs.length){
    certs = [
      {
        "title":"Google Analytics Certification",
        "issuer":"Google",
        "year":"2024",
        "link":"https://skillshop.credential.net/9568e9a7-1b4a-4a8a-8bb9-439006ac359e"
      }
    ];
  }

  grid.innerHTML = '';
  certs.forEach(c => {
    const el = document.createElement('article');
    el.className = 'cert cert-card';
    el.innerHTML = `
      <h3>${c.title || 'Certificate'}</h3>
      <p>${c.issuer || ''} ${c.year ? '· ' + c.year : ''}</p>
      ${c.link ? `<a class="btn ghost" href="${c.link}" target="_blank" rel="noopener">View</a>` : ''}
    `;
    grid.appendChild(el);
  });
}
loadCertificates();
