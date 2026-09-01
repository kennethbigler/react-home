import { BID_ORDER, isRealBid } from "./bid-order";
import { POSITIONS, getRelatives } from "./positions";
import type {
  AuctionContext,
  AuctionState,
  BidRound,
  BiddingPosition,
  Vulnerability,
} from "./types";

// ─── deriveSituation ─────────────────────────────────────────────────────────

/**
 * True when `doublerSeat`'s most recent Double was a LEAD-DIRECTING double of
 * the opponents' Stayman 2♣: the real bid immediately before the Double was
 * 2♣, and the auction's opening bid was 1NT by an opponent of the doubler.
 */
function wasDoubleOfStayman(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
  doublerSeat: BiddingPosition,
): boolean {
  const flat: { seat: BiddingPosition; call: string }[] = [];
  for (const r of completedRounds) {
    for (const p of POSITIONS) {
      const b = r[p];
      if (b !== undefined) flat.push({ seat: p, call: b });
    }
  }
  for (const p of POSITIONS) {
    if (p < myPosition && currentRound[p] !== undefined)
      flat.push({ seat: p, call: currentRound[p]! });
  }
  let dblIdx = -1;
  for (let i = flat.length - 1; i >= 0; i--) {
    if (flat[i].seat === doublerSeat && flat[i].call === "Double") {
      dblIdx = i;
      break;
    }
  }
  if (dblIdx < 0) return false;
  let prevReal: { seat: BiddingPosition; call: string } | undefined;
  for (let i = dblIdx - 1; i >= 0; i--) {
    if (isRealBid(flat[i].call)) {
      prevReal = flat[i];
      break;
    }
  }
  if (!prevReal || prevReal.call !== "2♣") return false;
  const openingEntry = flat.find((e) => isRealBid(e.call));
  if (!openingEntry || openingEntry.call !== "1NT") return false;
  const doublerPartner = getRelatives(doublerSeat).partner;
  return (
    openingEntry.seat !== doublerSeat && openingEntry.seat !== doublerPartner
  );
}

const WEAK2_BIDS = ["2♦", "2♥", "2♠"];
const PREEMPT_BIDS = ["3♣", "3♦", "3♥", "3♠"];

/** Returns true if this looks like a Stayman bid (2♣ after partner opened 1NT/2NT/3NT) */
function wasStayman(
  myBid: string,
  priorPartnerBid: string | undefined,
): boolean {
  return (
    (myBid === "2♣" && priorPartnerBid === "1NT") ||
    (myBid === "3♣" && priorPartnerBid === "2NT")
  );
}

/** Returns true if this looks like a Jacoby or minor-suit transfer */
function wasTransfer(
  myBid: string,
  priorPartnerBid: string | undefined,
): boolean {
  if (!priorPartnerBid) return false;
  const after1NT = priorPartnerBid === "1NT";
  const after2NT = priorPartnerBid === "2NT";
  if (after1NT && (myBid === "2♦" || myBid === "2♥")) return true;
  if (after2NT && (myBid === "3♦" || myBid === "3♥")) return true;
  if (after1NT && myBid === "2♠") return true; // minor transfer
  return false;
}

/** Returns true if partnerBid is a JUMP overcall — i.e. partnerBid is at a
 * level higher than the cheapest legal overcall in that strain at the moment
 * the bid was made.
 *
 * The "auction floor" is the highest suit/NT bid in the auction BEFORE
 * partner's overcall.  Pass in the actual floor — measuring against just the
 * original opener's bid is wrong when intervening bids have raised the floor
 * (e.g. 1♠–Pass–2♠–3♣: 3♣ is the cheapest club bid over 2♠, so it's a SIMPLE
 * overcall, not a jump, even though it's two levels above the natural
 * minimum 2♣ over the original 1♠).
 */
function isJumpOvercall(partnerBid: string, auctionFloor: string): boolean {
  const pIdx = BID_ORDER.indexOf(partnerBid);
  const fIdx = BID_ORDER.indexOf(auctionFloor);
  if (pIdx < 0 || fIdx < 0) return false;

  // Cheapest legal bid in partner's strain that is strictly above the floor.
  const suitSuffix = partnerBid.slice(1); // "♥", "♠", "♦", "♣", "NT"
  const minOvercallIdx = BID_ORDER.findIndex(
    (bid, i) => i > fIdx && bid.endsWith(suitSuffix),
  );
  if (minOvercallIdx < 0) return false;

  return pIdx > minOvercallIdx;
}

/**
 * Identifies which seat OPENED the auction (made its first real bid).
 * Scans for the first round containing a real bid; within that round the
 * opening bid is the LOWEST real bid (all later bids in a round must be
 * higher), which makes this robust regardless of seat ordering.
 */
function findAuctionOpenerSeat(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
): BiddingPosition | undefined {
  const cur: BidRound = {};
  for (const p of POSITIONS) if (p < myPosition) cur[p] = currentRound[p];
  for (const r of [...completedRounds, cur]) {
    const real = POSITIONS.filter((p) => isRealBid(r[p]));
    if (real.length > 0) {
      let best = real[0];
      for (const p of real) {
        if (BID_ORDER.indexOf(r[p]!) < BID_ORDER.indexOf(r[best]!)) best = p;
      }
      return best;
    }
  }
  return undefined;
}

/**
 * Returns the highest suit/NT bid that occurred in the auction BEFORE the
 * specified seat's most recent bid.  This is what "auction floor" means at
 * the moment of that bid.  Returns undefined if no prior suit/NT bid exists.
 */
function auctionFloorBeforeSeatBid(
  completedRounds: BidRound[],
  currentRound: BidRound,
  seat: BiddingPosition,
  seatBid: string,
): string | undefined {
  let lastSuitBid: string | undefined;
  for (let r = 0; r < completedRounds.length; r++) {
    for (const s of POSITIONS) {
      if (s === seat && completedRounds[r][s] === seatBid) return lastSuitBid;
      const b = completedRounds[r][s];
      if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") {
        lastSuitBid = b;
      }
    }
  }
  for (const s of POSITIONS) {
    if (s === seat && currentRound[s] === seatBid) return lastSuitBid;
    const b = currentRound[s];
    if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") {
      lastSuitBid = b;
    }
  }
  return lastSuitBid;
}

/**
 * True when MY most recent real bid is the standing contract and every call
 * since (around to my current turn) has been a Pass — i.e. the auction has been
 * passed out in my contract and I should simply pass.  Works regardless of
 * whether partner's "latest bid" resolves to a stale earlier bid, so it must be
 * checked BEFORE role-based routing (which can misread a stale opening as a new
 * suit to act on).
 */
function isMyBidPassedOut(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
  myLastBid: string | undefined,
): boolean {
  if (!myLastBid) return false;
  // The auction must be FORMALLY complete (three consecutive real passes after a
  // bid) AND the seat holding the final contract must be me.  Requiring true
  // completion distinguishes a genuine pass-out from a forcing bid still
  // awaiting partner's reply (e.g. a Jacoby transfer or a Blackwood ask, where
  // the passes have not gone all the way around).  getFinalContractInfo /
  // ...DeclarerSeat order calls by real bidding sequence, robust to who opened.
  const { isComplete, finalContract } = getFinalContractInfo(
    completedRounds,
    currentRound,
    myPosition,
  );
  if (!isComplete || !finalContract) return false;
  const declarerSeat = getFinalContractDeclarerSeat(
    completedRounds,
    currentRound,
    myPosition,
  );
  return declarerSeat === myPosition && finalContract === myLastBid;
}

/**
 * Derives the AuctionContext (including Situation) from an AuctionState.
 * This replaces the manual Situation dropdown.
 */
