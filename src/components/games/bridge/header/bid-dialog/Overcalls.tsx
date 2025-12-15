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
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
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
      </TableRow>
      <TableRow>
        <TableCell>11-12</TableCell>
        <TableCell>
          2NT Balanced with 1 stopper in opponent&apos;s suit.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>13-15</TableCell>
        <TableCell>
          3NT Balanced with 1 stopper in opponent&apos;s suit.
        </TableCell>
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
      </TableRow>
      <TableRow>
        <TableCell>9-12</TableCell>
        <TableCell>Jump bid in your longest suit.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>16+</TableCell>
        <TableCell>
          With 6 card suit, first double.
          <br />
          Second rebid 6 card suit.
        </TableCell>
        <TableCell>13+</TableCell>
        <TableCell>Jump bid in your longest suit.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>19+</TableCell>
        <TableCell>
          With balanced hand, first double.
          <br />
          Second rebid NT at lowest level.
        </TableCell>
        <TableCell />
        <TableCell>
          After double, bid like above.
          <br />
          After NT bid like 1NT response.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={2} sx={{ fontWeight: "bold" }}>
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
      </TableRow>
      <TableRow>
        <TableCell>5+</TableCell>
        <TableCell>Generally pass.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
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
      </TableRow>
      <TableRow>
        <TableCell>0-9</TableCell>
        <TableCell>
          With 3+ card support raise to the level of the fit.
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
        <TableCell>See Takeout Double above.</TableCell>
        <TableCell />
        <TableCell>See Takeout Double above.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
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
      </TableRow>
      <TableRow>
        <TableCell rowSpan={2}>
          A 7 card suit with 2 honors if jump is at 3 level.
        </TableCell>
        <TableCell>11-12</TableCell>
        <TableCell>Bid game with a fit or 2NT.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>13+</TableCell>
        <TableCell>Bid game with a fit or 3NT.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
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
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
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
        <TableCell />
        <TableCell>Response same as to 1NT open.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
    </TableBody>
  </>
));

Overcalls.displayName = "Overcalls";

export default Overcalls;
