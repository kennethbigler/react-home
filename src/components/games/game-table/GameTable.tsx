import React from 'react';
import Board from './board/Board';
import ButtonGroup from './button-group/ButtonGroup';
import { ButtonProps } from './button-group/Button';
import { DBPlayer, DBTurn } from '../../../store/types';

interface GameTableProps {
  betHandler?: Function;
  cardClickHandler?: Function;
  cardsToDiscard: number[];
  gameFunctions: ButtonProps[];
  gameOver: boolean;
  hideHands: boolean;
  isBlackJack: boolean;
  players: DBPlayer[];
  turn: DBTurn;
}

/* GameTable ->  Board -> Player -> Hand -> Card
 *          |->  Button Group  ->  Button        */
const GameTable: React.FC<GameTableProps> & { defaultProps: Partial<GameTableProps> } = (props: GameTableProps) => {
  const {
    betHandler, cardClickHandler, cardsToDiscard, gameFunctions,
    gameOver, hideHands, isBlackJack, players, turn,
  } = props;

  // move game buttons to make turn more obvious and support mobile
  const played: DBPlayer[] = React.useMemo(() => players.slice(0, turn.player + 1), [players, turn.player]);
  const future: DBPlayer[] = React.useMemo(() => players.slice(turn.player + 1), [players, turn.player]);
  const playersToDisplay: DBPlayer[] = React.useMemo(() => (
    (!hideHands && gameOver === false)
      ? players.slice(turn.player, turn.player + 1)
      : players
  ), [hideHands, gameOver, players, turn.player]);

  return (
    <>
      {isBlackJack && !hideHands
        ? (
          <>
            <Board
              players={played}
              betHandler={betHandler}
              cardHandler={cardClickHandler}
              cardsToDiscard={cardsToDiscard}
              hideHands={hideHands}
              isBlackJack={isBlackJack}
              turn={turn}
            />
            <ButtonGroup gameFunctions={gameFunctions} />
            <Board
              players={future}
              betHandler={betHandler}
              cardHandler={cardClickHandler}
              cardsToDiscard={cardsToDiscard}
              hideHands={hideHands}
              isBlackJack={isBlackJack}
              turn={{ player: -1, hand: -1 }}
            />
          </>
        ) : (
          <>
            <Board
              players={playersToDisplay}
              betHandler={betHandler}
              cardHandler={cardClickHandler}
              cardsToDiscard={cardsToDiscard}
              hideHands={hideHands}
              isBlackJack={isBlackJack}
              turn={turn}
            />
            <ButtonGroup gameFunctions={gameFunctions} />
          </>
        )}
    </>
  );
};

GameTable.defaultProps = {
  isBlackJack: true,
  hideHands: false,
  gameOver: false,
  cardsToDiscard: [],
};

export default GameTable;
