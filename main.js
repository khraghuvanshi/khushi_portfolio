const $ = (s, c = document) => c.querySelector(s),
  $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

const t = $(".nav-toggle"),
  e = $("#menu");

t &&
  t.addEventListener("click", () => {
    const t = "true" === e.getAttribute("data-open");
    e.setAttribute("data-open", String(!t)),
      t
        ? e.setAttribute("aria-expanded", "false")
        : e.setAttribute("aria-expanded", "true");
  });

$$(".menu a").forEach((t) => {
  t.addEventListener("click", (s) => {
    const n = t.getAttribute("href") || "";
    if (n.startsWith("#")) {
      s.preventDefault();
      const t = $(n);
      t &&
        (t.scrollIntoView({ behavior: "smooth", block: "start" }),
        null == e || e.setAttribute("data-open", "false"),
        null == window || window.history.pushState(null, "", n));
    }
  });
});

const s = ["#projects", "#about", "#services", "#contact"]
    .map((t) => $(t))
    .filter(Boolean),
  n = new Map($$(".menu a").map((t) => [t.getAttribute("href"), t])),
  o = () => {
    const t = window.scrollY + 100;
    s.forEach((s) => {
      if (!s) return;
      const o = s.offsetTop,
        a = o + s.offsetHeight,
        i = "#" + s.id,
        r = n.get(i);
      t >= o && t < a
        ? r && r.classList.add("is-active")
        : r && r.classList.remove("is-active");
    });
  };

addEventListener("scroll", o),
  addEventListener("keydown", (t) => {
    ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) ||
      ("j" === t.key.toLowerCase() &&
        $("#projects")?.scrollIntoView({ behavior: "smooth" }),
      "r" === t.key.toLowerCase() &&
        window.open("resume.pdf", "_blank"));
  }),
  ($("#year").textContent = new Date().getFullYear()),
  fetch("lib/projects.json", { cache: "no-store" })
    .then((t) => t.json())
    .then((t) => {
      const e = $("#project-grid");
      Array.isArray(t) &&
        t.slice(0, 12).forEach((t) => {
          const s = document.createElement("article");
          (s.className = "card project-card"),
            (s.innerHTML = `<img class="thumb" src="${
              t.image || "assets/images/projects.jpg"
            }" alt="${t.title || "Project"}" loading="lazy"><div class="card-body"><div class="project-meta"><h3>${
              t.title || "Project"
            }</h3>
<span class="year badge">${t.year || ""}</span></div><p>${
              t.description || ""
            }</p><div class="project-actions"><a class="btn ghost" href="${
              t.link || "#"
            }" target="_blank" rel="noopener">View project</a></div></div>`),
            e.appendChild(s);
        });
    })
    .catch(() => {});
