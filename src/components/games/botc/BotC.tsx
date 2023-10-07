import * as React from "react";
import { useRecoilState } from "recoil";
import BotcHeader from "./BotcHeader";
import botcAtom from "../../../recoil/botc-atom";
import PlayerNotes from "./PlayerNotes";

const BotC: React.FC = React.memo(() => {
  const [{ script, numPlayers, botcPlayers }, setState] =
    useRecoilState(botcAtom);

  /* ----------     Header Functions     ---------- */
  /** update botc script used */
  const updateScript = (i: number) => () =>
    setState({ script: i, numPlayers, botcPlayers });

  /** update number of players */
  const updateNumPlayers = (_e: Event, value: number | number[]) =>
    setState({ script, botcPlayers, numPlayers: value as number });

  /** update player name onBlur */
  const updatePlayersNamesBlur =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], name: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, botcPlayers: newPlayers });
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
        setState({ script, numPlayers, botcPlayers: newPlayers });
      }
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
      setState({ script, numPlayers, botcPlayers: newPlayers });
    };

  /** handle role selections */
  const updatePlayerRoles =
    (i: number, role: string, selected: boolean) => (): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i] };
      if (selected) {
        newPlayer.roles = newPlayer.roles.filter((r) => r !== role);
      } else {
        newPlayer.roles = [...newPlayer.roles, role];
      }
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, botcPlayers: newPlayers });
    };

  /* ----------     Render     ---------- */
  return (
    <>
      <BotcHeader
        script={script}
        numPlayers={numPlayers}
        botcPlayers={botcPlayers}
        updateScript={updateScript}
        updateNumPlayers={updateNumPlayers}
        updatePlayersBlur={updatePlayersNamesBlur}
        updatePlayersKeyDown={updatePlayersNamesKeyDown}
      />
      <PlayerNotes
        script={script}
        numPlayers={numPlayers}
        botcPlayers={botcPlayers}
        updatePlayerStats={updatePlayerStats}
        updatePlayerRoles={updatePlayerRoles}
      />
    </>
  );
});

export default BotC;
