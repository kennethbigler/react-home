import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { memo } from "react";

const BalancedHands = memo(() => (
  <>
    <TableHead>
      <TableRow>
        <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>
          <Typography variant="h5" component="h3">
            Opening Bids
          </Typography>
        </TableCell>
        <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>
          <Typography variant="h5" component="h3">
            Responding Bids
          </Typography>
        </TableCell>
        <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>
          <Typography variant="h5" component="h3">
            Opener&apos;s Rebids
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} align="center">
          <Typography variant="h6" component="h4">
            <span style={{ fontWeight: "bold" }}>Balanced Hands</span> (Point
            Counts Shown are High Card Points)
          </Typography>
        </TableCell>
        <TableCell rowSpan={2} />
        <TableCell rowSpan={2}>
          See responses to opening bids of 1 of a suit
        </TableCell>
        <TableCell rowSpan={2} />
        <TableCell rowSpan={2}>
          Give a single raise with 4 card support for responder&apos;s suit.
          <br />
          Show a 4 card major at the 1 level.
          <br />
          Otherwise rebid NT at the lowest level.
          <br />
          Pass if the response was 1NT.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>12-14</TableCell>
        <TableCell>
          Open 1 of a suit (1♣️ or 1♦️ if no 5 card major) then rebid NT
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={7}>15-17</TableCell>
        <TableCell rowSpan={7}>Open 1NT</TableCell>
        <TableCell>0-7</TableCell>
        <TableCell>Balanced: Pass</TableCell>
        <TableCell rowSpan={3} />
        <TableCell rowSpan={3}>
          Raise 2NT to 3NT with 17 points, otherwise Pass.
          <br />
          Raise 4NT to 6NT with 17 points, otherwise Pass.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>8-15</TableCell>
        <TableCell>
          Balanced (or unbalanced 5+ minor): 8-9&nbsp;2NT, 10-15&nbsp;3NT
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>16-17</TableCell>
        <TableCell>Balanced: 4NT invitational to 6NT</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>0-7</TableCell>
        <TableCell>
          Unbalanced: Transfer (see overleaf) then Pass
          <br />
          (2♣️ is reserved for &apos;Stayman&apos; convention - see overleaf)
        </TableCell>
        <TableCell rowSpan={2} />
        <TableCell rowSpan={2}>
          Transfers (see overleaf):
          <br />
          Bid 2❤️ when partner bids 2♦️
          <br />
          Bid 2♠️ when partner bids 2❤️
          <br />
          Bid 3♣️ when partner bids 2♠️
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>8+</TableCell>
        <TableCell>With 4 card major suit bid 2♣️ (Stayman)</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>8-9</TableCell>
        <TableCell>
          With 6+ card major transfer then bid 3 of the major, invitational.
          <br />
          With 5 card major transfer then bid 2NT, invitational.
        </TableCell>
        <TableCell />
        <TableCell>
          Raise partner&apos;s invitational bid with 17 points.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>10+</TableCell>
        <TableCell>
          With 6+ card major transfer then bid game in the major.
          <br />
          With 5 card major transfer then bid 3NT.
        </TableCell>
        <TableCell />
        <TableCell>
          Convert partner&apos;s NT bid (in a transfer sequence) to major suit
          contract
          <br />
          when holding 3+ cards in the major.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell>18-19</TableCell>
        <TableCell>First open 1 of a suit then jump rebid NT</TableCell>
        <TableCell />
        <TableCell>See responses to opening bids of 1 of a suit</TableCell>
        <TableCell />
        <TableCell>
          Jump rebid NT (except with 4 cards in responder&apos;s major).
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
      <TableRow>
        <TableCell rowSpan={3}>20-21</TableCell>
        <TableCell rowSpan={3}>Open 2NT</TableCell>
        <TableCell>0-3</TableCell>
        <TableCell>Pass</TableCell>
        <TableCell>Pass?</TableCell>
        <TableCell>Pass</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>4-11</TableCell>
        <TableCell>
          Balanced or long minor: Bid 3NT
          <br />
          With 6+ card major suit transfer then bid game in the major.
          <br />
          with 5 card major suit transfer then bid 3NT.
          <br />
          With 4 card major suit bid 3♣️ (Stayman)
        </TableCell>
        <TableCell />
        <TableCell>
          Transfers (see overleaf):
          <br />
          Bid 3❤️ when partner bids 3♦️.
          <br />
          Bid 3♠️ when partner bids 3❤️.
          <br />
          <br />
          Convert partner&apos;s NT bid (in a transfer sequence) to major suit
          contract
          <br />
          when holding 3+ cards in the major.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>12</TableCell>
        <TableCell>Balanced: 4NT invitational to 6NT</TableCell>
        <TableCell>4NT?</TableCell>
        <TableCell>21 points? Raise 4NT to 6NT, otherwise Pass.</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
    </TableBody>
  </>
));

BalancedHands.displayName = "BalancedHands";

export default BalancedHands;
