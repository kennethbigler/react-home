import { memo } from "react";
import Typography from "@mui/material/Typography";

const Rules = memo(() => (
  <>
    <Typography variant="h5">Objective:</Typography>
    <Typography>
      Get as close to 21 as you can, without going over. Each card is worth
      it&apos;s number, J/Q/K are worth 10, and an Ace is worth 11 unless you go
      over 21, then it is worth 1.
    </Typography>
    <br />
    <Typography variant="h5">Blackjack:</Typography>
    <Typography>
      Delt an Ace and a 10/J/Q/K, this casino pays 3:2, but Vegas casinos do
      6:5.
    </Typography>
    <br />
    <Typography variant="h5">Hit:</Typography>
    <Typography>Get an extra card which adds to your total.</Typography>
    <br />
    <Typography variant="h5">Stay:</Typography>
    <Typography>Move to the next player.</Typography>
    <br />
    <Typography variant="h5">Double Down:</Typography>
    <Typography>
      This option is available with a two card hand; before another card has
      been drawn double your bet and receive one (and only one) additional card
      to your hand. Play then moves to the next player.
    </Typography>
    <br />
    <Typography variant="h5">Splitting Pairs:</Typography>
    <Typography>
      When you are dealt a pair of cards of the same rank, you are allowed to
      split into two separate hands and play them independently. You will match
      your bet for the second hand. A double after a split is ok
    </Typography>
    <br />
    <Typography variant="h5">Resplitting:</Typography>
    <Typography>
      When you get additional pairs in the first two cards of a hand you can
      resplit. Typically a player is allowed to split up to 3 times (delt 4 of a
      kind).
    </Typography>
    <br />
    <Typography variant="h5">Splitting Aces:</Typography>
    <Typography>
      Player is limited to drawing only one additional card on each Ace. If you
      draw a ten-valued card on one of your split Aces, the hand is not
      considered a Blackjack (it is treated as a normal 21). You can re-split
      Aces.
    </Typography>
    <br />
    <Typography variant="h5">Other Rules:</Typography>
    <ul>
      <li>
        <Typography>Dealer hits on 16 or less and soft 17</Typography>
      </li>
      <li>
        <Typography>Minimum bet is $5</Typography>
      </li>
    </ul>
    <Typography variant="h5">AI Algorithm:</Typography>
    <ul>
      <li>
        <Typography>
          House Rules: 6 decks, H17, DAS, No Surrender, Peek
        </Typography>
      </li>
      <li>
        <Typography>Estimated casino edge for these rules: 0.66%</Typography>
      </li>
    </ul>
  </>
));

Rules.displayName = "Rules";

export default Rules;
