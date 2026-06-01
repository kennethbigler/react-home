import { useState, ChangeEvent, FocusEvent, ChangeEventHandler } from "react";
import { useAtom, useAtomValue } from "jotai";
import botcAtom, {
  ActiveScript,
  botcPlayerShell,
  BotCPlayerStatus,
  BotCRole,
  BaseScript,
  BaseScriptIndex,
  newRoundNotes,
  newTracker,
} from "../../../jotai/botc-atom";
import { CommunityScriptOption } from "../../../utils/botc-script-utils";

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
    [newPlayers[i], newPlayers[i + mod]] = [newPlayers[i + mod], newPlayers[i]];

    setState({ ...other, numPlayers, numTravelers, botcPlayers: newPlayers });
  };

  return updatePlayerOrder;
};

export const usePlayerNotes = () => {
  const [{ botcPlayers, numPlayers, numTravelers, ...other }, setState] =
    useAtom(botcAtom);
  const [randomPlayer, setRandomPlayer] = useState<number | null>(null);

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

  /** Shared helper: update a single string field on a player onBlur */
  const updatePlayerTextField =
    (i: number, field: "name" | "notes") =>
    (e: FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      newPlayers[i] = { ...newPlayers[i], [field]: e.target.value || "" };
      setState({ ...other, numPlayers, numTravelers, botcPlayers: newPlayers });
    };

  const updateNames = (i: number) => updatePlayerTextField(i, "name");
  const updateNotes = (i: number) => updatePlayerTextField(i, "notes");

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
    (_e: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
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

  /** update number of travelers */
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

  /** Select a base script by index (0–3) */
  const updateScript = (index: BaseScriptIndex) => {
    let newText = isText;
    // TB / S&V / BMR work best with text mode on
    if (index !== BaseScript.Other) {
      newText = true;
    }
    const newActiveScript: ActiveScript = { type: "base", index };
    setState({
      ...other,
      botcPlayers,
      numPlayers,
      numTravelers,
      isText: newText,
      script: newActiveScript,
    });
  };

  /** Select a community script from botcscripts.com */
  const updateCommunityScript = (option: CommunityScriptOption) => {
    const newActiveScript: ActiveScript = {
      type: "community",
      pk: option.pk,
      title: option.label,
      author: option.author,
      characters: option.characters,
    };
    setState({
      ...other,
      botcPlayers,
      numPlayers,
      numTravelers,
      isText,
      script: newActiveScript,
    });
  };

  /** toggle icon/text display mode */
  const updateText = (e: ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...other,
      botcPlayers,
      numPlayers,
      numTravelers,
      script,
      isText: e.target.checked,
    });
  };

  /** set a new game (resets roles/notes/tracker but keeps player names and script) */
  const newBotCGame = () => {
    setState({
      isText,
      numPlayers,
      numTravelers,
      script,
      round: 0,
      botcPlayers: botcPlayers.map(({ name }) => ({
        ...botcPlayerShell,
        name,
      })),
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
    updateCommunityScript,
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
    const updatedRound = [...tracker[round]];
    updatedRound[i] = (tracker[round][i] + 1) % 3;
    const updatedTracker = [...tracker];
    updatedTracker[round] = updatedRound;
    setState({ ...other, round, roundNotes, tracker: updatedTracker });
  };

  /** update round notes onBlur */
  const onNotesChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e): void => {
    const updatedRoundNotes = [...roundNotes];
    updatedRoundNotes[round] = e.target.value || "";
    setState({ ...other, round, tracker, roundNotes: updatedRoundNotes });
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
  const { isText, numPlayers, numTravelers, script } = useAtomValue(botcAtom);
  return { isText, numPlayers, numTravelers, script };
};

export default useBotC;
