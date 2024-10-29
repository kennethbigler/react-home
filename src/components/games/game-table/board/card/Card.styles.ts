const cardFace: React.CSSProperties = {
  border: 0,
  backgroundColor: "white",
  borderRadius: 5,
  cursor: "pointer",
  display: "inline-block",
  fontWeight: "bold",
  height: 78,
  margin: 5,
  padding: "0 3px 12px 3px",
  width: 50,
};

const cardTitle: React.CSSProperties = {
  textAlign: "left",
};

const suit: React.CSSProperties = {
  margin: "auto",
  marginTop: 5,
  textAlign: "center",
  width: "100%",
};

export default {
  cardFace,
  cardTitle,
  suit,
};
