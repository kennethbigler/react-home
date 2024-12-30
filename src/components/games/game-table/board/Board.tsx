import Player from "./player/Player";
import { DBPlayer } from "../../../../jotai/player-atom";
import { TurnState } from "../../../../jotai/turn-atom";
// Parents: GameTable

interface BoardProps {
  betHandler?: (id: number, value: number) => void;
  cardHandler?: (playerNo: number, handNo: number, cardNo: number) => void;
  cardsToDiscard: number[];
  hideHands: boolean;
  isBlackJack: boolean;
  players: DBPlayer[];
  turn: TurnState;
}

const Board = ({
  betHandler,
  cardHandler,
  cardsToDiscard,
  hideHands,
  isBlackJack,
  players,
  turn,
}: BoardProps) => (
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

export default Board;
