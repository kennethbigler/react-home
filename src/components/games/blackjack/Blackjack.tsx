/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380
 * split aces is not blackjack
 * get second card for dealer and hide it
 * buy insurance on dealer's Ace
 */
import { memo } from "react";
import useBlackjackAI from "./useBlackjackAI";
import Header from "./Header";
import GameTable from "../game-table";

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

  checkUpdate().catch((e) => console.error(e));

  return (
    <>
      <Header />
      <GameTable
        betHandler={betHandler}
        gameFunctions={gameFunctions}
        onClick={handleClick as (type: string) => void}
        hideHands={hideHands}
        players={players}
        turn={turn}
      />
    </>
  );
});

BlackJack.displayName = "BlackJack";

export default BlackJack;
