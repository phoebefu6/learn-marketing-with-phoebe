# Agent brief - shared by every fan-out page of learn-marketing-with-phoebe

Filled from course-builder/references/agent-brief.template.md on 2026-10-05. Internal build document.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page. Copy its structure, classes, SVG grammar and quiz markup EXACTLY, including
   how many options each question has (FOUR, A to D):
   `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-marketing-with-phoebe/courses/01-who-it-is-for.html`
   For rhythm on a numbers-heavy page also skim
   `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-marketing-with-phoebe/courses/04-the-funnel-bench.html`
2. The source map: every verified number, its evidence tier, per-session coverage, the seams. Use
   ONLY its numbers; never invent a statistic; if a fact is missing, teach the uncertainty.
   `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-marketing-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block for the palette tokens (first 30 lines only):
   `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-marketing-with-phoebe/assets/style.css`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY "learn-marketing-with-phoebe / Session N of 6", linked like the template,
#toggle-all, #zoom-toggle) · masthead (eyebrow "Learn Marketing with Phoebe · Session N of 6", h1
with one `<span class="accent">`, .sub, .chip-row with the level chip given in your outline, two
.chip.audience, .chip.time "45 min", .agenda a1-a4 with flex weights) · main.wrap ·
section#intro (Part 0: kicker, .lede, .legend pills copied from the template, .callout.win
"★ What you walk out with tonight.") · 3 Parts, each `section.section#part-N` with section-kicker
(klabel "Part N · covers ...", h2, `.tag.concept "N min live"`), a `.lede`, ONE figure,
`details.card` accordions (summary: `.mode.live` or `.mode.self`, title, `.mini`, `.caret ▶`),
and a `.callout.example` with `span.ex-pill` "Real world" per Part · section#demo-1 Build-along
(kicker klabel "Build-along", `.tag.demo "★ 22 min · everyone builds"`, .lede, ONE figure,
`.steps > .step`, each a `p` then a `.prompt-box.good` carrying a `span.label` "★ Step N · ...";
no code, these are sheets, templates and worked numbers) · section#exercise Homework (ol, 4 items,
klabel "Homework", h2 "Before session N+1", `.tag.exercise "30 min"`) · section#quiz (copy the
template: 3 x `.quiz-q data-answer="0-based"`, `p.qtext`, FOUR `button.qopt` "A · ...", `p.qwhy`;
one `p.quiz-score` after the last; vary which letter is correct) · section#official, h2 EXACTLY
"What this session teaches, and where it came from", `.covered > .covered-row` (pill solid ✓ /
light ◐ + name + note), then the `.mono` line EXACTLY "Every fact on this page, and its
verification tier, is recorded in the course's source map." · section.cheat#cheatsheet (h3
"Session N cheat sheet <span>· pin this</span>", .grid-2 of six .cheat-item) · `.callout.next`
with `.nx-pill` "Next session" · footer.pagefoot · `<script src="../assets/app.js?v=1"></script>`.

