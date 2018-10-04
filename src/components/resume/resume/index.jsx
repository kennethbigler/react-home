import React from 'react';
import PDF from '../../common/PDF';
import resume from '../../../images/kenneth_bigler_resume.pdf';
// Parents: Main

const Resume = () => (
  <PDF file={resume} />
);

export default Resume;
