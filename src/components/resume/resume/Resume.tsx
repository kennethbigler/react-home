import React, { useState, memo } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import get from 'lodash/get';
import resume from '../../../images/kenneth_bigler_resume.pdf';

const MAX_SCALE = 1.5;

// Workaround for worker-loader failing on Webpack 4
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface ResumeHook {
  numPages: number;
  width: number;
  onDocumentLoadSuccess: Function;
  onLoadSuccess: Function;
}

function useResume(): ResumeHook {
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(0);

  const onDocumentLoadSuccess = (pdf): void => {
    setNumPages(get(pdf, 'numPages', 1));
  };

  const onLoadSuccess = (pdf): void => {
    const pdfWidth = get(pdf, 'pageInfo.view[2]', 612);
    const screenWidth = document.body.clientWidth - 32;
    setWidth(screenWidth > pdfWidth * MAX_SCALE ? pdfWidth * MAX_SCALE : screenWidth);
  };

  return {
    numPages,
    width,
    onDocumentLoadSuccess,
    onLoadSuccess,
  };
}

const Resume = memo(() => {
  const {
    numPages,
    width,
    onDocumentLoadSuccess,
    onLoadSuccess,
  } = useResume();

  return (
    <Document file={resume} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          onLoadSuccess={onLoadSuccess}
          pageNumber={index + 1}
          width={width}
        />
      ))}
    </Document>
  );
});

export default Resume;
