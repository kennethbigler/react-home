import { memo, CSSProperties } from "react";
import { Typography } from "@mui/material";
import resume from "../../../images/kenneth_bigler_resume.png";

const imageStyles: CSSProperties = {
  maxWidth: 1275,
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
      loading="lazy"
      decoding="async"
      style={{ ...imageStyles, width: "100%", height: "auto" }}
    />
  </>
));

Resume.displayName = "Resume";

export default Resume;
