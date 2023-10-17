import { BotcScript } from "../../../constants/botc";
import { MuiColors } from "../../common/types";

const getAlignment = (
  alignment: MuiColors,
  script: BotcScript,
  role: string,
): MuiColors => {
  if (alignment === "primary") {
    return "primary";
  }
  if (
    (alignment === "inherit" || alignment === "info") &&
    script.townsfolk.indexOf(role) > -1
  ) {
    return "info";
  }
  if (
    (alignment === "inherit" || alignment === "success") &&
    script.outsiders.indexOf(role) > -1
  ) {
    return "success";
  }
  if (
    (alignment === "inherit" || alignment === "error") &&
    (script.minions.indexOf(role) > -1 || script.demons.indexOf(role) > -1)
  ) {
    return "error";
  }
  if (
    (alignment === "inherit" || alignment === "warning") &&
    script.travelers.indexOf(role) > -1
  ) {
    return "warning";
  }
  return "primary";
};

export default getAlignment;
