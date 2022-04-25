import React from "react";
import Controls from "./controls/Controls";
import Table from "./table/Table";
import Equations from "./Equations";
import { ladies, gents, options } from "../../../constants/ayto";

/**
 * TODO:
 * replace Dropdown with MUI Dropdown when available
 * if an equation exists in another equation, sub it out for remaining number
 * add percent likelihood to equations
 * consider making this the connected component and pass redux info down
 * on Match, update so that all future matchup-s have that match
 */
const AreYouTheOne = () => {
  const [roundNumber, setRoundNumber] = React.useState(0);

  const handleSelect = (selected: number) => {
    setRoundNumber(selected);
  };

  return (
    <>
      <h1>Are You The One?</h1>
      <Controls
        roundNumber={roundNumber}
        options={options}
        onSelect={handleSelect}
      />
      <br />
      <Table
        roundNumber={roundNumber}
        ladies={ladies}
        gents={gents}
        options={options}
      />
      <Equations ladies={ladies} gents={gents} />
    </>
  );
};

export default AreYouTheOne;
