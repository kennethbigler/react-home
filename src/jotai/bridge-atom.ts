import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type AboveScores = [
  [number[], number[]],
  [number[], number[]],
  [number[], number[]],
];

export interface BridgeState {
  aboveScores: AboveScores;
  weBelow: number[];
  theyBelow: number[];
  weRubbers: number;
  theyRubbers: number;
}

export const newBridgeGame: () => Omit<
  BridgeState,
  "weRubbers" | "theyRubbers"
> = () => ({
  aboveScores: [
    [[], []],
    [[], []],
    [[], []],
  ],
  weBelow: [],
  theyBelow: [],
});

const bridgeAtom = atomWithStorage<BridgeState>("bridgeAtom", {
  ...newBridgeGame(),
  weRubbers: 0,
  theyRubbers: 0,
});

const sum = (scores: number[]) => scores.reduce((acc, n) => acc + n, 0);

export const bridgeRead = atom((get) => {
  // access state
  const { aboveScores: aScores, weBelow, theyBelow } = get(bridgeAtom);
  // track wins
  let weWins = 0;
  let theyWins = 0;
  let gameIdx = 0;
  let weSum = sum(weBelow);
  let theySum = sum(theyBelow);
  // calculate wins
  aScores.forEach(([we, they]) => {
    const weScore = sum(we);
    const theyScore = sum(they);
    weSum += weScore;
    theySum += theyScore;
    if (weScore > theyScore && weScore >= 100) {
      weWins += 1;
      gameIdx += 1;
    } else if (theyScore > weScore && theyScore >= 100) {
      theyWins += 1;
      gameIdx += 1;
    }
  });
  // calculate vulnerabilities
  const weVulnerable = weWins > 0;
  const theyVulnerable = theyWins > 0;

  return {
    gameIdx,
    weSum,
    weWins,
    weVulnerable,
    theySum,
    theyWins,
    theyVulnerable,
  };
});

export default bridgeAtom;
