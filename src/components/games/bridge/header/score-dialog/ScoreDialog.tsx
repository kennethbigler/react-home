import { memo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import ScoringTable from "./ScoringTable";
import ScoreForm, { eIn } from "./ScoreForm";
import useBridgeScorer from "./score-helper";
import bridgeAtom, {
  AboveScores,
  bridgeRead,
  newBridgeGame,
  sum,
} from "../../../../../jotai/bridge-atom";
import ScoreSummary from "./ScoreSummary";

const ScoreDialog = memo(() => {
  const [
    { aboveScores, weBelow, theyBelow, weRubbers, theyRubbers, bids, ...other },
    setBridgeState,
  ] = useAtom(bridgeAtom);
  const {
    gameIdx,
    weWins,
    theyWins,
    weSum,
    theySum,
    weVulnerable,
    theyVulnerable,
  } = useAtomValue(bridgeRead);
  // modal state
  const [isOpen, setIsOpen] = useState(false);
  // form state
  const [contractSuit, setContractSuit] = useState("NT");
  const [contractTricks, setContractTricks] = useState(1);
  const [declarerTricks, setDeclarerTricks] = useState(7);
  const [isWe, setIsWe] = useState(true);
  const [isDouble, setIsDouble] = useState(false);
  const [isRedouble, setIsRedouble] = useState(false);
  const [is4Honours, setIs4Honours] = useState(false);
  const [is5Honours, setIs5Honours] = useState(false);
  const [is4Aces, setIs4Aces] = useState(false);

  // modal handlers
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  // form handlers
  const handleContractSuitChange = (e: SelectChangeEvent<string>) =>
    setContractSuit(e.target.value);
  const handleContractTricksChange = (e: SelectChangeEvent<number>) =>
    setContractTricks(e.target.value);
  const handleDeclarerTricksChange = (e: SelectChangeEvent<number>) =>
    setDeclarerTricks(e.target.value);
  const handleBidWinnerToggle = (_e: eIn, checked: boolean) => setIsWe(checked);
  // double handlers
  const handleRedoubleToggle = (_e: eIn, checked: boolean) => {
    if (checked) {
      setIsDouble(true);
    }
    setIsRedouble(checked);
  };
  const handleDoubleToggle = (_e: eIn, checked: boolean) =>
    setIsDouble(checked);
  // honours handlers
  const handle4AcesToggle = (_e: eIn, checked: boolean) => setIs4Aces(checked);
  const handle5HonoursToggle = (_e: eIn, checked: boolean) => {
    if (checked) {
      setIsDouble(true);
    }
    setIs5Honours(checked);
  };
  const handle4HonoursToggle = (_e: eIn, checked: boolean) =>
    setIs4Honours(checked);

  // Reset form to defaults
  const resetForm = () => {
    setContractSuit("NT");
    setContractTricks(1);
    setDeclarerTricks(7);
    setIsDouble(false);
    setIsRedouble(false);
    setIs4Honours(false);
    setIs5Honours(false);
    setIs4Aces(false);
  };

  const { winner, madeBid, aboveTheLine, belowTheLine } = useBridgeScorer(
    declarerTricks,
    contractTricks,
    isWe,
    contractSuit,
    isDouble,
    isRedouble,
    is4Aces,
    is4Honours,
    is5Honours,
    weVulnerable,
    theyVulnerable,
  );

  const handleSave = () => {
    const [we, they] = aboveScores[gameIdx];
    const newWe: number[] = [...we];
    const newThey: number[] = [...they];
    const newWeBelow: number[] = [...weBelow];
    const newTheyBelow: number[] = [...theyBelow];

    if (winner === "we") {
      newWe.push(aboveTheLine);
      newWeBelow.push(belowTheLine);
      newThey.push(0);
      newTheyBelow.push(0);
    } else {
      newThey.push(aboveTheLine);
      newTheyBelow.push(belowTheLine);
      newWe.push(0);
      newWeBelow.push(0);
    }

    const newAboveScores: AboveScores = [...aboveScores];
    newAboveScores[gameIdx] = [newWe, newThey];

    setBridgeState({
      aboveScores: newAboveScores,
      weBelow: newWeBelow,
      theyBelow: newTheyBelow,
      weRubbers,
      theyRubbers,
      bids: [
        ...bids,
        `${contractTricks}${contractSuit}${madeBid ? "" : "❌"}${isDouble ? "❗️" : ""}${isRedouble ? "❗️" : ""}`,
      ],
      ...other,
    });

    resetForm();
    handleClose();
  };

  const handleUndo = () => {
    const [we, they] = aboveScores[gameIdx];
    const newWe = [...we.slice(0, -1)];
    const newThey = [...they.slice(0, -1)];
    const newWeBelow = [...weBelow.slice(0, -1)];
    const newTheyBelow = [...theyBelow.slice(0, -1)];
    const newBids = [...bids.slice(0, -1)];
    const newAboveScores: AboveScores = [...aboveScores];
    newAboveScores[gameIdx] = [newWe, newThey];
    setBridgeState({
      aboveScores: newAboveScores,
      weBelow: newWeBelow,
      theyBelow: newTheyBelow,
      weRubbers,
      theyRubbers,
      bids: newBids,
      ...other,
    });
    handleClose();
  };

  const handleEnd = () => {
    let newWeRubbers = weRubbers;
    let newTheyRubbers = theyRubbers;
    let weTotal = weSum;
    let theyTotal = theySum;
    if (weWins > theyWins) {
      weTotal += 300;
    } else if (theyWins > weWins) {
      theyTotal += 300;
    } else {
      const [we, they] = aboveScores[gameIdx];
      const sumWe = sum(we);
      const sumThey = sum(they);
      if (sumWe > 0 && sumThey === 0) {
        weTotal += 100;
      } else if (sumThey > 0 && sumWe === 0) {
        theyTotal += 100;
      }
    }

    if (weTotal > theyTotal) {
      newWeRubbers += 1;
    } else if (theyTotal > weTotal) {
      newTheyRubbers += 1;
    }

    setBridgeState({
      weRubbers: newWeRubbers,
      theyRubbers: newTheyRubbers,
      ...newBridgeGame(),
    });
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen} variant="contained">
        Score
      </Button>

      <Dialog
        title="info-popup"
        onClose={handleClose}
        open={isOpen}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Score</DialogTitle>

        <DialogContent>
          <ScoreForm
            contractSuit={contractSuit}
            contractTricks={contractTricks}
            declarerTricks={declarerTricks}
            isWe={isWe}
            isDouble={isDouble}
            isRedouble={isRedouble}
            is4Honours={is4Honours}
            is5Honours={is5Honours}
            is4Aces={is4Aces}
            madeBid={madeBid}
            onContractSuitChange={handleContractSuitChange}
            onContractTricksChange={handleContractTricksChange}
            onDeclarerTricksChange={handleDeclarerTricksChange}
            onBidWinnerToggle={handleBidWinnerToggle}
            onRedoubleToggle={handleRedoubleToggle}
            onDoubleToggle={handleDoubleToggle}
            on4AcesToggle={handle4AcesToggle}
            on5HonoursToggle={handle5HonoursToggle}
            on4HonoursToggle={handle4HonoursToggle}
          />

          <Divider sx={{ marginTop: 2 }} />
          <ScoreSummary
            winner={winner}
            madeBid={madeBid}
            aboveTheLine={aboveTheLine}
            belowTheLine={belowTheLine}
          />
          <ScoringTable />
        </DialogContent>

        <DialogActions>
          <Button color="error" onClick={handleEnd}>
            End
          </Button>
          <Button color="warning" onClick={handleUndo}>
            Undo
          </Button>
          <Button color="primary" onClick={handleClose}>
            Close
          </Button>
          <Button color="secondary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

ScoreDialog.displayName = "ScoreDialog";

export default ScoreDialog;
