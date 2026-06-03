import { memo, useEffect } from "react";
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

  useEffect(() => {
    checkUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn.player, turn.hand, hideHands, gameOver]);

  return (
    <>
      <Header />
      <GameTable
        cardClickHandler={cardClickHandler}
        cardsToDiscard={cardsToDiscard}
        gameFunctions={gameFunctions}
        onClick={handleGameFunctionClick}
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
