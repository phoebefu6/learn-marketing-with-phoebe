#!/usr/bin/env python3
"""Rebuild every Olist funnel number quoted in learn-marketing-with-phoebe, and the bench data file.

Internal build script. Not linked from any audience-facing page.

Usage
-----
  python3 materials/build-olist-funnel.py [<dir-with-csvs>] [--write-sample]

With no directory it downloads the public dataset with no login:
  kagglehub.dataset_download("olistbr/marketing-funnel-olist")
  (Marketing Funnel by Olist, CC BY-NC-SA 4.0: 8,000 MQLs that requested contact
   between 2017-06-01 and 2018-06-01, and the 842 that closed as sellers.)

--write-sample regenerates assets/funnel-sample.js with json.dumps. It ships ALL 8,000 rows
(origin code, won flag, first-contact month, declared monthly revenue on won rows), not a draw,
so every count on the bench is the full real count.

Decisions, stated once (session 4 teaches them):
  cohort      leads first contacted Jan-May 2018 (5,998 MQLs). Closed-deal records begin
              2017-12-05, so 2017 leads look as if they almost never closed (0 to 5.0 percent by channel
              against 13.0). The bench can switch to all twelve months to show the damage.
  spendable   six origins a budget can buy: organic_search, paid_search, social, email,
              referral, display. unknown, direct_traffic, other, other_publicities and blank
              are shown in the table but cannot receive budget.
  response    constructed and labelled: leads(s) = cap * (1 - exp(-s / (CPL * cap))), where
              cap = headroom * the channel's real monthly MQL run rate in the cohort. The first
              dollar buys a lead at CPL; the channel saturates at cap.
  revenue     constructed. 797 of 842 closed deals declare 0 monthly revenue, so the declared
              column cannot carry a per-channel revenue. Payback uses one stated revenue per
              new seller and one stated gross margin for every channel.

The engine below mirrors assets/funnel-live.js line for line. The node check must agree:

  cd assets && node -e 'global.window={};require("./funnel-sample.js");
    const F=require("./funnel-live.js");console.log(JSON.stringify(F.canon(window.FUNNEL_DATA)))'
"""
import json
import math
import os
import sys

import pandas as pd

ORIGINS = ["organic_search", "paid_search", "social", "email", "referral", "display",
           "unknown", "direct_traffic", "other", "other_publicities", "(blank)"]
SPEND = ["organic_search", "paid_search", "social", "email", "referral", "display"]
MONTHS = ["2017-06", "2017-07", "2017-08", "2017-09", "2017-10", "2017-11", "2017-12",
          "2018-01", "2018-02", "2018-03", "2018-04", "2018-05"]
COHORT_START = 7  # index of 2018-01
SEED = 20180531

DEFAULTS = {
    "budget": 20000,
    "headroom": 2.0,
    "cpl": {"organic_search": 40, "paid_search": 60, "social": 25, "email": 15,
            "referral": 50, "display": 30},
    "revenue": 80,
    "margin": 0.65,
    "step": 100,
}


# ---------------- data ----------------
def load(d):
    m = pd.read_csv(os.path.join(d, "olist_marketing_qualified_leads_dataset.csv"))
    c = pd.read_csv(os.path.join(d, "olist_closed_deals_dataset.csv"))
    x = m.merge(c[["mql_id", "declared_monthly_revenue", "won_date"]], on="mql_id", how="left")
    x["origin"] = x["origin"].fillna("(blank)")
    x["won"] = x["won_date"].notna().astype(int)
    x["mo"] = x["first_contact_date"].str[:7]
    assert set(x["origin"]) <= set(ORIGINS), set(x["origin"]) - set(ORIGINS)
    assert set(x["mo"]) <= set(MONTHS)
    print("closed deals first won_date:", c.won_date.min(), " last:", c.won_date.max())
    rows = {
        "o": [ORIGINS.index(v) for v in x["origin"]],
        "w": [int(v) for v in x["won"]],
        "m": [MONTHS.index(v) for v in x["mo"]],
        # declared monthly revenue, BRL, on won rows; -1 on rows that never closed
        "v": [(-1 if not w else int(round(r))) for w, r in zip(x["won"], x["declared_monthly_revenue"].fillna(0))],
    }
    return {"origins": ORIGINS, "spend": SPEND, "months": MONTHS, "cohortStart": COHORT_START,
            "n": len(x), **rows}


# ---------------- engine (mirror of funnel-live.js) ----------------
def imul(a, b):
    return ((a & 0xFFFFFFFF) * (b & 0xFFFFFFFF)) & 0xFFFFFFFF


def mulberry32(seed):
    state = [seed & 0xFFFFFFFF]

    def nxt():
        state[0] = (state[0] + 0x6D2B79F5) & 0xFFFFFFFF
        t = state[0]
        t = imul(t ^ (t >> 15), t | 1)
        t ^= (t + imul(t ^ (t >> 7), t | 61)) & 0xFFFFFFFF
        t &= 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return nxt


def cohort_idx(D, cohort):
    lo = D["cohortStart"] if cohort == "2018" else 0
    return [i for i in range(D["n"]) if D["m"][i] >= lo]


def shuffled_won(D, idx, seed):
    w = [D["w"][i] for i in idx]
    rnd = mulberry32(seed)
    for i in range(len(w) - 1, 0, -1):
        j = math.floor(rnd() * (i + 1))
        w[i], w[j] = w[j], w[i]
    return w


def wilson(k, n):
    if n == 0:
        return [0.0, 0.0]
    z = 1.96
    p = k / n
    den = 1 + z * z / n
    mid = (p + z * z / (2 * n)) / den
    half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / den
    return [max(0.0, mid - half), min(1.0, mid + half)]


