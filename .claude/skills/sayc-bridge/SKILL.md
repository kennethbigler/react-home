---
name: sayc-bridge
description: >-
  Comprehensive reference for the Standard American Yellow Card (SAYC) contract
  bridge bidding system, including hand evaluation, all opening bids, responses,
  rebids, slam bidding, competitive auctions, conventions (Stayman, transfers,
  Blackwood/RKC, Jacoby 2NT, Michaels, unusual 2NT, negative doubles, Bergen,
  splinters, and more), defense to opponents' conventions, and opening leads
  and signals. Use this skill WHENEVER the user asks anything about bridge
  bidding, what to bid with a given hand, what a bid or auction "means", how a
  convention works, opening leads, defensive signals, hand evaluation / point
  count, or anything related to a bridge bidding app, convention card, or SAYC.
  Trigger even if the user does not say "SAYC" explicitly — any contract-bridge
  bidding, auction, or convention question should consult this skill rather than
  answering from memory or searching the web.
---

# SAYC Bridge Bidding

This skill is a comprehensive, structured reference for the **Standard American
Yellow Card (SAYC)** bidding system plus the popular and expert extensions most
players pair with it. It exists so you can answer bridge bidding questions
**accurately and without re-searching the web**. Treat the `references/` files
as authoritative for this domain.

## How to use this skill

1. Identify what kind of question it is (opening? response? competitive? slam?
   convention? lead?) and open the matching reference file below. Each file is
   self-contained and has a table of contents at the top.
2. For a fast bid→meaning lookup or to reason programmatically (e.g. inside a
   bidding app), use `references/bid-tables.md`, which holds the same
   information in compact, grep-friendly structured tables.
3. State the **SAYC default** clearly. Where a treatment has competing popular
   variants (weak-2 ranges, forcing vs semi-forcing NT, Blackwood vs RKC 1430
   vs 0314), name the default and briefly note the major alternative so you can
   adapt to a different convention card.
4. Always show your reasoning in terms of **HCP + distribution, fit, and the
   captaincy/forcing status of the auction** — that is how bridge experts
   actually decide, and it lets you handle hands the rote tables don't cover.

## Reference map

| File | Use it for |
|------|-----------|
| `references/hand-evaluation.md` | HCP, distribution points, Rule of 20/15/22, quick tricks, losing-trick count, re-evaluation after a fit |
| `references/opening-bids.md` | All opening bids: 1-of-a-suit, 1NT/2NT/3NT, strong 2♣, weak 2s, preempts, 3rd/4th seat openings, choosing between suits |
| `references/responses-1level-suit.md` | Responding to 1♣/1♦/1♥/1♠: raises, new suits, NT responses, forcing 1NT, limit/jump raises, Jacoby 2NT, splinters, Bergen raises |
| `references/responses-notrump.md` | Responding to 1NT/2NT/3NT: Stayman, Jacoby & Texas transfers, 4-suit transfers, Smolen, quantitative raises, Gerber |
| `references/rebids.md` | Opener's and responder's rebids, reverses, jump shifts, fourth-suit forcing, new minor forcing, sequences to game |
| `references/slam-bidding.md` | Blackwood, RKC Blackwood (1430 / 0314), Gerber, control/cue bids, Grand Slam Force, quantitative slam tries, when to drive slam |
| `references/competitive.md` | Overcalls, takeout/negative/responsive/support doubles, cuebid raises, Michaels, unusual 2NT, balancing, the Law of Total Tricks, penalty doubles |
| `references/defense-to-conventions.md` | Defending opponents' 1NT (Cappelletti, DONT), defending weak 2s and preempts, defending strong 2♣, Lebensohl |
| `references/more-conventions.md` | Additional/detailed conventions: Flannery, full Gerber & king-ask, Lebensohl contexts, Drury follow-ups, two-way NMF, control-bid sequences, GSF, splinter follow-ups, maximal doubles, DOPI/ROPI/DEPO |
| `references/leads-and-signals.md` | Standard opening leads, attitude/count/suit-preference signals, defensive and discard carding |
| `references/play-technique.md` | Post-auction play: planning, counting winners/losers, NT & suit declarer play, finesses, entries, safety plays, endplays, squeezes, defensive technique |
| `references/worked-auctions.md` | Full annotated bidding sequences (start-to-finish) across constructive, notrump, slam, competitive, and preemptive auctions — for pattern-matching real auctions |
| `references/bid-tables.md` | Compact structured lookup tables (bid → meaning, point ranges, suit lengths, forcing status) for fast retrieval and app logic |

## Core principles (always in scope)

These are the SAYC fundamentals you can rely on without opening a file. Anything
nuanced lives in the references.

- **High card points (HCP):** A=4, K=3, Q=2, J=1. 40 in the deck. An average
  hand is 10. See `hand-evaluation.md` for distribution points and adjustments.
- **Opening a hand:** Open most balanced 12–14 with a suit; reserve 15–17 for
  1NT. Open ~13+ HCP routinely; 11–12 with shape per the **Rule of 20** (HCP +
  two longest suits ≥ 20). Game-going values start around 25–26 combined HCP for
  3NT/4-of-a-major; slam around 33; grand slam around 37.
- **5-card majors:** Open 1♥/1♠ only with **5+** cards. With no 5-card major,
  open the longer minor; with 3–3 minors open 1♣, with 4–4 minors open 1♦.
- **Strong forcing opening:** **2♣** is the only strong, artificial, game-forcing
  opening (22+ HCP balanced, or ~9+ playing tricks). All other 2-level openings
  (2♦/2♥/2♠) are **weak** (preemptive, ~5–11 HCP, good 6-card suit).
- **1NT opening = 15–17 balanced.** 2NT = 20–21 balanced. 3NT = "gambling" (a
  solid 7-card minor) in SAYC.
- **Notrump priority:** Bid game in a known 8-card major fit over 3NT; otherwise
  prefer 3NT. Show majors before settling in notrump.
- **Captaincy:** When one partner's hand is narrowly defined (e.g. a 1NT opener,
  or a preemptor), the **other** partner becomes captain and places the
  contract. The defined hand obeys; it does not make further free decisions.
- **Forcing logic:** A new suit by an *unpassed responder* is forcing. A jump
  shift is strong/forcing. A reverse is forcing for one round and shows extra
  values. Raises and notrump rebids are limited (non-forcing) bids.

When a question goes beyond these basics — and most will — open the relevant
reference file and quote the specific treatment, ranges, and follow-up auctions.
