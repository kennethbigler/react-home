import React from "react";
import Typography from "@mui/material/Typography";
import resume from "../../../images/kenneth_bigler_resume.png";

const imageStyles: React.CSSProperties = {
  maxWidth: 1275,
  width: "100%",
  display: "block",
  margin: "auto",
};

const Resume = React.memo(() => (
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

export default Resume;
