import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { memo } from "react";

const Overleaf = memo(() => (
  <>
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

Overleaf.displayName = "Overleaf";

export default Overleaf;