Head: the template's social meta block with this page's own title/description/url (og:url
https://phoebefu6.github.io/learn-marketing-with-phoebe/courses/<file>);
`<title>Session N · <Title> - learn marketing with phoebe</title>`;
`<link rel="stylesheet" href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines
is guidance about depth, never a target: never collapse whitespace, dissolve a list into a
paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only. Hyphens
  in ranges ("5-7 months" inside Skok's quote, "0-3 · Welcome") are fine.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "session 5" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or is labelled constructed. For constructed data say
  "constructed" on the page (in the figure heading or aria-label and in prose).
- Contested or missing evidence: teach the disagreement; never resolve what the literature has not.
- Quotes: only the exact short quotes the map marks "read at source", in double quotes, attributed.
  Anything the map marks reported is paraphrased and labelled "reported" or "as widely
  summarised"; never put reported text in quotation marks.
- NEVER "lottery" or "lotteries"; say the mechanism.
- Default to the English word. No Chinese terms needed on these pages.
- No AI tools, prompts or AI workflows anywhere: marketing fundamentals only. AI is the seam to
  learn-ai-marketing-with-phoebe.
- Never the bullet glyph ✗ in prose lists; ✗/✓ only inside a figure's before-after headings or a
  pass/fail cell.
- Titles, widget ids and class names must not collide with siblings. Banned titles: "Positioning &
  brand strategy", "Positioning & messaging", "Your product on one page", "The roadmap on one
  page". Do not use ids or classes starting `fb-` (the bench owns them) or `m1`/`m4` (pages 1 and 4
  own those figure prefixes).
- Light surfaces only: no dark fills behind text anywhere you add.

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): ink #2B0F28 · muted #6A4A65 · accent #C41CB4 ·
accent-deep #6E0F66 · mid #A3179A · soft #F2C2EC · 50-tint #FCEFFA · faint #E6CFE2 · hairline
#F2E3EF · contrast ochre #9C5700 · ochre-ink #6A3B00 · ochre-50 #FDF2DE · `#FFFFFF` · universal
reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a wrong-way panel.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="the data, not the
  shape">` > `<defs>` + `<style>` + content, then `<figcaption>🔍 Click to zoom - takeaway</figcaption>`.
  Grow H, never W.
- Prefix unique per figure, used for every class and id: `m<session><letter>` (session 2 uses m2a,
  m2b, m2c, m2d; session 3 m3a...; session 5 m5a...; session 6 m6a...).
- `<defs>` holds three things with the figure prefix P: a wobble filter `id="PSk"`
  (`feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="<int>"` +
  `feDisplacementMap scale="2.4" xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%"
  width="106%" height="106%"`), a hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one
  #C41CB4 line, opacity .5), an open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, ink
  stroke 1.6). ALL shapes sit inside ONE `<g filter="url(#PSk)" fill="none" stroke="#2B0F28"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`; rects carry a tiny rotation (-4
  to 4 degrees for hand-placed items, under 1 for panels). Fills: white, #FCEFFA, the hachure for
  "the pile" or "the data", and the ochre #9C5700 ONLY for the one thing the figure is about (white
  text on it). One doodle anchor per figure, simple strokes, never a mascot. Text classes: `.PH`
  800 12px ink heading · `.PL` 600 12px ink label · `.PS` 400 11px #6A4A65 · `.PB` 800 11px #6A3B00
  · `.PV` 800 16-20px #6E0F66 value · `.PW` 800 12px white on a fill · `.PA` 700 11px #A3179A axis
  caption · `.PN` 400 12px #6A4A65 note. Hand-stacked items must not overlap as painted rects.
- ALL `<text>` outside the filtered group, sans stack, never below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; full-width note under 110
  chars; 40px between neighbouring point labels; bottom note 22px below the last row, H clears it by
  8px. When in doubt, shorten. NO line, curve, arrow or gridline may pass through any text label
  (the gate flags line-through-text): put edge labels beside a line, never on it.
- Floor: one figure per Part plus one in the build-along. Draw the MECHANISM, never a metaphor
  literally, never decoration.

## Voice and honesty

Every Part gets a real-world story from the map's cases (Olist measured facts, Dunford/Weinberg/
Skok as read at source, the traced famous claims). Constructed cases say "constructed" on the page:
Cadence, its segments, alternatives, prices, CAC, churn, tests. The Cadence beachhead (from
session 1): user-research teams of 5 to 15 at software firms; buyer research lead; trigger new head
of research or a new shared research repository; not for regulated legal teams, solo freelancers,
on-premise-only buyers. Two motions: solo self-serve and Teams.

## Cross-links (absolute URLs)

- AI for content/SEO/ads/email/social: https://phoebefu6.github.io/learn-ai-marketing-with-phoebe/
- Brand positioning statement, naming, identity: https://phoebefu6.github.io/learn-ai-branding-with-phoebe/ (its b2 page: https://phoebefu6.github.io/learn-ai-branding-with-phoebe/courses/b2-positioning-strategy.html)
- Attribution, channel credit, MMM: https://phoebefu6.github.io/learn-marketing-attribution-with-phoebe/
- Pricing, elasticity: https://phoebefu6.github.io/learn-economics-with-phoebe/
- Experiments: https://phoebefu6.github.io/learn-experimentation-with-phoebe/
- Personal brand: https://phoebefu6.github.io/learn-personal-branding-with-phoebe/
- Margin, cash: https://phoebefu6.github.io/learn-finance-with-phoebe/
- Retention and LTV: https://phoebefu6.github.io/learn-customer-retention-with-phoebe/
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chain and session titles

Footer left: "Session N of 6 · learn-marketing-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>"
Footer right: "<a href="prev.html">← Prev: <title></a> &nbsp;·&nbsp; <a href="next.html">Next: <title> →</a>" (last page: "← Prev" and "<a href="../index.html">Course home →</a>").

Session titles and files (exact; sentence case; one accent span in h1):
1. 01-who-it-is-for.html · Who it is for, and who it is not
2. 02-the-promise.html · The promise, against the real alternative
3. 03-where-they-already-are.html · Where they already are
4. 04-the-funnel-bench.html · The funnel bench
5. 05-what-a-customer-is-worth.html · What a customer is worth
6. 06-the-one-page-plan.html · The one-page marketing plan
