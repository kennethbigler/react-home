import { memo } from "react";
import GameTable from "../game-table";
import usePoker from "./usePoker";
import Header from "./Header";

const Poker = memo(() => {
  const {
    checkUpdate,
    cardClickHandler,
    cardsToDiscard,
    gameFunctions,
    handleGameFunctionClick,
    gameOver,
    hideHands,
    players,
    turn,
  } = usePoker();

  checkUpdate();

  return (
    <>
      <Header />
      <GameTable
        cardClickHandler={cardClickHandler}
        cardsToDiscard={cardsToDiscard}
        gameFunctions={gameFunctions}
        onClick={handleGameFunctionClick as (name: string) => void}
        gameOver={gameOver}
        hideHands={hideHands}
        isBlackJack={false}
        players={players}
        turn={turn}
      />
    </>
  );
});

Poker.displayName = "Poker";

export default Poker;
