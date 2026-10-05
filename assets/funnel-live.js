/* funnel-live.js - the funnel bench for learn-marketing-with-phoebe
 *
 * All 8,000 real marketing-qualified leads of the public Marketing Funnel by Olist dataset
 * (funnel-sample.js), each with its origin channel, whether it closed as a seller, its
 * first-contact month and, on closed rows, the monthly revenue the seller declared.
 *
 * What is REAL, computed here from those rows: every lead count, every closed-deal count, every
 *   close rate and its 95% interval, the declared-revenue counts, the shuffle.
 * What is CONSTRUCTED, labelled on the widget and editable: the monthly budget, the cost per
 *   lead of each channel, the headroom (how far past today's real volume a channel can be
 *   pushed before it saturates), the monthly revenue per new seller and the gross margin.
 *
 * Response model, stated once: leads(s) = cap * (1 - exp(-s / (CPL * cap))),
 *   cap = headroom * the channel's real monthly MQL run rate. The first dollar buys a lead at
 *   CPL; the more you push, the dearer the next lead; the channel tops out at cap.
 *
 * materials/build-olist-funnel.py mirrors this engine line for line; the two must agree on
 * every number before a page quotes one.
 */
(function (root) {
  "use strict";

  var SEED = 20180531;
  var DEFAULTS = {
    budget: 20000,
    headroom: 2.0,
    cpl: { organic_search: 40, paid_search: 60, social: 25, email: 15, referral: 50, display: 30 },
    revenue: 80,
    margin: 0.65,
    step: 100
  };
  var LABEL = {
    organic_search: "Organic search", paid_search: "Paid search", social: "Social",
    email: "Email", referral: "Referral", display: "Display", unknown: "Unknown",
    direct_traffic: "Direct traffic", other: "Other", other_publicities: "Other publicity",
    "(blank)": "(blank)"
  };
  var WHY_NOT = {
    unknown: "origin not recorded, so no budget line can buy it",
    direct_traffic: "people typing the address: a result of other marketing, not a line item",
    other: "a catch-all label, no single lever behind it",
    other_publicities: "a catch-all label, no single lever behind it",
    "(blank)": "origin field empty"
  };
  var SMALL = 30; // fewer closed deals than this: the close rate is a guess, say so

  /* ---------- engine ---------- */
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
      t = (t ^ ((t + (Math.imul(t ^ (t >>> 7), t | 61) >>> 0)) >>> 0)) >>> 0;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function cohortIdx(D, cohort) {
    var lo = cohort === "2018" ? D.cohortStart : 0, out = [];
    for (var i = 0; i < D.n; i++) if (D.m[i] >= lo) out.push(i);
    return out;
  }

  function shuffledWon(D, idx, seed) {
    var w = idx.map(function (i) { return D.w[i]; });
    var rnd = mulberry32(seed);
    for (var i = w.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = w[i]; w[i] = w[j]; w[j] = t;
    }
    return w;
  }

  function wilson(k, n) {
    if (n === 0) return [0, 0];
    var z = 1.96, p = k / n, den = 1 + z * z / n;
    var mid = (p + z * z / (2 * n)) / den;
    var half = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / den;
    return [Math.max(0, mid - half), Math.min(1, mid + half)];
  }

  function median(a) {
    if (!a.length) return null;
    var b = a.slice().sort(function (x, y) { return x - y; });
    var m = b.length >> 1;
    return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
  }

  function tally(D, cohort, shuffle) {
    var idx = cohortIdx(D, cohort);
    var won = shuffle ? shuffledWon(D, idx, SEED) : idx.map(function (i) { return D.w[i]; });
    var months = D.months.length - (cohort === "2018" ? D.cohortStart : 0);
    var by = {}, decl = {};
    D.origins.forEach(function (o) { by[o] = { n: 0, deals: 0 }; decl[o] = []; });
    for (var p = 0; p < idx.length; p++) {
      var i = idx[p], o = D.origins[D.o[i]];
      by[o].n += 1;
      if (won[p]) {
        by[o].deals += 1;
        if (!shuffle && D.v[i] > 0) decl[o].push(D.v[i]);
      }
    }
    var totN = 0, totK = 0;
    D.origins.forEach(function (o) {
      var s = by[o];
      totN += s.n; totK += s.deals;
      s.rate = s.n ? s.deals / s.n : 0;
      s.ci = wilson(s.deals, s.n);
      s.perMonth = s.n / months;
      s.declaredN = decl[o].length;
      s.declaredMedian = median(decl[o]);
    });
    return { by: by, n: totN, deals: totK, rate: totK / totN, months: months, spend: D.spend };
  }

  function leadsFor(spend, cpl, cap) {
    if (spend <= 0 || cap <= 0) return 0;
    return cap * (1 - Math.exp(-spend / (cpl * cap)));
  }

  function evaluate(T, split, A) {
    var totW = 0;
    T.spend.forEach(function (c) { totW += Math.max(0, split[c] || 0); });
    var per = {}, leads = 0, deals = 0;
    T.spend.forEach(function (c) {
      var s = totW > 0 ? A.budget * (Math.max(0, split[c] || 0) / totW) : 0;
      var cap = A.headroom * T.by[c].perMonth;
      var L = leadsFor(s, A.cpl[c], cap);
      var k = L * T.by[c].rate;
      per[c] = { spend: s, leads: L, deals: k };
      leads += L; deals += k;
    });
    var cac = deals > 0 ? A.budget / deals : Infinity;
    var gp = A.revenue * A.margin;
    return { per: per, leads: leads, deals: deals, cac: cac, payback: gp > 0 ? cac / gp : Infinity };
  }

  function bestSplit(T, A) {
    var alloc = {}, caps = {};
    T.spend.forEach(function (c) { alloc[c] = 0; caps[c] = A.headroom * T.by[c].perMonth; });
    var steps = Math.floor(A.budget / A.step);
    for (var s = 0; s < steps; s++) {
      var best = null, gain = -1;
      for (var q = 0; q < T.spend.length; q++) {
        var c = T.spend[q];
        var g = (leadsFor(alloc[c] + A.step, A.cpl[c], caps[c]) - leadsFor(alloc[c], A.cpl[c], caps[c])) * T.by[c].rate;
        if (g > gain) { best = c; gain = g; }
      }
      alloc[best] += A.step;
    }
    return alloc;
  }

  function presets(T, A) {
    var even = {}, leads = {}, cheap = {}, deals = {};
    T.spend.forEach(function (c) {
      even[c] = 1; leads[c] = T.by[c].n; cheap[c] = 1 / A.cpl[c]; deals[c] = T.by[c].deals;
    });
    return { even: even, leads: leads, cheap: cheap, deals: deals, best: bestSplit(T, A) };
  }

  function canon(D) {
    var out = {};
    ["2018", "all"].forEach(function (cohort) {
      [false, true].forEach(function (shuffle) {
        var T = tally(D, cohort, shuffle), P = presets(T, DEFAULTS), lad = {}, ch = {}, bs = {};
        Object.keys(P).forEach(function (k) {
          var e = evaluate(T, P[k], DEFAULTS);
          lad[k] = [e.leads, e.deals, e.cac, e.payback];
        });
        D.origins.forEach(function (o) {
          var s = T.by[o];
          ch[o] = [s.n, s.deals, s.rate, s.ci[0], s.ci[1], s.declaredN, s.declaredMedian];
        });
        T.spend.forEach(function (c) { bs[c] = P.best[c]; });
        out[cohort + (shuffle ? "-shuffled" : "")] = {
          n: T.n, deals: T.deals, rate: T.rate, channels: ch, ladder: lad, bestSplit: bs
        };
      });
    });
    return out;
  }

  /* ---------- UI ---------- */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function money(x) { return isFinite(x) ? "$" + Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "never"; }
  function pct1(x) { return (x * 100).toFixed(1) + "%"; }
  function num1(x) { return x.toFixed(1); }
  function clone(A) { return JSON.parse(JSON.stringify(A)); }

  var PRESETS = [
    { key: "even", label: "Even split", note: "One sixth of the budget to each channel." },
    { key: "leads", label: "Spend where the most leads come from", anti: true,
      note: "Budget in proportion to each channel's real MQL count." },
    { key: "cheap", label: "Cheapest leads first", anti: true,
      note: "Budget in proportion to 1 / cost per lead." },
    { key: "deals", label: "Spend where the deals come from",
      note: "Budget in proportion to each channel's real closed deals." },
    { key: "best", label: "Next dollar to the next best deal",
      note: "The bench moves $100 at a time to whichever channel buys the most deals for it." }
  ];

  function mount(el) {
    var D = root.FUNNEL_DATA;
    if (!D) { el.textContent = "The lead data did not load."; return; }
    var state = { cohort: "2018", shuffle: false, preset: "leads", A: clone(DEFAULTS), custom: null };

    el.className = "mb-wrap fb-wrap";
    el.innerHTML =
      '<h4>The funnel bench: split one month of budget across six channels</h4>' +
      '<p class="mb-intro">Every lead count and close rate below is computed now, in your browser, from ' +
      D.n.toLocaleString("en-US") + ' real leads. Every cost is an assumption you can change. ' +
      'The bench prints what the split buys.</p>' +
      '<div class="fb-switches">' +
        '<label class="fb-switch"><input type="checkbox" data-fb="all"> Include the 2017 leads (closed-deal records start in December 2017)</label>' +
        '<button type="button" class="btn fb-break" data-fb="break">Break it: shuffle the closed-deal flags</button>' +
      '</div>' +
      '<div class="fb-table"></div>' +
      '<details class="fb-assume"><summary><span class="mb-mkind is-heuristic">constructed</span> Assumptions panel: costs, headroom, revenue, margin</summary><div class="fb-agrid"></div>' +
        '<p class="mb-hint">Defaults: $20,000 a month; cost per lead organic $40, paid $60, social $25, email $15, referral $50, display $30; ' +
        'headroom 2x the real monthly lead volume; $80 a month revenue per new seller at 65% gross margin. None of these come from the dataset. ' +
        '<button type="button" class="fb-reset" data-fb="reset">Reset defaults</button></p></details>' +
      '<div class="mb-presets fb-presets"></div>' +
      '<div class="fb-custom"><p class="fb-ctitle">Or set your own split (weights; the bench scales them to the budget)</p><div class="fb-sliders"></div></div>' +
      '<div class="fb-out"></div>';

    var tableEl = el.querySelector(".fb-table"), agrid = el.querySelector(".fb-agrid");
    var presetEl = el.querySelector(".fb-presets"), sliders = el.querySelector(".fb-sliders");
    var outEl = el.querySelector(".fb-out"), breakBtn = el.querySelector('[data-fb="break"]');

    function T() { return tally(D, state.cohort, state.shuffle); }

    function renderTable(t) {
      var rows = D.origins.slice().sort(function (a, b) {
        var sa = D.spend.indexOf(a) >= 0 ? 0 : 1, sb = D.spend.indexOf(b) >= 0 ? 0 : 1;
        return sa - sb || t.by[b].n - t.by[a].n;
      });
      var h = '<div class="dt-tablewrap"><table class="dt-table fb-ch"><thead><tr><th>Channel</th><th>Leads</th><th>Closed</th><th>Close rate (95% range)</th><th>Declared revenue</th></tr></thead><tbody>';
      rows.forEach(function (o) {
        var s = t.by[o], spendable = D.spend.indexOf(o) >= 0;
        var small = s.deals < SMALL ? ' <span class="fb-small">only ' + s.deals + ' deals</span>' : "";
        var decl = state.shuffle ? "not moved by the shuffle" :
          (s.deals ? s.declaredN + " of " + s.deals + " declared" + (s.declaredN ? ", their median R$ " + Math.round(s.declaredMedian).toLocaleString("en-US") : "") : "none closed");
        h += '<tr class="' + (spendable ? "" : "fb-off") + '"><th>' + esc(LABEL[o]) +
          (spendable ? "" : "<em>" + esc(WHY_NOT[o]) + "</em>") + "</th><td>" + s.n.toLocaleString("en-US") +
          "</td><td>" + s.deals + "</td><td><b>" + pct1(s.rate) + "</b> <span class=\"fb-ci\">(" + pct1(s.ci[0]) + " to " + pct1(s.ci[1]) + ")</span>" + small +
          "</td><td>" + esc(decl) + "</td></tr>";
      });
      h += '</tbody></table></div><p class="mb-hint">All ' + t.n.toLocaleString("en-US") + " leads, " + t.deals + " closed, overall " + pct1(t.rate) +
        (state.shuffle ? ". SHUFFLED: closed flags were dealt back out at random, so every channel should sit near the overall rate." : ". Measured, not modelled.") + "</p>";
      tableEl.innerHTML = h;
    }

    function inputRow(label, key, sub, val, stepv) {
      return '<label class="fb-field"><span>' + esc(label) + '</span><input type="number" min="0" step="' + stepv + '" value="' + val + '" data-a="' + key + '"' + (sub ? ' data-sub="' + sub + '"' : "") + "></label>";
    }
    function renderAssume() {
      var A = state.A, h = "";
      h += inputRow("Monthly budget ($)", "budget", "", A.budget, 1000);
      h += inputRow("Headroom (x real volume)", "headroom", "", A.headroom, 0.5);
      h += inputRow("Revenue per new seller ($/month)", "revenue", "", A.revenue, 5);
      h += inputRow("Gross margin (0 to 1)", "margin", "", A.margin, 0.05);
      D.spend.forEach(function (c) { h += inputRow("Cost per lead, " + LABEL[c] + " ($)", "cpl", c, A.cpl[c], 1); });
      agrid.innerHTML = h;
    }

    function renderPresets(t) {
      var P = presets(t, state.A), h = "";
      PRESETS.forEach(function (p) {
        var e = evaluate(t, P[p.key], state.A);
        h += '<button type="button" class="mb-preset' + (p.anti ? " is-anti" : "") + (state.preset === p.key && !state.custom ? " is-on" : "") + '" data-p="' + p.key + '">' +
          '<span class="fb-cac">' + money(e.cac) + '</span><span class="mb-pname">' + esc(p.label) +
          (p.anti ? ' <em class="mb-anti">the obvious move</em>' : "") + '</span><span class="mb-pnote">' + esc(p.note) + "</span></button>";
      });
      presetEl.innerHTML = h;
      return P;
    }

    function currentSplit(P) { return state.custom || P[state.preset]; }

    function renderSliders(split) {
      var tot = 0, h = "";
      D.spend.forEach(function (c) { tot += Math.max(0, split[c] || 0); });
      D.spend.forEach(function (c) {
        var share = tot > 0 ? Math.max(0, split[c] || 0) / tot : 0;
        h += '<label class="fb-slide"><span>' + esc(LABEL[c]) + '</span><input type="range" min="0" max="100" step="1" value="' + Math.round(share * 100) + '" data-s="' + c + '"><b>' + Math.round(share * 100) + "%</b></label>";
      });
      sliders.innerHTML = h;
    }

    function renderOut(t, P) {
      var split = currentSplit(P), e = evaluate(t, split, state.A), b = evaluate(t, P.best, state.A);
      var gap = e.cac / b.cac - 1;
      var cls = gap <= 0.005 ? "is-good" : gap <= 0.05 ? "is-ok" : "is-bad";
      var verdict = gap <= 0.005 ? "As good as the bench can find under these assumptions" :
        "CAC " + (gap * 100).toFixed(1) + "% above the best split the bench found (" + money(b.cac) + ")";
      var rows = "";
      D.spend.forEach(function (c) {
        var p = e.per[c], s = t.by[c];
        rows += "<tr><th>" + esc(LABEL[c]) + "</th><td>" + money(p.spend) + "</td><td>" + num1(p.leads) + "</td><td>" + num1(p.deals) +
          "</td><td>" + (p.leads > 0 ? money(p.spend / p.leads) : "-") + "</td><td>" + (p.deals > 0 ? money(p.spend / p.deals) : "-") +
          (s.deals < SMALL && p.spend > 0 ? ' <span class="fb-small">rate rests on ' + s.deals + " deals</span>" : "") + "</td></tr>";
      });
      outEl.innerHTML =
        '<div class="mb-verdict ' + cls + '">' + esc(verdict) + "</div>" +
        '<div class="mb-metrics">' +
          metric("Expected leads", num1(e.leads), "per month", "constructed") +
          metric("Expected deals", num1(e.deals), "new sellers per month", "constructed") +
          metric("Blended CAC", money(e.cac), "budget / deals", "constructed") +
          metric("Payback", isFinite(e.payback) ? num1(e.payback) : "never", "months of gross profit", "constructed") +
        "</div>" +
        '<div class="dt-tablewrap"><table class="dt-table fb-split"><thead><tr><th>Channel</th><th>Spend</th><th>Leads</th><th>Deals</th><th>Avg cost per lead</th><th>Channel CAC</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
        '<p class="mb-hint fb-rail">Close rates are measured on real rows' + (state.shuffle ? " (currently shuffled)" : "") +
        '. Leads per dollar, saturation, revenue and margin are constructed, so read the ORDER of the splits, not the dollar figures. Your numbers will differ.</p>';
    }

    function metric(label, value, unit, kind) {
      return '<div class="mb-metric"><span class="mb-mlabel">' + esc(label) + '</span><span class="mb-mvalue">' + esc(value) +
        '</span><span class="mb-munit">' + esc(unit) + '</span><span class="mb-mkind is-heuristic">' + kind + "</span></div>";
    }

    function render(keepSliders) {
      var t = T(), P = renderPresets(t);
      renderTable(t);
      if (!keepSliders) renderSliders(currentSplit(P));
      renderOut(t, P);
      breakBtn.textContent = state.shuffle ? "Restore the real closed-deal flags" : "Break it: shuffle the closed-deal flags";
      breakBtn.classList.toggle("mode-on", state.shuffle);
      el.setAttribute("data-fb-state", state.cohort + (state.shuffle ? "-shuffled" : "") + ":" + (state.custom ? "custom" : state.preset));
    }

    el.addEventListener("click", function (ev) {
      var p = ev.target.closest("[data-p]");
      if (p) { state.preset = p.getAttribute("data-p"); state.custom = null; render(); return; }
      var f = ev.target.closest("[data-fb]");
      if (!f) return;
      var k = f.getAttribute("data-fb");
      if (k === "break") { state.shuffle = !state.shuffle; render(); }
      if (k === "reset") { state.A = clone(DEFAULTS); renderAssume(); render(); }
    });
    el.addEventListener("change", function (ev) {
      var t = ev.target;
      if (t.getAttribute("data-fb") === "all") { state.cohort = t.checked ? "all" : "2018"; render(); }
    });
    el.addEventListener("input", function (ev) {
      var t = ev.target, a = t.getAttribute("data-a"), s = t.getAttribute("data-s");
      if (a) {
        var v = parseFloat(t.value);
        if (!isFinite(v) || v < 0) return;
        if (a === "cpl") { if (v > 0) state.A.cpl[t.getAttribute("data-sub")] = v; }
        else if (a === "margin") state.A.margin = Math.min(1, v);
        else if (a === "budget") { if (v >= state.A.step) state.A.budget = v; }
        else state.A[a] = v;
        render(true);
      }
      if (s) {
        var cur = {};
        sliders.querySelectorAll("input[data-s]").forEach(function (inp) {
          cur[inp.getAttribute("data-s")] = parseFloat(inp.value);
          inp.nextElementSibling.textContent = "";
        });
        state.custom = cur;
        var tot = 0; Object.keys(cur).forEach(function (c) { tot += cur[c]; });
        sliders.querySelectorAll("input[data-s]").forEach(function (inp) {
          inp.nextElementSibling.textContent = (tot > 0 ? Math.round(cur[inp.getAttribute("data-s")] / tot * 100) : 0) + "%";
        });
        render(true);
      }
    });

    renderAssume();
    render();
  }

  var API = { DEFAULTS: DEFAULTS, tally: tally, evaluate: evaluate, presets: presets, bestSplit: bestSplit,
    canon: canon, mulberry32: mulberry32, mount: mount };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  root.FunnelBench = API;

  if (typeof document !== "undefined") {
    var go = function () { document.querySelectorAll("[data-funnel-bench]").forEach(mount); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  }
})(typeof window !== "undefined" ? window : this);
