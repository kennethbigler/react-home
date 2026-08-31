import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ChangeEventHandler,
} from "react";
import { useAtomValue, useSetAtom } from "jotai";
import botcAtom, {
  type ActiveScript,
  type BotCPlayer,
  botcIsTextAtom,
  botcNumPlayersAtom,
  botcNumTravelersAtom,
  botcPlayersAtom,
  botcPlayerShell,
  type BotCPlayerStatus,
  type BotCRole,
  botcRoundAtom,
  botcRoundNotesAtom,
  botcScriptAtom,
  botcTrackerAtom,
  BaseScript,
  type BaseScriptIndex,
  newRoundNotes,
  newTracker,
} from "@/jotai/botc-atom";
import type { CommunityScriptOption } from "@/utils/botc-script-utils";

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

/** Immutable single-player update, shared by the player-editing actions */
const withPlayer = (
  players: BotCPlayer[],
  i: number,
  patch: Partial<BotCPlayer>,
): BotCPlayer[] => {
  const newPlayers = [...players];
  newPlayers[i] = { ...newPlayers[i], ...patch };
  return newPlayers;
};

/** -------------------- PlayerNotes Specific Functions -------------------- */
export const usePlayerAdjControls = () => {
  const setState = useSetAtom(botcAtom);

  /** move player in array */
  const updatePlayerOrder = (i: number, isUp: boolean) => () => {
    setState((prev) => {
      const pc = prev.numPlayers + prev.numTravelers;
      const mod = isUp ? getUpNum(i, pc) : getDownNum(i, pc);

      const newPlayers = [...prev.botcPlayers];
      [newPlayers[i], newPlayers[i + mod]] = [
        newPlayers[i + mod],
        newPlayers[i],
      ];

      return { ...prev, botcPlayers: newPlayers };
    });
  };

  return updatePlayerOrder;
};

export const usePlayerNotes = () => {
  const botcPlayers = useAtomValue(botcPlayersAtom);
  const numPlayers = useAtomValue(botcNumPlayersAtom);
  const numTravelers = useAtomValue(botcNumTravelersAtom);
  const setState = useSetAtom(botcAtom);
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
      setState((prev) => ({
        ...prev,
        botcPlayers: withPlayer(prev.botcPlayers, i, {
          [field]: e.target.value || "",
        }),
      }));
    };

  const updateNames = (i: number) => updatePlayerTextField(i, "name");
  const updateNotes = (i: number) => updatePlayerTextField(i, "notes");

  /** handle role selections */
  const updateRoles =
    (i: number) => (role: BotCRole, selected: boolean) => (): void => {
      setState((prev) => {
        const roles = selected
          ? prev.botcPlayers[i].roles.filter((r) => r.name !== role.name)
          : [...prev.botcPlayers[i].roles, role];
        return {
          ...prev,
          botcPlayers: withPlayer(prev.botcPlayers, i, { roles }),
        };
      });
    };

  /** handle checkboxes checked for player stat updates */
  const updateStats =
    (i: number) =>
    (key: BotCPlayerStatus) =>
    (_e: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      if ((key === "exec" || key === "kill") && checked) {
        setRandomPlayer(null);
      }
      setState((prev) => ({
        ...prev,
        botcPlayers: withPlayer(prev.botcPlayers, i, { [key]: checked }),
      }));
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
  const isText = useAtomValue(botcIsTextAtom);
  const script = useAtomValue(botcScriptAtom);
  const setState = useSetAtom(botcAtom);

  /** update number of players */
  const updateNumPlayers = (value: number) => {
    setState((prev) => ({ ...prev, numPlayers: value }));
  };

  /** update number of travelers */
  const updateNumTravelers = (value: number) => {
    setState((prev) => ({ ...prev, numTravelers: value }));
  };

  /** Select a base script by index (0–3) */
  const updateScript = (index: BaseScriptIndex) => {
    const newActiveScript: ActiveScript = { type: "base", index };
    setState((prev) => ({
      ...prev,
      // TB / S&V / BMR work best with text mode on
      isText: index !== BaseScript.Other ? true : prev.isText,
      script: newActiveScript,
    }));
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
    setState((prev) => ({ ...prev, script: newActiveScript }));
  };

  /** toggle icon/text display mode */
  const updateText = (e: ChangeEvent<HTMLInputElement>): void => {
    setState((prev) => ({ ...prev, isText: e.target.checked }));
  };

  /** set a new game (resets roles/notes/tracker but keeps player names and script) */
  const newBotCGame = () => {
    setState((prev) => ({
      ...prev,
      round: 0,
      botcPlayers: prev.botcPlayers.map(({ name }) => ({
        ...botcPlayerShell,
        name,
      })),
      roundNotes: newRoundNotes(),
      tracker: newTracker(),
    }));
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
  const botcPlayers = useAtomValue(botcPlayersAtom);
  const round = useAtomValue(botcRoundAtom);
  const roundNotes = useAtomValue(botcRoundNotesAtom);
  const tracker = useAtomValue(botcTrackerAtom);
  const setState = useSetAtom(botcAtom);

  const onRoundClick = (i: number) => () =>
    setState((prev) => ({ ...prev, round: i }));

  const onTrackClick = (i: number) => () => {
    setState((prev) => {
      const updatedRound = [...prev.tracker[prev.round]];
      updatedRound[i] = (prev.tracker[prev.round][i] + 1) % 3;
      const updatedTracker = [...prev.tracker];
      updatedTracker[prev.round] = updatedRound;
      return { ...prev, tracker: updatedTracker };
    });
  };

  /** update round notes onBlur */
  const onNotesChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e): void => {
    setState((prev) => {
      const updatedRoundNotes = [...prev.roundNotes];
      updatedRoundNotes[prev.round] = e.target.value || "";
      return { ...prev, roundNotes: updatedRoundNotes };
    });
  };

  return {
    botcPlayers,
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
  const isText = useAtomValue(botcIsTextAtom);
  const numPlayers = useAtomValue(botcNumPlayersAtom);
  const numTravelers = useAtomValue(botcNumTravelersAtom);
  const script = useAtomValue(botcScriptAtom);
  return { isText, numPlayers, numTravelers, script };
};

export default useBotC;