function deriveSituationCore(
  state: AuctionState,
  vulnerability: Vulnerability = "none",
): AuctionContext {
  const { myPosition, completedRounds, currentRound, agreedSuit } = state;
  const { partner, lho, rho } = getRelatives(myPosition);
  const vul = vulnerability;

  // ── Flatten timeline into per-player last bids ──────────────────────────────

  const myBids = completedRounds.map((r) => r[myPosition]).filter(isRealBid);
  const myLastBid = myBids[myBids.length - 1];

  // Track any non-pass action by myPosition, including Double/Redouble.
  // isRealBid excludes these, so myBids misses them — but we still need to know
  // whether I've already acted (e.g. doubled) so we don't re-route to a first-bid
  // situation and accidentally recommend doubling my own partner.
  const myLastNonPassAction: string | undefined = (() => {
    // Walk backwards through completed rounds + currentRound
    const allRounds = [
      ...completedRounds,
      currentRound as { [k: number]: string | undefined },
    ];
    for (let i = allRounds.length - 1; i >= 0; i--) {
      const b = allRounds[i][myPosition];
      if (b && b !== "Pass") return b;
    }
    return undefined;
  })();

  // Most recent bid from each player across all completed rounds + current round
  const latestBid = (pos: BiddingPosition): string | undefined => {
    const current = currentRound[pos];
    if (current && current !== "Pass" && isRealBid(current)) return current;
    if (current === "Double" || current === "Redouble") return current;
    // Walk back through completed rounds
    for (let i = completedRounds.length - 1; i >= 0; i--) {
      const b = completedRounds[i][pos];
      if (b && b !== "Pass" && isRealBid(b)) return b;
      if (b === "Double" || b === "Redouble") return b;
    }
    return undefined;
  };

  const partnerBid = latestBid(partner);
  const rhoBid = latestBid(rho);
  const lhoBid = latestBid(lho);

  // The bid by each player in the round just before the current one (for rebid context)
  const prevRound = completedRounds[completedRounds.length - 1];
  const prevPartnerBid = prevRound?.[partner];
  // The partner's bid from TWO rounds back (their opening, before my rebid)

  // ── Case: I've already bid (rebid / convention follow-up situations) ─────────

  if (myLastBid) {
    // ── Passed out in MY contract (checked FIRST) ──────────────────────────────
    // If my last real bid is the standing contract and everyone has passed since,
    // the auction is over.  This must precede role-routing: otherwise a stale
    // "partnerBid" (e.g. partner's opening before my NT response, now passed) is
    // misread as a fresh suit to support — producing phantom bids like raising to
    // a minor-suit game.
    if (
      isMyBidPassedOut(completedRounds, currentRound, myPosition, myLastBid)
    ) {
      return {
        situation: "auction-passed-out",
        myPreviousBid: myLastBid,
        vulnerability: vul,
      };
    }

    // My most recent bid determines the situation
    const prevPartnerResponse = prevPartnerBid;

    // Convention follow-ups — what did I bid LAST?
    // A JACOBY 2NT auction agrees the OPENED MAJOR — later suit bids by our
    // side (3-level shortness replies, 4-level side-suit shows) are
    // ARTIFICIAL and must never be read as the agreed suit.
    const jacobyAgreedMajor = (() => {
      const firstRealOf = (p: BiddingPosition): string | undefined => {
        for (const r of completedRounds) {
          const b = r[p];
          if (isRealBid(b)) return b;
        }
        return undefined;
      };
      const mine = firstRealOf(myPosition);
      const partners = firstRealOf(partner);
      if ((mine === "1♥" || mine === "1♠") && partners === "2NT")
        return mine.slice(1);
      if ((partners === "1♥" || partners === "1♠") && mine === "2NT")
        return partners.slice(1);
      return undefined;
    })();
    // Agreed suit for a Blackwood auction: only bids made BEFORE my 4NT ask
    // count (partner's 5♦/5♠/6♦... ace and king REPLIES are artificial and
    // must never be read as the agreed suit). Prefer a suit both partners
    // bid; recognize partner's splinter (a double jump over my 1-of-a-suit
    // opening agrees MY suit); otherwise the last suit bid before the ask.
    const deriveAgreedSuitBefore4NT = (): string | undefined => {
      const flat4NT: { seat: BiddingPosition; call: string }[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS) {
          const b = r[p];
          if (b !== undefined) flat4NT.push({ seat: p, call: b });
        }
      }
      for (const p of POSITIONS) {
        if (p < myPosition && currentRound[p] !== undefined)
          flat4NT.push({ seat: p, call: currentRound[p]! });
      }
      let askIdx = -1;
      for (let i = flat4NT.length - 1; i >= 0; i--) {
        if (flat4NT[i].seat === myPosition && flat4NT[i].call === "4NT") {
          askIdx = i;
          break;
        }
      }
      const beforeAsk = askIdx >= 0 ? flat4NT.slice(0, askIdx) : flat4NT;
      const ourSuitCalls = beforeAsk.filter(
        (e) =>
          (e.seat === myPosition || e.seat === partner) &&
          isRealBid(e.call) &&
          !e.call.endsWith("NT"),
      );
      if (ourSuitCalls.length === 0) return undefined;
      const mySuitSet = new Set(
        ourSuitCalls
          .filter((e) => e.seat === myPosition)
          .map((e) => e.call.slice(1)),
      );
      const partnerSuitSet = new Set(
        ourSuitCalls
          .filter((e) => e.seat === partner)
          .map((e) => e.call.slice(1)),
      );
      for (let i = ourSuitCalls.length - 1; i >= 0; i--) {
        const sym = ourSuitCalls[i].call.slice(1);
        if (mySuitSet.has(sym) && partnerSuitSet.has(sym)) return sym;
      }
      const myOpeningAg = ourSuitCalls.find((e) => e.seat === myPosition)?.call;
      const partnerLastAg = [...ourSuitCalls]
        .reverse()
        .find((e) => e.seat === partner)?.call;
      if (
        myOpeningAg &&
        /^1[♠♥♦♣]$/.test(myOpeningAg) &&
        partnerLastAg &&
        /^[34][♠♥♦♣]$/.test(partnerLastAg) &&
        partnerLastAg.slice(1) !== myOpeningAg.slice(1)
      ) {
        const cheapestAg = BID_ORDER.find(
          (b, i) =>
            i > BID_ORDER.indexOf(myOpeningAg) &&
            b.endsWith(partnerLastAg.slice(1)),
        );
        if (
          cheapestAg &&
          parseInt(partnerLastAg[0]) - parseInt(cheapestAg[0]) === 2
        )
          return myOpeningAg.slice(1);
      }
      return ourSuitCalls[ourSuitCalls.length - 1].call.slice(1);
    };
    if (myLastBid === "4NT") {
      return {
        situation: "blackwood-response",
        partnerBid,
        vulnerability: vul,
        agreedSuit:
          agreedSuit ?? jacobyAgreedMajor ?? deriveAgreedSuitBefore4NT(),
      };
    }
    if (myLastBid === "4♣") {
      // Gerber is only valid in uncontested NT auctions (SAYC).
      // Partner's NT bid must have come BEFORE my 4♣ — an NT bid partner made
      // AFTER it (e.g. a 4NT Blackwood over my 4♣ SPLINTER) can never turn my
      // 4♣ into Gerber retroactively.
      const partnerBidNTBefore4C = (() => {
        const flatG: { seat: BiddingPosition; call: string }[] = [];
        for (const r of completedRounds) {
          for (const p of POSITIONS) {
            const b = r[p];
            if (b !== undefined) flatG.push({ seat: p, call: b });
          }
        }
        for (const p of POSITIONS) {
          if (p < myPosition && currentRound[p] !== undefined)
            flatG.push({ seat: p, call: currentRound[p]! });
        }
        let fourCIdx = -1;
        for (let i = flatG.length - 1; i >= 0; i--) {
          if (flatG[i].seat === myPosition && flatG[i].call === "4♣") {
            fourCIdx = i;
            break;
          }
        }
        const beforeG = fourCIdx >= 0 ? flatG.slice(0, fourCIdx) : flatG;
        return beforeG.some(
          (e) =>
            e.seat === partner && isRealBid(e.call) && e.call.includes("NT"),
        );
      })();
      const hasInterference = !!(rhoBid || lhoBid);
      if (!hasInterference && partnerBidNTBefore4C) {
        return { situation: "gerber-response", partnerBid, vulnerability: vul };
      }
      // Otherwise fall through to regular rebid handling
    }
    if (myLastBid === "5NT") {
      // Could be blackwood-kings OR grand-slam-force based on whether prior bid was 4NT
      const priorMyBid = myBids[myBids.length - 2];
      if (priorMyBid === "4NT") {
        // Partner's ACE response was their real bid before the current kings
        // reply (typically last completed round).
        const partnerReal = completedRounds
          .map((r) => r[partner])
          .filter(isRealBid);
        const partnerAceResponse = partnerReal
          .filter((b) => /^5[♣♦♥♠]$/.test(b))
          .slice(-1)[0];
        return {
          situation: "blackwood-kings",
          partnerBid,
          vulnerability: vul,
          agreedSuit:
            agreedSuit ?? jacobyAgreedMajor ?? deriveAgreedSuitBefore4NT(),
          partnerAceResponse,
        };
      }
      return { situation: "grand-slam-force", vulnerability: vul };
    }

    // Find what partner opened (their last real bid BEFORE my first real bid).
    // Walk the auction strictly in seat order (round → seat 1..4) and stop the
    // moment we reach my first bid; the most recent partner bid before that
    // point is the answer.  Crucially, if partner sits AFTER me in the same
    // round as my first bid, their bid in that round came LATER and must NOT
    // be returned (the previous bug: a weak-2 opener in seat 1 was reading
    // partner's same-round 2NT as if it had preceded the opening, causing
    // wasTransfer("2♥","2NT") to fire incorrectly).
    // After partner's strong 2♣ (and 2NT rebid), my artificial 2♦ WAITING
    // response is not a convention bid — the Stayman/transfer analysis
    // applies to my NEXT bid, made over the 2NT.
    const partnerOpened2CConv = (() => {
      for (const r of completedRounds) {
        const b = r[partner];
        if (b && isRealBid(b)) return b === "2♣";
        if (b && b !== "Pass") return false;
      }
      return false;
    })();
    const myBidsConv =
      partnerOpened2CConv && myBids[0] === "2♦" ? myBids.slice(1) : myBids;
    const myFirstBid = myBidsConv[0];
    const partnerBidBeforeMe = (() => {
      if (myFirstBid === undefined) return undefined;
      let lastPartnerBidSoFar: string | undefined;
      for (let r = 0; r < completedRounds.length; r++) {
        for (const seat of POSITIONS) {
          // Stop the moment we see my first real bid — anything later is not
          // "before me" even if it's earlier in seat order in a later round.
          if (seat === myPosition && completedRounds[r][seat] === myFirstBid) {
            return lastPartnerBidSoFar;
          }
          if (seat === partner) {
            const b = completedRounds[r][partner];
            if (b && b !== "Pass") lastPartnerBidSoFar = b;
          }
        }
      }
      return lastPartnerBidSoFar;
    })();

    // Stayman / Transfer follow-ups apply ONLY when my Stayman/transfer bid
    // is still my MOST RECENT bid (i.e., partner just replied and now it's my
    // turn).  Once I've already made a follow-up bid (e.g. 2NT inviting after
    // a Stayman denial), I'm in a normal rebid situation and the Stayman
    // routing must NOT fire again — otherwise the engine tries to recommend
    // the same 2NT it already bid, then falls back to Pass with confusing
    // reasoning.
    const stillInStaymanFollowUpSeat = myBidsConv.length === 1;
    // Stayman/transfers are OFF once an opponent made a real bid between
    // partner's NT and my call — my 2♣/2♦/2♥/2♠ was then NATURAL (an escape),
    // so the convention follow-up handlers must not fire.
    const systemsWereOnForMyBid = (() => {
      if (myFirstBid === undefined) return true;
      const flatSys: { seat: BiddingPosition; call: string }[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS) {
          const b = r[p];
          if (b !== undefined) flatSys.push({ seat: p, call: b });
        }
      }
      const myIdxSys = flatSys.findIndex(
        (e) => e.seat === myPosition && e.call === myFirstBid,
      );
      if (myIdxSys < 0) return true;
      let ntIdxSys = -1;
      for (let i = myIdxSys - 1; i >= 0; i--) {
        if (flatSys[i].seat === partner && isRealBid(flatSys[i].call)) {
          ntIdxSys = i;
          break;
        }
      }
      if (ntIdxSys < 0) return true;
      for (let i = ntIdxSys + 1; i < myIdxSys; i++) {
        if (
          flatSys[i].seat !== partner &&
          flatSys[i].seat !== myPosition &&
          isRealBid(flatSys[i].call)
        )
          return false;
      }
      return true;
    })();
    if (
      stillInStaymanFollowUpSeat &&
      systemsWereOnForMyBid &&
      wasStayman(myFirstBid ?? "", partnerBidBeforeMe)
    ) {
      // Find the original Stayman reply (the first real bid partner made AFTER my 2♣).
      // In seat order: if partner sits before me (e.g. partner=1, me=3), their Stayman
      // reply is in the round AFTER the round containing my 2♣.
      // If partner sits after me (e.g. partner=4, me=3 — rare), it's in the same round.
      // `partnerBid` (from latestBid) may already be a later continuation (e.g. 2NT
      // declining an invitation) — we need the first reply separately.
      const staymanReply = (() => {
        for (let i = 0; i < completedRounds.length; i++) {
          // myFirstBid is the Stayman bid itself: 2♣ over 1NT, 3♣ over 2NT.
          if (completedRounds[i][myPosition] === myFirstBid) {
            if (partner < myPosition) {
              // Partner bids before me in each round — their Stayman reply is in the
              // NEXT completed round (round i+1), or in currentRound if not yet completed.
              const nextRound = completedRounds[i + 1]?.[partner];
              if (nextRound && nextRound !== "Pass") return nextRound;
              const inCurrent = currentRound[partner];
              if (inCurrent && inCurrent !== "Pass") return inCurrent;
            } else {
              // Partner bids after me — reply is in the same round.
              const sameRound = completedRounds[i][partner];
              if (sameRound && sameRound !== "Pass") return sameRound;
            }
          }
        }
        return undefined;
      })();
      // If partner has since made a continuation bid (e.g. 2NT after 2♦-2♠), store it.
      const staymanContinuation =
        staymanReply && partnerBid !== staymanReply ? partnerBid : undefined;
      return {
        situation: "stayman-response",
        partnerBid: staymanReply ?? partnerBid,
        partnerContinuation: staymanContinuation,
        // The NT opening Stayman was used over (1NT or 2NT) — the follow-up
        // ranges and levels depend on it.
        partnerFirstBid: partnerBidBeforeMe,
        vulnerability: vul,
      };
    }
    if (
      stillInStaymanFollowUpSeat &&
      systemsWereOnForMyBid &&
      wasTransfer(myFirstBid ?? "", partnerBidBeforeMe)
    ) {
      const transferred = myFirstBid === "2♠" ? "minor" : "major";
      if (transferred === "minor") {
        return {
          situation: "minor-transfer-response",
          partnerBid,
          vulnerability: vul,
        };
      }
      return {
        situation: "transfer-response",
        partnerBid,
        partnerFirstBid: partnerBidBeforeMe,
        vulnerability: vul,
        ...(partnerOpened2CConv && { after2COpening: true }),
      };
    }

    // Opener/responder rebids — any NT bid goes to the NT rebid handler.
    // EXCEPTION: if partner opened a suit *before* my NT response, partner's current
    // bid is a natural suit showing — route to the responder-specific handler.
    {
      // Route NT rebids by ROLE: the auction's opener gets rebid-after-nt,
      // the opener's partner gets responder-nt-rebid, and when the OPPONENTS
      // opened we fall through to the role-aware router below (advancer /
      // overcaller logic) instead of misapplying opener semantics.
      const ntOpenerSeat = findAuctionOpenerSeat(
        completedRounds,
        currentRound,
        myPosition,
      );
      if (
        myLastBid.endsWith("NT") &&
        ntOpenerSeat !== lho &&
        ntOpenerSeat !== rho
      ) {
        // Detect if partner had a prior suit bid that's a natural showing
        // (rather than a convention ack like 2♣ Stayman over my 1NT).
        const partnerOpenedSuitBeforeMyNT =
          ntOpenerSeat === partner &&
          completedRounds
            // Partner's bid in the round of my NT came BEFORE mine when they
            // sit earlier in the rotation — include that round in the scan.
            .slice(
              0,
              partner < myPosition
                ? completedRounds.length
                : completedRounds.length - 1,
            )
            .some((r) => {
              const b = r[partner];
              return b && b !== "Pass" && !b.endsWith("NT");
            });

        if (partnerOpenedSuitBeforeMyNT) {
          let ntPartnerFirstBid: string | undefined;
          for (const r of completedRounds) {
            const b = r[partner];
            if (isRealBid(b)) {
              ntPartnerFirstBid = b;
              break;
            }
          }
          return {
            situation: "responder-nt-rebid",
            myPreviousBid: myLastBid,
            partnerBid,
            partnerFirstBid: ntPartnerFirstBid,
            vulnerability: vul,
          };
        }
        // Did an OPPONENT make a real bid BEFORE partner's latest response?
        // Only then are Stayman/transfers off for that response.
        const systemsOff = (() => {
          if (!partnerBid || !isRealBid(partnerBid)) return false;
          const floorBefore = auctionFloorBeforeSeatBid(
            completedRounds,
            currentRound,
            partner,
            partnerBid,
          );
          // floorBefore is the last real bid before partner's response; if it
          // was made by an opponent (i.e. it isn't one of MY bids), systems off.
          if (floorBefore && !new Set(myBids).has(floorBefore)) return true;
          // An opponent's DOUBLE of my NT bid also kills the systems —
          // partner's suit bids become natural ESCAPES, never transfers.
          const flatSO: { seat: BiddingPosition; call: string }[] = [];
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (b !== undefined) flatSO.push({ seat: p, call: b });
            }
          }
          for (const p of POSITIONS) {
            if (p < myPosition && currentRound[p] !== undefined)
              flatSO.push({ seat: p, call: currentRound[p]! });
          }
          let myNTIdxSO = -1;
          for (let i = flatSO.length - 1; i >= 0; i--) {
            if (
              flatSO[i].seat === myPosition &&
              flatSO[i].call.endsWith("NT")
            ) {
              myNTIdxSO = i;
              break;
            }
          }
          if (myNTIdxSO < 0) return false;
          for (let i = myNTIdxSO + 1; i < flatSO.length; i++) {
            const e = flatSO[i];
            if (e.seat === partner && isRealBid(e.call)) break;
            if (
              e.seat !== partner &&
              e.seat !== myPosition &&
              e.call === "Double"
            )
              return true;
          }
          return false;
        })();
        // Only partner calls made AFTER my NT bid are a response to it — a
        // stale Double from earlier rounds must not read as "partner doubled
        // the interference over my NT".
        const partnerCallAfterMyNT = (() => {
          const flatNTR: { seat: BiddingPosition; call: string }[] = [];
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (b !== undefined) flatNTR.push({ seat: p, call: b });
            }
          }
          for (const p of POSITIONS) {
            if (p < myPosition && currentRound[p] !== undefined)
              flatNTR.push({ seat: p, call: currentRound[p]! });
          }
          let myIdxNTR = -1;
          for (let i = flatNTR.length - 1; i >= 0; i--) {
            if (
              flatNTR[i].seat === myPosition &&
              flatNTR[i].call === myLastBid
            ) {
              myIdxNTR = i;
              break;
            }
          }
          for (let i = flatNTR.length - 1; i > myIdxNTR; i--) {
            if (flatNTR[i].seat === partner && flatNTR[i].call !== "Pass")
              return flatNTR[i].call;
          }
          return undefined;
        })();
        return {
          situation: "rebid-after-nt",
          myPreviousBid: myLastBid,
          partnerBid:
            partnerCallAfterMyNT ??
            (partnerBid === "Double" ? "Pass" : partnerBid),
          vulnerability: vul,
          systemsOff,
        };
      }
    }

    // Partner bid 4NT (Blackwood) after a suit was established — respond with ace count.
    // Exception: if my last bid was NT, treat it as quantitative (handled by rebid-after-nt above).
    if (partnerBid === "4NT") {
      return { situation: "blackwood-ace-response", vulnerability: vul };
    }

    // Partner bid 5NT (Blackwood kings ask) after I showed aces — respond with king count.
    if (partnerBid === "5NT") {
      return { situation: "blackwood-kings-response", vulnerability: vul };
    }

    // NT-range opener continuing after a Stayman/Transfer response they
    // already answered: a 1NT/2NT opening, or a strong 2♣ whose 2NT rebid
    // turned systems on one level up.  Exclude Blackwood/Gerber NT bids.
    const iAmNTRangeOpener =
      (myFirstBid?.endsWith("NT") &&
        myFirstBid !== "4NT" &&
        myFirstBid !== "5NT") ||
      (myFirstBid === "2♣" && myBids[1] === "2NT");
    if (iAmNTRangeOpener && myBids.length >= 2) {
      // My conventions sit at the 2NT level when 2NT was my opening OR my
      // rebid after the strong 2♣.
      const myNTIsTwoNT =
        myFirstBid === "2NT" || (myFirstBid === "2♣" && myBids[1] === "2NT");
      // Detect whether MY LATEST bid was a transfer completion: find what
      // partner bid in the round I made it — a transfer prompt (2♦→♥, 2♥→♠;
      // one level up over 2NT) flags suit-game preference logic rather than
      // the Stayman "no fit" logic.  (A 2♦ WAITING response to 2♣ is NOT a
      // transfer — only the 3-level prompts count for the 2♣-then-2NT hand.)
      const wasTransferCompletion = (() => {
        for (let i = 0; i < completedRounds.length; i++) {
          if (completedRounds[i][myPosition] === myLastBid) {
            const promptBid =
              partner < myPosition
                ? completedRounds[i][partner]
                : completedRounds[i - 1]?.[partner];
            return (
              (myFirstBid === "1NT" &&
                (promptBid === "2♦" || promptBid === "2♥")) ||
              (myNTIsTwoNT && (promptBid === "3♦" || promptBid === "3♥"))
            );
          }
        }
        return false;
      })();
      // Has partner bid since MY convention answer?  If not (e.g. they
      // transferred weak and the OPPONENTS competed), partner is limited —
      // the handler must not bid on unilaterally.
      const staymanPartnerNothingNew = (() => {
        const flatSO: { seat: BiddingPosition; call: string }[] = [];
        for (const r of completedRounds) {
          for (const p of POSITIONS) {
            const b = r[p];
            if (b !== undefined) flatSO.push({ seat: p, call: b });
          }
        }
        for (const p of POSITIONS) {
          if (p < myPosition && currentRound[p] !== undefined)
            flatSO.push({ seat: p, call: currentRound[p]! });
        }
        const lastRealIdxSO = (seat: BiddingPosition) => {
          for (let i = flatSO.length - 1; i >= 0; i--) {
            if (flatSO[i].seat === seat && isRealBid(flatSO[i].call)) return i;
          }
          return -1;
        };
        const mineSO = lastRealIdxSO(myPosition);
        const partnerSO = lastRealIdxSO(partner);
        return partnerSO >= 0 && mineSO >= 0 && partnerSO < mineSO;
      })();
      return {
        situation: "stayman-opener-rebid",
        myPreviousBid: myLastBid,
        partnerBid,
        vulnerability: vul,
        wasTransferCompletion,
        ...(staymanPartnerNothingNew && { partnerHasNothingNew: true }),
      };
    }
    // Jacoby 2NT applies ONLY when MY 1♥/1♠ was the auction's OPENING bid.
    // A responder's 1♠ followed by partner's natural 2NT jump rebid (18-19)
    // must NOT be read as Jacoby.
    const iOpenedTheAuction =
      findAuctionOpenerSeat(completedRounds, currentRound, myPosition) ===
      myPosition;
    if (
      // Use `partnerBid` (latest real bid, checked in the CURRENT round first)
      // rather than `prevPartnerResponse` (which only looks at the previous
      // COMPLETED round) — partner's 2NT often lands in the current round,
      // one seat before mine, and prevPartnerResponse misses it entirely.
      partnerBid === "2NT" &&
      (myLastBid === "1♥" || myLastBid === "1♠") &&
      iOpenedTheAuction &&
      // The 1♥/1♠ must be my OPENING (my only real bid), not a second-suit
      // rebid — after e.g. 1♦-1♥-1♠, partner's 2NT is a natural invitation,
      // never Jacoby.
      myBids.length === 1
    ) {
      return {
        situation: "jacoby-2nt-opener",
        myPreviousBid: myLastBid,
        vulnerability: vul,
      };
    }
    if (
      (prevPartnerBid === "Double" ||
        prevPartnerResponse === "Double" ||
        // Partner's negative double may sit several rounds back (they passed
        // since while the opponents kept raising) — it is still the context my
        // rebid answers as long as it is their latest non-pass action.
        partnerBid === "Double") &&
      // A NEGATIVE double exists only when MY SIDE opened and I am the opener
      // — an advancer whose partner made a TAKEOUT double belongs elsewhere.
      findAuctionOpenerSeat(completedRounds, currentRound, myPosition) ===
        myPosition
    ) {
      // Two DIFFERENT bids matter here and must not be conflated:
      //   • the bid partner actually DOUBLED (the real bid immediately before
      //     their Double) — this decides negative-vs-penalty (through 2♠);
      //   • the opponents' HIGHEST bid — the floor the rebid must clear.
      const oppRealBids = [lhoBid, rhoBid].filter((b): b is string =>
        isRealBid(b),
      );
      const highestOpp =
        oppRealBids.length > 0
          ? oppRealBids.sort(
              (a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a),
            )[0]
          : rhoBid;
      const doubledBid = (() => {
        const flatND: { seat: BiddingPosition; call: string }[] = [];
        for (const r of completedRounds) {
          for (const p of POSITIONS) {
            const b = r[p];
            if (b !== undefined) flatND.push({ seat: p, call: b });
          }
        }
        for (const p of POSITIONS) {
          if (p < myPosition && currentRound[p] !== undefined)
            flatND.push({ seat: p, call: currentRound[p]! });
        }
        for (let i = flatND.length - 1; i >= 0; i--) {
          if (flatND[i].seat === partner && flatND[i].call === "Double") {
            for (let j = i - 1; j >= 0; j--) {
              if (isRealBid(flatND[j].call)) return flatND[j].call;
            }
            return undefined;
          }
        }
        return undefined;
      })();
      return {
        situation: "rebid-after-negative-double",
        myPreviousBid: myLastBid,
        rhoBid: highestOpp,
        vulnerability: vul,
        ...(doubledBid && { doubledBid }),
      };
    }

    // Detect Blackwood kings sign-off: my last bid was a kings response (6♣/6♦/6♥/6♠)
    // and partner has now bid a slam contract in our agreed suit.  This is NOT an
    // invitation — partner is simply signing off after the kings ask.  Pass.
    const blackwoodKingsResponses = ["6♣", "6♦", "6♥", "6♠"];
    if (
      myLastBid &&
      blackwoodKingsResponses.includes(myLastBid) &&
      partnerBid &&
      /^[67][♠♥♦♣]$/.test(partnerBid)
    ) {
      return {
        situation: "blackwood-kings",
        myPreviousBid: myLastBid,
        partnerBid,
        agreedSuit: partnerBid.slice(1), // "♠" from "6♠" — mark as sign-off in agreed suit
        vulnerability: vul,
      };
    }

    // Detect when partner is rebidding their own previously-shown suit as an invitation.
    // Example: 1♦-1♥-2♦-3♥ — partner bid "1♥" in round 1, now jumps to "3♥" (a jump of 2
    // levels, skipping past 2♥).  This is an invitational jump, NOT a new suit.
    // The tell: partner's current bid is the same suit they bid earlier, BUT at a level
    // more than 1 higher than that earlier bid.
    if (
      partnerBid &&
      partnerBid !== "Pass" &&
      partnerBid !== "Double" &&
      !partnerBid.endsWith("NT")
    ) {
      const partnerSuitSym = partnerBid.slice(1); // "♥" from "3♥"
      const partnerBidLevel = parseInt(partnerBid[0]);
      let partnerPrevSuitLevel = -1;
      for (let i = 0; i < completedRounds.length - 1; i++) {
        const bid = completedRounds[i][partner];
        if (
          bid &&
          bid !== "Pass" &&
          bid !== "Double" &&
          !bid.endsWith("NT") &&
          bid.includes(partnerSuitSym)
        ) {
          partnerPrevSuitLevel = parseInt(bid[0]);
          break;
        }
      }
      // Only a TRUE jump is an invitation — EXCEPT when the "floor" that made
      // partner's rebid the cheapest legal bid was OUR OWN side's call (e.g.
      // 1♣-1♥-2♥-3♥: the 3♥ re-raise over my 2♥ raise is still the classic
      // invitation).  Only an OPPONENT's interference demotes the rebid to
      // mere competition.
      const floorBeforePartnerBid = auctionFloorBeforeSeatBid(
        completedRounds,
        currentRound,
        partner,
        partnerBid,
      );
      const isTrueJump = (() => {
        if (!floorBeforePartnerBid) return true;
        const floorIdx = BID_ORDER.indexOf(floorBeforePartnerBid);
        const cheapest = BID_ORDER.find(
          (b, i) => i > floorIdx && b.endsWith(partnerSuitSym),
        );
        if (cheapest !== partnerBid) return true;
        // Cheapest-legal rebid: invitation stands if the floor bid was ours.
        const flatInv: { seat: BiddingPosition; call: string }[] = [];
        for (const r of completedRounds) {
          for (const p of POSITIONS) {
            const b = r[p];
            if (b !== undefined) flatInv.push({ seat: p, call: b });
          }
        }
        for (const p of POSITIONS) {
          if (p < myPosition && currentRound[p] !== undefined)
            flatInv.push({ seat: p, call: currentRound[p]! });
        }
        let pIdxInv = -1;
        for (let i = flatInv.length - 1; i >= 0; i--) {
          if (flatInv[i].seat === partner && flatInv[i].call === partnerBid) {
            pIdxInv = i;
            break;
          }
        }
        for (let i = pIdxInv - 1; i >= 0; i--) {
          if (isRealBid(flatInv[i].call)) {
            // The our-side exception applies only when OUR floor bid was in
            // partner's OWN suit (a raise, e.g. 1♣-1♥-2♥-3♥).  If my bid was
            // a DIFFERENT suit (e.g. a reverse), partner was FORCED to this
            // level — their cheapest same-suit rebid shows weakness, not an
            // invitational jump.
            return (
              (flatInv[i].seat === myPosition || flatInv[i].seat === partner) &&
              !flatInv[i].call.endsWith("NT") &&
              flatInv[i].call.slice(1) === partnerSuitSym
            );
          }
        }
        return false;
      })();
      // A bid at or above GAME level is a placement/acceptance, never an
      // invitation (invitations by definition stop below game).
      const partnerGameLvl =
        partnerSuitSym === "♥" || partnerSuitSym === "♠" ? 4 : 5;
      if (
        partnerPrevSuitLevel >= 0 &&
        partnerBidLevel > partnerPrevSuitLevel + 1 &&
        partnerBidLevel < partnerGameLvl &&
        isTrueJump
      ) {
        // Was partner the auction's OPENER, or an overcaller?  Their invite
        // reads differently (opener rebid ladder vs 14-15 overcall).
        const inviteOpenerSeat = findAuctionOpenerSeat(
          completedRounds,
          currentRound,
          myPosition,
        );
        return {
          situation: "respond-to-partner-invitation",
          myPreviousBid: myLastBid,
          partnerBid,
          vulnerability: vul,
          ...(inviteOpenerSeat !== partner &&
            inviteOpenerSeat !== myPosition && {
              partnerWasOvercaller: true,
            }),
          // Partner OPENED: their jump rebid is the 16-18 opener invite and
          // I am the responder — a different ladder from a responder invite.
          ...(inviteOpenerSeat === partner && { partnerOpened: true }),
        };
      }
    }

    // ── I DOUBLED earlier (reopening/takeout) and partner has since responded —
    // continue as the doubler, never as an opener reading a free raise.
    if (
      (myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble") &&
      isRealBid(partnerBid)
    ) {
      const aodOpp = [lhoBid, rhoBid]
        .filter((b): b is string => isRealBid(b))
        .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
      return {
        situation: "after-own-double",
        partnerBid,
        rhoBid: aodOpp,
        vulnerability: vul,
      };
    }

    // ── Advancer of partner's TAKEOUT DOUBLE, rebidding ────────────────────────
    // The opponents opened, partner's only action is a Double, and I already
    // advanced once — my advance said it all; route to the advancer fallback
    // instead of the opener handlers below.
    {
      const advOpenerSeat = findAuctionOpenerSeat(
        completedRounds,
        currentRound,
        myPosition,
      );
      if (
        partnerBid === "Double" &&
        (advOpenerSeat === lho || advOpenerSeat === rho) &&
        isRealBid(myLastBid)
      ) {
        return {
          situation: "advancer-rebid",
          myPreviousBid: myLastBid,
          partnerBid: undefined,
          partnerFirstBid: undefined,
          lhoBid,
          rhoBid,
          vulnerability: vul,
        };
      }
    }

    // ── Role-aware routing for later turns ─────────────────────────────────────
    // Everything below this block assumes OPENER semantics (e.g. "1NT rebid =
    // 12-14").  Work out who actually opened the auction; if it was an
    // opponent, I am the overcaller or the advancer; if it was partner, I am
    // the responder.  Each of those roles gets its own rebid logic.
    {
      const openerSeat = findAuctionOpenerSeat(
        completedRounds,
        currentRound,
        myPosition,
      );
      // Partner's first real bid (their original overcall / opening / response)
      let partnerFirstBid: string | undefined;
      for (const r of completedRounds) {
        const b = r[partner];
        if (isRealBid(b)) {
          partnerFirstBid = b;
          break;
        }
      }
      const opponentsOpened = openerSeat === lho || openerSeat === rho;
      // I am the ADVANCER only if partner's first real bid (the overcall) came
      // BEFORE my own first real bid.  If I bid first, I am the overcaller and
      // partner is responding to ME.
      // Chronology proxy: earlier round first; within a round the LOWER bid
      // came first (legal auctions ascend within a round).  For PARTNER, a
      // Double/Redouble also counts as their first action — answering
      // partner's takeout double makes me the ADVANCER, not an overcaller.
      const firstActionTurn = (
        p: BiddingPosition,
        includeDoubles: boolean,
      ): number => {
        for (let r = 0; r < completedRounds.length; r++) {
          const b = completedRounds[r][p];
          if (isRealBid(b)) return r * 100 + BID_ORDER.indexOf(b);
          if (includeDoubles && (b === "Double" || b === "Redouble"))
            return r * 100; // earliest possible slot in the round
        }
        const cb = currentRound[p];
        if (p < myPosition && isRealBid(cb))
          return completedRounds.length * 100 + BID_ORDER.indexOf(cb);
        if (
          p < myPosition &&
          includeDoubles &&
          (cb === "Double" || cb === "Redouble")
        )
          return completedRounds.length * 100;
        return Number.MAX_SAFE_INTEGER;
      };
      const iAmAdvancer =
        opponentsOpened &&
        firstActionTurn(partner, true) <= firstActionTurn(myPosition, false);

      if (
        opponentsOpened &&
        iAmAdvancer &&
        partnerBid &&
        isRealBid(partnerBid)
      ) {
        return {
          situation: "advancer-rebid",
          myPreviousBid: myLastBid,
          partnerBid,
          partnerFirstBid,
          lhoBid,
          rhoBid,
          vulnerability: vul,
        };
      }
      if (
        opponentsOpened &&
        !iAmAdvancer &&
        partnerBid &&
        isRealBid(partnerBid)
      ) {
        // Systems apply over a 1NT OVERCALL (same as over a 1NT opening):
        // partner's 2♣ is Stayman and 2♦/2♥ are transfers.  The overcaller
        // MUST answer them — never treat them as natural, passable advances.
        if (
          myBids.length === 1 &&
          myBids[0] === "1NT" &&
          ["2♣", "2♦", "2♥"].includes(partnerBid)
        ) {
          return {
            situation: "rebid-after-nt",
            myPreviousBid: myLastBid,
            partnerBid,
            vulnerability: vul,
          };
        }
        // I overcalled; partner has advanced.  Opener semantics do not apply.
        // The opponents' opening suit identifies partner's cuebid.
        const openerFirstBid = (() => {
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (isRealBid(b)) return b;
            }
          }
          return undefined;
        })();
        // Partner silent since my latest real bid → my hand is described.
        const ocrNothingNew = (() => {
          if (myBids.length < 2) return false;
          const flatOCR: { seat: BiddingPosition; call: string }[] = [];
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (b !== undefined) flatOCR.push({ seat: p, call: b });
            }
          }
          for (const p of POSITIONS) {
            if (p < myPosition && currentRound[p] !== undefined)
              flatOCR.push({ seat: p, call: currentRound[p]! });
          }
          const lastRealOCR = (seat: BiddingPosition) => {
            for (let i = flatOCR.length - 1; i >= 0; i--) {
              if (flatOCR[i].seat === seat && isRealBid(flatOCR[i].call))
                return i;
            }
            return -1;
          };
          const m = lastRealOCR(myPosition);
          const pt = lastRealOCR(partner);
          return pt >= 0 && m >= 0 && pt < m;
        })();
        return {
          situation: "overcaller-rebid",
          myPreviousBid: myLastBid,
          myFirstBid: myBids[0],
          partnerBid,
          partnerFirstBid,
          ...(ocrNothingNew && { partnerHasNothingNew: true }),
          lhoBid: openerFirstBid,
          rhoBid,
          vulnerability: vul,
        };
      }
      if (openerSeat === partner && partnerBid && isRealBid(partnerBid)) {
        // Partner opened a STRONG 2♣ and rebid 2NT (22-24 balanced) over my
        // waiting 2♦ — Stayman and transfers apply one level up, exactly as
        // over a 2NT opening.  Route to the 2NT-response systems.
        if (
          partnerFirstBid === "2♣" &&
          partnerBid === "2NT" &&
          myLastBid === "2♦"
        ) {
          return {
            situation: "responding-2nt",
            partnerBid,
            vulnerability: vul,
            after2COpening: true,
          };
        }
        // Partner opened, I responded in a suit, partner has rebid — I am the
        // RESPONDER making my second bid.  If partner has said nothing new
        // since MY last real bid (only the opponents acted), my earlier bid
        // already described this hand — flag it so the handler does not bid
        // the same values twice.
        const respNothingNew = (() => {
          const flatRR: { seat: BiddingPosition; call: string }[] = [];
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (b !== undefined) flatRR.push({ seat: p, call: b });
            }
          }
          for (const p of POSITIONS) {
            if (p < myPosition && currentRound[p] !== undefined)
              flatRR.push({ seat: p, call: currentRound[p]! });
          }
          const lastRealRR = (seat: BiddingPosition) => {
            for (let i = flatRR.length - 1; i >= 0; i--) {
              if (flatRR[i].seat === seat && isRealBid(flatRR[i].call))
                return i;
            }
            return -1;
          };
          const mineRR = lastRealRR(myPosition);
          const partRR = lastRealRR(partner);
          return (
            myBids.length >= 2 && partRR >= 0 && mineRR >= 0 && partRR < mineRR
          );
        })();
        const rebidFloorRR = auctionFloorBeforeSeatBid(
          completedRounds,
          currentRound,
          partner,
          partnerBid,
        );
        return {
          situation: "responder-rebid",
          myPreviousBid: myLastBid,
          partnerBid,
          partnerFirstBid,
          lhoBid,
          rhoBid,
          vulnerability: vul,
          ...(respNothingNew && { partnerHasNothingNew: true }),
          ...(rebidFloorRR && { partnerRebidFloor: rebidFloorRR }),
        };
      }
    }

    // ── Protective / balancing position ────────────────────────────────────────
    // Partner has never bid (only passed) — this is NOT a normal opener rebid.
    // The opener is in the "protective seat" ONLY when the auction is about to
    // die: the two calls immediately before this turn were both passes (e.g.
    // 1♥-(2♦)-Pass-(Pass)-back to opener).  When the auction is still live
    // (RHO just bid), this is ordinary competition — reopening-double standards
    // do NOT apply, so the handler must know which seat it is in.
    if (!partnerBid) {
      // (The "passed out in my contract" case is handled earlier, before
      // role-routing — see isMyBidPassedOut at the top of this block.)
      // Flatten all calls made so far, in seat order, to find the two calls
      // immediately preceding this turn.
      const flatCalls: string[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS) flatCalls.push(r[p] ?? "Pass");
      }
      for (const p of POSITIONS) {
        if (p < myPosition) {
          const b = currentRound[p];
          if (b !== undefined) flatCalls.push(b);
        }
      }
      // If MY last bid is still the highest live call (no opponent has bid over
      // it), my own side holds the contract — there is nothing to reopen.  This
      // is not a protective seat; pass and play it.  (Without this, a sequence
      // like 1♦-(1NT me)-P-P back toward me would phantom a reopening double of
      // my own contract.)
      const myLastIdx = myLastBid ? BID_ORDER.indexOf(myLastBid) : -1;
      const highestOppIdx = Math.max(
        isRealBid(lhoBid) ? BID_ORDER.indexOf(lhoBid) : -1,
        isRealBid(rhoBid) ? BID_ORDER.indexOf(rhoBid) : -1,
      );
      if (myLastIdx >= 0 && myLastIdx > highestOppIdx) {
        // An opponent DOUBLE after my last bid keeps the auction alive — I may
        // pass, redouble, or run.  Flag it so the handler tells that story
        // instead of "auction over".
        const myLastCallPos = flatCalls.lastIndexOf(myLastBid!);
        const doubledSince =
          myLastCallPos >= 0 &&
          flatCalls.slice(myLastCallPos + 1).includes("Double");
        return {
          situation: "auction-passed-out",
          myPreviousBid: myLastBid,
          vulnerability: vul,
          myBidWasDoubled: doubledSince || undefined,
        };
      }
      const lastTwo = flatCalls.slice(-2);
      const inBalancingSeat =
        lastTwo.length === 2 && lastTwo.every((b) => b === "Pass");
      return {
        situation: "protective-rebid",
        myPreviousBid: myLastBid,
        // Use whichever opponent bid — could be LHO (typical overcall) or RHO
        // (balancing bid after two passes, e.g. 1♥-Pass-Pass-2♦-back to opener).
        lhoBid: lhoBid ?? rhoBid ?? undefined,
        rhoBid,
        vulnerability: vul,
        balancing: inBalancingSeat,
        // My first bid was an overcall if I was not the auction's opener —
        // the handler's stories must not call it an "opening bid".
        ...(findAuctionOpenerSeat(completedRounds, currentRound, myPosition) !==
          myPosition && { iOvercalled: true }),
      };
    }

    // Partner's FIRST real bid (so the rebid handler can tell a genuine raise of
    // opener's suit from a mere PREFERENCE back to it after partner showed a
    // different suit first — e.g. 1♦-2♥-2♠-3♦, where 3♦ is preference, not a
    // limit raise).
    let rebidPartnerFirstBid: string | undefined;
    for (const r of completedRounds) {
      const b = r[partner];
      if (isRealBid(b)) {
        rebidPartnerFirstBid = b;
        break;
      }
    }
    // Flatten the calls in table order — used both for "partner has nothing
    // new" and for order-correct cuebid detection.
    const flatRAS: { seat: BiddingPosition; call: string }[] = [];
    for (const r of completedRounds) {
      for (const p of POSITIONS) {
        const b = r[p];
        if (b !== undefined) flatRAS.push({ seat: p, call: b });
      }
    }
    for (const p of POSITIONS) {
      if (p < myPosition && currentRound[p] !== undefined)
        flatRAS.push({ seat: p, call: currentRound[p]! });
    }
    const lastRealIdxRAS = (seat: BiddingPosition) => {
      for (let i = flatRAS.length - 1; i >= 0; i--) {
        if (flatRAS[i].seat === seat && isRealBid(flatRAS[i].call)) return i;
      }
      return -1;
    };
    // Have I already rebid (2+ real bids) with partner adding NOTHING since?
    // If partner's last real bid came before mine, I already answered it and
    // my hand is fully described.
    const mineIdxRAS = lastRealIdxRAS(myPosition);
    const partnerIdxRAS = lastRealIdxRAS(partner);
    const alreadyDescribed =
      myBids.length >= 2 &&
      partnerIdxRAS >= 0 &&
      mineIdxRAS >= 0 &&
      partnerIdxRAS < mineIdxRAS;
    // Did partner's latest bid CUE a suit an opponent had shown BEFORE it?
    const partnerCuedTheirSuit = (() => {
      if (partnerIdxRAS < 0) return false;
      const pBid = flatRAS[partnerIdxRAS].call;
      if (!isRealBid(pBid) || pBid.endsWith("NT")) return false;
      const pSuit = pBid.slice(1);
      for (let i = 0; i < partnerIdxRAS; i++) {
        const e = flatRAS[i];
        if (
          e.seat !== partner &&
          e.seat !== myPosition &&
          isRealBid(e.call) &&
          !e.call.endsWith("NT") &&
          e.call.slice(1) === pSuit
        )
          return true;
      }
      return false;
    })();
    // Partner made a DOUBLE earlier: their later raise of my suit is the
    // invitational 11-13 continuation, never a weak preemptive jump.
    const partnerDoubledEarlierRAS = flatRAS.some(
      (e, i) => e.seat === partner && e.call === "Double" && i < partnerIdxRAS,
    );
    // Jordan 2NT applies ONLY when an opponent's DOUBLE sat DIRECTLY over MY
    // OPENING bid — i.e. the auction ran my-opening, (Double), then straight
    // to partner's response (passes allowed in between, but no other REAL
    // bid). A double anywhere else (over partner's later bid, a reopening
    // double after 2NT was already on the table, etc.) does not make 2NT
    // Jordan — checking only "did LHO or RHO ever double" would
    // over-trigger on those unrelated auctions.
    const myOpeningIdxRAS = flatRAS.findIndex(
      (e) => e.seat === myPosition && e.call === myBids[0],
    );
    const oppDoubledMyOpeningDirectlyRAS =
      myOpeningIdxRAS >= 0 &&
      partnerIdxRAS > myOpeningIdxRAS &&
      flatRAS
        .slice(myOpeningIdxRAS + 1, partnerIdxRAS)
        .every((e) => e.call === "Pass" || e.call === "Double") &&
      flatRAS
        .slice(myOpeningIdxRAS + 1, partnerIdxRAS)
        .some((e) => e.call === "Double");
    return {
      situation: "rebid-after-suit",
      myPreviousBid: myLastBid,
      partnerBid,
      partnerFirstBid: rebidPartnerFirstBid,
      // Forward opponent interference so the rebid handler knows the auction was
      // contested (e.g. a jump raise after a double is preemptive, not a limit
      // raise) and so its level math clears the opponents' bids.
      lhoBid,
      rhoBid,
      vulnerability: vul,
      ...(alreadyDescribed && { partnerHasNothingNew: true }),
      ...(partnerCuedTheirSuit && { partnerCuedTheirSuit: true }),
      ...(partnerDoubledEarlierRAS && { partnerDoubledEarlier: true }),
      ...(oppDoubledMyOpeningDirectlyRAS && {
        oppDoubledMyOpeningDirectly: true,
      }),
    };
  }

  // Any bid (including Double/Redouble) counts as non-pass for opening detection
  const anyNonPass =
    [partnerBid, rhoBid, lhoBid].some((b) => b && b !== "Pass") ||
    completedRounds.some((r) =>
      Object.values(r).some((b) => b && b !== "Pass"),
    );

  if (!anyNonPass) {
    return { situation: "opening", vulnerability: vul };
  }

  // ── Case: Grand Slam Force response (partner jumped to 5NT) ────────────────

  if (partnerBid === "5NT") {
    return {
      situation: "grand-slam-force-response",
      vulnerability: vul,
      agreedSuit: agreedSuit ?? "♠",
    };
  }

  // ── Determine who opened the auction ─────────────────────────────────────
  // For completed rounds: iterate POSITIONS to find first non-pass bid
  // For current round: use bid level (lower bid = earlier in auction) since
  //   the display order doesn't match auction sequence

  let auctionOpenedByPartner = false;
  let auctionOpenedByOpponent = false;
  let firstOpenerSeat: BiddingPosition | undefined;
  let firstOpenerBid: string | undefined;

  // Check completed rounds first
  outerLoop: for (const round of completedRounds) {
    for (const seat of POSITIONS) {
      const bid = round[seat];
      if (bid && bid !== "Pass") {
        firstOpenerSeat = seat;
        firstOpenerBid = bid;
        if (seat === partner) auctionOpenedByPartner = true;
        else auctionOpenedByOpponent = true;
        break outerLoop;
      }
    }
  }

  // If no completed rounds, check current round using bid levels
  if (!auctionOpenedByPartner && !auctionOpenedByOpponent) {
    const partnerBidIdx = isRealBid(partnerBid)
      ? BID_ORDER.indexOf(partnerBid!)
      : 999;
    const rhoBidIdx = isRealBid(rhoBid) ? BID_ORDER.indexOf(rhoBid!) : 999;
    const lhoBidIdx = isRealBid(lhoBid) ? BID_ORDER.indexOf(lhoBid!) : 999;

    if (
      isRealBid(partnerBid) &&
      partnerBidIdx < rhoBidIdx &&
      partnerBidIdx < lhoBidIdx
    ) {
      auctionOpenedByPartner = true;
      firstOpenerSeat = partner;
      firstOpenerBid = partnerBid;
    } else if (isRealBid(rhoBid) || isRealBid(lhoBid)) {
      auctionOpenedByOpponent = true;
      if (isRealBid(rhoBid) && (!isRealBid(lhoBid) || rhoBidIdx <= lhoBidIdx)) {
        firstOpenerSeat = rho;
        firstOpenerBid = rhoBid;
      } else {
        firstOpenerSeat = lho;
        firstOpenerBid = lhoBid;
      }
    }
  }

  const isPartnerFirst = auctionOpenedByPartner;
  const isOpponentFirst = auctionOpenedByOpponent;

  // ── Partner opened ──────────────────────────────────────────────────────────

  if (isPartnerFirst) {
    const partnerOpenBid = firstOpenerBid ?? partnerBid ?? "";

    // Did an opponent make ANY bid after partner (including Double)?
    const opponentActed =
      (rhoBid && rhoBid !== "Pass") || (lhoBid && lhoBid !== "Pass");

    if (!opponentActed) {
      // Clean response to partner's opening
      if (partnerOpenBid === "1NT")
        return { situation: "responding-1nt", partnerBid, vulnerability: vul };
      if (partnerOpenBid === "2NT")
        return { situation: "responding-2nt", partnerBid, vulnerability: vul };
      if (partnerOpenBid === "3NT")
        return {
          situation: "responding-3nt-opening",
          partnerBid,
          vulnerability: vul,
        };

      // If partner's latest bid differs from their opening bid they have already
      // rebid once — this is a continuation, NOT a first response to their opener.
      // Route to responding-suit using the most-recent bid so the player gets
      // advice that matches the actual auction level.  (This prevents e.g. a 2♣
      // opener's 2♠ rebid from being treated as a pre-emptive weak 2♠ opener.)
      if (isRealBid(partnerBid) && partnerBid !== partnerOpenBid) {
        return { situation: "responding-suit", partnerBid, vulnerability: vul };
      }

      if (partnerOpenBid === "2♣")
        return { situation: "responding-2c", partnerBid, vulnerability: vul };
      if (WEAK2_BIDS.includes(partnerOpenBid))
        return {
          situation: "responding-weak2",
          partnerBid,
          vulnerability: vul,
        };
      if (PREEMPT_BIDS.includes(partnerOpenBid))
        return {
          situation: "responding-preempt",
          partnerBid,
          vulnerability: vul,
        };
      if (["1♣", "1♦", "1♥", "1♠"].includes(partnerOpenBid)) {
        return { situation: "responding-suit", partnerBid, vulnerability: vul };
      }
    }

    // Opponent intervened after partner
    const opponentBid = rhoBid ?? lhoBid;

    if (opponentBid === "Double") {
      // When partner opened 1NT and opponent doubled, that is NOT a suit-support
      // situation.  Use a dedicated handler so we don't confuse NT responses with
      // "Weak Raise … 3-card support" messaging.
      if (partnerOpenBid === "1NT") {
        return {
          situation: "responding-1nt-doubled",
          partnerBid,
          rhoBid: opponentBid,
          vulnerability: vul,
        };
      }
      // If I already acted (doubled/redoubled) earlier in this auction, my
      // strength is shown — never recommend a second Redouble.
      if (
        myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble"
      ) {
        return {
          situation: "after-own-double",
          partnerBid,
          rhoBid: opponentBid,
          vulnerability: vul,
          partnerOpened: true,
        };
      }
      // Partner opened a WEAK 2 / preempt and the opponent doubled: this is
      // preempt-response territory (raise per the Law or pass), never the
      // Jordan-2NT flow (whose 1-level new-suit math walks into the safety
      // net over a 2-level opening).
      if (WEAK2_BIDS.includes(partnerOpenBid)) {
        return {
          situation: "responding-weak2",
          partnerBid,
          rhoBid: opponentBid,
          vulnerability: vul,
        };
      }
      if (PREEMPT_BIDS.includes(partnerOpenBid)) {
        return {
          situation: "responding-preempt",
          partnerBid,
          rhoBid: opponentBid,
          vulnerability: vul,
        };
      }
      // Partner opened a suit, opponent doubled → Jordan 2NT territory
      return {
        situation: "responding-suit-after-double",
        partnerBid,
        rhoBid: opponentBid,
        vulnerability: vul,
      };
    }
    if (
      isRealBid(opponentBid) &&
      ["1♣", "1♦", "1♥", "1♠"].includes(partnerOpenBid)
    ) {
      // Partner OPENED and has since DOUBLED the opponents' bid (reopening /
      // optional double) — I must answer the double (sit or pull), not sit in
      // a phantom negative-double seat.
      if (partnerBid === "Double") {
        return {
          situation: "responding-to-double",
          rhoBid: opponentBid,
          vulnerability: vul,
          partnerOpened: true,
          partnerFirstBid: partnerOpenBid,
        };
      }
      // Partner opened 1-of-suit, opponent overcalled → negative double territory.
      // BUT: if I already made a Double/Redouble in a prior round, I am NOT in
      // the negative-double seat.  I already showed my hand; the current bid is
      // partner's response to my earlier action.  Pass unless I have extra values.
      if (
        myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble"
      ) {
        // Find the REAL bid my own double was made against — without this,
        // downstream "did partner/opponent jump since the double" math falls
        // back to the CURRENT (possibly since-raised) opponent bid and
        // over-counts the jump, e.g. reading a raise after the double as if
        // it were the doubled call itself.
        const myDoubledBidAOD = (() => {
          const flatAOD: { seat: BiddingPosition; call: string }[] = [];
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (b !== undefined) flatAOD.push({ seat: p, call: b });
            }
          }
          for (const p of POSITIONS) {
            if (p < myPosition && currentRound[p] !== undefined)
              flatAOD.push({ seat: p, call: currentRound[p]! });
          }
          for (let i = flatAOD.length - 1; i >= 0; i--) {
            if (
              flatAOD[i].seat === myPosition &&
              (flatAOD[i].call === "Double" || flatAOD[i].call === "Redouble")
            ) {
              for (let j = i - 1; j >= 0; j--) {
                if (isRealBid(flatAOD[j].call)) return flatAOD[j].call;
              }
              return undefined;
            }
          }
          return undefined;
        })();
        return {
          situation: "after-own-double",
          partnerBid: partnerBid ?? undefined,
          rhoBid: opponentBid,
          vulnerability: vul,
          partnerOpened: true,
          // The opening bid, so the handler can tell "partner opened 1♦ and
          // has passed since" apart from "partner has bid again".
          partnerFirstBid: partnerOpenBid,
          ...(myDoubledBidAOD && { doubledBid: myDoubledBidAOD }),
        };
      }
      // Partner opened 1-of-suit, opponent overcalled → negative double territory
      return {
        situation: "negative-double",
        myPreviousBid: partnerOpenBid,
        rhoBid: opponentBid,
        vulnerability: vul,
      };
    }
    // Partner REOPENED with a double after the opponent's overcall (e.g.
    // 2♣-(2♠)-P-(P)-Double).  That double is takeout/cards asking me to bid —
    // advance it (bid my best suit), do NOT fall back to "respond to the
    // opening", which would ignore the double and pass below the contract.
    // Pass partner's FIRST real bid through: after partner's own NT bid the
    // double is penalty-suggestive, and the handler must not force a bid.
    if (partnerBid === "Double") {
      let partnerFirstRealRTD: string | undefined;
      for (const r of completedRounds) {
        const b = r[partner];
        if (isRealBid(b)) {
          partnerFirstRealRTD = b;
          break;
        }
      }
      return {
        situation: "responding-to-double",
        rhoBid: opponentBid,
        vulnerability: vul,
        ...(partnerFirstRealRTD && { partnerFirstBid: partnerFirstRealRTD }),
      };
    }

    // Partner opened pre-empt or 2, opponent bid → just respond to partner
    // Pass through the opponent's bid so the UI can ask about stoppers when needed.
    // First: if partner has REBID (their latest bid ≠ their opening bid), treat as
    // a continuation and route to responding-suit using the most-recent bid.
    if (isRealBid(partnerBid) && partnerBid !== partnerOpenBid) {
      return { situation: "responding-suit", partnerBid, vulnerability: vul };
    }
    if (partnerOpenBid === "1NT")
      return {
        situation: "responding-1nt",
        partnerBid,
        rhoBid: opponentBid,
        vulnerability: vul,
      };
    if (partnerOpenBid === "2♣")
      return { situation: "responding-2c", partnerBid, vulnerability: vul };
    if (partnerOpenBid === "2NT")
      return { situation: "responding-2nt", partnerBid, vulnerability: vul };
    if (partnerOpenBid === "3NT")
      return {
        situation: "responding-3nt-opening",
        partnerBid,
        vulnerability: vul,
      };
    if (WEAK2_BIDS.includes(partnerOpenBid))
      return { situation: "responding-weak2", partnerBid, vulnerability: vul };
    if (PREEMPT_BIDS.includes(partnerOpenBid))
      return {
        situation: "responding-preempt",
        partnerBid,
        vulnerability: vul,
      };
    return { situation: "responding-suit", partnerBid, vulnerability: vul };
  }

  // ── Opponent opened / bid first ─────────────────────────────────────────────

  if (isOpponentFirst) {
    const opponentOpenBid = firstOpenerBid ?? rhoBid ?? lhoBid ?? "";
    const effectiveRhoBid =
      firstOpenerSeat === rho ? opponentOpenBid : (rhoBid ?? opponentOpenBid);

    // I haven't bid yet — what did partner do?
    if (!partnerBid || partnerBid === "Pass") {
      // Partner passed/hasn't bid — I need to decide whether/how to compete
      // Include lhoBid so getOvercall can detect conventional bids
      // (e.g. 2♣ Stayman when LHO opened 1NT)
      const lhoBidForContext =
        firstOpenerSeat === lho ? opponentOpenBid : lhoBid;

      // Detect the balancing (protective) seat — the PASS-OUT seat ONLY: the
      // two calls immediately before my turn are both passes, so a pass by me
      // would end the auction (e.g. 1♠-P-P-?).  In this seat the standards for
      // competing are relaxed by about a king — partner may have been trapped
      // with values, so I "borrow a king" to reopen rather than sell out.
      // NOTE: merely having PASSED EARLIER does not make this the balancing
      // seat — a passed hand sitting DIRECTLY over the opener must still meet
      // full direct-seat standards.
      const callsBeforeMe: string[] = [];
      for (const round of completedRounds) {
        for (const p of POSITIONS) callsBeforeMe.push(round[p] ?? "Pass");
      }
      for (const p of POSITIONS) {
        if (p < myPosition) callsBeforeMe.push(currentRound[p] ?? "Pass");
      }
      let trailingPasses = 0;
      for (let i = callsBeforeMe.length - 1; i >= 0; i--) {
        if (callsBeforeMe[i] === "Pass") trailingPasses++;
        else break;
      }
      const anyRealBidBeforeMe = callsBeforeMe.some(
        (c) => c !== "Pass" && c !== "Double" && c !== "Redouble",
      );
      const inPassOutSeat = anyRealBidBeforeMe && trailingPasses === 2;

      // If I already doubled, I have shown my hand — re-routing to
      // "overcalling" would recommend doubling again forever.
      if (
        myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble"
      ) {
        return {
          situation: "after-own-double",
          partnerBid,
          rhoBid: effectiveRhoBid,
          vulnerability: vul,
          ...(wasDoubleOfStayman(
            completedRounds,
            currentRound,
            myPosition,
            myPosition,
          ) && { doubleWasLeadDirecting: true }),
        };
      }

      return {
        situation: "overcalling",
        rhoBid: effectiveRhoBid,
        lhoBid: lhoBidForContext,
        vulnerability: vul,
        ...(inPassOutSeat && { balancing: true }),
      };
    }

    // Partner has bid after opponent — I'm responding to partner's action
    if (partnerBid === "Double") {
      // Special case: partner doubled Stayman (2♣ over the opponents' 1NT
      // opening).  This is a lead-directing double, NOT a takeout double —
      // checked order-aware so later rounds still read it correctly.
      const lhoBidForDouble =
        firstOpenerSeat === lho ? opponentOpenBid : lhoBid;
      const isPartnerDoubledStayman =
        (lhoBidForDouble === "2♣" && effectiveRhoBid?.endsWith("NT")) ||
        wasDoubleOfStayman(completedRounds, currentRound, myPosition, partner);
      if (isPartnerDoubledStayman) {
        return {
          situation: "overcalling",
          rhoBid: lhoBidForDouble, // "2♣" — the doubled bid
          lhoBid: effectiveRhoBid, // "1NT" — the NT opener
          partnerBid: "Double", // signal that partner already doubled
          vulnerability: vul,
        };
      }
      // Partner's FIRST real bid matters: after partner's own NT bid a later
      // double is penalty-suggestive, and the handler must not force a bid.
      let partnerFirstRealRTD2: string | undefined;
      for (const r of completedRounds) {
        const b = r[partner];
        if (isRealBid(b)) {
          partnerFirstRealRTD2 = b;
          break;
        }
      }
      // The bid partner actually DOUBLED (the real bid immediately before
      // their Double) — NOT necessarily the current floor.  RHO may have
      // since ADVANCED over the double (e.g. Jordan 2NT after a takeout
      // double of an opening) — that advance is not itself "doubled", and
      // the NT-penalty branches inside getResponseToDouble must judge
      // against the true doubled bid, or a Jordan/negative-double-answer
      // 2NT/3NT gets misread as "partner doubled a natural 2NT/3NT".
      const actualDoubledBid = (() => {
        const flatRTD: { seat: BiddingPosition; call: string }[] = [];
        for (const r of completedRounds) {
          for (const p of POSITIONS) {
            const b = r[p];
            if (b !== undefined) flatRTD.push({ seat: p, call: b });
          }
        }
        for (const p of POSITIONS) {
          if (p < myPosition && currentRound[p] !== undefined)
            flatRTD.push({ seat: p, call: currentRound[p]! });
        }
        for (let i = flatRTD.length - 1; i >= 0; i--) {
          if (flatRTD[i].seat === partner && flatRTD[i].call === "Double") {
            for (let j = i - 1; j >= 0; j--) {
              if (isRealBid(flatRTD[j].call)) return flatRTD[j].call;
            }
            return undefined;
          }
        }
        return undefined;
      })();
      return {
        situation: "responding-to-double",
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
        ...(partnerFirstRealRTD2 && { partnerFirstBid: partnerFirstRealRTD2 }),
        ...(actualDoubledBid && { doubledBid: actualDoubledBid }),
      };
    }

    // Advancing partner's CAPPELLETTI call: the opponents opened 1NT and
    // partner's IMMEDIATE next call was one of 2♣/2♦/2♥/2♠/2NT — SAYC's
    // standard defense to 1NT — so these are CONVENTIONAL, not natural, and
    // must not fall into the Michaels/Unusual-2NT/simple-overcall handlers
    // below (which assume a SUIT opening, not 1NT).
    if (
      opponentOpenBid === "1NT" &&
      isRealBid(partnerBid) &&
      /^2[♣♦♥♠]$|^2NT$/.test(partnerBid) &&
      (() => {
        // Partner's Cappelletti call must be the DIRECT answer to the 1NT —
        // i.e. the last real bid before partner's call was that 1NT itself.
        const flatCapp: { seat: BiddingPosition; call: string }[] = [];
        for (const r of completedRounds) {
          for (const p of POSITIONS) {
            const b = r[p];
            if (b !== undefined) flatCapp.push({ seat: p, call: b });
          }
        }
        for (const p of POSITIONS) {
          if (p < myPosition && currentRound[p] !== undefined)
            flatCapp.push({ seat: p, call: currentRound[p]! });
        }
        let partnerIdxCapp = -1;
        for (let i = flatCapp.length - 1; i >= 0; i--) {
          if (flatCapp[i].seat === partner && flatCapp[i].call === partnerBid) {
            partnerIdxCapp = i;
            break;
          }
        }
        if (partnerIdxCapp <= 0) return false;
        for (let i = partnerIdxCapp - 1; i >= 0; i--) {
          const e = flatCapp[i];
          if (e.call === "Pass") continue;
          return e.call === "1NT";
        }
        return false;
      })()
    ) {
      // Opponents' highest real bid AFTER partner's Cappelletti call — must
      // be cleared by any advance.
      const flatCappInt: { seat: BiddingPosition; call: string }[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS) {
          const b = r[p];
          if (b !== undefined) flatCappInt.push({ seat: p, call: b });
        }
      }
      for (const p of POSITIONS) {
        if (p < myPosition && currentRound[p] !== undefined)
          flatCappInt.push({ seat: p, call: currentRound[p]! });
      }
      const cappIdx = flatCappInt.map((e) => e.call).lastIndexOf(partnerBid);
      let interferenceOverCapp: string | undefined;
      for (let i = cappIdx + 1; i < flatCappInt.length; i++) {
        const e = flatCappInt[i];
        if (
          e.seat !== partner &&
          e.seat !== myPosition &&
          isRealBid(e.call) &&
          (!interferenceOverCapp ||
            BID_ORDER.indexOf(e.call) > BID_ORDER.indexOf(interferenceOverCapp))
        ) {
          interferenceOverCapp = e.call;
        }
      }
      return {
        situation: "advancing-cappelletti",
        partnerBid,
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
        ...(interferenceOverCapp && {
          interferenceOverCappelletti: interferenceOverCapp,
        }),
      };
    }

    // I DOUBLED earlier and partner has since made a real bid — I am
    // continuing after my OWN double (e.g. a penalty double of 1NT that
    // partner pulled), not advancing a partner overcall.
    if (
      (myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble") &&
      isRealBid(partnerBid)
    ) {
      return {
        situation: "after-own-double",
        partnerBid,
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
        ...(opponentOpenBid === "1NT" && { doubledBid: "1NT" }),
      };
    }

    // Detect Michaels (partner cuebid the opponents' suit).  You never overcall
    // the opponents' own suit naturally, so a 2-level bid by partner IN a suit
    // an opponent has bid is an artificial two-suiter (Michaels) — NOT a natural
    // overcall.  Classic Michaels cues the OPENING suit; a cue of the
    // responder's suit (e.g. 1♦-1♠ … 2♠) is the same idea.  Pass the cued suit
    // to the handler so it infers the right two-suiter (cue a minor → both
    // majors; cue a major → the other major + an unspecified minor).
    // A cuebid means partner bid a suit the opponents had shown BEFORE
    // partner's call.  An opponent bidding the same suit LATER (e.g. their
    // own cuebid of partner's natural overcall) must NOT be counted — order
    // matters.  Walk the auction in table order up to partner's latest real
    // bid and collect only the opponent suits shown before it.
    // Michaels is a DIRECT cuebid: the LAST real bid before partner's call
    // must itself be the bid partner cued.  A delayed 2♣ over the opener's
    // later 1NT rebid (1♣-P-1♠-P-1NT-2♣) is NATURAL — 1♣ can be three cards
    // and the moment has passed.
    const lastRealBeforePartner = (() => {
      if (!isRealBid(partnerBid)) return undefined;
      const flatMC: { seat: BiddingPosition; call: string }[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS) {
          const b = r[p];
          if (b !== undefined) flatMC.push({ seat: p, call: b });
        }
      }
      for (const p of POSITIONS) {
        if (p < myPosition && currentRound[p] !== undefined)
          flatMC.push({ seat: p, call: currentRound[p]! });
      }
      let partnerIdxMC = -1;
      for (let i = flatMC.length - 1; i >= 0; i--) {
        if (flatMC[i].seat === partner && flatMC[i].call === partnerBid) {
          partnerIdxMC = i;
          break;
        }
      }
      if (partnerIdxMC < 0) return undefined;
      for (let i = partnerIdxMC - 1; i >= 0; i--) {
        const e = flatMC[i];
        if (e.seat !== partner && e.seat !== myPosition && isRealBid(e.call))
          return e.call;
      }
      return undefined;
    })();
    const partnerCueSuitChar =
      isRealBid(partnerBid) && !partnerBid.endsWith("NT")
        ? partnerBid.slice(1)
        : undefined;
    if (
      partnerCueSuitChar !== undefined &&
      lastRealBeforePartner !== undefined &&
      !lastRealBeforePartner.endsWith("NT") &&
      lastRealBeforePartner.slice(1) === partnerCueSuitChar &&
      parseInt(partnerBid[0]) === 2
    ) {
      return {
        situation: "responding-to-michaels",
        lhoBid: partnerBid, // the cued suit carries the info the handler needs
        partnerBid,
        vulnerability: vul,
      };
    }

    // Detect Unusual 2NT
    if (partnerBid === "2NT") {
      return {
        situation: "responding-to-unusual-2nt",
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
      };
    }

    // Partner overcalled
    if (partnerBid === "1NT") {
      // Was partner's 1NT a BALANCING (pass-out seat) action?  Flatten the
      // calls and check whether the two calls immediately before partner's
      // 1NT were both passes with a real bid before them — a balancing 1NT
      // shows only 11-14, a full king lighter than the direct 15-18.
      const flatForBal: { seat: BiddingPosition; call: string }[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS)
          flatForBal.push({ seat: p, call: r[p] ?? "Pass" });
      }
      for (const p of POSITIONS) {
        if (p < myPosition && currentRound[p] !== undefined)
          flatForBal.push({ seat: p, call: currentRound[p]! });
      }
      const ntIdx = flatForBal.map((e) => e.call).lastIndexOf("1NT");
      const partnerBalanced =
        ntIdx >= 3 &&
        flatForBal[ntIdx - 1].call === "Pass" &&
        flatForBal[ntIdx - 2].call === "Pass" &&
        flatForBal.slice(0, ntIdx - 2).some((e) => isRealBid(e.call));
      // Opponents' highest real bid AFTER partner's 1NT — systems are off
      // over it, and suit escapes must clear it.
      let interferenceAfter1NT: string | undefined;
      for (let i = ntIdx + 1; i < flatForBal.length; i++) {
        const e = flatForBal[i];
        if (
          e.seat !== partner &&
          e.seat !== myPosition &&
          isRealBid(e.call) &&
          (!interferenceAfter1NT ||
            BID_ORDER.indexOf(e.call) > BID_ORDER.indexOf(interferenceAfter1NT))
        ) {
          interferenceAfter1NT = e.call;
        }
      }
      return {
        situation: "responding-to-1nt-oc",
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
        ...(partnerBalanced && { balancing: true }),
        ...(interferenceAfter1NT && {
          interferenceOverPartnerNT: interferenceAfter1NT,
        }),
      };
    }

    // Jump or simple overcall?  Measure jump-ness against the auction floor
    // at the moment partner overcalled (NOT against RHO's first bid — see
    // isJumpOvercall doc).
    //
    // A 3-level or 4-level bid is a PREEMPT only if it was a JUMP at the
    // moment partner bid it.  Without this check, e.g. 1♠–Pass–2♠–3♣ would
    // mis-classify partner's forced simple 3♣ overcall as a pre-empt.
    const partnerOvercallFloor =
      auctionFloorBeforeSeatBid(
        completedRounds,
        currentRound,
        partner,
        partnerBid,
      ) ?? effectiveRhoBid;
    const partnerOvercallIsJump = isJumpOvercall(
      partnerBid,
      partnerOvercallFloor,
    );
    if (partnerOvercallIsJump) {
      // Route 3-level / 4-level jumps to the preempt handler when level >= 3,
      // otherwise the standard jump-overcall handler.  Both are jumps, but
      // preempts get specialized advice.
      const partnerLevel = parseInt(partnerBid[0]) || 0;
      if (
        partnerLevel >= 3 &&
        ["3♣", "3♦", "3♥", "3♠", "4♣", "4♦", "4♥", "4♠"].includes(partnerBid)
      ) {
        return {
          situation: "responding-to-preempt-oc",
          partnerBid,
          vulnerability: vul,
        };
      }
      return {
        situation: "responding-to-jump-oc",
        partnerBid,
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
      };
    }
    return {
      situation: "responding-to-simple-oc",
      partnerBid,
      rhoBid: effectiveRhoBid,
      vulnerability: vul,
    };
  }

  // Fallback
  return { situation: "opening", vulnerability: vul };
}

