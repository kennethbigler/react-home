import React from 'react';
import { render, screen } from '@testing-library/react';
import Degree, { DegreeType } from './Degree';

const degree: DegreeType = {
  degree: 'DegreeName',
  years: [{
    year: 'YearName',
    quarters: [{
      quarter: 'QuarterName',
      classes: [
        { name: 'ClassName', catalog: 'CLSS 101' },
      ],
    }],
  }],
};

describe('resume | education | Degree', () => {
  it('renders as expected with minimal props', () => {
    render(<Degree degree={degree} />);

    expect(screen.getByText(degree.degree)).toBeInTheDocument();
    expect(screen.getByText('YearName')).toBeInTheDocument();
    expect(screen.getByText('QuarterName')).toBeInTheDocument();
    expect(screen.getByText('CLSS 101 -')).toBeInTheDocument();
    expect(screen.getByText('ClassName')).toBeInTheDocument();

    expect(screen.queryByText('SubTitle')).toBeNull();
  });

  it('renders as expected with maximum props', () => {
    const localDegree = {
      ...degree,
      school: 'SchoolName',
      major: 'MajorName',
      minor: 'MinorName',
      gpa: '3.97',
      graduation: 'GraduationName',
      subtitle: 'SubTitle',
      color: '#0067C5',
    };

    const { container } = render(<Degree degree={localDegree} />);

    expect(
      screen.getByText(
        `${localDegree.school} - ${localDegree.degree} in ${localDegree.major} ${localDegree.minor}`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(localDegree.subtitle)).toBeInTheDocument();
    expect(screen.getByText('YearName')).toBeInTheDocument();
    expect(screen.getByText('QuarterName')).toBeInTheDocument();
    expect(screen.getByText('CLSS 101 -')).toBeInTheDocument();
    expect(screen.getByText('ClassName')).toBeInTheDocument();
    expect(container.querySelector('.MuiCardHeader-root')).toHaveStyle('background-color: rgb(0, 103, 197);');

    expect(screen.queryByText(`GPA: ${localDegree.gpa} - Graduation: ${localDegree.graduation}`)).toBeNull();
  });

  it('renders gpa as expected without subtitle props', () => {
    const localDegree = {
      ...degree,
      gpa: '3.97',
      graduation: 'GraduationName',
    };

    render(<Degree degree={localDegree} />);

    expect(screen.getByText(localDegree.degree)).toBeInTheDocument();
    expect(screen.getByText(`GPA: ${localDegree.gpa} - Graduation: ${localDegree.graduation}`)).toBeInTheDocument();
    expect(screen.getByText('YearName')).toBeInTheDocument();
    expect(screen.getByText('QuarterName')).toBeInTheDocument();
    expect(screen.getByText('CLSS 101 -')).toBeInTheDocument();
    expect(screen.getByText('ClassName')).toBeInTheDocument();
  });
});
