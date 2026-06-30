# Structured Bid Tables (SAYC) — fast lookup

Compact, grep-friendly tables of bid → meaning, ranges, lengths, and forcing
status. Each row is a discrete fact for quick retrieval and for app logic. Prose
explanations and edge cases live in the topical reference files; this file is the
index of facts. Notation: `M`=major, `m`=minor, `HCP`=high card points, `F`=
forcing, `NF`=non-forcing, `GF`=game-forcing, `INV`=invitational.

## 1. Hand-evaluation constants
| Key | Value |
|-----|-------|
| HCP A / K / Q / J | 4 / 3 / 2 / 1 |
| HCP in deck | 40 |
| Average hand | 10 HCP |
| Game (major/NT) combined | 25–26 HCP |
| Game (minor) combined | 28–29 HCP |
| Small slam combined | ~33 HCP |
| Grand slam combined | ~37 HCP |
| Length point | +1 per card beyond 4 in a suit |
| Shortness (with fit) void/sing/dbl | 5 / 3 / 1 |
| Rule of 20 | open if HCP + (two longest suits) ≥ 20 |
| Rule of 15 (4th seat) | open if HCP + spade length ≥ 15 |
| Quick tricks AK/AQ/A/KQ/Kx | 2 / 1.5 / 1 / 1 / 0.5 |

## 2. Opening bids
| Bid | Meaning | HCP | Suit length | Notes |
|-----|---------|-----|-------------|-------|
| 1♣ | natural | 12–21 | 3+ | shortest minor possible |
| 1♦ | natural | 12–21 | 3+ (usu 4+) | longer minor; 4-4 minors → 1♦ |
| 1♥/1♠ | natural | 12–21 | **5+** | 5-card-major system |
| 1NT | balanced | **15–17** | — | 4333/4432/5332 |
| 2♣ | strong artificial | **22+** bal or 9+ tricks | — | **GF** (except 2♣-2♦-2NT) |
| 2♦/2♥/2♠ | weak two | **5–11** (≈6–10) | good 6 | preempt |
| 2NT | balanced | **20–21** | — | Stayman/transfers on |
| 3♣–3♠ | preempt | ~6–10 | good 7 | Rule of 2-3-4 |
| 3NT | gambling | — | solid 7-card minor | little outside |
| 4♣–4♠ | preempt | shape | 7–8 | to play/push |

## 3. Choosing the opening suit (priority)
| Holding | Open |
|---------|------|
| 5-card major | the major |
| Two 5-card majors (5-5) | 1♠ (higher) |
| No 5-card major, longer minor | the longer minor |
| 4-4 minors | 1♦ |
| 3-3 minors | 1♣ |
| Two 5+ suits non-major | higher-ranking first |
| 6-4 | the 6-card suit first |

## 4. Responses to 1-of-a-major (1♥/1♠)
| Response | Meaning | Pts | Trumps | Force |
|----------|---------|-----|--------|-------|
| 2M (single raise) | simple raise | 6–10 | 3+ | NF |
| 3M (jump raise = limit) | invitational | 10–12 | 4+ | NF/INV |
| 4M (direct game) | weak/shapely preempt | <10 | 5+ | NF |
| 1NT | catch-all | 6–12 | <3 | **F one round** (semi-F variant) |
| 2NT (Jacoby) | GF raise | 13+ | 4+ | **GF** |
| 3♠/4♣/4♦ etc (splinter) | GF raise + shortness | 11–14 | 4+ | **GF** |
| new suit 1-level (1♥-1♠) | natural | 6+ | 4+ | **F** |
| new suit 2-level (2/1) | natural | 10+ | 4+ | **F** |
| jump shift (1♥-3♣) | huge | 17+ | — | **F/GF** |
| 3♣/3♦ (Bergen, variant) | 3♣=constructive, 3♦=limit | 7–12 | 4+ | special |

## 5. Responses to 1-of-a-minor (1♣/1♦)
| Response | Meaning | Notes |
|----------|---------|-------|
| 1♥/1♠ | 4+ major, 6+ HCP | bid majors up the line; F |
| 1NT | 6–10, balanced, no major | NF |
| 2m (single raise) | 6–10, 4+/5+ support | NF (inverted-minors variant: 10+ F) |
| 3m (jump raise) | invitational, 5+ support | NF (inverted: weak/preempt) |
| 2NT | 13–15 natural | NF/INV per style |
| 3NT | 16–17 balanced | to play |
| new suit 2-level | 10+, F | 2/1 |

## 6. Jacoby 2NT replies (opener, after 1M–2NT)
| Reply | Meaning |
|-------|---------|
| new suit at 3 | shortness (singleton/void) there |
| 3 of agreed M | strong balanced minimum, slam-ish |
| 4 of agreed M | minimum, signoff, no slam |
| new suit at 4 | strong 5-card side suit |
| 3NT | ~15–17 balanced, no shortness |

## 7. Responses to 1NT (15–17)
| Response | Meaning |
|----------|---------|
| 2♣ | Stayman (asks 4-card major) |
| 2♦ | transfer → hearts (5+♥) |
| 2♥ | transfer → spades (5+♠) |
| 2♠ | transfer to minor / range probe (variant) |
| 2NT | invite, 8–9 |
| 3♣/3♦ | natural F, slam-ish (or 4-suit transfers) |
| 3♥/3♠ | natural, 5+, GF slam try |
| 3NT | to play, 10–15 |
| 4♣ | Gerber (ace ask) |
| 4♦/4♥ | Texas transfer → ♥ / ♠ |
| 4NT | quantitative slam invite (16–17) |
| 5NT | quant grand invite, forces 6NT+ |
| 6NT | to play, ~18 |

