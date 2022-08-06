import React from "react";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

interface DropdownProps {
  onSelect: (index: number) => void;
  options: string[];
  value: number;
  ariaLabel: string;
}

const Dropdown = (props: DropdownProps) => {
  const { ariaLabel, value, options, onSelect } = props;

  // hooks/state
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    onSelect(index);
    setOpen(false);
  };

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        ref={anchorRef}
        aria-controls={open ? "split-button-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        endIcon={<ArrowDropDownIcon />}
        size="small"
        variant="contained"
        onClick={handleToggle}
      >
        {options[value]}
      </Button>
      <Menu
        id="split-button-menu"
        anchorEl={anchorRef.current}
        open={open}
        autoFocus
        PaperProps={{ style: { maxHeight: 48 * 5.5 } }}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === value}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Dropdown;
