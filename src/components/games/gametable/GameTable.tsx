import React from 'react';
import Board from './board/Board';
import { DBPlayer, DBTurn } from './board/player/Player';
import ButtonGroup from './button-group/ButtonGroup';
import { ButtonProps } from './button-group/Button';
// Parents: BlackJack

interface GameTableProps {
  betHandler?: Function;
  cardClickHandler?: Function;
  cardsToDiscard?: number[];
  gameFunctions: ButtonProps[];
  gameOver?: boolean;
  hideHands?: boolean;
  isBlackJack?: boolean;
  players: DBPlayer[];
  turn: DBTurn;
}

/* GameTable ->  Board -> Player -> Hand -> Card
 *          |->  Button Group  ->  Button
 */
const GameTable: React.FC<GameTableProps> = (props: GameTableProps) => {
  const {
    betHandler, cardClickHandler, cardsToDiscard, gameFunctions,
    gameOver, hideHands, isBlackJack, players,
    turn,
  } = props;

  // move game buttons to make turn more obvious and support mobile
  const played = players.slice(0, turn.player + 1);
  const future = players.slice(turn.player + 1);
  const playersToDisplay = !hideHands && gameOver === false
    ? players.slice(turn.player, turn.player + 1)
    : players;

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
              turn={turn}
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
};

export default GameTable;
