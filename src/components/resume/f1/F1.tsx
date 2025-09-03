import Typography from "@mui/material/Typography";
import Standings from "./charts/Standings";
import { useAtomValue } from "jotai";
import themeAtom from "../../../jotai/theme-atom";

const F1 = () => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <>
      <Typography variant="h2" component="h1">
        F1
      </Typography>
      <Standings color={color} />
    </>
  );
};

export default F1;
