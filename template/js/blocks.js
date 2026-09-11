/**
 * ============================================================================
 * BLOCKS — the dispatcher that turns one project.yaml sections[].blocks[]
 * entry into DOM. This, together with render.js building <section> elements
 * from sections[], is what closes the "adding a new section requires an
 * index.html edit" gap (docs/01-principles.md #6): the engine renders
 * whatever the config describes, generically. See tasks/04-engine-js-blocks.md.
 *
 * Every renderer has the signature (container, blockConfig) -> void |
 * Promise<void>. renderBlock() is the single entry point render.js calls.
 * ============================================================================
 */

(function () {
  "use strict";

  function fetchText(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error(path + " responded " + res.status);
      return res.text();
    });
  }

  function fetchYaml(path) {
    return fetchText(path).then(parseYamlLite);
  }

  function loadFailure(container, path, err) {
    console.error("Failed to load " + path + ":", err);
    container.textContent =
      "Content failed to load (" + path + "). If you're previewing locally, " +
      "serve this folder over http:// (not file://).";
  }

  const renderers = {
    markdown: function (container, block) {
      container.classList.add("block-markdown");
      return fetchText(block.source)
        .then(function (text) { container.innerHTML = mdBlock(text); })
        .catch(function (err) { loadFailure(container, block.source, err); });
    },

    figure: function (container, block) {
      const figure = document.createElement("figure");
      if (block.position === "left" || block.position === "right") {
        figure.classList.add("fig-" + block.position);
      }
      const img = document.createElement("img");
      img.src = block.src;
      img.alt = block.alt || "";
      figure.appendChild(img);
      if (block.caption) {
        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = mdInline(block.caption);
        figure.appendChild(figcaption);
      }
      container.appendChild(figure);
    },

    takeaways: function (container, block) {
      return fetchYaml(block.source)
        .then(function (items) {
          const grid = document.createElement("div");
          grid.className = "takeaways-grid";
          (items || []).forEach(function (item) {
            const card = item.anchor ? document.createElement("a") : document.createElement("div");
            card.className = "takeaway";
            if (item.anchor) card.href = item.anchor;
            card.innerHTML =
              "<strong>" + mdInline(item.title || "") + "</strong> " + mdInline(item.body || "");
            grid.appendChild(card);
          });
          container.appendChild(grid);
        })
        .catch(function (err) { loadFailure(container, block.source, err); });
    },

    table: function (container, block) {
      const wrap = document.createElement("div");
      wrap.className = "table-scroll";
      const table = document.createElement("table");
      wrap.appendChild(table);
      container.appendChild(wrap);
      return fetchText(block.source)
        .then(function (text) { renderMarkdownTable(table, text); })
        .catch(function (err) { loadFailure(container, block.source, err); });
    },

    results_table: function (container, block) {
      const wrap = document.createElement("div");
      wrap.className = "table-scroll";
      const table = document.createElement("table");
      wrap.appendChild(table);
      container.appendChild(wrap);
      return fetchYaml(block.source)
        .then(function (data) { renderResultsTable(table, data); })
        .catch(function (err) { loadFailure(container, block.source, err); });
    },

    callout: function (container, block) {
      const div = document.createElement("div");
      div.className = "callout callout-" + (block.style || "tldr");
      container.appendChild(div);
      return fetchText(block.source)
        .then(function (text) { div.innerHTML = mdBlock(text); })
        .catch(function (err) { loadFailure(container, block.source, err); });
    },

    citation: function (container, block) {
      const wrap = document.createElement("div");
      wrap.className = "citation-block";
      const pre = document.createElement("pre");
      pre.id = "bibtex-block";
      const btn = document.createElement("button");
      btn.id = "copy-bibtex-btn";
      btn.type = "button";
      btn.textContent = "Copy BibTeX";
      wrap.appendChild(pre);
      wrap.appendChild(btn);
      container.appendChild(wrap);
      return fetchText(block.source)
        .then(function (text) {
          if (typeof window.renderBibtex === "function") window.renderBibtex(text);
        })
        .catch(function (err) { loadFailure(container, block.source, err); });
    },
  };

  function renderBlock(container, block) {
    const renderer = renderers[block.type];
    if (!renderer) {
      console.warn('blocks.js: block type "' + block.type + '" isn\'t implemented yet.');
      const div = document.createElement("div");
      div.className = "block-unsupported";
      div.textContent = 'Block type "' + block.type + '" isn\'t implemented yet.';
      container.appendChild(div);
      return;
    }
    return renderer(container, block);
  }

  // Exposed for render.js.
  window.renderBlock = renderBlock;
})();
