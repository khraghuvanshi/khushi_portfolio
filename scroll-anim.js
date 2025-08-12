// assets/js/scroll-anim.js
// Reveal on scroll using data- attributes. Supports optional repeating & stagger.

const els = document.querySelectorAll('[data-animate]');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const el = entry.target;
    const repeat = el.hasAttribute('data-repeat');
    const isIn = entry.isIntersecting;

    if (isIn) {
      // Stagger immediate children if parent has data-stagger
      if (el.hasAttribute('data-stagger')) {
        const children = el.matches('[data-stagger]')
          ? Array.from(el.children)
          : [];
        children.forEach((child, i) => {
          child.style.transitionDelay = `${Math.min(i * 80, 600)}ms`;
        });
      }
      el.classList.add('in');
      if (!repeat) io.unobserve(el);
    } else if (repeat) {
      // allow it to animate again when it leaves and re-enters
      el.classList.remove('in');
    }
  });
}, {
  threshold: 0.15,           // when ~15% visible
  rootMargin: '0px 0px -10% 0px'
});

els.forEach(el => io.observe(el));
