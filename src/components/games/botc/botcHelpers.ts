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

  let numEvil: number = dist[2] + dist[3];
  if (numTravelers >= 3) {
    // Evil Travelers
    numEvil += 2;
  } else if (numTravelers > 0) {
    // Evil Traveler
    numEvil += 1;
  }
  if ((script.type === "community" || script.index !== 0) && dist[1] > 0) {
    // Evil Outsider
    numEvil += 1;
  }

  let numDrunk: number = numTravelers >= 4 ? 1 : 0;
  if (script.type === "community") {
    numDrunk += Math.min(dist[1], 2); // Outsider 🍺😡
    numDrunk += Math.min(dist[2], 2); // Minion 🧪😡
  } else {
    switch (script.index) {
      case 0:
        // TB
        numDrunk += Math.min(dist[1], 1); // Outsider 🍺
        numDrunk += Math.min(dist[2], 1); // Minion 🧪
        break;
      case 1:
        // S&V
        numDrunk += Math.min(dist[1], 1); // Outsider 🍺😡
        numDrunk += Math.min(dist[2], 2); // Minion 🧪😡
        break;
      case 3: // Other
        numDrunk += Math.min(dist[1], 2); // Outsider 🍺😡
        numDrunk += Math.min(dist[2], 2); // Minion 🧪😡
        break;
      default: // BMR (case 2) — no additional drunk
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
