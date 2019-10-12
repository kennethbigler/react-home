import forEach from 'lodash/forEach';
import get from 'lodash/get';
import { DBCard } from '../../../store/types';

/** calculate the weight of a hand */
export default function weighHand(hand: DBCard[] = []): { weight: number; soft: boolean } {
  // set return values
  let weight = 0;
  let soft = false;

  // find the weight of the hand
  forEach(hand, (card) => {
    const cardWeight = get(card, 'weight', 0);
    if (cardWeight === 14) {
      // A
      if (weight <= 10) {
        weight += 11;
        soft = true;
      } else {
        weight += 1;
      }
    } else if (cardWeight > 10) {
      // J - K
      weight += 10;
    } else {
      // 2 - 10
      weight += cardWeight;
    }
    // reduce by 10 if bust and soft
    if (weight > 21 && soft) {
      weight -= 10;
      soft = false;
    }
  });

  // return object w/ useful information
  return { weight, soft };
}
