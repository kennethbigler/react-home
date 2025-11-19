const useBridgeScorer = (
  declarerTricks: number,
  contractTricks: number,
  isWe: boolean,
  contractSuit: string,
  isDouble: boolean,
  isRedouble: boolean,
  is4Aces: boolean,
  is4Honours: boolean,
  is5Honours: boolean,
) => {
  const madeBid = declarerTricks >= contractTricks + 6;

  let winner: "we" | "they";
  if (madeBid) {
    winner = isWe ? "we" : "they";
  } else {
    winner = !isWe ? "we" : "they";
  }

  let aboveTheLine: number = 0;
  if (madeBid) {
    if (contractSuit === "minor") {
      aboveTheLine = contractTricks * 20;
    } else if (contractSuit === "major") {
      aboveTheLine = contractTricks * 30;
    } else {
      aboveTheLine = 40 + (contractTricks - 1) * 30;
    }
  }

  let belowTheLine: number = 0;
  const isVulnerable = false;
  if (madeBid) {
    // check for slams
    const slamMultiplier = 1 * (isDouble ? 2 : 1) * (isRedouble ? 2 : 1);
    if (contractTricks === 6) {
      belowTheLine += slamMultiplier * (isVulnerable ? 500 : 750);
    } else if (contractTricks === 7) {
      belowTheLine += slamMultiplier * (isVulnerable ? 1000 : 1500);
    }

    // check for overtricks
    if (declarerTricks > contractTricks + 6) {
      const overtricks = declarerTricks - contractTricks - 6;
      if (!isDouble) {
        belowTheLine += overtricks * (contractSuit === "minor" ? 20 : 30);
      } else {
        const multiplier = 1 * (isVulnerable ? 2 : 1) * (isRedouble ? 2 : 1);
        belowTheLine += overtricks * 100 * multiplier;
      }
    }

    // check for honours
    if (contractSuit === "nt" && is4Aces) {
      belowTheLine += 150;
    } else if (contractSuit !== "nt") {
      if (is5Honours) {
        belowTheLine += 150;
      } else if (is4Honours) {
        belowTheLine += 100;
      }
    }
    if (isRedouble) {
      belowTheLine += 100;
    } else if (isDouble) {
      belowTheLine += 50;
    }
  } else {
    // check for undertricks
    const undertricks = contractTricks + 6 - declarerTricks - 1; // -1 for 0 indexing
    const lookupIdx = 0 + (isVulnerable ? 1 : 0) + (isDouble ? 2 : 0);
    const multiplier = isRedouble ? 2 : 1;
    const undertrickTable = [
      [50, 100, 100, 200],
      [100, 200, 300, 500],
      [150, 300, 500, 800],
      [200, 400, 800, 1100],
      [250, 500, 1100, 1400],
      [350, 600, 1200, 1700],
      [400, 700, 1400, 2000],
      [450, 800, 1600, 2300],
      [500, 900, 1800, 2700],
      [550, 1000, 2000, 3000],
      [600, 1100, 2200, 3300],
      [650, 1200, 2400, 3600],
      [700, 1300, 2600, 3900],
    ];
    belowTheLine += undertrickTable[undertricks][lookupIdx] * multiplier;
  }

  return {
    winner,
    madeBid,
    aboveTheLine,
    belowTheLine,
  };
};

export default useBridgeScorer;
