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
            <span style={{ fontWeight: "bold" }}>Unbalanced Hands</span> (Point
            counts shown below are Total Points except where shown. When raising
            partner&apos;s suit, add Short Suit Points instead of Long Suit
            Points.)
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell rowSpan={14}>13-21</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>
          Opening Bids of 1 of a Suit
        </TableCell>
        <TableCell>0-5</TableCell>
        <TableCell>Pass</TableCell>
        <TableCell />
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={3}>
          Open all hands with 13 Total Points. With 12 Total Points use the Rule
          of 20 test (see below).
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
        <TableCell>10-12</TableCell>
        <TableCell>Raise to 3 level</TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={3}>
          <span style={{ fontWeight: "bold" }}>
            With a 5 card or longer suit:
          </span>
          <br />
          Bid the longest suit.
          <br />
          Bid the higher ranking of suits of equal length.
        </TableCell>
        <TableCell>13+</TableCell>
        <TableCell>Bid a new suit</TableCell>
      </TableRow>
      <TableRow>
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
        <TableCell rowSpan={3}>
          <span style={{ fontWeight: "bold" }}>
            With no 5 card or longer suit:
          </span>
          <br />
          Bid the longer minor (may be only 3 cards).
          <br />
          Bid 1♦️ with 4 clubs and 4 diamonds
          <br />
          Bid 1♣️ with 3 clubs and 3 diamonds
        </TableCell>
        <TableCell>11-18</TableCell>
        <TableCell>
          Bid a new suit at the 2 level with 5+ card major suit or 4+ card minor
          suit{" "}
          <span style={{ textDecoration: "underline" }}>
            but only if you can&apos;t bid at the 1 level
          </span>
          .
          <br />
          (With less than 12 HCP bid 4 card major at the 1 level in preference
          to bidding longer minor suit at the 2 level)
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>19+</TableCell>
        <TableCell>Jump bid in a new suit. Must be 5+ card suit.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
          If none of the above are possible, raise partner&apos;s minor suit or
          bid No Trump
        </TableCell>
        <TableCell rowSpan={3}>16-18</TableCell>
        <TableCell rowSpan={3}>
          Jump support responder&apos;s major with 4+ cards (or with 3 cards if
          the response was 2❤️). Bid a new suit &apos;above the barrier&apos;.
          <br />
          Bid a new lower ranking suit at the 2 level if no &apos;above the
          barrier bid is available&apos;. Notice this bid shows 13-18 range.
          <br />
          Jump rebid own suit with 6+ cards.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={4}>
          <span style={{ fontWeight: "bold" }}>Rule of 20:</span>
          <br />
          With 12 Total Points do the &apos;Rule of 20&apos; test.
          <br />
          If the total of all your HCP plus the total number of cards in your 2
          longest suits is 20 or more you may open the bidding.
          <br />
          If not, pass.
        </TableCell>
        <TableCell>6-10</TableCell>
        <TableCell>Bid 1NT - need not be balanced.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>11-12</TableCell>
        <TableCell>Bid 2NT* with balanced hand.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>13-15</TableCell>
        <TableCell>Bid 3NT* with balanced hand.</TableCell>
        <TableCell rowSpan={2}>19-21</TableCell>
        <TableCell rowSpan={2}>
          Bid game in partner&apos;s major suit with 4+ cards. Otherwise jump
          bid in a new suit or bid game in own suit or 3NT.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>*</TableCell>
        <TableCell>*See note overleaf about 2NT and 3NT responses.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
    </TableBody>
  </>
));

UnbalancedHands.displayName = "UnbalancedHands";

export default UnbalancedHands;
