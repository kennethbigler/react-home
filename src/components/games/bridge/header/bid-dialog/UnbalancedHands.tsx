import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { memo } from "react";

const UnbalancedHands = memo(() => (
  <>
    <TableHead>
      <TableRow>
        <TableCell colSpan={6}>
          <Typography variant="h6" component="h4">
            <span style={{ fontWeight: "bold" }}>Unbalanced Hands</span> (Points
            shown are Total Points. Raising partner&apos;s suit: add Short Suit
            Points instead of Long Suit Points.)
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={13}>13-21</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>
          Opening Bids of 1 of a Suit
        </TableCell>
        <TableCell>0-5</TableCell>
        <TableCell>Pass</TableCell>
        <TableCell />
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={2}>
          Open all hands with 13 Total Points.
          <br />
          With 12 Total Points use the Rule of 20 test (see below).
        </TableCell>
        <TableCell sx={{ fontWeight: "bold" }} colSpan={2}>
          3 or more cards in openers major suit
        </TableCell>
        <TableCell sx={{ fontWeight: "bold" }} colSpan={2}>
          After same suit response
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>6-9</TableCell>
        <TableCell>Raise to 2 level</TableCell>
        <TableCell rowSpan={3} />
        <TableCell rowSpan={3}>
          If max combined points below game, pass.
          <br />
          If game possible if partner max, raise 1 level to invite game.
          <br />
          If game is certain even if partner minimum, bid game.
          <br />
          If partner raised to 2 of minor, bid 3NT with 19-21.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={2}>
          <span style={{ fontWeight: "bold" }}>
            With a 5 card or longer suit:
          </span>
          <br />
          Bid the longest suit.
          <br />
          Bid the higher ranking of suits of equal length.
        </TableCell>
        <TableCell>10-12</TableCell>
        <TableCell>Raise to 3 level</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>13+</TableCell>
        <TableCell>Bid a new suit</TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={4}>
          <span style={{ fontWeight: "bold" }}>
            With no 5 card or longer suit:
          </span>
          <br />
          Bid the longer minor (may be only 3 cards).
          <br />
          Bid 1♦️ with 4 ♣️s &amp; 4 ♦️s
          <br />
          Bid 1♣️ with 3 ♣️s &amp; 3 ♦️s
        </TableCell>
        <TableCell sx={{ fontWeight: "bold" }} colSpan={2}>
          Bid a new suit (forcing)
        </TableCell>
        <TableCell sx={{ fontWeight: "bold" }} colSpan={2}>
          After a new suit or 1NT response
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>6-10</TableCell>
        <TableCell>Bid 4+ card suit at the 1 level</TableCell>
        <TableCell rowSpan={3}>13-15</TableCell>
        <TableCell rowSpan={3}>
          Raise responder&apos;s major suit with a 4+ cards.
          <br />
          Bid a new suit at the 1 level if possible.
          <br />
          Bid a new lower ranking suit at the 2 level.
          <br />
          Rebid your own suit (usually 6+ cards but sometimes 5)
          <br />
          If responder bid 1NT, pass with less than 6 card suit.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>11-18</TableCell>
        <TableCell>
          Bid a new suit at the 2 level with 5+ card major suit or 4+ card minor
          suit
          <br />
          <span style={{ textDecoration: "underline" }}>
            but only if you can&apos;t bid at the 1 level
          </span>
          .
          <br />
          (With less than 12 HCP bid 4 card major at the 1 level
          <br />
          in preference to bidding longer minor suit at the 2 level)
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>19+</TableCell>
        <TableCell>Jump bid in a new suit. Must be 5+ card suit.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={4}>
          <span style={{ fontWeight: "bold" }}>Rule of 20:</span>
          <br />
          With 12 Total Points do the &apos;Rule of 20&apos; test.
          <br />
          If the total of all your High Card Points (HCP)
          <br />
          + the total # of cards in your 2 longest suits
          <br />
          = 20 or more, you may open the bidding.
          <br />
          If not, pass.
        </TableCell>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
          If none of the above are possible, raise partner&apos;s minor suit or
          bid No Trump
        </TableCell>
        <TableCell rowSpan={3}>16-18</TableCell>
        <TableCell rowSpan={3}>
          Jump support responder&apos;s major with 4+ cards (or with 3 cards if
          the response was 2❤️).
          <br />
          Bid a new suit &apos;above the barrier&apos;.
          <br />
          Bid a new lower ranking suit at the 2 level if no &apos;above the
          barrier bid is available&apos;.
          <br />
          Notice this bid shows 13-18 range.
          <br />
          Jump rebid own suit with 6+ cards.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>6-10</TableCell>
        <TableCell>Bid 1NT - need not be balanced.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>11-12</TableCell>
        <TableCell>Bid 2NT with balanced hand.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>13-15</TableCell>
        <TableCell>Bid 3NT with balanced hand.</TableCell>
        <TableCell>19-21</TableCell>
        <TableCell>
          Bid game in partner&apos;s major suit with 4+ cards.
          <br />
          Otherwise jump bid in a new suit or bid game in own suit or 3NT.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={4}>5-10 HCP</TableCell>
        <TableCell rowSpan={4}>
          <span style={{ fontWeight: "bold" }}>
            Opening Bids of 2♦️, 2❤️, or 2♠️ (&quot;Weak 2s&quot;):
          </span>
          <br />
          Needs 6 card suit with good suit quality &amp; a hand with less than
          13 total points.
          <br />
          Should have no outside 4 card major.
        </TableCell>
        <TableCell>0-14</TableCell>
        <TableCell>
          Raise to the 3 level with 3 card support
          <br />
          Raise to the 4 level with 4 card support or if game is certain
          opposite a minimum hand.
        </TableCell>
        <TableCell />
        <TableCell>
          Raises are pre-emptive &amp; not invitational so pass if partner
          raises.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={3}>15+</TableCell>
        <TableCell rowSpan={3}>
          Bid 2NT to find out more from partner or bid a new suit (forcing).
          <br />
          Bid 3NT to play if game is certain.
        </TableCell>
        <TableCell sx={{ fontWeight: "bold" }} colSpan={2}>
          After a 2NT response:
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>5-7</TableCell>
        <TableCell>Bid 3 of own suit with minimum hand.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>8-10</TableCell>
        <TableCell>
          Bid a suit containing an Ace or King or bid 3NT with 2 of the top 3
          honors in trumps
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={2}>22+</TableCell>
        <TableCell rowSpan={2}>
          <span style={{ fontWeight: "bold" }}>Opening Bid of 2♣️</span>
          <br />
          22+ total points unbalanced or 22+ HCP balanced
        </TableCell>
        <TableCell>0-7</TableCell>
        <TableCell>Bid 2♦️ (negative response).</TableCell>
        <TableCell />
        <TableCell>
          Over 2♦️ bid 2NT with 22-24 balanced (not forcing).
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>8+</TableCell>
        <TableCell>
          or with any 1 Ace &amp; 1 King make a positive response.
        </TableCell>
        <TableCell />
        <TableCell>Any other rebid is forcing to game.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={2}>5-10 HCP</TableCell>
        <TableCell rowSpan={2}>
          <span style={{ fontWeight: "bold" }}>
            Pre-Emptive Opening Bids of 3 of a Suit
          </span>
          <br />
          7 card suit with good suit quality &amp; no 4 card major.
          <br />
          Less than 13 total points.
          <br />
          With 8 cards, open 4 of the suit.
        </TableCell>
        <TableCell>0-15</TableCell>
        <TableCell>
          Less than 3 card support, PASS.
          <br />
          3+ support, raise 1 level.
        </TableCell>
        <TableCell rowSpan={2} />
        <TableCell rowSpan={2}>
          Don&apos;t bid again unless responder bid a new suit (forcing).
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>16+</TableCell>
        <TableCell>
          Bid game in opener&apos;s suit or bid a new suit (forcing).
          <br />
          Be cautious about bidding 3NT as opener will have few entries.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
    </TableBody>
  </>
));

UnbalancedHands.displayName = "UnbalancedHands";

export default UnbalancedHands;
