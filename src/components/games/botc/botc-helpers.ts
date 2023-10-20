import { BotcScript, bmr, snv, tb } from "../../../constants/botc";
import { MuiColors } from "../../common/types";

const getAlignment = (
  alignment: MuiColors,
  script: BotcScript,
  role: string,
): MuiColors => {
  if (alignment === "error" || script.minions.indexOf(role) > -1 || script.demons.indexOf(role) > -1) {
    return "error";
  }
  if (alignment === "warning" || tb.travelers.indexOf(role) > -1 || snv.travelers.indexOf(role) > -1 || bmr.travelers.indexOf(role) > -1) {
    return "warning";
  }
  if (alignment === "success" || script.outsiders.indexOf(role) > -1) {
    return "success";
  }
  if (alignment === "info" || script.townsfolk.indexOf(role) > -1) {
    return "info";
  }
  return "primary";
};

export default getAlignment;
