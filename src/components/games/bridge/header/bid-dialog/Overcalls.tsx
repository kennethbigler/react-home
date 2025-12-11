import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { memo } from "react";

const Overcalls = memo(() => (
  <>
    <TableHead>
      <TableRow>
        <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>
          <Typography variant="h5" component="h3">
            Overcalls
          </Typography>
        </TableCell>
        <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>
          <Typography variant="h5" component="h3">
            Responding to Overcalls
          </Typography>
        </TableCell>
        <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>
          <Typography variant="h5" component="h3">
            No Fear Bridge Cheat Sheet
          </Typography>
          <Typography variant="h6" component="h4">
            American Style 5 Card Majors &amp; String 1NT (15-17)
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={5}>
          <span style={{ fontWeight: "bold" }}>
            Takeout
            <br />
            Double
          </span>
          <br />
          12-15
        </TableCell>
        <TableCell rowSpan={5}>
          With opening strength &amp; good shape (4441, 5440, 0 or 1 card in
          opponent&apos;s suit).
          <br />
          Shape is less important the higher the point count but you must be
          prepared to play in any suit bid by partner.
          <br />
          Do not bid again unless partner promises points.
        </TableCell>
        <TableCell>6-10</TableCell>
        <TableCell>
          1NT Balanced with 1 stopper in opponent&apos;s suit.
        </TableCell>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }} align="center">
          <Typography variant="h6" component="h4">
            Stayman (NT Response)
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>11-12</TableCell>
        <TableCell>
          2NT Balanced with 1 stopper in opponent&apos;s suit.
        </TableCell>
        <TableCell>
          1NT
          <br />
          Open?
        </TableCell>
        <TableCell>Bid 2♣️ to check for major suit fit.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>13-15</TableCell>
        <TableCell>
          3NT Balanced with 1 stopper in opponent&apos;s suit.
        </TableCell>
        <TableCell colSpan={2}>Partner&apos;s responses are:</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>0-8</TableCell>
        <TableCell>
          Bid your longest suit.
          <br />
          Bid 4+ card major in preference to longer minor.
          <br />
          With few points &amp; no other suit than the opponent&apos;s suit bid
          your cheapest 3 card suit.
        </TableCell>
        <TableCell>
          2♦️
          <br />
          2❤️
          <br />
          2♠️
        </TableCell>
        <TableCell>
          = no 4 card major
          <br /> = 4 ❤️s
          <br />= 4 ♠️s
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>9-12</TableCell>
        <TableCell>Jump bid in your longest suit.</TableCell>
        <TableCell>0-7</TableCell>
        <TableCell>
          If 4-5 or 5-4 in majors, bid a major after 2♦️ reply.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>16+</TableCell>
        <TableCell>
          With 6 card suit, first double, then rebid 6 card suit.
        </TableCell>
        <TableCell>13+</TableCell>
        <TableCell>Jump bid in your longest suit.</TableCell>
        <TableCell>8+</TableCell>
        <TableCell>
          If partner bids 2♦️, &amp; no 4 card major available, bid 2NT.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={9}>
          <span style={{ fontWeight: "bold" }}>
            Simple
            <br />
            Overcall
          </span>
          <br />
          8-15 HCP
        </TableCell>
        <TableCell rowSpan={9}>
          Must be a 5 card suit (w/ 2 honors if minimum points).
          <br />
          Avoid overcall w/ 5332 shape unless strong hand or suit.
          <br />
          Bid at the 1 level.
        </TableCell>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
          After an overcall at the 1 level with support:
        </TableCell>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }} align="center">
          <Typography variant="h6" component="h4">
            Red Suit Transfers
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>0-9</TableCell>
        <TableCell>
          With 3+ card support raise to the level of the fit.
        </TableCell>
        <TableCell colSpan={2} rowSpan={10}>
          Respond to 1NT opening or overcall, &amp; 2NT opening
          <br />
          when you have a 5+ card major suit
          <br />
          Bid ♦️ for ❤️, bid ❤️ for ♠️.
          <br />
          NT bidder must bid next suit:
          <br />
          e.g. 1NT, pass, 2♦️, pass, 2❤️
          <br />
          With no chance of game: transfer &amp; then PASS.
          <br />
          <br />
          Game hand &amp; 6+ cards: transfer then bid major game.
          <br />
          Game hand &amp; 5 cards: transfer then bid 3NT.
          <br />
          <br />
          Partner: convert to game in major w/ 3 card support.
          <br />
          Invitational hand &amp; 6+ cards: transfer then bid 3 major.
          <br />
          Invitational hand &amp; 5 cards: transfer then bid 2NT.
          <br />
          <br />
          <span style={{ fontWeight: "bold" }}>
            Transferring to ♣️s or ♦️s:
          </span>
          <br />
          With a weak hand &amp; a 6+ card minor suit bid 2♠️.
          <br />
          1NT bidder must bid 3♣️.
          <br />
          Responder passes or converts to 3♦️.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>10+</TableCell>
        <TableCell>
          Cue bid opener&apos;s suit to find out more about partner&apos;s hand.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
          After an overcall at the 1 level without support:
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>0-8</TableCell>
        <TableCell>Pass without 3 card support.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>9+</TableCell>
        <TableCell>Bid a very good new 5+ card suit (not forcing)</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>9-12</TableCell>
        <TableCell>1NT with a stopper in opener&apos;s suit.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>13-14</TableCell>
        <TableCell>2NT with a stopper in opener&apos;s suit.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>15+</TableCell>
        <TableCell>3NT</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>10-15 HCP</TableCell>
        <TableCell>
          Can bid at the 2 level if necessary.
          <br />
          Only bid a 5 card suit at the 2 level if very strong.
          <br />
          Similar principles apply after a 1NT opening.
        </TableCell>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
          After an overcall at the 2 level:
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>16+</TableCell>
        <TableCell>
          If you have a 6 card suit, first double, then rebid the suit.
        </TableCell>
        <TableCell />
        <TableCell>Same as if partner opened bidding</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={3}>
          <span style={{ fontWeight: "bold" }}>
            Jump
            <br />
            Overcall
          </span>
          <br />
          5-10
        </TableCell>
        <TableCell>
          A 6 card suit containing 2 honors if jump is at 2 level.
        </TableCell>
        <TableCell>6-10</TableCell>
        <TableCell>
          With 3+ card support, give a single raise.
          <br />
          Without support, pass, DO NOT BID OWN SUIT.
        </TableCell>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }} align="center">
          <Typography variant="h6" component="h4">
            Gerber (NT Response)
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={2}>
          A 7 card suit with 2 honors if jump is at 3 level.
        </TableCell>
        <TableCell>11-12</TableCell>
        <TableCell>Bid game with a fit or 2NT.</TableCell>
        <TableCell>
          4♣️
          <br />
          Aces?
        </TableCell>
        <TableCell>4♦️=0 or 4, 4❤️=1, 4♠️=2, 4NT=3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>13+</TableCell>
        <TableCell>Bid game with a fit or 3NT.</TableCell>
        <TableCell>
          5♣️
          <br />
          Kings?
        </TableCell>
        <TableCell>5♦️=0 or 4, 5❤️=1, 5♠️=2, 5NT=3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell>
          <span style={{ fontWeight: "bold" }}>
            Pre-
            <br />
            Emptive
            <br />
            Overcall
          </span>
          <br />
          6-10
        </TableCell>
        <TableCell>
          With good suit quality &amp; 7+ card suit:
          <br />
          Jump 2 levels (double jump)
          <br />
          Use with caution if vulnerable.
        </TableCell>
        <TableCell />
        <TableCell>
          Respond in the same way as an opening pre-emptive bid.
        </TableCell>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }} align="center">
          <Typography variant="h6" component="h4">
            Blackwood (4NT)
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
        <TableCell colSpan={2} />
      </TableRow>
      <TableRow>
        <TableCell>
          <span style={{ fontWeight: "bold" }}>
            Strong
            <br />
            Overcall
          </span>
          <br />
          15-18
        </TableCell>
        <TableCell>
          1NT - balanced hand w/ stopper in opponent&apos;s suit.
        </TableCell>
        <TableCell rowSpan={2} />
        <TableCell rowSpan={2}>
          Respond in the same way as an opening bid of 1NT.
        </TableCell>
        <TableCell>
          4NT
          <br />
          Aces?
        </TableCell>
        <TableCell>
          5♣️=0 or 4, 5♦️=1, 5❤️=2, 5♠️=3
          <br />
          No points for slam? Bid 5 of unbid suit.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>19+</TableCell>
        <TableCell>
          Balanced hand, double, then rebid NT at lowest level.
        </TableCell>
        <TableCell>
          5NT
          <br />
          Kings?
        </TableCell>
        <TableCell>
          6♣️=0 or 4, 6♦️=1, 6❤️=2, 6♠️=3
          <br />
          No points for slam? Pass.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
        <TableCell colSpan={2} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={2}>
          <span style={{ fontWeight: "bold" }}>
            Double
            <br />
            of 1NT
          </span>
          <br />
          16+
        </TableCell>
        <TableCell rowSpan={2}>This is always a penalty double.</TableCell>
        <TableCell>0-4</TableCell>
        <TableCell>If very unbalanced, bid your longest suit.</TableCell>
        <TableCell rowSpan={2} colSpan={2}>
          Do not ask for Kings unless you know
          <br />
          you have the strength for a grand slam.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>5+</TableCell>
        <TableCell>Generally pass.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
    </TableBody>
    <TableHead>
      <TableRow>
        <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>
          <Typography variant="h5" component="h3">
            Hand Valuation
          </Typography>
        </TableCell>
        <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>
          <Typography variant="h5" component="h3">
            Contract Limit Guide
          </Typography>
        </TableCell>
        <TableCell colSpan={2} />
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>HCP</TableCell>
        <TableCell>High Card Points: Ace=4, King=3, Queen=2, Jack=1</TableCell>
        <TableCell>19-24</TableCell>
        <TableCell>Non-Game Bids</TableCell>
        <TableCell colSpan={2} rowSpan={7} align="center">
          Learn more online at
          <br />
          <a
            href="https://www.nofearbridge.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.nofearbridge.com
          </a>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          Long Suit Points: 1 for every card more than 4.
        </TableCell>
        <TableCell>25+</TableCell>
        <TableCell>3NT or 4❤️♠️</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          Short Suit Points: (with trump fit only): 0=5, 1=3, 2=1
        </TableCell>
        <TableCell>29+</TableCell>
        <TableCell>5♣️♦️</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          Use Short Suit Points instead of Long Suit Points
          <br />
          when raising partner&apos;s suit.
        </TableCell>
        <TableCell>31+</TableCell>
        <TableCell>&amp; 6 in suit? Small Slam (6)</TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={3}>TP</TableCell>
        <TableCell>Total Points</TableCell>
        <TableCell>33+</TableCell>
        <TableCell>6NT</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>HCP + Long Suit Points OR</TableCell>
        <TableCell>35+</TableCell>
        <TableCell>&amp; 7 in suit? Grand Slam (7)</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>HCP + Short Suit Points</TableCell>
        <TableCell>37+</TableCell>
        <TableCell>7NT</TableCell>
      </TableRow>
    </TableBody>
  </>
));

Overcalls.displayName = "Overcalls";

export default Overcalls;
