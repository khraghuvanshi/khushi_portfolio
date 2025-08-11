// FAQ accordion toggles
document.addEventListener('click', (e) => {
  const q = e.target.closest('.faq .question');
  if (!q) return;
  const item = q.closest('.faq-item');
  const ans = item.querySelector('.answer');
  const toggle = item.querySelector('.toggle');
  const open = ans.style.display === 'block';
  ans.style.display = open ? 'none' : 'block';
  if (toggle) toggle.textContent = open ? '+' : '−';
});