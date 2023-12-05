import * as React from "react";
import { useRecoilState } from "recoil";
import BotCHeader from "./header/BotCHeader";
import botcAtom, {
  BotCPlayer,
  BotCRole,
  botcPlayerShell,
} from "../../../recoil/botc-atom";
import PlayerNotes from "./notes/PlayerNotes";

const BotC: React.FC = React.memo(() => {
  const [{ script, numPlayers, numTravelers, botcPlayers }, setState] =
    useRecoilState(botcAtom);

  /* ----------     Header Functions     ---------- */
  /** update botc script used */
  const updateScript = (i: number) => () =>
    setState({ script: i, numPlayers, numTravelers, botcPlayers });

  /** update number of players */
  const updateNumPlayers = (_e: Event, value: number | number[]) => {
    // new values
    const newNumPlayers = Array.isArray(value) ? value[0] : value;
    // update global state
    setState({
      script,
      numTravelers,
      botcPlayers,
      numPlayers: newNumPlayers,
    });
  };

  /** update number of players */
  const updateNumTravelers = (_e: Event, value: number | number[]) => {
    // new values
    const newNumTravelers = Array.isArray(value) ? value[0] : value;
    // update global state
    setState({
      script,
      numPlayers,
      botcPlayers,
      numTravelers: newNumTravelers,
    });
  };

  /** update player name onBlur */
  const updateNamesOnBlur =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], name: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  /** move player in array */
  const updatePlayerOrder = (i: number, dir: number) => () => {
    const newPlayers = [...botcPlayers];
    const playerA = newPlayers[i];
    const playerB = newPlayers[i + dir];
    newPlayers[i] = { ...playerB };
    newPlayers[i + dir] = { ...playerA };
    setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
  };

  /** set a new game */
  const newBotCGame = () => {
    const newPlayers: BotCPlayer[] = [];
    botcPlayers.forEach((player) =>
      newPlayers.push({ ...botcPlayerShell, name: player.name, id: player.id }),
    );
    setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
  };

  /* ----------     Notes Functions     ---------- */
  /** handle checkboxes checked for player stat updates */
  const updateStats =
    (i: number, key: "liar" | "dead" | "used") =>
    (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i] };
      newPlayer[key] = checked;
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  /** handle role selections */
  const updateRoles =
    (i: number, role: BotCRole, selected: boolean) => (): void => {
      // set up immutability for new player
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i] };
      // if selected remove, if not add
      if (selected) {
        newPlayer.roles = newPlayer.roles.filter((r) => r.name !== role.name);
      } else {
        newPlayer.roles = [...newPlayer.roles, role];
      }
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  /** update player notes onBlur */
  const updateNotesOnBlur =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], notes: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  /* ----------     Render     ---------- */
  return (
    <>
      <BotCHeader
        script={script}
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        botcPlayers={botcPlayers}
        newBotCGame={newBotCGame}
        updateScript={updateScript}
        updateNumPlayers={updateNumPlayers}
        updateNumTravelers={updateNumTravelers}
        updateNamesOnBlur={updateNamesOnBlur}
        updatePlayerOrder={updatePlayerOrder}
      />
      <PlayerNotes
        script={script}
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        botcPlayers={botcPlayers}
        updateStats={updateStats}
        updateRoles={updateRoles}
        updateNotesOnBlur={updateNotesOnBlur}
      />
    </>
  );
});

export default BotC;
