import { memo, useCallback, CSSProperties } from "react";
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

const Card = memo(
  ({
    dropped,
    suit,
    name,
    cardHandler,
    playerNo,
    handNo,
    cardNo,
  }: CardProps) => {
    // handle click to for card
    const handleClick = useCallback((): void => {
      if (cardHandler) {
        cardHandler(playerNo, handNo, cardNo);
      }
    }, [cardHandler, cardNo, handNo, playerNo]);
    // checking color based off suits: ♣♦♥♠
    const cardColor: CSSProperties = {
      color: suit === "♣" || suit === "♠" ? "black" : red[500],
      backgroundColor: dropped ? red[100] : "white",
    };

    return (
      <button
        style={{ ...styles.cardFace, ...cardColor }}
        onClick={handleClick}
      >
        <div style={styles.cardTitle}>{name + suit}</div>
        <Typography variant="h4" style={{ ...styles.suit, ...cardColor }}>
          {suit}
        </Typography>
      </button>
    );
  },
);

Card.displayName = "Card";

export default Card;
