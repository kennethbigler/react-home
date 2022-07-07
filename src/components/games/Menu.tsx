import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

interface MenuProps {
  onItemClick?: (loc: string) => void;
}

const Menu: React.FC<MenuProps> = React.memo((props: MenuProps) => {
  const { onItemClick } = props;
  const baseUrl = "/games";

  // internal routes
  const menu = React.useMemo(
    () =>
      [
        { name: "Home - Games", route: "" },
        { divider: true },
        { name: "BlackJack", route: "blackjack" },
        { name: "Deal or No Deal", route: "deal" },
        { name: "Poker", route: "poker" },
        { name: "Slot Machine", route: "slots" },
        { name: "Yahtzee", route: "yahtzee" },
        { divider: true },
        { name: "Are You The One", route: "are-you-the-one" },
        { name: "Connect4", route: "connect4" },
        { name: "Family Feud", route: "family-feud" },
        { name: "Tic-Tac-Toe", route: "tictactoe" },
      ].map((item, index) =>
        item.divider ? (
          <Divider key={index} />
        ) : (
          <MenuItem
            key={item.name}
            onClick={(): void =>
              onItemClick && onItemClick(`${baseUrl}/${item.route || ""}`)
            }
          >
            {item.name}
          </MenuItem>
        )
      ),
    [onItemClick]
  );

  // navigation
  const home = React.useCallback(
    (): void => onItemClick && onItemClick("/"),
    [onItemClick]
  );

  // render menu
  return (
    <>
      <MenuItem onClick={home}>Back to Resume</MenuItem>
      {menu}
    </>
  );
});

export default Menu;
