export interface MenuItem {
  name?: string;
  route?: string;
  divider?: boolean;
  icon?: string;
}

const menuItems: MenuItem[] = [
  { name: "Home - Games", route: "" },
  { divider: true },
  { name: "BlackJack", route: "blackjack", icon: "🃏" },
  { name: "Deal or No Deal", route: "deal", icon: "💼" },
  { name: "Poker", route: "poker", icon: "🍀" },
  { name: "Slot Machine", route: "slots", icon: "🎰" },
  { name: "Yahtzee", route: "yahtzee", icon: "🎲" },
  { divider: true },
  { name: "Are You The One", route: "are-you-the-one", icon: "🤷‍♂️" },
  { name: "Connect4", route: "connect4", icon: "🔴" },
  { name: "Family Feud", route: "family-feud", icon: "👨‍👩‍👧‍👦" },
  { name: "Tic-Tac-Toe", route: "tictactoe", icon: "❌" },
];

export default menuItems;
