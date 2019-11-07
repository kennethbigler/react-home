import React from 'react';
import resume from '../../../images/kenneth_bigler_resume.png';

const imageStyles: React.CSSProperties = {
  maxWidth: 1275,
  width: '100%',
  display: 'block',
  margin: 'auto',
};

const Resume = React.memo(() => (
  <img src={resume} alt="Kenneth Bigler Software Engineer Resume" style={imageStyles} />
));

export default Resume;
