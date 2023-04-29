import * as React from "react";
import Typography from "@mui/material/Typography";
import {
  Role,
  villagers,
  outsiders,
  wolves,
} from "../../../constants/werewolf";
import WerewolfPanel from "./WerewolfPanel";

const Werewolf: React.FC = React.memo(() => {
  const [expanded, setExpanded] = React.useState("");

  const handleChange = React.useCallback(
    (panel: string) =>
      (_event: React.SyntheticEvent<Element, Event>, exp?: boolean): void => {
        setExpanded(exp ? panel : "");
      },
    [setExpanded]
  );

  const getRolePanel = (role: Role, i: number) => {
    const { name, description, value, count } = role;

    return (
      <WerewolfPanel
        key={i}
        {...{
          expanded,
          name,
          description,
          value,
          count,
          expandedKey: `${i}`,
          handleChange,
        }}
      />
    );
  };

  const villagerPanels = villagers.map(getRolePanel);
  const outsiderPanels = outsiders.map(getRolePanel);
  const wolfPanels = wolves.map(getRolePanel);

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Werewolf
      </Typography>
      <hr />
      <Typography variant="h3" component="h2" gutterBottom>
        Villagers
      </Typography>
      {villagerPanels}
      <hr />
      <Typography variant="h3" component="h2" gutterBottom>
        Outsiders
      </Typography>
      {outsiderPanels}
      <hr />
      <Typography variant="h3" component="h2" gutterBottom>
        Wolves
      </Typography>
      {wolfPanels}
    </>
  );
});

export default Werewolf;
