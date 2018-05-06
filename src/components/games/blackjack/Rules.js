import React from 'react';
// Parents: Popup

/** ========================================
 * Rules
 * ======================================== */
export const Rules = () => {
  return (
    <div>
      <h4>Objective:</h4>
      <p>
        Get as close to 21 as you can, without going over. Each card is worth
        it&apos;s number, J/Q/K are worth 10, and an Ace is worth 11 unless you
        go over 21, then it is worth 1.
      </p>
      <br />
      <h4>Blackjack:</h4>
      <p>
        Delt an Ace and a 10/J/Q/K, this casino pays 3:2, but Vegas casinos do
        6:5.
      </p>
      <br />
      <h4>Hit:</h4>
      <p>Get an extra card which adds to your total.</p>
      <br />
      <h4>Stay:</h4>
      <p>Move to the next player.</p>
      <br />
      <h4>Double Down:</h4>
      <p>
        This option is available with a two card hand; before another card has
        been drawn double your bet and receive one (and only one) additional
        card to your hand. Play then moves to the next player.
      </p>
      <br />
      <h4>Splitting Pairs:</h4>
      <p>
        When you are dealt a pair of cards of the same rank, you are allowed to
        split into two separate hands and play them independently. You will
        match your bet for the second hand. A double after a split is ok
      </p>
      <br />
      <h4>Resplitting:</h4>
      <p>
        When you get additional pairs in the first two cards of a hand you can
        resplit. Typically a player is allowed to split up to 3 times (delt 4 of
        a kind).
      </p>
      <br />
      <h4>Splitting Aces:</h4>
      <p>
        Player is limited to drawing only one additional card on each Ace. If
        you draw a ten-valued card on one of your split Aces, the hand is not
        considered a Blackjack (it is treated as a normal 21). You can re-split
        Aces.
      </p>
      <br />
      <h4>Other Rules:</h4>
      <ul>
        <li>Dealer hits on 16 or less and soft 17</li>
        <li>Minimum bet is $5</li>
      </ul>
      <h4>AI Algorithm:</h4>
      <ul>
        <li>House Rules: 6 decks, H17, DAS, No Surrender, Peek</li>
        <li>Estimated casino edge for these rules: 0.66%</li>
      </ul>
    </div>
  );
};
