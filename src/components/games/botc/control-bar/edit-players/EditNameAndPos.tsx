import * as React from "react";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface EditNameAndPosProps {
  first: boolean;
  last: boolean;
  name: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  moveUp: () => void;
  moveDown: () => void;
}

/** EditPlayers -> ScriptSelect
 *              -> ScriptControls
 *              -> players.map(EditNameAndPos) */
const EditNameAndPos = ({
  first,
  last,
  name,
  onBlur,
  moveUp,
  moveDown,
}: EditNameAndPosProps) => (
  <Grid size={{ xs: 6, sm: 4 }} sx={{ display: "flex", alignItems: "center" }}>
    <ButtonGroup aria-label="move player" orientation="vertical" variant="text">
      <Button aria-label="up" disabled={first} size="small" onClick={moveUp}>
        <ArrowDropUpIcon />
      </Button>
      <Button aria-label="down" disabled={last} size="small" onClick={moveDown}>
        <ArrowDropDownIcon />
      </Button>
    </ButtonGroup>

    <TextField defaultValue={name} placeholder="Player Name" onBlur={onBlur} />
  </Grid>
);

export default EditNameAndPos;