def median(a):
    b = sorted(a)
    m = len(b) >> 1
    if not b:
        return None
    return b[m] if len(b) % 2 else (b[m - 1] + b[m]) / 2


def tally(D, cohort="2018", shuffle=False):
    idx = cohort_idx(D, cohort)
    won = shuffled_won(D, idx, SEED) if shuffle else [D["w"][i] for i in idx]
    months = len(D["months"]) - (D["cohortStart"] if cohort == "2018" else 0)
    out = {}
    for name in D["origins"]:
        out[name] = {"n": 0, "deals": 0, "declared": []}
    for pos, i in enumerate(idx):
        s = out[D["origins"][D["o"][i]]]
        s["n"] += 1
        if won[pos]:
            s["deals"] += 1
            # declared revenue stays with the ROW; under the shuffle it is not moved
            if not shuffle and D["v"][i] > 0:
                s["declared"].append(D["v"][i])
    tot_n = tot_k = 0
    for name, s in out.items():
        tot_n += s["n"]
        tot_k += s["deals"]
        s["rate"] = s["deals"] / s["n"] if s["n"] else 0.0
        s["ci"] = wilson(s["deals"], s["n"])
        s["perMonth"] = s["n"] / months
        s["declaredN"] = len(s["declared"])
        s["declaredMedian"] = median(s["declared"])
        del s["declared"]
    return {"by": out, "n": tot_n, "deals": tot_k, "rate": tot_k / tot_n, "months": months}


def leads_for(spend, cpl, cap):
    if spend <= 0 or cap <= 0:
        return 0.0
    return cap * (1 - math.exp(-spend / (cpl * cap)))


def evaluate(T, split, A):
    """split: dict channel -> weight (any scale). Normalised to the budget."""
    tot_w = sum(max(0.0, split.get(c, 0)) for c in SPEND)
    per = {}
    leads = deals = 0.0
    for c in SPEND:
        s = A["budget"] * (max(0.0, split.get(c, 0)) / tot_w) if tot_w > 0 else 0.0
        cap = A["headroom"] * T["by"][c]["perMonth"]
        L = leads_for(s, A["cpl"][c], cap)
        k = L * T["by"][c]["rate"]
        per[c] = {"spend": s, "leads": L, "deals": k}
        leads += L
        deals += k
    cac = A["budget"] / deals if deals > 0 else float("inf")
    gp = A["revenue"] * A["margin"]
    payback = cac / gp if gp > 0 else float("inf")
    return {"per": per, "leads": leads, "deals": deals, "cac": cac, "payback": payback}


def best_split(T, A):
    alloc = {c: 0.0 for c in SPEND}
    steps = int(A["budget"] // A["step"])
    caps = {c: A["headroom"] * T["by"][c]["perMonth"] for c in SPEND}
    for _ in range(steps):
        best, gain = None, -1.0
        for c in SPEND:
            g = (leads_for(alloc[c] + A["step"], A["cpl"][c], caps[c]) -
                 leads_for(alloc[c], A["cpl"][c], caps[c])) * T["by"][c]["rate"]
            if g > gain:
                best, gain = c, g
        alloc[best] += A["step"]
    return alloc


def presets(T, A):
    return {
        "even": {c: 1 for c in SPEND},
        "leads": {c: T["by"][c]["n"] for c in SPEND},
        "cheap": {c: 1 / A["cpl"][c] for c in SPEND},
        "deals": {c: T["by"][c]["deals"] for c in SPEND},
        "best": best_split(T, A),
    }


def r(x, d):
    # canon is compared raw against node; rounding happens only when a page prints it
    return x


def canon(D):
    out = {}
    for cohort in ("2018", "all"):
        for shuffle in (False, True):
            T = tally(D, cohort, shuffle)
            P = presets(T, DEFAULTS)
            key = cohort + ("-shuffled" if shuffle else "")
            out[key] = {
                "n": T["n"], "deals": T["deals"], "rate": r(T["rate"], 4),
                "channels": {c: [T["by"][c]["n"], T["by"][c]["deals"], r(T["by"][c]["rate"], 4),
                                 r(T["by"][c]["ci"][0], 4), r(T["by"][c]["ci"][1], 4),
                                 T["by"][c]["declaredN"], T["by"][c]["declaredMedian"]]
                             for c in ORIGINS},
                "ladder": {k: [r(e["leads"], 1), r(e["deals"], 1), r(e["cac"], 0), r(e["payback"], 1)]
                           for k, e in ((k, evaluate(T, w, DEFAULTS)) for k, w in P.items())},
                "bestSplit": {c: int(P["best"][c]) for c in SPEND},
            }
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if args:
        d = args[0]
    else:
        import kagglehub
        d = kagglehub.dataset_download("olistbr/marketing-funnel-olist")
    D = load(d)
    if "--write-sample" in sys.argv:
        here = os.path.dirname(os.path.abspath(__file__))
        dst = os.path.join(here, "..", "assets", "funnel-sample.js")
        with open(dst, "w") as f:
            f.write("/* funnel-sample.js - all 8,000 real MQLs of the public Marketing Funnel by Olist dataset\n"
                    " * (CC BY-NC-SA 4.0). Generated by materials/build-olist-funnel.py with json.dumps.\n"
                    " * o = origin index, w = closed as a seller (1/0), m = first-contact month index,\n"
                    " * v = declared monthly revenue in BRL on closed rows (-1 = never closed). */\n")
            f.write("window.FUNNEL_DATA = " + json.dumps(D, separators=(",", ":")) + ";\n")
        print("wrote", dst, os.path.getsize(dst), "bytes")
    C = canon(D)
    print(json.dumps(C, sort_keys=True))


if __name__ == "__main__":
    main()
