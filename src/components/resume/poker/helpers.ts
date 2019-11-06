import reduce from 'lodash/reduce';
import hasIn from 'lodash/hasIn';
import { PokerScoreEntry } from '../../../constants/poker';

/** Helper function that takes an array and changes scores to be
 * the sums for a player, rather than just the single night
 *
 * @param {Array} scores - array of objects containing a night's results
 * @returns {Object} totals for all of the players
 */
const parseData = (scores: PokerScoreEntry[]): { totals: PokerScoreEntry; parsedScores: PokerScoreEntry[] } => {
  const totals: PokerScoreEntry = {};

  // iterate over all the scores
  const parsedScores = scores.map((week) => {
    // iterate over the players in a week
    const parsedWeek = reduce(week, (acc: PokerScoreEntry, val, key) => {
      if (hasIn(totals, key) && key !== 'name') {
        // update total with value (if total exists)
        totals[key] += val;
        acc[key] = totals[key];
      } else if (key !== 'name') {
        // add value to totals obj (totals did not exist)
        totals[key] = val;
        acc[key] = totals[key];
      } else {
        // key == name
        acc[key] = val;
      }
      return acc;
    }, {});
    return parsedWeek;
  });

  return { parsedScores, totals };
};

export default parseData;
