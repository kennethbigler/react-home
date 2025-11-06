import { useMemo } from "react";
import Board from "./board/Board";
import ButtonGroup from "./button-group/ButtonGroup";
import { DBPlayer } from "../../../jotai/player-atom";
import { TurnState } from "../../../jotai/turn-atom";

interface GameTableProps {
  betHandler?: (id: number, value: number) => void;
  cardClickHandler?: (playerNo: number, handNo: number, cardNo: number) => void;
  cardsToDiscard?: number[];
  gameFunctions?: string[];
  gameOver?: boolean;
  hideHands?: boolean;
  isBlackJack?: boolean;
  onClick: (name: string) => void;
  players: DBPlayer[];
  turn: TurnState;
}

/* GameTable ->  Board -> Player -> Hand -> Card
 *          |->  Button Group  ->  Button        */
const GameTable = ({
  betHandler,
  cardClickHandler,
  cardsToDiscard = [],
  gameFunctions = [],
  gameOver = false,
  hideHands = false,
  isBlackJack = true,
  players,
  turn,
  onClick,
}: GameTableProps) => {
  // move game buttons to make turn more obvious and support mobile
  const played: DBPlayer[] = useMemo(
    () => players.slice(0, turn.player + 1),
    [players, turn.player],
  );
  const future: DBPlayer[] = useMemo(
    () => players.slice(turn.player + 1),
    [players, turn.player],
  );
  const playersToDisplay: DBPlayer[] = useMemo(
    () =>
      !hideHands && gameOver === false
        ? players.slice(turn.player, turn.player + 1)
        : players,
    [hideHands, gameOver, players, turn.player],
  );

  return isBlackJack && !hideHands ? (
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
  );
};

export default GameTable;
