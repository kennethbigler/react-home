import type { ReactNode } from "react";
import { Typography } from "@mui/material";

interface ExperienceSectionProps {
  title: string;
  children: ReactNode;
}

const ExperienceSection = ({ title, children }: ExperienceSectionProps) => (
  <div style={{ marginTop: 25 }}>
    <Typography
      variant="h3"
      component="h2"
      style={{ textTransform: "capitalize" }}
    >
      {title}
    </Typography>
    <hr aria-hidden />
    {children}
  </div>
);

export default ExperienceSection;
