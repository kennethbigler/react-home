import React from "react";
import Controls from "./Controls";
import Table from "./Table";
import Equations from "./Equations";
import { ladies, gents } from "../../../constants/ayto";

// pairs.forEach((gentI, ladyI) => {
//   if (confirmed[ladyI] !== -1) // confirmed
//   if (noMatch[ladyI][gentI]) // noMatch
// })
const AreYouTheOne = () => {
  const [roundNumber, setRoundNumber] = React.useState(1);

  const handleSelect = (selected: number) => {
    setRoundNumber(selected);
  };

  return (
    <>
      <h1>Are You The One?</h1>
      <Controls roundNumber={roundNumber} onSelect={handleSelect} />
      <br />
      <Table roundNumber={roundNumber} ladies={ladies} gents={gents} />
      <Equations />
    </>
  );
};

export default AreYouTheOne;
