import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import GameTable from '../game-table';
import { updateCardsToDiscard } from '../../../store/modules/poker';
import { DBRootState } from '../../../store/types';
import usePokerFunctions from './hooks';

const LAST_PLAYER = 5;

const Poker: React.FC<{}> = () => {
  const {
    turn, players, cardsToDiscard, gameFunctions,
    previousPlayer, hideHands,
  } = useSelector((state: DBRootState) => ({
    turn: state.turn,
    players: state.players,
    ...state.poker,
  }));
  const dispatch = useDispatch();

  /** function to be called on card clicks */
  const cardClickHandler = (playerNo: number, handNo: number, cardNo: number): void => {
    const newCardsToDiscard = [...cardsToDiscard];
    // find card
    const i = newCardsToDiscard.indexOf(cardNo);
    // toggle in array
    i === -1 ? newCardsToDiscard.push(cardNo) : newCardsToDiscard.splice(i, 1);
    // update state
    dispatch(updateCardsToDiscard(newCardsToDiscard));
  };

  const { checkUpdate, handleGameFunctionClick } = usePokerFunctions({
    turn,
    players,
    cardsToDiscard,
    gameFunctions,
    previousPlayer,
    hideHands,
    dispatch,
  });

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
        gameOver={previousPlayer >= LAST_PLAYER}
        hideHands={hideHands}
        isBlackJack={false}
        players={players}
        turn={turn}
      />
    </>
  );
};

export default Poker;
