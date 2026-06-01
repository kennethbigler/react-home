import { playerDist } from "../../../constants/botc";
import { ActiveScript } from "../../../jotai/botc-atom";

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
  const dist = playerDist[numPlayers].split(",").map((d) => parseInt(d, 10));

  const [_townsfolk, outsiders, minions, demons] = dist;
  let numEvil: number = minions + demons;
  if (numTravelers >= 3) {
    // Evil Travelers
    numEvil += 2;
  } else if (numTravelers > 0) {
    // Evil Traveler
    numEvil += 1;
  }

  let numDrunk: number = numTravelers >= 4 ? 1 : 0;
  if (script.type === "community") {
    numDrunk += Math.min(outsiders, 2); // Outsider 🍺😡
    numDrunk += Math.min(minions, 2); // Minion 🧪😡
    numEvil += Math.min(outsiders, 1); // Evil Outsider 😈
  } else {
    switch (script.index) {
      case 0:
        // TB
        numDrunk += Math.min(outsiders, 1); // Outsider 🍺
        numDrunk += Math.min(minions, 1); // Minion 🧪
        break;
      case 1:
        // S&V
        numDrunk += Math.min(outsiders, 1); // Outsider 🍺😡
        numDrunk += Math.min(minions, 2); // Minion 🧪😡
        numEvil += Math.min(outsiders, 1); // Evil Outsider 😈
        break;
      case 2:
        // BMR - +1 Outsider for Godfather
        if (outsiders >= 0) {
          numDrunk += 1; // Lunatic 😡
          if (outsiders >= 1) {
            numEvil += 1; // Goon 😈
          }
        }
        break;
      case 3: // Other
      default:
        numDrunk += Math.min(outsiders, 2); // Outsider 🍺😡
        numDrunk += Math.min(minions, 2); // Minion 🧪😡
        numEvil += Math.min(outsiders, 1); // Evil Outsider 😈
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
