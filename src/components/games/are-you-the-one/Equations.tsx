import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DBRootState } from "../../../store/types";

interface EquationsProps {
  ladies: string[];
  gents: string[];
}

const Equations = (props: EquationsProps) => {
  const { ladies, gents } = props;
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