/**
 * Public entry point for auction situation derivation.
 * Always enriches the context with rhoBid and lhoBid (from the full auction
 * state) so that getBidFloorFromContext can compute the correct bid floor
 * even when the internal routing omits opponent bids from the returned context.
 */
export function deriveSituation(
  state: AuctionState,
  vulnerability: Vulnerability = "none",
): AuctionContext {
  const ctx = deriveSituationCore(state, vulnerability);

  // Compute opponent bids and the caller's own last bid directly from the auction
  // state so that getBidFloorFromContext always has the full picture.
  const { myPosition, completedRounds, currentRound } = state;
  const { partner, lho, rho } = getRelatives(myPosition);

  const stdBids = new Set(["Pass", "Double", "Redouble", "Interpret response"]);
  const latestNonPass = (pos: BiddingPosition): string | undefined => {
    const c = currentRound[pos];
    if (c && !stdBids.has(c)) return c;
    for (let i = completedRounds.length - 1; i >= 0; i--) {
      const b = completedRounds[i][pos];
      if (b && !stdBids.has(b)) return b;
    }
    return undefined;
  };

  // My own last real bid (needed for floor calculation when context omits myPreviousBid)
  const myRealBids = completedRounds
    .map((r) => r[myPosition])
    .filter((b): b is string => !!b && !stdBids.has(b));
  const myLastBid = myRealBids.slice(-1)[0];
  // My ORIGINAL opening bid — the first real bid I made.  Distinct from
  // myLastBid in any auction with a rebid; rebid handlers must use this to
  // reason about my opening suit (e.g. weak-2 inquiry detection).
  const myOriginalOpeningBid = myRealBids[0];

  const latestPartnerBid = latestNonPass(partner);

  // For stayman-response, `partnerBid` must stay as the ORIGINAL Stayman reply
  // (2♦, 2♥, or 2♠) so getStaymanFollowUp knows what major partner showed/denied.
  // If partner has since made a continuation bid (e.g. 2NT declining an invitation),
  // that goes into `partnerContinuation` instead.
  const isStaymanResponse = ctx.situation === "stayman-response";
  const partnerBidOut = isStaymanResponse
    ? ctx.partnerBid // preserve original Stayman reply
    : (latestPartnerBid ?? ctx.partnerBid);
  const partnerContinuation =
    isStaymanResponse && latestPartnerBid !== ctx.partnerBid
      ? latestPartnerBid
      : ctx.partnerContinuation;

  // The most recent call overall (flattened seat order), for Double/Redouble
  // legality in the safety net.
  const flatAll: string[] = [];
  for (const r of completedRounds) {
    for (const p of POSITIONS) flatAll.push(r[p] ?? "Pass");
  }
  for (const p of POSITIONS) {
    if (p < myPosition && currentRound[p] !== undefined)
      flatAll.push(currentRound[p]!);
  }
  const lastNonPassCall = [...flatAll].reverse().find((b) => b !== "Pass");

  // The auction's first real bid — identifies openings vs responses for
  // convention detection (e.g. Stayman requires the 1NT to be the OPENING).
  const auctionOpeningBid = (() => {
    for (const r of [...completedRounds, currentRound]) {
      for (const p of POSITIONS) {
        const b = r[p];
        if (b && !stdBids.has(b)) return b;
      }
    }
    return undefined;
  })();

  return {
    ...ctx,
    partnerBid: partnerBidOut,
    partnerContinuation,
    rhoBid: latestNonPass(rho) ?? ctx.rhoBid,
    lhoBid: latestNonPass(lho) ?? ctx.lhoBid,
    myPreviousBid: ctx.myPreviousBid ?? myLastBid,
    myFirstBid: ctx.myFirstBid ?? myOriginalOpeningBid,
    lastCall: lastNonPassCall,
    auctionOpeningBid,
  };
}

