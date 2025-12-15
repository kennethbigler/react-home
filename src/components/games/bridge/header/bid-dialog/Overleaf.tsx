import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { memo } from "react";

const Overleaf = memo(() => (
  <>
    <TableHead>
      <TableRow>
        <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>
          <Typography variant="h5" component="h3">
            No Fear Bridge Cheat Sheet
          </Typography>
          <Typography variant="h6" component="h4">
            American Style 5 Card Majors &amp; String 1NT (15-17)
          </Typography>
        </TableCell>
        <TableCell colSpan={2} align="center">
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
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
    </TableHead>
    <TableHead>
      <TableRow>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }} align="center">
          <Typography variant="h6" component="h4">
            Stayman (NT Response)
          </Typography>
        </TableCell>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }} align="center">
          <Typography variant="h6" component="h4">
            Red Suit Transfers
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>
          1NT
          <br />
          Open?
        </TableCell>
        <TableCell>Bid 2♣️ to check for major suit fit.</TableCell>
        <TableCell colSpan={2}>
          Respond to 1NT &amp; 2NT opening with a 5+ card major suit
          <br />
          Bid ♦️ for ❤️, bid ❤️ for ♠️.
          <br />
          NT bidder must bid next suit (e.g. 1NT, pass, 2♦️, pass, 2❤️)
          <br />
          With no chance of game: transfer &amp; then PASS.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>Partner&apos;s responses are:</TableCell>
        <TableCell colSpan={2}>
          Game hand &amp; 6+ cards: transfer then bid major game.
          <br />
          Game hand &amp; 5 cards: transfer then bid 3NT.
        </TableCell>
      </TableRow>
      <TableRow>
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
        <TableCell colSpan={2}>
          Partner: convert to game in major w/ 3 card support.
          <br />
          Invitational hand &amp; 6+ cards: transfer then bid 3 major.
          <br />
          Invitational hand &amp; 5 cards: transfer then bid 2NT.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>0-7</TableCell>
        <TableCell>
          If 4-5 or 5-4 in majors, bid a major after 2♦️ reply.
        </TableCell>
        <TableCell colSpan={2} rowSpan={2}>
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
        <TableCell>8+</TableCell>
        <TableCell>
          If partner bids 2♦️, &amp; no 4 card major available, bid 2NT.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ backgroundColor: grey[800] }} />
      </TableRow>
    </TableBody>
    <TableHead>
      <TableRow>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }} align="center">
          <Typography variant="h6" component="h4">
            Gerber
          </Typography>
        </TableCell>
        <TableCell colSpan={2} sx={{ fontWeight: "bold" }} align="center">
          <Typography variant="h6" component="h4">
            Blackwood (4NT)
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell colSpan={2}>
          A bid over an opening bid of 1NT or 2NT.
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
        <TableCell>
          4♣️
          <br />
          Aces?
        </TableCell>
        <TableCell>4♦️=0 or 4, 4❤️=1, 4♠️=2, 4NT=3</TableCell>
        <TableCell colSpan={2}>
          Do not ask for Kings unless you know
          <br />
          you have the strength for a grand slam.
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          5♣️
          <br />
          Kings?
        </TableCell>
        <TableCell>5♦️=0 or 4, 5❤️=1, 5♠️=2, 5NT=3</TableCell>
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
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>HCP</TableCell>
        <TableCell>High Card Points: Ace=4, King=3, Queen=2, Jack=1</TableCell>
        <TableCell>19-24</TableCell>
        <TableCell>Non-Game Bids</TableCell>
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

Overleaf.displayName = "Overleaf";

export default Overleaf;
