import { CSSProperties } from "react";
import Add from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Remove from "@mui/icons-material/Remove";
import Typography from "@mui/material/Typography";
import { green, blueGrey, red, grey } from "@mui/material/colors";
import Hand from "../Hand";
import { DBPlayer } from "../../../../../jotai/player-atom";
import { TurnState } from "../../../../../jotai/turn-atom";
import styles from "./Player.styles";

interface PlayerProps {
  betHandler?: (id: number, value: number) => void;
  cardHandler?: (playerNo: number, handNo: number, cardNo: number) => void;
  cardsToDiscard: number[];
  hideHands: boolean;
  isBlackJack: boolean;
  player: DBPlayer;
  playerNo: number;
  turn: TurnState;
}

const Player = ({
  betHandler,
  cardHandler,
  cardsToDiscard,
  hideHands,
  isBlackJack,
  player,
  playerNo,
  turn,
}: PlayerProps) => {
  // set booleans
  const isPlayerTurn: boolean = !!turn && playerNo === turn.player;
  const isMultiHand: boolean = player.hands.length > 1;
  const showBetting: boolean =
    !!hideHands && isBlackJack && player.id !== 0 && !player.isBot;
  // set edge variables
  const minBet: number = Math.max(Math.min(player.money, 5), 0);
  const maxBet: number = Math.max(Math.min(player.money, 100), 10);
  const decrBet = () => {
    if (betHandler) {
      betHandler(player.id, player.bet - 5);
    }
  };
  const incrBet = () => {
    if (betHandler) {
      betHandler(player.id, player.bet + 5);
    }
  };
  const weight: CSSProperties = {
    fontWeight: isPlayerTurn ? "bold" : "normal",
  };
  // set colors
  let color: CSSProperties = { background: grey[900], color: "white" };
  if (player.status === "win") {
    color = { background: green[300], color: "white" };
  } else if (player.status === "draw") {
    color = { background: blueGrey[300], color: "white" };
  } else if (player.status === "lose") {
    color = { background: red[300], color: "white" };
  } else if (isPlayerTurn) {
    color = { background: grey[300], color: "black" };
  }

  return (
    <Card style={{ ...styles.player, ...color }}>
      <Typography variant="h4" component="h2" style={{ ...weight }}>
        {`${player.name}: $${player.money}`}
      </Typography>
      {showBetting && (
        <IconButton
          onClick={decrBet}
          color="primary"
          disabled={player.bet <= minBet}
        >
          <Remove />
        </IconButton>
      )}
      {player.bet}
      {showBetting && (
        <IconButton
          onClick={incrBet}
          color="primary"
          disabled={player.bet >= maxBet}
        >
          <Add />
        </IconButton>
      )}
      {isBlackJack && player.id !== 0 && (
        <Typography
          variant="h5"
          component="h3"
        >{`Bet: $${player.bet}`}</Typography>
      )}
      {player.hands.map((hand, i) => {
        const isHandTurn: boolean = !!turn && turn.hand === i;
        return (
          <div key={`hand${i}`}>
            {!hideHands && (
              <Hand
                cardHandler={cardHandler}
                cardsToDiscard={cardsToDiscard}
                hand={hand}
                handNo={i}
                isBlackJack={isBlackJack}
                isHandTurn={isHandTurn}
                isMultiHand={isMultiHand}
                isPlayerTurn={isPlayerTurn}
                playerNo={playerNo}
              />
            )}
          </div>
        );
      })}
    </Card>
  );
};

export default Player;
