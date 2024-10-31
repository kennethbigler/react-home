import * as React from "react";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import styles from "./Card.styles";

interface CardProps {
  cardHandler?: (playerNo: number, handNo: number, cardNo: number) => void;
  cardNo: number;
  dropped: boolean;
  handNo: number;
  name: string;
  playerNo: number;
  suit: string;
}

const Card = React.memo((props: CardProps) => {
  const { dropped, suit, name, cardHandler, playerNo, handNo, cardNo } = props;
  // handle click to for card
  const handleClick = React.useCallback((): void => {
    if (cardHandler) {
      cardHandler(playerNo, handNo, cardNo);
    }
  }, [cardHandler, cardNo, handNo, playerNo]);
  // checking color based off suits: ♣♦♥♠
  const cardColor: React.CSSProperties = {
    color: suit === "♣" || suit === "♠" ? "black" : red[500],
    backgroundColor: dropped ? red[100] : "white",
  };

  return (
    <button style={{ ...styles.cardFace, ...cardColor }} onClick={handleClick}>
      <div style={styles.cardTitle}>{name + suit}</div>
      <Typography variant="h4" style={{ ...styles.suit, ...cardColor }}>
        {suit}
      </Typography>
    </button>
  );
});

Card.displayName = "Card";

export default Card;
