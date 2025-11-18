import { memo } from "react";
import ScoringTable from "./ScoringTable";
import ScoreForm from "./ScoreForm";

const ScoreDialog = memo(() => (
  <>
    <ScoreForm />
    <ScoringTable />
  </>
));

ScoreDialog.displayName = "ScoreDialog";

export default ScoreDialog;
