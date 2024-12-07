import { useAtom } from "jotai";
import yahtzeeState, { newYahtzee, Dice } from "../../../jotai/yahtzee-state";

const useYahtzeeState = () => {
  const [state, setState] = useAtom(yahtzeeState);

  const newGame = (score: number) =>
    setState({
      ...newYahtzee(),
      lastScore: score,
      bestScore: score > state.bestScore ? score : state.bestScore,
      money: state.money + Math.ceil(score / 10),
    });
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
  const updateRoll = (
    values: Dice[],
    saved: Dice[],
    roll: Dice,
    payToPlay: boolean,
  ) =>
    setState({
      ...state,
      values,
      saved,
      roll,
      showScoreButtons: true,
      money: payToPlay ? state.money - 25 : state.money,
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