// ─── Final contract detection ─────────────────────────────────────────────────

/**
 * Determines whether bidding is complete (3 consecutive passes) and what the
 * final contract is. Inputs remain editable so this recomputes reactively.
 */
export function getFinalContractInfo(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
): {
  isComplete: boolean;
  finalContract: string | undefined;
  /** "doubled" / "redoubled" when the final contract was left in a Double /
   *  Redouble; undefined otherwise.  Kept separate from `finalContract` so
   *  contract parsing stays simple. */
  doubling?: "doubled" | "redoubled";
} {
  const allBids: string[] = [];

  // Flatten completed rounds in position order 1→4
  for (const round of completedRounds) {
    for (const pos of POSITIONS) {
      allBids.push(round[pos] ?? "Pass");
    }
  }

  // Add current-round bids (only positions before me, only if explicitly entered)
  for (let p = 1; p < myPosition; p++) {
    const bid = currentRound[p as BiddingPosition];
    if (bid !== undefined) {
      allBids.push(bid);
    }
  }

  // Determine the last real bid (the final contract candidate) and whether a
  // Double/Redouble followed it (and was never superseded by a new bid).
  let finalContract: string | undefined;
  let doubling: "doubled" | "redoubled" | undefined;
  for (let i = allBids.length - 1; i >= 0; i--) {
    const b = allBids[i];
    if (b === "Redouble" && doubling === undefined) doubling = "redoubled";
    else if (b === "Double" && doubling === undefined) doubling = "doubled";
    if (b !== "Pass" && b !== "Double" && b !== "Redouble") {
      finalContract = b;
      break;
    }
  }

  const isComplete =
    allBids.length >= 3 &&
    allBids.slice(-3).every((b) => b === "Pass") &&
    // Only "bidding complete" when a real bid was made before the passes
    // (or all 4 players opened with a pass — a full passed-out round).
    (finalContract !== undefined || allBids.length >= 4);

  return { isComplete, finalContract, doubling };
}

/**
 * The seat (1-4) that made the final contract bid, or undefined if the deal was
 * passed out.  Used to decide which side declares when handing the contract off
 * to the score sheet.  Mirrors getFinalContractInfo's bid-flattening order.
 */
export function getFinalContractDeclarerSeat(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
): BiddingPosition | undefined {
  const seq: { seat: BiddingPosition; bid: string }[] = [];
  for (const round of completedRounds) {
    for (const pos of POSITIONS) {
      seq.push({ seat: pos, bid: round[pos] ?? "Pass" });
    }
  }
  for (let p = 1; p < myPosition; p++) {
    const bid = currentRound[p as BiddingPosition];
    if (bid !== undefined) seq.push({ seat: p as BiddingPosition, bid });
  }
  for (let i = seq.length - 1; i >= 0; i--) {
    const { seat, bid } = seq[i];
    if (bid !== "Pass" && bid !== "Double" && bid !== "Redouble") return seat;
  }
  return undefined;
}
