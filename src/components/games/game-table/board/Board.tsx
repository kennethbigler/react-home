import React from 'react';
import Player from './player/Player';
import { DBPlayer, DBTurn } from '../../../../store/types';
// Parents: GameTable

interface BoardProps {
  betHandler?: (id: number, event: React.ChangeEvent<Record<string, unknown>>, value: number) => void;
  cardHandler?: (playerNo: number, handNo: number, cardNo: number) => void;
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
      {players.map((player, i) => (
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
