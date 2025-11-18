import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type AboveScores = [
  [number[], number[]],
  [number[], number[]],
  [number[], number[]],
];
// TODO: replace with connected data at some point
const aboveScores: AboveScores = [
  [[], []],
  [[], []],
  [[], []],
];
const weBelow: number[] = [];
const theyBelow: number[] = [];

export interface BridgeState {
  aboveScores: AboveScores;
  weBelow: number[];
  theyBelow: number[];
  weRubbers: number;
  theyRubbers: number;
}

const initialState: BridgeState = {
  aboveScores,
  weBelow,
  theyBelow,
  weRubbers: 0,
  theyRubbers: 0,
};

const bridgeAtom = atomWithStorage<BridgeState>("bridgeAtom", initialState);

const sum = (scores: number[]) => scores.reduce((acc, n) => acc + n, 0);

export const bridgeRead = atom((get) => {
  // access state
  const { aboveScores: aScores } = get(bridgeAtom);
  // track wins
  let weWins = 0;
  let theyWins = 0;
  // calculate wins
  aScores.forEach(([we, they]) => {
    const weScore = sum(we);
    const theyScore = sum(they);
    if (weScore > theyScore && weScore >= 100) {
      weWins += 1;
    } else if (theyScore > weScore && theyScore >= 100) {
      theyWins += 1;
    }
  });
  // calculate vulnerabilities
  const weVulnerable = weWins > 0;
  const theyVulnerable = theyWins > 0;

  return {
    weVulnerable,
    theyVulnerable,
    weWins,
    theyWins,
  };
});

export default bridgeAtom;
