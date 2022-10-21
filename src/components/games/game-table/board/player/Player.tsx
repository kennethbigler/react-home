import React from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { green, blueGrey, red, grey } from "@mui/material/colors";
import Hand from "../Hand";
import { DBPlayer } from "../../../../../recoil/player-atom";
import { TurnState } from "../../../../../recoil/turn-atom";
import styles from "./Player.styles";

interface PlayerProps {
  betHandler?: (id: number, event: Event, value: number) => void;
  cardHandler?: (playerNo: number, handNo: number, cardNo: number) => void;
  cardsToDiscard: number[];
  hideHands: boolean;
  isBlackJack: boolean;
  player: DBPlayer;
  playerNo: number;
  turn: TurnState;
}

const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  // get vars from props
  const {
    betHandler,
    cardHandler,
    cardsToDiscard,
    hideHands,
    isBlackJack,
    player,
    playerNo,
    turn,
  } = props;
  // set booleans
  const isPlayerTurn: boolean = !!turn && playerNo === turn.player;
  const isMultiHand: boolean = player.hands.length > 1;
  const showSlider: boolean =
    !!hideHands && isBlackJack && player.id !== 0 && !player.isBot;
  // set slider variables
  const minBet: number = Math.max(Math.min(player.money, 5), 0);
  const maxBet: number = Math.max(Math.min(player.money, 100), 10);
  const step = 5;
  const onSliderChange = React.useCallback(
    (event: Event, value: number | number[]): void => {
      betHandler && betHandler(player.id, event, value as number);
    },
    [betHandler, player.id]
  );
  const weight: React.CSSProperties = {
    fontWeight: isPlayerTurn ? "bold" : "normal",
  };
  // set colors
  let color: React.CSSProperties = { background: grey[900], color: "white" };
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
      <Typography variant="h4" style={{ ...weight }}>
        {`${player.name}: $${player.money}`}
      </Typography>
      {showSlider && (
        <Slider
          max={maxBet}
          min={minBet}
          onChange={onSliderChange}
          step={step}
          style={styles.width}
          value={player.bet}
          aria-label={`adjust bet for ${player.name}`}
        />
      )}
      {isBlackJack && player.id !== 0 && (
        <Typography variant="h5">{`Bet: $${player.bet}`}</Typography>
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
