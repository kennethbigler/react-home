import { Grid } from "@mui/material";
import Degree from "@/components/common/edu-cards/Degree";
import type { School } from "@/constants/classes";
import ExperienceSection from "./ExperienceSection";
import { experienceCardSize } from "./experienceCardSize";

interface DegreeCardsProps {
  title: string;
  degrees: School[];
  fullWidth?: boolean;
}

const DegreeCards = ({ title, degrees, fullWidth }: DegreeCardsProps) => (
  <ExperienceSection title={title}>
    <Grid container spacing={2}>
      {degrees.map((degree) => (
        <Grid
          key={degree.degree}
          size={experienceCardSize(degrees.length, fullWidth)}
        >
          <Degree degree={degree} />
        </Grid>
      ))}
    </Grid>
  </ExperienceSection>
);

export default DegreeCards;
