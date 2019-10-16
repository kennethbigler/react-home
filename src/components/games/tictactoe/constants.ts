export const X = 'X';
export const O = 'O';
export const getTurn = (n: number): string => (n % 2 ? O : X);
