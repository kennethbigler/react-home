import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import TextField from "@mui/material/TextField";
import { DBRootState } from "../../../store/types";
import { updateScore } from "../../../store/modules/ayto";
import { options } from "../../../constants/ayto";

interface ControlsProps {
  roundNumber: number;
  onSelect: (index: number) => void;
}

// eslint-disable-next-line no-restricted-globals
const getScore = (value: number) => (isNaN(value) ? -1 : value);

const Controls = (props: ControlsProps) => {
  const { roundNumber, onSelect } = props;

  // Redux
  const { roundPairings } = useSelector((state: DBRootState) => ({
    ...state.ayto,
  }));
  const dispatch = useDispatch();

  // hooks/state
  const [open, setOpen] = React.useState(false);
  const [score, setScore] = React.useState(
    getScore(roundPairings[roundNumber]?.score)
  );
  const anchorRef = React.useRef<HTMLDivElement>(null);

  // handlers
  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScore(parseInt(event.target.value, 10) || 0);
    dispatch(updateScore(parseInt(event.target.value, 10), roundNumber));
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setScore(getScore(roundPairings[index]?.score));
    onSelect(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <ButtonGroup
        ref={anchorRef}
        variant="contained"
        aria-label="split button"
        color={roundNumber + 1 === options.length ? "error" : "primary"}
      >
        <Button>{options[roundNumber]}</Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === roundNumber}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <TextField
        id="score-input"
        label="Score"
        variant="outlined"
        type="number"
        value={score}
        onChange={handleTextFieldChange}
      />
    </div>
  );
};

export default Controls;