## 8. Stayman follow-ups
| Opener reply | Meaning |
|--------------|---------|
| 2♦ | no 4-card major |
| 2♥ | 4 hearts (maybe 4 spades too) |
| 2♠ | 4 spades, denies 4 hearts |
| Responder: raise to 3 | invitational + 4 support |
| Responder: raise to 4 | game, 4 support |
| Responder: 2NT | invite, no fit |
| Responder: 3NT | game, no major fit |

## 9. Transfers
| Bid | Target | Notes |
|-----|--------|-------|
| 1NT-2♦ | hearts | opener completes 2♥; super-accept jump w/ 17+4-fit |
| 1NT-2♥ | spades | opener completes 2♠ |
| 1NT-4♦ | hearts (Texas) | game level, no slam |
| 1NT-4♥ | spades (Texas) | game level, no slam |
| Smolen (1NT-2♣-2♦-3♥/3♠) | jump in 4-card major shows 5-4 GF | 3♥=4♥5♠, 3♠=4♠5♥ |

## 10. Opener's rebids (after 1-suit opening + response)
| Rebid | Strength | Shape |
|-------|----------|-------|
| rebid own suit (min) | 12–15 | 6+ suit |
| jump rebid own suit | 16–18 | 6+ suit |
| rebid 1NT | **12–14** | balanced (≠ 1NT opening!) |
| jump 2NT | 18–19 | balanced |
| raise responder | 12–15 | 4+ support |
| jump-raise responder | 16–18 | 4+ support |
| raise responder to game | 19–21 | 4+ support |
| reverse | **17+** | longer 1st suit, F one round |
| jump shift | 19+ | GF two-suiter |

## 11. Forcing status quick-reference
| Bid | Status |
|-----|--------|
| new suit by unpassed responder | **Forcing** |
| reverse by opener | Forcing one round |
| jump shift (either) | Forcing (GF) |
| fourth-suit forcing | Forcing (GF default) |
| new minor forcing | Forcing |
| cue-bid of opponent's suit | Forcing |
| 2♣ opening | GF (except 2♣-2♦-2NT) |
| raise of partner's suit | NF (limited) |
| 1NT/2NT/3NT rebid | NF (limited) |
| simple rebid of own suit | NF |
| preference to partner's 1st suit | NF |

## 12. Slam tools
| Bid | Meaning |
|-----|---------|
| 4NT (suit agreed) | Blackwood ace-ask (5♣=0/4,5♦=1,5♥=2,5♠=3) |
| 4NT RKCB 1430 | 5♣=1/4, 5♦=0/3, 5♥=2 no Q, 5♠=2 w/ Q |
| 4NT RKCB 0314 | 5♣=0/3, 5♦=1/4, 5♥=2 no Q, 5♠=2 w/ Q |
| 5NT (after 4NT) | king-ask |
| 4♣ (over NT) | Gerber ace-ask (4♦=0/4,4♥=1,4♠=2,4NT=3) |
| 4NT (over NT, no suit) | quantitative (not Blackwood) |
| 5NT (Grand Slam Force) | bid 7 w/ 2 of top-3 trumps |
| new 4-level suit (fit agreed) | control/cue bid (1st-round control) |

## 13. Competitive bids
| Bid | Meaning | Range |
|-----|---------|-------|
| simple overcall 1-lvl | good 5+ suit | 8–16 |
| simple overcall 2-lvl | good 5+/6 suit | 10–17 |
| jump overcall | weak (like weak 2) | 6–11 |
| 1NT overcall (direct) | balanced + stopper | 15–18 |
| 1NT overcall (balancing) | balanced | 11–14 |
| takeout double | unbid suits, short in their suit | 12+ (17+ = dbl then bid) |
| negative double | unbid major(s), by responder | 6+ (on through 2♠ default) |
| Michaels (cue minor) | both majors 5-5 | weak or strong |
| Michaels (cue major) | other major + a minor 5-5 | weak or strong |
| Unusual 2NT | two lowest unbid suits (usu minors) 5-5 | weak or strong |
| cue-bid raise of overcall | limit-raise-or-better in their suit | 10+ |
| responsive double (variant) | unbid suits after opp raise | — |
| support double (variant) | exactly 3-card support | — |

## 14. Responding to a takeout double
| Hand | Action |
|------|--------|
| 0–8 | bid best suit at minimum (could be nothing) |
| 9–11 | jump in suit (invitational) |
| 12+ | cue-bid opener's suit (GF) or jump to game |
| 6–10 + stopper | 1NT |
| 11–12 + stopper | 2NT |
| strong trumps behind opener | pass for penalty |

## 15. Defense to 1NT
| Cappelletti | DONT |
|-------------|------|
| Dbl = penalty | Dbl = one-suiter |
| 2♣ = one-suiter | 2♣ = clubs + higher |
| 2♦ = both majors | 2♦ = diamonds + higher |
| 2♥ = hearts + minor | 2♥ = hearts + spades |
| 2♠ = spades + minor | 2♠ = spades |
| 2NT = both minors | — |

## 16. Leads (which card)
| Holding | Lead |
|---------|------|
| AK… (vs suit) | K |
| KQJ/KQ10 | K |
| QJ10 | Q |
| J109 | J |
| long suit w/ honor vs NT | 4th best |
| three small | top (top of nothing) |
| doubleton | high |
| singleton | the card |

## 17. Signals (standard / SAYC default)
| Signal | Meaning |
|--------|---------|
| Attitude | high = encourage, low = discourage |
| Count | high-low = even, low-high = odd |
| Suit preference | high = higher suit, low = lower suit |
| Discard | high = like that suit (variant: UDCA reverses) |
