import type { ReactNode } from "react";
import { Box, Divider, Typography } from "@mui/material";

interface ExperienceSectionProps {
  title: string;
  children: ReactNode;
}

export const ExperienceSection = ({
  title,
  children,
}: ExperienceSectionProps) => (
  <Box sx={{ mt: 3 }}>
    <Typography
      variant="h3"
      component="h2"
      sx={{ textTransform: "capitalize" }}
    >
      {title}
    </Typography>
    <Divider aria-hidden />
    {children}
  </Box>
);
