import { memo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import ScoringTable from "./ScoringTable";
import ScoreForm, { eIn } from "./ScoreForm";
import InfoPopup from "../../../../common/info-popover/InfoPopup";
import { Divider, SelectChangeEvent } from "@mui/material";
import useBridgeScorer from "./score-helper";
import bridgeAtom, {
  AboveScores,
  bridgeRead,
} from "../../../../../jotai/bridge-atom";
import ScoreSummary from "./ScoreSummary";

const ScoreDialog = memo(() => {
  const [{ aboveScores, weBelow, theyBelow, ...other }, setBridgeState] =
    useAtom(bridgeAtom);
  const { gameIdx } = useAtomValue(bridgeRead);
  const [contractSuit, setContractSuit] = useState("nt");
  const [contractTricks, setContractTricks] = useState(1);
  const [declarerTricks, setDeclarerTricks] = useState(7);
  const [isWe, setIsWe] = useState(true);
  const [isDouble, setIsDouble] = useState(false);
  const [isRedouble, setIsRedouble] = useState(false);
  const [is4Honours, setIs4Honours] = useState(false);
  const [is5Honours, setIs5Honours] = useState(false);
  const [is4Aces, setIs4Aces] = useState(false);

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
    } else {
      newThey.push(aboveTheLine);
      newTheyBelow.push(belowTheLine);
    }

    const newAboveScores: AboveScores = [...aboveScores];
    newAboveScores[gameIdx] = [newWe, newThey];

    setBridgeState({
      aboveScores: newAboveScores,
      weBelow: newWeBelow,
      theyBelow: newTheyBelow,
      ...other,
    });

    setContractSuit("nt");
    setContractTricks(1);
    setDeclarerTricks(7);
    setIsWe(true);
    setIsDouble(false);
    setIsRedouble(false);
    setIs4Honours(false);
    setIs5Honours(false);
    setIs4Aces(false);
  };

  return (
    <InfoPopup title="Score" onSave={handleSave}>
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
    </InfoPopup>
  );
});

ScoreDialog.displayName = "ScoreDialog";

export default ScoreDialog;
