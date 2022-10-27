import * as React from "react";
import Year, { YearType } from "./Year";
import ExpandableCard from "../../common/expandable-card";

export interface DegreeType {
  school?: string;
  major?: string;
  minor?: string;
  degree: string;
  gpa?: string | number;
  graduation?: string;
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
  const minor = degree.minor ? ` ${degree.minor}` : "";
  const title = `${school}${degree.degree}${major}${minor}`;
  const gpa = degree.gpa && `GPA: ${degree.gpa}`;
  const graduation = degree.graduation
    ? ` - Graduation: ${degree.graduation}`
    : "";
  const subtitle =
    degree.subtitle || ((gpa || graduation) && `${gpa || ""}${graduation}`);

  return { title, subtitle };
};

/** Education  ->  Degree  -> Year  ->  Quarter  ->  Class */
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
