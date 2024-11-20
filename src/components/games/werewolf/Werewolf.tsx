import * as React from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {
  Role,
  villagers,
  outsiders,
  wolves,
} from "../../../constants/werewolf";
import WerewolfPanel from "./WerewolfPanel";
import ExpandableCard from "../../common/expandable-card";

const Werewolf: React.FC = React.memo(() => {
  const [expanded, setExpanded] = React.useState("");
  const [gameTotal, setGameTotal] = React.useState<number | undefined>(
    undefined,
  );
  const [masonCount, setMasonCount] = React.useState(0);
  const [villagerCount, setVillagerCount] = React.useState(0);
  const [vampireCount, setVampireCount] = React.useState(0);
  const [wolfCount, setWolfCount] = React.useState(0);

  const handleChange = React.useCallback(
    (panel: string) =>
      (_event: React.SyntheticEvent<Element, Event>, exp?: boolean): void => {
        setExpanded(exp ? panel : "");
      },
    [setExpanded],
  );

  const handleStar = (value: number, count: number, role: string) => {
    switch (role) {
      case "Mason":
        setGameTotal(
          (gameTotal || 0) + value * (count ? count - masonCount : masonCount),
        );
        setMasonCount(count);
        return;
      case "Villager":
        setGameTotal(
          (gameTotal || 0) +
            value * (count ? count - villagerCount : villagerCount),
        );
        setVillagerCount(count);
        return;
      case "Vampire":
        setGameTotal(
          (gameTotal || 0) +
            value * (count ? count - vampireCount : vampireCount),
        );
        setVampireCount(count);
        return;
      case "Werewolf":
        setGameTotal(
          (gameTotal || 0) + value * (count ? count - wolfCount : wolfCount),
        );
        setWolfCount(count);
        return;
      default:
        setGameTotal((gameTotal || 0) + value);
    }
  };

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
          expandedKey: `${name}-${i}`,
          handleChange,
          handleStar,
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
      {gameTotal !== undefined && (
        <Chip
          label={`Total: ${gameTotal}`}
          color="primary"
          sx={{ position: "fixed", bottom: 15, right: 15, zIndex: 1 }}
        />
      )}
      <ExpandableCard title="Villagers">{villagerPanels}</ExpandableCard>
      <ExpandableCard title="Outsiders">{outsiderPanels}</ExpandableCard>
      <ExpandableCard title="Wolves">{wolfPanels}</ExpandableCard>
    </>
  );
});

Werewolf.displayName = "Werewolf";

export default Werewolf;
