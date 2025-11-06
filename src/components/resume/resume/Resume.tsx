import { memo, CSSProperties } from "react";
import Typography from "@mui/material/Typography";
import resume from "../../../images/kenneth_bigler_resume.png";

const imageStyles: CSSProperties = {
  maxWidth: 1275,
  width: "100%",
  display: "block",
  margin: "auto",
};

const Resume = memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Resume
    </Typography>
    <img
      src={resume}
      alt="Kenneth Bigler Software Engineer Resume"
      style={imageStyles}
    />
  </>
));

Resume.displayName = "Resume";

export default Resume;
