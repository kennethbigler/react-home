import { MuiColors } from "../../../common/types";

const getButtonValues = (
  isTB: boolean,
  noMatch: boolean,
  match: boolean,
  isPaired: boolean,
  isConsolidated: boolean,
  histValue: number,
) => {
  // variables
  let variant: "outlined" | "contained" = "outlined";
  let color: MuiColors = "primary";

  if (isTB && (noMatch || match)) {
    // if has data about match or no match
    variant = "contained";
  } else if (isPaired) {
    // if paired this round
    variant = "contained";
  } else if (isConsolidated && histValue > 0) {
    // if consolidated
    variant = "contained";
  }

  if (noMatch) {
    color = "error";
  } else if (match) {
    color = "success";
  }

  return { variant, color, histValue };
};

export default getButtonValues;
