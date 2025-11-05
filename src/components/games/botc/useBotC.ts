import * as React from "react";
import { useAtom } from "jotai";
import { SelectChangeEvent } from "@mui/material";
import botcAtom, {
  BotCPlayer,
  botcPlayerShell,
  BotCPlayerStatus,
  BotCRole,
  newRoundNotes,
  newTracker,
} from "../../../jotai/botc-atom";

const getUpNum = (i: number, pc: number) => {
  const isFull = pc % 2 === 0;
  if (i === 0) {
    return 1;
  } else if (i === 3 || (isFull && i === pc - 1)) {
    return -3;
  } else if (i < 3 || (isFull && i === pc - 2)) {
    return -1;
  }
  return -2;
};

const getDownNum = (i: number, pc: number) => {
  const isFull = pc % 2 === 0;
  if (i === 0 || (isFull && i === pc - 4)) {
    return 3;
  } else if (i === 1 || i === pc - 2 || (isFull && i === pc - 3)) {
    return 1;
  } else if (i === pc - 1) {
    return -1;
  }
  return 2;
};

/** -------------------- PlayerNotes Specific Functions -------------------- */
export const usePlayerAdjControls = () => {
  const [{ botcPlayers, numPlayers, numTravelers, ...other }, setState] =
    useAtom(botcAtom);

  /** move player in array */
  const updatePlayerOrder = (i: number, isUp: boolean) => () => {
    const mod = isUp
      ? getUpNum(i, numPlayers + numTravelers)
      : getDownNum(i, numPlayers + numTravelers);

    const newPlayers = [...botcPlayers];
    const playerA = newPlayers[i];
    const playerB = newPlayers[i + mod];
    newPlayers[i] = playerB;
    newPlayers[i + mod] = playerA;

    setState({
      ...other,
      numPlayers,
      numTravelers,
      botcPlayers: newPlayers,
    });
  };

  return updatePlayerOrder;
};

export const usePlayerNotes = () => {
  const [{ botcPlayers, numPlayers, numTravelers, ...other }, setState] =
    useAtom(botcAtom);
  const [randomPlayer, setRandomPlayer] = React.useState<number | null>(null);

  const getRandomPlayer = () => {
    const alivePlayers: number[] = [];
    for (let i = 1; i < numPlayers + numTravelers; i += 1) {
      if (!botcPlayers[i].exec && !botcPlayers[i].kill) {
        alivePlayers.push(i);
      }
    }

    setRandomPlayer(
      alivePlayers[Math.floor(Math.random() * alivePlayers.length)],
    );
  };

  /** update player name onBlur */
  const updateNames =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], name: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({ ...other, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  /** update player notes onBlur */
  const updateNotes =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], notes: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({ ...other, numPlayers, numTravelers, botcPlayers: newPlayers });
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
      setState({ ...other, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  /** handle checkboxes checked for player stat updates */
  const updateStats =
    (i: number) =>
    (key: BotCPlayerStatus) =>
    (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i] };
      newPlayer[key] = checked;
      newPlayers[i] = newPlayer;
      if ((key === "exec" || key === "kill") && checked) {
        setRandomPlayer(null);
      }
      setState({ ...other, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  return {
    botcPlayers,
    getRandomPlayer,
    randomPlayer,
    updateNames,
    updateNotes,
    updateRoles,
    updateStats,
  };
};

/** -------------------- EditPlayers Specific Functions -------------------- */
export const useEditPlayers = () => {
  const [
    { isText, numPlayers, numTravelers, script, botcPlayers, ...other },
    setState,
  ] = useAtom(botcAtom);

  /** update number of players */
  const updateNumPlayers = (value: number) => {
    setState({
      ...other,
      botcPlayers,
      isText,
      numTravelers,
      script,
      numPlayers: value,
    });
  };

  /** update number of players */
  const updateNumTravelers = (value: number) => {
    setState({
      ...other,
      botcPlayers,
      isText,
      numPlayers,
      script,
      numTravelers: value,
    });
  };

  /** update botc script used */
  const updateScript = (e: SelectChangeEvent<number>) => {
    const newScript = e.target.value;
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
      botcPlayers,
      numPlayers,
      numTravelers,
      isText: newText,
      script: newScript,
    });
  };

  /** update player notes onBlur */
  const updateText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...other,
      botcPlayers,
      numPlayers,
      numTravelers,
      script,
      isText: e.target.checked,
    });
  };

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
      roundNotes: newRoundNotes(),
      tracker: newTracker(),
    });
  };

  return {
    isText,
    script,
    updateNumPlayers,
    updateNumTravelers,
    updateScript,
    updateText,
    newBotCGame,
  };
};

/** -------------------- Tracker Specific Functions -------------------- */
export const useTracker = () => {
  const [{ round, roundNotes, tracker, ...other }, setState] =
    useAtom(botcAtom);

  const onRoundClick = (i: number) => () =>
    setState({ ...other, roundNotes, tracker, round: i });

  const onTrackClick = (i: number) => () => {
    const tempTracker = [...tracker[round]];
    tempTracker[i] = (tracker[round][i] + 1) % 3;
    const newTracker = [...tracker];
    newTracker[round] = tempTracker;
    setState({ ...other, round, roundNotes, tracker: newTracker });
  };

  /** update round notes onBlur */
  const onNotesChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e): void => {
    const newRoundNotes = [...roundNotes];
    newRoundNotes[round] = e.target.value || "";
    setState({ ...other, round, tracker, roundNotes: newRoundNotes });
  };

  return {
    botcPlayers: other.botcPlayers,
    round,
    roundNotes,
    tracker,
    onNotesChange,
    onRoundClick,
    onTrackClick,
  };
};

/** -------------------- Home Specific Functions -------------------- */
const useBotC = () => {
  const [{ isText, numPlayers, numTravelers, script }] = useAtom(botcAtom);
  return { numPlayers, numTravelers, isText, script };
};

export default useBotC;
