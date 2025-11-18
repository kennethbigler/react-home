import { memo } from "react";
import ScoringTable from "./ScoringTable";
import ScoreForm from "./ScoreForm";
import InfoPopup from "../../../common/info-popover/InfoPopup";

const ScoreDialog = memo(() => (
  <InfoPopup title="Score">
    <ScoreForm />
    <ScoringTable />
  </InfoPopup>
));

ScoreDialog.displayName = "ScoreDialog";

export default ScoreDialog;
