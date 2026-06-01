import { playerDist } from "../../../constants/botc";
import { ActiveScript, BaseScript } from "../../../jotai/botc-atom";

/** Pre-parsed playerDist: [townsfolk, outsiders, minions, demons] per player count */
const PLAYER_DIST_PARSED: [number, number, number, number][] = playerDist.map(
  (s) => {
    if (!s) return [0, 0, 0, 0];
    const [tf, out, min, dem] = s.split(",").map(Number);
    return [tf, out, min, dem];
  },
);

export const getGridSize = (pc: number, i: number) => {
  if (i < 3 || (pc % 2 === 0 && i >= pc - 3)) {
    return 4;
  } else if (pc % 2 === 1 && i >= pc - 2) {
    return 6;
  }
  return 5;
};

export const getLieSeries = (
  numPlayers: number,
  numTravelers: number,
  script: ActiveScript,
) => {
  const [, outsiders, minions, demons] = PLAYER_DIST_PARSED[numPlayers];
  let numEvil: number = minions + demons;

  if (numTravelers >= 3) {
    numEvil += 2; // Evil Travelers
  } else if (numTravelers > 0) {
    numEvil += 1; // Evil Traveler
  }

  let numDrunk: number = numTravelers >= 4 ? 1 : 0;

  if (script.type === "community" || script.index === BaseScript.Other) {
    numEvil += Math.min(outsiders, 1); // Evil Outsider 😈
    numDrunk += Math.min(outsiders, 2) + Math.min(minions, 2); // Outsider 🍺😡 + Minion 🧪😡
  } else {
    switch (script.index) {
      case BaseScript.TB:
        numDrunk += Math.min(outsiders, 1) + Math.min(minions, 1); // Outsider 🍺 + Minion 🧪
        break;
      case BaseScript.SNV:
        numDrunk += Math.min(outsiders, 1) + Math.min(minions, 2); // Outsider 🍺😡 + Minion 🧪😡
        numEvil += Math.min(outsiders, 1); // Evil Outsider 😈
        break;
      case BaseScript.BMR:
        numDrunk += 1; // Lunatic 😡
        if (outsiders >= 1) {
          numEvil += 1; // Goon 😈
        }
        break;
    }
  }

  const numLie: number = Math.ceil(
    0.2 * (numPlayers + numTravelers - numEvil - numDrunk - 1),
  );
  const numTrue: number =
    numPlayers + numTravelers - numEvil - numDrunk - numLie - 1;

  return [
    { name: "😈", y: numEvil },
    { name: "🍺🧪😡", y: numDrunk },
    { name: "🤥", y: numLie },
    { name: "✅", y: numTrue },
  ];
};
