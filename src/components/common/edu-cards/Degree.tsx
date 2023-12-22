import * as React from "react";
import Year, { YearType } from "./Year";
import ExpandableCard from "../expandable-card";

export interface DegreeType {
  school?: string;
  major?: string;
  minor?: string;
  degree: string;
  subtitle?: string;
  color?: string;
  years: YearType[];
}
interface DegreeProps {
  degree: DegreeType;
}

const getTitles = (degree: DegreeType): { title: string; subtitle: string } => {
  const school = degree.school ? `${degree.school} - ` : "";
  const major = degree.major ? ` in ${degree.major}` : "";
  const minor = degree.minor ? `, ${degree.minor}` : "";
  const title = `${school}${degree.degree}${major}${minor}`;
  const subtitle = degree.subtitle || "";

  return { title, subtitle };
};

/** Degree  -> Year  ->  Quarter  ->  Class */
const Degree: React.FC<DegreeProps> = (props: DegreeProps) => {
  const { degree } = props;
  const { title, subtitle } = getTitles(degree);

  return (
    <ExpandableCard
      backgroundColor={degree.color && degree.color}
      subtitle={subtitle}
      title={title}
    >
      {degree.years.map((year) => (
        <Year key={year.year} len={degree.years.length} year={year} />
      ))}
    </ExpandableCard>
  );
};

export default Degree;
