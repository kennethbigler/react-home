import * as React from "react";
import { useRecoilState } from "recoil";
import BotcHeader from "./BotcHeader";
import botcAtom, {
  BotCPlayer,
  botcPlayerShell,
} from "../../../recoil/botc-atom";
import PlayerNotes from "./PlayerNotes";
import { tb, snv, bmr } from "../../../constants/botc";
import { MuiColors } from "../../common/types";
import getAlignment from "./botc-helpers";

const BotC: React.FC = React.memo(() => {
  const [{ script, numPlayers, numTravelers, botcPlayers }, setState] =
    useRecoilState(botcAtom);

  /* ----------     Header Functions     ---------- */
  /** update botc script used */
  const updateScript = (i: number) => () =>
    setState({ script: i, numPlayers, numTravelers, botcPlayers });

  /** update number of players */
  const updateNumPlayers = (_e: Event, value: number | number[]) =>
    setState({ script, numTravelers, botcPlayers, numPlayers: value as number });

  /** update number of players */
  const updateNumTravelers = (_e: Event, value: number | number[]) =>
    setState({ script, numPlayers, botcPlayers, numTravelers: value as number });

  /** update player name onBlur */
  const updatePlayersNamesBlur =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], name: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
    };
  /** if enter key was pressed in textfield, update name */
  const updatePlayersNamesKeyDown =
    (i: number) =>
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter") {
        const newPlayers = [...botcPlayers];
        const newPlayer = {
          ...newPlayers[i],
          name: (e.target as HTMLInputElement).value || "",
        };
        newPlayers[i] = newPlayer;
        setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
      }
    };

  /** set a new game */
  const newBotcGame = () => {
    const newPlayers: BotCPlayer[] = [];
    botcPlayers.forEach((player) =>
      newPlayers.push({ ...botcPlayerShell, name: player.name }),
    );
    setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
  };

  /* ----------     Notes Functions     ---------- */
  /** handle checkboxes checked for player stat updates */
  const updatePlayerStats =
    (i: number, key: "liar" | "dead" | "used") =>
    (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i] };
      newPlayer[key] = checked;
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  /** handle role selections */
  const updatePlayerRoles =
    (i: number, role: string, selected: boolean) => (): void => {
      // set up immutability for new player
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i] };
      // find the active script
      let active;
      switch (script) {
        case 1:
          active = snv;
          break;
        case 2:
          active = bmr;
          break;
        default:
          active = tb;
      }
      // if selected remove, if not add
      if (selected) {
        newPlayer.roles = newPlayer.roles.filter((r) => r !== role);
        // set alignment based of all roles
        let newAlignment: MuiColors = newPlayer.roles.length
          ? "inherit"
          : "primary";
        for (let j = 0; j < newPlayer.roles.length; j += 1) {
          newAlignment = getAlignment(newAlignment, active, newPlayer.roles[j]);
        }
        newPlayer.alignment = newAlignment;
      } else {
        newPlayer.alignment = getAlignment(
          newPlayer.roles.length ? newPlayer.alignment : "inherit",
          active,
          role,
        );
        newPlayer.roles = [...newPlayer.roles, role];
      }
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  /** update player notes onBlur */
  const updatePlayerNotesBlur =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], notes: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
    };
  /** if enter key was pressed in textfield, update notes */
  const updatePlayerNotesKeyDown =
    (i: number) =>
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter") {
        const newPlayers = [...botcPlayers];
        const newPlayer = {
          ...newPlayers[i],
          notes: (e.target as HTMLInputElement).value || "",
        };
        newPlayers[i] = newPlayer;
        setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
      }
    };

  /* ----------     Render     ---------- */
  return (
    <>
      <BotcHeader
        script={script}
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        botcPlayers={botcPlayers}
        newBotcGame={newBotcGame}
        updateScript={updateScript}
        updateNumPlayers={updateNumPlayers}
        updateNumTravelers={updateNumTravelers}
        updatePlayersBlur={updatePlayersNamesBlur}
        updatePlayersKeyDown={updatePlayersNamesKeyDown}
      />
      <PlayerNotes
        script={script}
        numPlayers={numPlayers}
        botcPlayers={botcPlayers}
        updatePlayerStats={updatePlayerStats}
        updatePlayerRoles={updatePlayerRoles}
        updatePlayerNotesBlur={updatePlayerNotesBlur}
        updatePlayerNotesKeyDown={updatePlayerNotesKeyDown}
      />
    </>
  );
});

export default BotC;
