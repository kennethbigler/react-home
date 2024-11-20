import * as React from "react";
import Typography from "@mui/material/Typography";
import roles, { CASINO, Importance, intro } from "../../../constants/murder";
import MurderMysteryPanel from "./MurderMysteryPanel";
import ExpandableCard from "../../common/expandable-card";

const MurderMystery: React.FC = React.memo(() => {
  const [expanded, setExpanded] = React.useState("");

  const handleChange = React.useCallback(
    (panel: string) =>
      (_event: React.SyntheticEvent<Element, Event>, exp?: boolean): void => {
        setExpanded(exp ? panel : "");
      },
    [setExpanded],
  );

  const requiredRoles: React.ReactNode[] = [];
  const recRoles: React.ReactNode[] = [];
  const optionalRoles: React.ReactNode[] = [];

  roles.forEach((r, i) => {
    const { role, gender, description, hint, clue } = r;
    const R = (
      <MurderMysteryPanel
        key={i}
        {...{
          expanded,
          role,
          gender,
          description,
          hint,
          clue,
          expandedKey: `${i}`,
          handleChange,
        }}
      />
    );

    switch (r.importance) {
      case Importance.I1:
        requiredRoles.push(R);
        break;
      case Importance.I2:
        recRoles.push(R);
        break;
      case Importance.I3:
      default:
        optionalRoles.push(R);
    }
  });

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Murder Mystery
      </Typography>
      <ExpandableCard title={`Murder at ${CASINO}`}>
        <Typography gutterBottom>{intro}</Typography>
      </ExpandableCard>
      <ExpandableCard title="Required Roles">{requiredRoles}</ExpandableCard>
      <ExpandableCard title="Recommended Roles">{recRoles}</ExpandableCard>
      <ExpandableCard title="Optional Roles">{optionalRoles}</ExpandableCard>
    </>
  );
});

MurderMystery.displayName = "MurderMystery";

export default MurderMystery;
