import type { BiddingPosition } from "./types";

export const POSITIONS = [
  1, 2, 3, 4,
] as const satisfies readonly BiddingPosition[];

export function getRelatives(position: BiddingPosition): {
  partner: BiddingPosition;
  lho: BiddingPosition;
  rho: BiddingPosition;
} {
  const idx = position - 1;
  return {
    partner: POSITIONS[(idx + 2) % 4],
    lho: POSITIONS[(idx + 1) % 4],
    rho: POSITIONS[(idx + 3) % 4],
  };
}
