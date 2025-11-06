import { memo } from "react";
import Typography from "@mui/material/Typography";
import Degree from "../../common/edu-cards/Degree";
import { presentations } from "../../../constants/classes";

/** Presentations  ->  Degree */
const Presentations = memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Presentations &amp; Hackathons
    </Typography>
    {presentations.map((d) => (
      <Degree key={d.degree} degree={d} />
    ))}
  </>
));

Presentations.displayName = "Presentations";

export default Presentations;
