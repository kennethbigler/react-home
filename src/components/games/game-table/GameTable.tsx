import React from 'react';
import Board from './board/Board';
import ButtonGroup from './button-group/ButtonGroup';
import { DBPlayer, DBTurn } from '../../../store/types';

interface GameTableProps {
  betHandler?: (id: number, event: React.ChangeEvent<Record<string, unknown>>, value: number) => void;
  cardClickHandler?: (playerNo: number, handNo: number, cardNo: number) => void;
  cardsToDiscard?: number[];
  gameFunctions?: string[];
  gameOver?: boolean;
  hideHands?: boolean;
  isBlackJack?: boolean;
  onClick: (name: string) => void;
  players: DBPlayer[];
  turn: DBTurn;
}

/* GameTable ->  Board -> Player -> Hand -> Card
 *          |->  Button Group  ->  Button        */
const GameTable = (props: GameTableProps): React.ReactElement => {
  const {
    betHandler, cardClickHandler,
    cardsToDiscard = [], gameFunctions = [],
    gameOver = false, hideHands = false, isBlackJack = true,
    players, turn, onClick,
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
            <ButtonGroup gameFunctions={gameFunctions} onClick={onClick} />
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
            <ButtonGroup gameFunctions={gameFunctions} onClick={onClick} />
          </>
        )}
    </>
  );
};

export default GameTable;
