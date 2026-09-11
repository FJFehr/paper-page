/**
 * ============================================================================
 * PEOPLE — authors, affiliations, correspondence. Adapts
 * when-rubrics-fail/legal-reward-bench's renderAuthors/renderAffiliation/
 * renderCorrespondence (main.js), generalized for authors.yaml's new
 * affiliations: lookup table (tasks/01-schema-and-tree.md) -- this is the
 * direct fix for the per-author-affiliation gap legal-reward-bench's own
 * header comment flagged (docs/02-comparison-matrix.md). See
 * tasks/05-engine-js-render.md.
 * ============================================================================
 */

(function () {
  "use strict";

  // Builds { affiliationId -> 1-based index } from the top-level
  // affiliations[] lookup table, in declaration order.
  function buildAffiliationIndex(affiliations) {
    const index = {};
    (affiliations || []).forEach(function (aff, i) { index[aff.id] = i + 1; });
    return index;
  }

  function affiliationById(affiliations, id) {
    return (affiliations || []).find(function (a) { return a.id === id; });
  }

  function renderAuthors(authors, affiliations) {
    const list = document.getElementById("author-list");
    if (!list || !authors) return;

    const affIndex = buildAffiliationIndex(affiliations);
    list.innerHTML = "";

    authors.forEach(function (author, i) {
      const li = document.createElement("li");
      li.className = "author";

      if (author.url) {
        const a = document.createElement("a");
        a.href = author.url;
        a.textContent = author.name;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        li.appendChild(a);
      } else {
        const span = document.createElement("span");
        span.textContent = author.name;
        span.className = "author-noLink";
        li.appendChild(span);
      }

      (author.affiliations || []).forEach(function (affId) {
        const num = affIndex[affId];
        if (num === undefined) return; // unknown affiliation id -- skip rather than show "undefined"
        const sup = document.createElement("sup");
        sup.textContent = String(num);
        const aff = affiliationById(affiliations, affId);
        if (aff && aff.name) sup.title = aff.name;
        li.appendChild(sup);
      });

      if (author.equal_contribution) {
        const sup = document.createElement("sup");
        sup.textContent = "*";
        sup.setAttribute("aria-label", "equal contribution");
        li.appendChild(sup);
      }

      if (i < authors.length - 1) {
        const sep = document.createElement("span");
        sep.className = "author-sep";
        sep.setAttribute("aria-hidden", "true");
        sep.textContent = ",";
        li.appendChild(sep);
      }

      list.appendChild(li);
    });

    const hasEqual = authors.some(function (a) { return a.equal_contribution; });
    const note = document.getElementById("equal-contribution-note");
    if (note) note.hidden = !hasEqual;
  }

  // Generic loop over affiliations[] -- replaces the two hardcoded
  // #oxford-logo/#oxai-logo-wrap ids from the source repos. An affiliation
  // with no `logo` field contributes no image (its superscript number still
  // renders via renderAuthors above), so a paper with more affiliations than
  // logos degrades cleanly rather than showing a broken image.
  function renderAffiliationLogos(affiliations) {
    const wrap = document.getElementById("affiliation-logos");
    if (!wrap) return;
    wrap.innerHTML = "";
    (affiliations || []).forEach(function (aff) {
      if (!aff.logo) return;
      const img = document.createElement("img");
      img.src = aff.logo;
      img.alt = aff.name || "";
      wrap.appendChild(img);
    });
  }

  function renderCorrespondence(correspondence) {
    const wrap = document.getElementById("correspondence");
    if (!wrap) return;
    if (!correspondence || (!correspondence.name && !correspondence.email)) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    const nameEl = document.getElementById("correspondence-name");
    const emailEl = document.getElementById("correspondence-email");
    if (nameEl) nameEl.textContent = correspondence.name || "[CORRESPONDING AUTHOR]";
    if (emailEl) {
      if (correspondence.email) {
        emailEl.textContent = correspondence.email;
        emailEl.href = "mailto:" + correspondence.email;
      } else {
        emailEl.textContent = "[EMAIL]";
        emailEl.removeAttribute("href");
      }
    }
  }

  // Exposed for render.js.
  window.renderAuthors = renderAuthors;
  window.renderAffiliationLogos = renderAffiliationLogos;
  window.renderCorrespondence = renderCorrespondence;
})();
