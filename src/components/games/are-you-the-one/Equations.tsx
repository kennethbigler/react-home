import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ladies, gents } from "../../../constants/ayto";
import { DBRootState } from "../../../store/types";

const Equations = () => {
  // Redux
  const { roundPairings /* , matches, noMatches */ } = useSelector(
    (state: DBRootState) => ({ ...state.ayto })
  );
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Equations</h1>
    </div>
  );
};

export default Equations;
