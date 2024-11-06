import * as React from "react";
import { useRecoilState } from "recoil";
import { SelectChangeEvent } from "@mui/material";
import Header from "./header/Header";
import botcAtom, {
  BotCPlayer,
  BotCPlayerStatus,
  BotCRole,
  botcPlayerShell,
  newTracker,
} from "../../../recoil/botc-atom";
import PlayerNotes from "./player-notes/PlayerNotes";

const BotC: React.FC = React.memo(() => {
  const [
    { isText, numPlayers, numTravelers, round, script, botcPlayers, tracker },
    setState,
  ] = useRecoilState(botcAtom);

  /* ----------     Header Functions     ---------- */
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
      numPlayers,
      numTravelers,
      round,
      botcPlayers,
      tracker,
      isText: newText,
      script: newScript,
    });
  };

  /** update number of players */
  const updateNumPlayers = (_e: Event, value: number | number[]) => {
    const newNum = Array.isArray(value) ? value[0] : value;
    setState({
      isText,
      numTravelers,
      round,
      script,
      botcPlayers,
      tracker,
      numPlayers: newNum,
    });
  };

  /** update number of players */
  const updateNumTravelers = (_e: Event, value: number | number[]) => {
    const newNum = Array.isArray(value) ? value[0] : value;
    setState({
      isText,
      numPlayers,
      round,
      script,
      botcPlayers,
      tracker,
      numTravelers: newNum,
    });
  };

  /** update player notes onBlur */
  const updateText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({
      numPlayers,
      numTravelers,
      round,
      script,
      botcPlayers,
      tracker,
      isText: e.target.checked,
    });
  };

  /** update player name onBlur */
  const updateNames =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], name: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({
        isText,
        numPlayers,
        numTravelers,
        round,
        script,
        tracker,
        botcPlayers: newPlayers,
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
      isText,
      numPlayers,
      numTravelers,
      round,
      script,
      tracker,
      botcPlayers: newPlayers,
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
      tracker: newTracker(),
    });
  };

  /* ----------     Notes Functions     ---------- */
  /** handle checkboxes checked for player stat updates */
  const updateStats =
    (i: number) =>
    (key: BotCPlayerStatus) =>
    (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i] };
      newPlayer[key] = checked;
      newPlayers[i] = newPlayer;
      setState({
        isText,
        numPlayers,
        numTravelers,
        round,
        script,
        tracker,
        botcPlayers: newPlayers,
      });
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
      setState({
        isText,
        numPlayers,
        numTravelers,
        round,
        script,
        tracker,
        botcPlayers: newPlayers,
      });
    };

  /** update player notes onBlur */
  const updateNotes =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], notes: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({
        isText,
        numPlayers,
        numTravelers,
        round,
        script,
        tracker,
        botcPlayers: newPlayers,
      });
    };

  const updateRound = (i: number) => () =>
    setState({
      isText,
      numPlayers,
      numTravelers,
      script,
      botcPlayers,
      tracker,
      round: i,
    });

  const updateTracker = (i: number) => () => {
    const tempTracker = [...tracker[round]];
    tempTracker[i] = (tracker[round][i] + 1) % 3;
    const newTracker = [...tracker];
    newTracker[round] = tempTracker;
    setState({
      isText,
      numPlayers,
      numTravelers,
      round,
      script,
      botcPlayers,
      tracker: newTracker,
    });
  };

  /* ----------     Render     ---------- */
  return (
    <>
      <Header
        // Shared
        botcPlayers={botcPlayers}
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        // Header
        newBotCGame={newBotCGame}
        // Tracker
        round={round}
        tracker={tracker}
        updateRound={updateRound}
        updateTracker={updateTracker}
        // EditPlayers
        isText={isText}
        script={script}
        updateNames={updateNames}
        updateNumPlayers={updateNumPlayers}
        updateNumTravelers={updateNumTravelers}
        updatePlayerOrder={updatePlayerOrder}
        updateScript={updateScript}
        updateText={updateText}
      />
      <PlayerNotes
        botcPlayers={botcPlayers}
        isText={isText}
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        script={script}
        updateNotes={updateNotes}
        updateRoles={updateRoles}
        updateStats={updateStats}
      />
    </>
  );
});

BotC.displayName = "BotC";

export default BotC;
