// Build Certificates section from lib/certificates.json
(async function initCertificates() {
  const grid = document.getElementById('cert-grid');
  if (!grid) return;

  try {
    const res = await fetch('lib/certificates.json', { cache: 'no-store' });
    const certs = await res.json();

    if (!Array.isArray(certs)) return;

    certs.forEach((c) => {
      const card = document.createElement('article');
      card.className = 'card cert-card';

      const title = c.title || c.name || 'Certificate';
      const issuer = c.issuer || c.provider || '';
      const year = c.year || c.date || '';
      const desc = c.description || '';

      card.innerHTML = `
        <h3>${title}</h3>
        <div class="cert-issuer">
          <span>${issuer}</span>
          ${year ? `<span class="badge">${year}</span>` : ''}
        </div>
        ${desc ? `<p>${desc}</p>` : ''}
        <div class="cert-actions">
          ${c.link ? `<a class="btn ghost" href="${c.link}" target="_blank" rel="noopener">View credential</a>` : ''}
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (e) {
    console.warn('Could not load certificates.json', e);
  }
})();
// --- Make all certificate cards the same height ---
function equalizeCertHeights() {
  const cards = Array.from(document.querySelectorAll('.cert-card'));
  if (!cards.length) return;
  // reset to auto before measuring
  cards.forEach(c => (c.style.height = 'auto'));
  const max = Math.max(...cards.map(c => c.offsetHeight));
  cards.forEach(c => (c.style.height = max + 'px'));
}

// run once after render + on resize (debounced)
equalizeCertHeights();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(equalizeCertHeights, 150);
});
