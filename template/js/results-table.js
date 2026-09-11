/**
 * ============================================================================
 * RESULTS TABLE — the net-new "leaderboard" primitive (the `results_table`
 * block type). Closes the gap documented in docs/01-principles.md #6 and
 * docs/02-comparison-matrix.md: legal-reward-bench needed to compare 15
 * reward models across several benchmarks and had nothing but prose +
 * static spider-chart PNGs, because the only table renderer (tables.js) was
 * built for small qualitative example tables.
 *
 * Source schema (content/results-table.yaml, see
 * tasks/01-schema-and-tree.md):
 *
 *   caption: "..."
 *   columns:
 *     - id: model
 *       label: Model
 *       type: text
 *     - id: lrb
 *       label: LRB
 *       type: number
 *       better: higher   # "higher" | "lower" -- which extreme gets .best
 *   rows:
 *     - model: "Model A"
 *       lrb: 0.82
 * ============================================================================
 */

(function () {
  "use strict";

  function renderResultsTable(el, data) {
    if (!data || !Array.isArray(data.columns) || !Array.isArray(data.rows)) {
      console.error("results-table.js: source is missing columns[]/rows[].");
      return;
    }

    el.classList.add("md-table", "results-table");
    el.innerHTML = "";

    if (data.caption) {
      const caption = document.createElement("caption");
      caption.textContent = data.caption;
      el.appendChild(caption);
    }

    // Precompute each numeric column's best value across all rows.
    const bestByColumn = {};
    data.columns.forEach(function (col) {
      if (col.type !== "number") return;
      const values = data.rows
        .map(function (row) { return Number(row[col.id]); })
        .filter(function (v) { return !isNaN(v); });
      if (!values.length) return;
      bestByColumn[col.id] = col.better === "lower" ? Math.min.apply(null, values) : Math.max.apply(null, values);
    });

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    data.columns.forEach(function (col) {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = col.label || col.id;
      th.setAttribute("data-col-type", col.type || "text");
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    el.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.rows.forEach(function (row) {
      const tr = document.createElement("tr");
      data.columns.forEach(function (col) {
        const td = document.createElement("td");
        const raw = row[col.id];
        td.setAttribute("data-col-type", col.type || "text");
        if (col.type === "number") {
          const num = Number(raw);
          td.textContent = raw === undefined || raw === null || isNaN(num) ? "" : String(raw);
          if (!isNaN(num) && bestByColumn[col.id] !== undefined && num === bestByColumn[col.id]) {
            td.classList.add("best");
          }
        } else {
          td.innerHTML = mdInline(raw === undefined || raw === null ? "" : String(raw));
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    el.appendChild(tbody);
  }

  // Exposed for blocks.js.
  window.renderResultsTable = renderResultsTable;
})();
