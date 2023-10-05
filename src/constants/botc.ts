export interface BotCPlayer {
  name: string;
  roles: [string?, string?, string?];
  liar: boolean;
  dead: boolean;
}

export const BOTC_MIN_PLAYERS = 6;
export const BOTC_MAX_PLAYERS = 20;
