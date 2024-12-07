import * as React from "react";
import { useAtom } from "jotai";
import { SelectChangeEvent } from "@mui/material";
import botcAtom, {
  BotCPlayer,
  botcPlayerShell,
  BotCPlayerStatus,
  BotCRole,
  newTracker,
} from "../../../jotai/botc-atom";

/** -------------------- PlayerNotes Specific Functions -------------------- */
export const usePlayerNotes = () => {
  const [{ botcPlayers, ...other }, setState] = useAtom(botcAtom);

  /** handle checkboxes checked for player stat updates */
  const updateStats =
    (i: number) =>
    (key: BotCPlayerStatus) =>
    (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i] };
      newPlayer[key] = checked;
      newPlayers[i] = newPlayer;
      setState({ ...other, botcPlayers: newPlayers });
    };

  /** handle role selections */
  const updateRoles =
    (i: number) => (role: BotCRole, selected: boolean) => (): void => {
      // set up immutability for new player
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i] };
      // if selected remove, if not add
      newPlayer.roles = selected
        ? newPlayer.roles.filter((r) => r.name !== role.name)
        : [...newPlayer.roles, role];
      newPlayers[i] = newPlayer;
      setState({ ...other, botcPlayers: newPlayers });
    };

  /** update player notes onBlur */
  const updateNotes =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], notes: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({
        ...other,
        botcPlayers: newPlayers,
      });
    };

  return { updateNotes, updateRoles, updateStats };
};

/** -------------------- EditPlayers Specific Functions -------------------- */
export const useEditPlayers = () => {
  const [
    { isText, numPlayers, numTravelers, script, botcPlayers, ...other },
    setState,
  ] = useAtom(botcAtom);

  /** update player name onBlur */
  const updateNames =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], name: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({
        ...other,
        isText,
        numPlayers,
        numTravelers,
        script,
        botcPlayers: newPlayers,
      });
    };

  /** update number of players */
  const updateNumPlayers = (_e: Event, value: number | number[]) => {
    const newNum = Array.isArray(value) ? value[0] : value;
    setState({
      ...other,
      isText,
      numTravelers,
      script,
      botcPlayers,
      numPlayers: newNum,
    });
  };

  /** update number of players */
  const updateNumTravelers = (_e: Event, value: number | number[]) => {
    const newNum = Array.isArray(value) ? value[0] : value;
    setState({
      ...other,
      isText,
      numPlayers,
      script,
      botcPlayers,
      numTravelers: newNum,
    });
  };

  /** move player in array */
  const updatePlayerOrder = (i: number, dir: number) => () => {
    const newPlayers = [...botcPlayers];
    const playerA = newPlayers[i];
    const playerB = newPlayers[i + dir];
    newPlayers[i] = playerB;
    newPlayers[i + dir] = playerA;
    setState({
      ...other,
      isText,
      numPlayers,
      numTravelers,
      script,
      botcPlayers: newPlayers,
    });
  };

  /** update botc script used */
  const updateScript = (e: SelectChangeEvent<number>) => {
    const newScript = e.target.value as number;
    let newText = isText;
    switch (newScript) {
      case 0:
      case 1:
      case 2:
        newText = true;
        break;
      case 5:
        newText = false;
        break;
      default:
    }
    setState({
      ...other,
      numPlayers,
      numTravelers,
      botcPlayers,
      isText: newText,
      script: newScript,
    });
  };

  /** update player notes onBlur */
  const updateText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...other,
      numPlayers,
      numTravelers,
      script,
      botcPlayers,
      isText: e.target.checked,
    });
  };

  return {
    isText,
    script,
    updateNames,
    updateNumPlayers,
    updateNumTravelers,
    updatePlayerOrder,
    updateScript,
    updateText,
  };
};

/** -------------------- Tracker Specific Functions -------------------- */
export const useTracker = () => {
  const [{ round, tracker, ...other }, setState] = useAtom(botcAtom);

  const onRoundClick = (i: number) => () =>
    setState({ ...other, tracker, round: i });

  const onTrackClick = (i: number) => () => {
    const tempTracker = [...tracker[round]];
    tempTracker[i] = (tracker[round][i] + 1) % 3;
    const newTracker = [...tracker];
    newTracker[round] = tempTracker;
    setState({ ...other, round, tracker: newTracker });
  };

  return { round, tracker, onRoundClick, onTrackClick };
};

/** -------------------- Home Specific Functions -------------------- */
const useBotC = () => {
  const [{ isText, numPlayers, numTravelers, script, botcPlayers }, setState] =
    useAtom(botcAtom);

  /** set a new game */
  const newBotCGame = () => {
    const newPlayers: BotCPlayer[] = [];
    botcPlayers.forEach((player) =>
      newPlayers.push({ ...botcPlayerShell, name: player.name }),
    );
    setState({
      isText,
      numPlayers,
      numTravelers,
      script,
      round: 0,
      botcPlayers: newPlayers,
      tracker: newTracker(),
    });
  };

  return { botcPlayers, numPlayers, numTravelers, newBotCGame, isText, script };
};

export default useBotC;
