/**
 * ============================================================================
 * RENDER — the orchestrator, replacing when-rubrics-fail/legal-reward-bench's
 * main.js. Fetches project.yaml/authors.yaml, builds the nav and <main> from
 * project.yaml's sections[].blocks[] (via blocks.js), renders the hero
 * (title/authors/affiliations/resources) via people.js, and reuses this
 * template's proven interactivity (theme toggle, scroll-spy, citation copy)
 * near-verbatim from the source repos' main.js. See
 * tasks/05-engine-js-render.md.
 * ============================================================================
 */

(function () {
  "use strict";

  // Set once project.yaml has loaded; read by the theme-toggle handler on
  // every click, since it can't close over a value that doesn't exist yet
  // at script-parse time.
  let currentProject = null;

  /* ---------------------------------------------------------------------
   * Theme toggle -- unchanged from the source repos' logic, except
   * applyTheme() now takes the fetched project's theme config.
   * ------------------------------------------------------------------- */
  function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    function currentTheme() {
      return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }
    function reflectButton(theme) {
      const isDark = theme === "dark";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      btn.textContent = isDark ? "☀" : "☾";
    }

    reflectButton(currentTheme());

    btn.addEventListener("click", function () {
      const next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode etc. -- theme still applies this view */ }
      if (currentProject) applyTheme(currentProject.theme, next);
      reflectButton(next);
    });
  }

  /* ---------------------------------------------------------------------
   * Header-height var + smooth scroll + scroll-spy + progress bar --
   * unchanged from the source repos' main.js, except the nav-link
   * collection now runs against dynamically-built #site-nav links.
   * ------------------------------------------------------------------- */
  function updateHeaderHeightVar() {
    const header = document.querySelector("header.site-header");
    if (!header) return;
    const height = header.getBoundingClientRect().height + 8;
    document.documentElement.style.setProperty("--header-height", height + "px");
  }

  function initScrolling() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    updateHeaderHeightVar();
    window.addEventListener("resize", updateHeaderHeightVar);

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        const id = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        history.pushState(null, "", "#" + id);
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });

    const navLinks = Array.from(document.querySelectorAll("#site-nav a[href^='#']"));
    const sections = navLinks
      .map(function (link) { return document.getElementById(link.getAttribute("href").slice(1)); })
      .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          const link = navLinks.find(function (l) { return l.getAttribute("href") === "#" + entry.target.id; });
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.removeAttribute("aria-current"); });
            link.setAttribute("aria-current", "true");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      sections.forEach(function (s) { observer.observe(s); });
    }

    const progressBar = document.getElementById("scroll-progress");
    if (progressBar) {
      const update = function () {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
        progressBar.style.width = pct + "%";
      };
      document.addEventListener("scroll", update, { passive: true });
      update();
    }
  }

  /* ---------------------------------------------------------------------
   * BibTeX block + copy button -- unchanged from the source repos'
   * main.js. Called by blocks.js's `citation` renderer once its fetch of
   * citation.bib resolves (see blocks.js).
   * ------------------------------------------------------------------- */
  function renderBibtex(bibtex) {
    const pre = document.getElementById("bibtex-block");
    if (pre && bibtex) pre.textContent = bibtex;

    const copyBtn = document.getElementById("copy-bibtex-btn");
    if (!copyBtn || !bibtex) return;

    const defaultLabel = copyBtn.textContent;
    copyBtn.addEventListener("click", function () {
      copyText(bibtex)
        .then(function () {
          copyBtn.textContent = "✓ Copied";
          copyBtn.classList.add("copied");
          setTimeout(function () { copyBtn.textContent = defaultLabel; copyBtn.classList.remove("copied"); }, 2000);
        })
        .catch(function () {
          copyBtn.textContent = "Copy failed. Select manually.";
          setTimeout(function () { copyBtn.textContent = defaultLabel; }, 2500);
        });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("execCommand copy failed"));
      } catch (err) {
        reject(err);
      }
    });
  }

  /* ---------------------------------------------------------------------
   * Resource buttons -- generalized icon map (tasks/01-schema-and-tree.md):
   * every resources{} key renders a button, known keys get a matching
   * icon, unknown keys fall back to a generic link icon + title-cased
   * label. A null URL renders as the existing disabled/inert state.
   * ------------------------------------------------------------------- */
  const ICON_DOCUMENT =
    '<svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm8 1.5V8h4.5L14 3.5ZM8 13h8v1.5H8V13Zm0 3.5h8V18H8v-1.5ZM8 9.5h4V11H8V9.5Z"/></svg>';
  const ICON_GITHUB =
    '<svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z"/></svg>';
  const ICON_DATASET =
    '<svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><ellipse cx="12" cy="5.5" rx="8" ry="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 5.5v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6M4 11.5v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/></svg>';
  const ICON_PLAY =
    '<svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="currentColor" d="M10 8.5l6 3.5-6 3.5v-7Z"/></svg>';
  const ICON_LINK =
    '<svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M9.5 14.5 14.5 9.5M8 12l-2.3 2.3a3 3 0 0 0 4.24 4.24L12.2 16.3M16 12l2.3-2.3a3 3 0 0 0-4.24-4.24L11.8 7.7"/></svg>';

  const RESOURCE_MAP = {
    paper: { icon: ICON_DOCUMENT, label: "Paper" },
    arxiv: { icon: ICON_DOCUMENT, label: "arXiv" },
    code: { icon: ICON_GITHUB, label: "Code" },
    dataset: { icon: ICON_DATASET, label: "Dataset" },
    demo: { icon: ICON_PLAY, label: "Demo" },
    slides: { icon: ICON_DOCUMENT, label: "Slides" },
  };

  function titleCase(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/[_-]/g, " ");
  }

  function renderResourceButtons(resources, citeSectionId) {
    const container = document.getElementById("resource-buttons");
    if (!container || !resources) return;
    container.innerHTML = "";

    function makeButton(label, url, icon) {
      const textClass = "visually-hidden";
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.className = "btn";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = icon + '<span class="' + textClass + '">' + label + "</span>";
        return a;
      }
      const span = document.createElement("span");
      span.className = "btn btn-disabled";
      span.setAttribute("aria-disabled", "true");
      span.innerHTML = icon + '<span class="' + textClass + '">' + label + "</span>";
      return span;
    }

    Object.keys(resources).forEach(function (key) {
      const known = RESOURCE_MAP[key];
      const label = known ? known.label : titleCase(key);
      const icon = known ? known.icon : ICON_LINK;
      container.appendChild(makeButton(label, resources[key], icon));
    });

    if (citeSectionId) {
      const citeBtn = document.createElement("a");
      citeBtn.href = "#" + citeSectionId;
      citeBtn.className = "btn btn-cite";
      citeBtn.textContent = "Cite";
      container.appendChild(citeBtn);
    }
  }

  /* ---------------------------------------------------------------------
   * Main orchestration.
   * ------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
      fetch("project.yaml").then(function (r) {
        if (!r.ok) throw new Error("project.yaml responded " + r.status);
        return r.text();
      }).then(parseYamlLite),
      fetch("authors.yaml").then(function (r) {
        if (!r.ok) throw new Error("authors.yaml responded " + r.status);
        return r.text();
      }).then(parseYamlLite),
    ]).then(function (results) {
      const project = results[0];
      const authorsData = results[1];
      currentProject = project;

      // Hero
      document.title = project.paper.title;
      document.getElementById("hero-title").textContent = project.paper.title;
      document.getElementById("wordmark").textContent = project.paper.short_title || project.paper.title;
      renderAuthors(authorsData.authors, authorsData.affiliations);
      renderAffiliationLogos(authorsData.affiliations);
      renderCorrespondence(authorsData.correspondence);

      const citeSection = (project.sections || []).find(function (s) {
        return (s.blocks || []).some(function (b) { return b.type === "citation"; });
      });
      renderResourceButtons(project.resources || {}, citeSection ? citeSection.id : null);

      // Re-apply the *configured* palette now that project.yaml has loaded
      // (see index.html's THEME BOOTSTRAP comment for the accepted
      // pre-paint tradeoff this resolves).
      const mode = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(project.theme || {}, mode);

      // Nav + <main>, built entirely from sections[]
      const nav = document.getElementById("site-nav");
      const main = document.getElementById("main");
      (project.sections || []).forEach(function (section) {
        if (section.nav) {
          const a = document.createElement("a");
          a.href = "#" + section.id;
          a.textContent = section.title || section.id;
          nav.appendChild(a);
        }

        const el = document.createElement("section");
        el.id = section.id;
        // Every section gets its own .wrap, same as the hero/footer --
        // this is what keeps section content aligned with the hero (both
        // center within --content-width with 24px side padding) and, via
        // .wrap's display:flow-root, contains any floated `figure` block
        // (position: left/right) so it can't spill past its own section.
        const wrap = document.createElement("div");
        wrap.className = "wrap";
        el.appendChild(wrap);
        if (section.title) {
          const h2 = document.createElement("h2");
          h2.textContent = section.title;
          wrap.appendChild(h2);
        }
        main.appendChild(el);

        (section.blocks || []).forEach(function (block) {
          const container = document.createElement("div");
          wrap.appendChild(container);
          renderBlock(container, block);
        });
      });

      // Footer
      if (project.footer && project.footer.note) {
        document.getElementById("footer-note").textContent = project.footer.note;
      }

      // Nav now exists -- wire up scroll-spy/smooth-scroll/theme-toggle.
      initThemeToggle();
      initScrolling();
    }).catch(function (err) {
      console.error("Failed to load project.yaml/authors.yaml:", err);
      const main = document.getElementById("main");
      if (main) {
        main.textContent =
          "Content failed to load. If you're previewing locally, serve this folder " +
          "over http:// (not file://) -- see tasks/07-verification.md.";
      }
    });
  });

  // Exposed for blocks.js's citation renderer.
  window.renderBibtex = renderBibtex;
})();
