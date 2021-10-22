import React from 'react';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import GameTable from '../game-table';
import { updateCardsToDiscard } from '../../../store/modules/poker';
import { DBRootState } from '../../../store/types';
import usePokerFunctions from './hooks';

const Poker: React.FC = () => {
  const {
    turn, players, cardsToDiscard, gameFunctions,
    gameOver, hideHands,
  } = useSelector((state: DBRootState) => ({
    turn: state.turn,
    players: state.players,
    ...state.poker,
  }));
  const dispatch = useDispatch();

  /** function to be called on card clicks */
  const cardClickHandler = React.useCallback((playerNo: number, handNo: number, cardNo: number): void => {
    const newCardsToDiscard = [...cardsToDiscard];
    // find card
    const i = newCardsToDiscard.indexOf(cardNo);
    // toggle in array
    i === -1 ? newCardsToDiscard.push(cardNo) : newCardsToDiscard.splice(i, 1);
    // update state
    dispatch(updateCardsToDiscard(newCardsToDiscard));
  }, [cardsToDiscard, dispatch]);

  const { checkUpdate, handleGameFunctionClick } = usePokerFunctions(
    dispatch,
    cardsToDiscard,
    players,
    turn.player,
    hideHands,
    gameOver,
  );

  checkUpdate();

  return (
    <>
      <Typography variant="h2" gutterBottom>
        5 Card Draw Poker
      </Typography>
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
};

export default Poker;
