import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { BotCPlayer } from "../../../../recoil/botc-atom";

interface DialogPlayersProps {
  numPlayers: number;
  numTravelers: number;
  botcPlayers: BotCPlayer[];
  updateNamesOnBlur: (
    i: number,
  ) => (e: React.FocusEvent<HTMLInputElement>) => void;
}

const wStyles = { display: "flex", alignItems: "center" };

const DialogPlayers = ({
  numPlayers,
  numTravelers,
  botcPlayers,
  updateNamesOnBlur,
}: DialogPlayersProps) => {
  const [players, setPlayers] = React.useState(botcPlayers);
  /** TODO: move player up in array */
  /** TODO: move player down in array */
  // set player TextFields
  const playerTextFields = [];
  for (let i = 0; i < numPlayers + numTravelers; i += 1) {
    playerTextFields.push(
      <Grid item xs={6} sm={4} sx={wStyles} key={`playerNo${i}`}>
        <ButtonGroup
          orientation="vertical"
          aria-label="move player up or down"
          variant="text"
        >
          <Button size="small" aria-label="up">
            <ArrowDropUpIcon />
          </Button>
          <Button size="small" aria-label="down">
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <TextField
          defaultValue={players[i].name}
          placeholder="Enter Player Name"
          title={`player ${i} name`}
          onBlur={updateNamesOnBlur(i)}
        />
      </Grid>,
    );
  }

  return playerTextFields;
};

export default DialogPlayers;
