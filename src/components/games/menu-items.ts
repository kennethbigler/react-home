export interface MenuItem {
  name?: string;
  route?: string;
  divider?: boolean;
  icon?: string;
}

export const socialItems: MenuItem[] = [
  { name: "BotC", route: "botc", icon: "⏱️" },
  { name: "Murder Mystery", route: "murder", icon: "🔎" },
  { name: "Werewolf", route: "werewolf", icon: "🐺" },
];
export const trackerItems: MenuItem[] = [
  { name: "Are You The One", route: "are-you-the-one", icon: "🤷‍♂️" },
  { name: "Bridge", route: "bridge", icon: "🌉" },
  { name: "Imperial Assault", route: "imperial-assault", icon: "🪐" },
  { name: "Spades", route: "spades", icon: "♠️" },
  { name: "Type Checker", route: "types", icon: "🧪" },
];
export const casinoItems: MenuItem[] = [
  { name: "BlackJack", route: "blackjack", icon: "🃏" },
  { name: "Deal or No Deal", route: "deal", icon: "💼" },
  { name: "Poker", route: "poker", icon: "🍀" },
  { name: "Slot Machine", route: "slots", icon: "🎰" },
  { name: "Yahtzee", route: "yahtzee", icon: "🎲" },
];
export const gameItems: MenuItem[] = [
  { name: "Connect4", route: "connect4", icon: "🔴" },
  { name: "Family Feud", route: "family-feud", icon: "👨‍👩‍👧‍👦" },
  { name: "Tic-Tac-Toe", route: "tictactoe", icon: "❌" },
];

const menuItems: MenuItem[] = [
  { name: "Home - Games", route: "" },
  { divider: true },
  ...socialItems,
  { divider: true },
  ...trackerItems,
  { divider: true },
  ...casinoItems,
  { divider: true },
  ...gameItems,
];

export default menuItems;
