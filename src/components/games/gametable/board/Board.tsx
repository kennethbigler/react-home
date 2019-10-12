import React from 'react';
import map from 'lodash/map';
import Player from './player/Player';
import { DBPlayer, DBTurn } from '../../../../store/types';
// Parents: GameTable

interface BoardProps {
  betHandler?: Function;
  cardHandler?: Function;
  cardsToDiscard: number[];
  hideHands: boolean;
  isBlackJack: boolean;
  players: DBPlayer[];
  turn: DBTurn;
}

const Board: React.FC<BoardProps> = (props: BoardProps) => {
  const {
    betHandler, cardHandler, cardsToDiscard, hideHands,
    isBlackJack, players, turn,
  } = props;

  return (
    <>
      {map(players, (player, i) => (
        <Player
          key={`player${i}`}
          betHandler={betHandler}
          cardHandler={cardHandler}
          cardsToDiscard={cardsToDiscard}
          hideHands={hideHands}
          isBlackJack={isBlackJack}
          player={player}
          playerNo={i}
          turn={turn}
        />
      ))}
    </>
  );
};

export default Board;
