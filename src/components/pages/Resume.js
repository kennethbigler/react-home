import React from 'react';
import resume from '../../images/kenneth_bigler_resume.pdf';

const Resume = () => {
  return (
    <object data={resume} type="application/pdf" width="100%" height="750px">
      <embed src={resume} type="application/pdf" />
      <p>
        This browser does not support PDFs. Please download the PDF to view it:{' '}
        <a href={'/kenneth_bigler_resume.pdf'}>Download PDF</a>.
      </p>
    </object>
  );
};

export default Resume;
