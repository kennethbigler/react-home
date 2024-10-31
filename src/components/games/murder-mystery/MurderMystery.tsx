import * as React from "react";
import Typography from "@mui/material/Typography";
import profiles, { CASINO, intro } from "../../../constants/murder";
import MurderMysteryPanel from "./MurderMysteryPanel";

const MurderMystery: React.FC = React.memo(() => {
  const [expanded, setExpanded] = React.useState("");

  const handleChange = React.useCallback(
    (panel: string) =>
      (_event: React.SyntheticEvent<Element, Event>, exp?: boolean): void => {
        setExpanded(exp ? panel : "");
      },
    [setExpanded],
  );

  const mmProfiles = React.useMemo(
    () =>
      profiles.map((profile, i) => {
        const { role, importance, gender, description, hint, clue } = profile;

        return (
          <MurderMysteryPanel
            key={i}
            {...{
              expanded,
              role,
              importance,
              gender,
              description,
              hint,
              clue,
              expandedKey: `${i}`,
              handleChange,
            }}
          />
        );
      }),
    [expanded, handleChange],
  );

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Murder Mystery
      </Typography>
      <hr aria-hidden />
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
      >{`Murder at ${CASINO}`}</Typography>
      <hr aria-hidden />
      <Typography gutterBottom>{intro}</Typography>
      <hr aria-hidden />
      {mmProfiles}
    </>
  );
});

MurderMystery.displayName = "MurderMystery";

export default MurderMystery;
