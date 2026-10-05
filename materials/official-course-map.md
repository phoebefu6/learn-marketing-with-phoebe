# learn-marketing-with-phoebe - official course map (source map)

Internal build document. Never linked from an audience page.

**Course:** Marketing. Landing title "Learn Marketing with Phoebe". Bucket `biz`, difficulty 2, audience
both (org teams and personal followers), icon 📣, single-track 6 sessions x 45 min, by Phoebe Fu.
**Scope:** marketing fundamentals and the decisions behind them. No AI tooling.
**Donor:** learn-rfm-modeling-with-phoebe (assets, page anatomy, quiz markup with 4 options).
**Palette:** megaphone magenta. `--indigo #C41CB4`, deep `#6E0F66`, mid `#A3179A`, soft `#F2C2EC`,
50 `#FCEFFA`, ink `#2B0F28`, muted `#6A4A65`, faint `#E6CFE2`, hairline `#F2E3EF`, warm ochre
`--amber #9C5700`, amber-ink `#6A3B00`, amber-50 `#FDF2DE`, paper `#FFFCFE`. Min CIE76 Delta-E 21.8 and
CIEDE2000 12.3 from every one of the 118 distinct `--indigo` values in github_repo/learn-*/assets/style.css
(nearest #8957A2, #9333EA, #86198F), and from the coral/rose family left to learn-personal-branding.
Every text-on-fill pair checked before authoring: white on #C41CB4 5.03, white on deep 10.92, white on
mid 6.67, ink on soft 11.40, white on amber 5.56, amber-ink on amber-50 8.46, #C41CB4 on 50-tint 4.52,
muted on white 7.55. Never draw #C41CB4 text on the soft fill (3.28). Light surfaces only: the cheat
sheet and lightbox scrim were changed from the donor's dark ink to light washes.

## The running case: Cadence (constructed)

Cadence is the fictional AI note-taker already used as the running project by
`learn-ai-marketing-with-phoebe` (launch campaign) and `learn-ai-branding-with-phoebe` (brand
foundation). Note for the record: the build brief said finance and economics use Cadence; they do not
(finance runs on the fictional Marchmont Instruments, economics on Olist), so the facts below are kept
consistent with the two courses that actually own Cadence.

Facts fixed by the siblings, never contradicted here:
- AI note-taker SaaS, two motions: solo professional (self-serve, free signup) and team lead (B2B,
  Teams plan, Teams-plan trials). "Cadence has two ICPs" (ai-marketing b2).
- Personality "calm, capable" (ai-branding b5); brand palette deep pink and cream (ai-marketing b8).
- ai-marketing b9 supplies a 14-day campaign table (blog/SEO 6,400 visits and 512 free signups; paid
  $3,000, 1,900 clicks, 141 free signups; email 4,200 sent, 34 Teams trials; social 22,000 impressions,
  48 free signups). Not reused here; nothing here contradicts it.

Constructed for this course (labelled "constructed" on every page that uses them):
- Teams plan $15 per seat per month; a typical Teams account 8 seats, so $120 a month per account.
- Gross margin 75%, monthly logo churn 2.5% on Teams accounts.
- Session 5 maths: monthly gross profit per account $90; LTV (Skok form: ARPA x gross margin / churn)
  $120 x 0.75 / 0.025 = $3,600; blended Teams CAC $1,800; payback 1,800 / 90 = 20 months; LTV:CAC 2.0.
- Session 1 segments (constructed): solo consultants, agency account leads, in-house research teams,
  sales teams, legal/compliance teams. Beachhead chosen in session 1: user-research teams of 5 to 15
  at software companies (they already record interviews, share notes, and talk to each other).
- Session 3 Bullseye outcome (constructed): Targeting Blogs (sponsor two research newsletters) PASSES and
  becomes the centre; Community Building (research Slack) FAILS; Speaking Engagements (one research
  conference talk) INCONCLUSIVE on too few leads.
- Session 6 plan (constructed): $6,000 a month for 90 days ($4,500 newsletters, $1,500 talk test);
  guardrail $1,080 (12 x $90, the stricter of payback-12 $1,080 and ratio-3 $1,200); stop on day 90 if
  10+ Teams accounts and blended CAC over $1,440 (16 months); fewer than 10, extend once.
- Session 2 competitive alternatives for that beachhead: a shared doc typed live by a teammate;
  recording and rewatching; a general meeting-bot note-taker; doing nothing.

## The bench data: Marketing Funnel by Olist (real rows)

Route: `kagglehub.dataset_download("olistbr/marketing-funnel-olist")`, no login. Licence CC BY-NC-SA 4.0.
Kaggle description (read at source via the Kaggle API JSON): "Marketing funnel dataset from sellers that
filled-in requests of contact to sell their products on Olist Store." Period: contact requested between
Jun 1st 2017 and Jun 1st 2018. 8,000 MQLs. Joins to the Brazilian E-Commerce dataset by `seller_id`.
The Kaggle page gives no explicit MQL definition and no field descriptions for `origin` or
`declared_monthly_revenue` (could not verify); the page says only what the data shows.

Measured in this build (materials/build-olist-funnel.py, all rows, not a draw):
- 8,000 MQLs, 842 closed deals (10.5%). 60 MQLs have a blank origin.
- Closed-deal records begin 2017-12-05 and end 2018-11-14. Leads from 2017 close at 0 to 5.0 percent
  by channel (2,002 leads, 61 deals, 3.0% overall; = all-months totals minus the 2018 cohort) against 13.0 for 2018: the deal log started late, not the leads got worse. The bench
  therefore defaults to the Jan-May 2018 cohort: **5,998 MQLs, 781 deals, 13.0%**.
- Declared monthly revenue: **797 of 842 closed deals declare 0**; 45 declare a positive figure, from 6
  to 50,000,000 (BRL). The median of all closed deals is 0. The column cannot carry a per-channel
  revenue; the bench uses one stated revenue assumption instead and says why.
- `assets/funnel-sample.js` 74,828 bytes, json.dumps, all 8,000 rows.

2018 cohort by origin (leads, deals, close rate, 95% Wilson interval, declared non-zero):

| Origin | Leads | Deals | Rate | 95% range | Declared |
|---|---|---|---|---|---|
| organic_search | 1,736 | 255 | 14.7% | 13.1 to 16.4 | 12 |
| paid_search | 1,182 | 175 | 14.8% | 12.9 to 16.9 | 13 |
| social | 1,051 | 66 | 6.3% | 5.0 to 7.9 | 2 |
| email | 347 | 14 | 4.0% | 2.4 to 6.7 | 1 |
| referral | 211 | 24 | 11.4% | 7.8 to 16.4 | 0 |
| display | 75 | 5 | 6.7% | 2.9 to 14.7 | 0 |
| unknown | 813 | 168 | 20.7% | 18.0 to 23.6 | 3 |
| direct_traffic | 380 | 54 | 14.2% | 11.1 to 18.1 | 1 |
| other | 114 | 4 | 3.5% | 1.4 to 8.7 | 0 |
| other_publicities | 41 | 3 | 7.3% | 2.5 to 19.4 | 0 |
| (blank) | 48 | 13 | 27.1% | 16.6 to 41.0 | 1 |

Social is 17.5% of the 2018 leads (1,051 of 5,998) and 8.5% of the deals (66 of 781). The "unknown"
origin is the best-converting large group (20.7%): untracked leads are not bad leads.

### Bench assumptions (constructed, editable, defaults printed on the widget)

Budget $20,000 a month. Cost per lead: organic $40, paid $60, social $25, email $15, referral $50,
display $30. Headroom 2x the channel's real monthly MQL run rate (cohort months = 5). Response
leads(s) = cap x (1 - exp(-s / (CPL x cap))). Revenue per new seller $80 a month, gross margin 65%, so
$52 of monthly gross profit; payback months = CAC / 52. Small-sample flag below 30 deals.

### Bench canon (python and node agree on all 424 values, tolerance 1e-9)

2018 cohort, default assumptions. Widget prints CAC as whole dollars, payback to one decimal.

| Preset | Leads | Deals | CAC | Payback (months) | vs best |
|---|---|---|---|---|---|
| Even split | 431.4 | 38.1 | $524 | 10.1 | 42.5% above |
| Spend where the most leads come from (ANTI) | 488.8 | 50.5 | $396 | 7.6 | 7.5% above |
| Cheapest leads first (ANTI) | 412.1 | 31.9 | $627 | 12.1 | 70.4% above |
| Spend where the deals come from | 436.9 | 52.7 | $380 | 7.3 | 3.1% above |
| Next dollar to the next best deal (best) | 419.9 | 54.3 | $368 | 7.1 | - |

Best split: organic $14,400, paid $3,500, social $1,500, email $400, referral $200, display $0.

**Anti-lever verdict (what the data shows):** "most leads" buys the MOST leads (488.8) and still fewer
deals (50.5 vs 52.7), so its CAC is $396 against $380, 4.3% worse than the deals-weighted split. The
gap is real but modest, because the two biggest lead sources (organic, paid) are also the two best
closers; the damage is concentrated in social (17.5% of leads, 8.5% of deals). The big trap on this data
is "cheapest leads first": $627, 70.4% above best. Teach both, and do not overstate the first.

Break button (shuffle closed flags across the cohort, mulberry32 seed 20180531): every channel moves
toward 13.0% (social 6.3% to 13.3%, email 4.0% to 10.7%). Leads-weighted and deals-weighted then tie at
$316 (payback 6.1), so the advantage of conversion weighting disappears exactly when conversion
information is destroyed. Best under shuffle $292.

All 12 months (checkbox): even $742, leads $542, cheap $907, deals $519, best $516. Every CAC rises
because 2017 leads look unclosed; the ordering survives.

Other measured facts quoted on pages (842 closed deals): business segment top four home_decor 105,
health_beauty 93, car_accessories 77, household_utilities 71; lead_type online_medium 332, online_big 126,
industry 123, offline 104, online_small 77, online_beginner 57, online_top 14; has_company blank 779,
declared_product_catalog_size blank 773.

## Sessions and coverage

| # | File | Title | Covers | Depth |
|---|---|---|---|---|
| 1 | 01-who-it-is-for.html | Who it is for, and who it is not | segments, beachhead (Moore, Aulet), ICP, Cadence segment scoring | ✓ |
| 2 | 02-the-promise.html | The promise, against the real alternative | Dunford's positioning and five components, competitive alternatives first, the category frame | ✓ |
| 3 | 03-where-they-already-are.html | Where they already are | channel choice, Traction's Bullseye, 19 channels, cheap tests, real Olist channel mix | ✓ |
| 4 | 04-the-funnel-bench.html | The funnel bench | MQL to deal, close rate with its range, CAC, the anti-lever, the break button | ✓ |
| 5 | 05-what-a-customer-is-worth.html | What a customer is worth | CAC, payback, LTV, LTV:CAC; Skok's wording; Cadence maths | ✓ |
| 6 | 06-the-one-page-plan.html | The one-page marketing plan | assembling 1-5 on one page; Dib's nine squares as one template; brand vs activation disagreement | ✓ |

## Verified facts and tiers

Tiers: **read at source** (the author's own published page, fetched in this build; fetch tools return
summaries, so short quotes are kept short and should be re-checked against the book before print),
**reported** (second-hand only), **could not verify**.

### Session 1 - segments, beachhead, ICP
- Aulet, MIT Executive Education page (read at source): a beachhead market is "the place where, once you
  gain a dominant market share, you will have the strength to attack adjacent markets". Three conditions
  of a market: customers "all buy similar products"; "have a similar sales cycle and expect products to
  provide value in similar ways"; "Word of mouth communication exists between customers in the market".
  https://executive.mit.edu/launching-a-successful-start-up-3-the-beachhead-market-MC7FUMDZ6IU5AIPP4WGIPN2PZJI4.html
- MIT Sloan on Disciplined Entrepreneurship (read at source): beachhead "Select one market segment where
  you feel you have the highest odds of success"; persona from "one actual real end user".
  https://mitsloan.mit.edu/ideas-made-to-matter/disciplined-entrepreneurship-6-questions-startup-success
- Aulet's seven selection questions: could not verify. Not stated.
- Moore, Crossing the Chasm (1991; 3rd ed. 2014): the D-Day / Normandy beachhead analogy and the
  bowling-alley sequence are **reported** (no primary page read). Teach the idea, attribute it, no quote.
- ICP: no canonical primary definition exists; it is practitioner vocabulary. Gartner Digital Markets'
  firmographic/behavioural definition is **reported** (page 403). Teach ICP as a working tool, say so.

### Session 2 - positioning (April Dunford)
- Definition (read at source, aprildunford.com home): "Positioning defines how our product is different
  and better than alternatives for a particular set of customers." Her other pages word it differently;
  cite this one.
- Five components, her site's order (read at source, quickstart guide on Substack and blog):
  competitive alternatives, key unique attributes, value, target customers, market category. Labels vary
  by page; the book's labels and the "trend" layer are reported.
  https://aprildunford.substack.com/p/a-quickstart-guide-to-positioning
- Starting question (read at source, aprildunford.com/post/positioning-and-competition): "What would a
  customer do if your offering didn't exist?"
- Obviously Awesome (2019) teaches "How to break positioning down into five component pieces" (her books
  page, read at source). The 10 step names are reported (Heinz Marketing summary); not quoted.
- Sales Pitch (2023): could not verify any claim that it changed the framework; not claimed.
- Overlap with sibling: learn-ai-branding b2 teaches a positioning STATEMENT for the brand ("For [audience]
  who [moment], Cadence is the [category] that..."). Here: the decision underneath it, from
  alternatives; link the sibling for the brand work.

### Session 3 - channels (Traction)
- Weinberg's own posts, read at source via a mirror of his Medium (readmedium.com):
  rings named "The Outer Ring: What's Possible", "The Middle Ring: What's Probable", "The Inner Ring:
  What's Working"; "For each traction channel in your middle ring, now construct a cheap traction test";
  "a rough idea of a channel's effectiveness with at most a thousand dollars and a month of time".
  The 19 channels, his order: Targeting Blogs, Publicity, Unconventional PR, Search Engine Marketing,
  Social and Display Ads, Offline Ads, Search Engine Optimization, Content Marketing, Email Marketing,
  Viral Marketing, Engineering as Marketing, Business Development, Sales, Affiliate Programs, Existing
  Platforms, Trade Shows, Offline Events, Speaking Engagements, Community Building.
  https://readmedium.com/the-bullseye-framework-for-getting-traction-ef49d05bfd7e and
  https://readmedium.com/the-19-channels-you-can-use-to-get-traction-93c762d19339
- The "50% of time on traction" rule: reported only (book reports); not quoted.
- "Rule of 7" touchpoints: folklore. No primary study; 1859 "sixth time" and 1885 "20 exposures" items
  are reported via a blog (successfulsoftware.net, 2010). Taught as unsupported.
- Olist channel mix (measured, table above).

### Session 4 - the bench
- All figures in the canon above, measured or constructed as labelled.

### Session 5 - customer worth
- David Skok, "SaaS Metrics 2.0" (read at source, forentrepreneurs.com/saas-metrics-2/): "The best SaaS
  businesses have a LTV to CAC ratio that is higher than 3, sometimes as high as 7 or 8." "Many of the
  best SaaS businesses are able to recover their CAC in 5-7 months." Profitability "is anemic if the
  time to recover CAC extends beyond 12 months". 12 months is his ceiling, not his target; never write
  "Skok says payback under 12 months".
- learn-customer-retention s1 already quotes "3:1 is the classic healthy benchmark (Skok)": consistent
  with "higher than 3"; no contradiction.
- learn-finance-with-phoebe does NOT teach CAC or LTV (its map: "Not taught"). It owns gross margin,
  cash and the three statements; session 5 links it for margin and cash timing only, and links
  learn-customer-retention for retention's effect on LTV.

### Session 6 - the plan
- Allan Dib, The 1-Page Marketing Plan (2016): nine squares in three phases, before (target market,
  message, media), during (lead capture, lead nurture, sales conversion), after (world-class experience,
  lifetime value, referrals). Read at source on leanmarketing.com as a paraphrased list: tier
  reported-for-exact-labels. Use as one template, not "the" plan.
- Binet and Field, The Long and the Short of It (IPA, 2013): about 60% brand-building, 40% activation,
  from the IPA Databank, 996 award-entry campaigns 1980 to 2010 (reported via Alex Murrell's summary). B2B follow-up for the LinkedIn
  B2B Institute (2019): summaries disagree, 46/54 vs about 50/50, both reported. Teach the disagreement
  and the award-entry selection limit.

### Famous claims (traced; grep of github_repo/learn-*/courses found none in use)
- "Quarter-inch hole": not Levitt's. Quote Investigator credits Leo McGivena; earliest strong match a 1942
  insurance advert; Levitt credited McGivena in The Marketing Mode (1969); Christensen's 2005 HBR article
  helped the misattribution. Tier: read at source for QI's account.
  https://quoteinvestigator.com/2019/03/23/drill/
- "Half the money I spend on advertising is wasted": attribution uncertain. Earliest Wanamaker-linked
  evidence 1919 (second-hand); Leverhulme-linked 1931 (second-hand, his son); Ogilvy 1963 credited both.
  Say "attributed to". https://quoteinvestigator.com/2022/04/11/advertising/ (seam: attribution is the
  sibling course's subject; mention, link.)
- "Rule of 7": no evidence (above).

## Seams (link, never teach)

| Topic | Owner |
|---|---|
| AI for content, SEO, ads, email, social | https://phoebefu6.github.io/learn-ai-marketing-with-phoebe/ |
| Company brand positioning, naming, identity | https://phoebefu6.github.io/learn-ai-branding-with-phoebe/ |
| Attribution, channel credit, MMM | https://phoebefu6.github.io/learn-marketing-attribution-with-phoebe/ |
| Pricing, elasticity | https://phoebefu6.github.io/learn-economics-with-phoebe/ |
| Experiments, A/B tests | https://phoebefu6.github.io/learn-experimentation-with-phoebe/ |
| Personal brand | https://phoebefu6.github.io/learn-personal-branding-with-phoebe/ (built in parallel) |
| Margin, cash, the three statements | https://phoebefu6.github.io/learn-finance-with-phoebe/ |
| Retention and its effect on LTV | https://phoebefu6.github.io/learn-customer-retention-with-phoebe/ |

## Not covered (honest list)

- Any AI tool or prompt (ai-marketing owns it).
- Attribution models and channel credit (attribution course). The bench takes each lead's recorded
  origin at face value and says so.
- Pricing (economics), brand identity and naming (ai-branding), experiment design (experimentation).
- Consumer brand-building and media planning in depth (reach, frequency, mental availability); named
  once in session 6 as a disagreement, not taught.
- Sales process beyond the MQL-to-deal handoff.
- Book texts not opened in this build: Obviously Awesome, Traction, Crossing the Chasm, Disciplined
  Entrepreneurship, The 1-Page Marketing Plan. Each is cited from the author's own published pages or as
  reported.

## Citation appendix (exact form used on pages)

- April Dunford, aprildunford.com and "A Quickstart Guide to Positioning"; Obviously Awesome (2019).
- Gabriel Weinberg, "The Bullseye Framework for Getting Traction" and "The 19 channels you can use to get
  traction" (his Medium posts); Weinberg and Mares, Traction (2014, revised 2015).
- Bill Aulet, Disciplined Entrepreneurship (2013); MIT Executive Education, "The Beachhead Market".
- Geoffrey Moore, Crossing the Chasm (1991; 3rd ed. 2014) - reported.
- David Skok, "SaaS Metrics 2.0", forEntrepreneurs.
- Allan Dib, The 1-Page Marketing Plan (2016) - reported labels.
- Les Binet and Peter Field, The Long and the Short of It (IPA, 2013) - reported.
- Quote Investigator, "drill" (2019) and "advertising" (2022).
- Olist, "Marketing Funnel by Olist", Kaggle, CC BY-NC-SA 4.0.
