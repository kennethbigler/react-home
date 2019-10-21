import React from 'react';
import get from 'lodash/get';
import map from 'lodash/map';
import Year, { YearType } from './Year';
import ExpandableCard from '../../common/expandable-card';

interface DegreeType {
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

const Degree: React.FC<DegreeProps> = (props: DegreeProps) => {
  const { degree } = props;

  const school = degree.school ? `${degree.school} - ` : '';
  const major = degree.major ? ` in ${degree.major}` : '';
  const minor = degree.minor ? ` ${degree.minor}` : '';
  const title = `${school}${degree.degree}${major}${minor}`;
  const gpa = degree.gpa && `GPA: ${degree.gpa}`;
  const graduation = degree.graduation
    ? ` - Graduation: ${degree.graduation}`
    : '';
  const subtitle = get(degree, 'subtitle', `${gpa}${graduation}`);

  return (
    <ExpandableCard
      backgroundColor={degree.color && degree.color}
      subtitle={subtitle}
      title={title}
    >
      {map(degree.years, (year) => (
        <Year key={year.year} len={degree.years.length} year={year} />
      ))}
    </ExpandableCard>
  );
};

export default Degree;
