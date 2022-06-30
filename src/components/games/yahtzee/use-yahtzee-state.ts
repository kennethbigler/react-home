import { useRecoilState } from "recoil";
import yahtzeeAtom, { newYahtzee, Dice } from "../../../recoil/yahtzee-atom";

const useYahtzeeState = () => {
  const [state, setState] = useRecoilState(yahtzeeAtom);

  const newGame = (score: number) =>
    setState({ ...newYahtzee(), scores: [...state.scores, score] });
  const diceClick = (values: Dice[], saved: Dice[]) =>
    setState({
      ...state,
      values,
      saved,
    });
  const updateTop = (topScores: number[]) =>
    setState({
      ...state,
      topScores,
      showScoreButtons: false,
      roll: 0,
      values: [0, 0, 0, 0, 0],
      saved: [],
    });
  const updateBottom = (bottomScores: number[]) =>
    setState({
      ...state,
      bottomScores,
      showScoreButtons: false,
      roll: 0,
      values: [0, 0, 0, 0, 0],
      saved: [],
    });
  const updateRoll = (values: Dice[], saved: Dice[], roll: Dice) =>
    setState({
      ...state,
      values,
      saved,
      roll,
      showScoreButtons: true,
    });

  return {
    state,
    newGame,
    diceClick,
    updateTop,
    updateBottom,
    updateRoll,
  };
};

export default useYahtzeeState;
