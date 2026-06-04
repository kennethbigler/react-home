/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380
 * split aces is not blackjack
 * get second card for dealer and hide it
 * buy insurance on dealer's Ace
 */
import { memo, useEffect } from "react";
import useBlackjackAI from "./useBlackjackAI";
import Header from "./Header";
import GameTable from "../game-table";
import { catchErr } from "./catchErr";

const BlackJack = memo(() => {
  const {
    betHandler,
    checkUpdate,
    gameFunctions,
    handleClick,
    hideHands,
    players,
    turn,
  } = useBlackjackAI();

  useEffect(() => {
    checkUpdate().catch(catchErr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn.player, turn.hand, hideHands]);

  return (
    <>
      <Header />
      <GameTable
        betHandler={betHandler}
        gameFunctions={gameFunctions}
        onClick={handleClick}
        hideHands={hideHands}
        players={players}
        turn={turn}
      />
    </>
  );
});

BlackJack.displayName = "BlackJack";

export default BlackJack;
