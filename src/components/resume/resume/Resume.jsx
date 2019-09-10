import React, { useState, memo } from 'react';
// https://github.com/wojtekmaj/react-pdf
import { pdfjs, Document, Page } from 'react-pdf';
import get from 'lodash/get';
import resume from '../../../images/kenneth_bigler_resume.pdf';
// Parents: Main

const MAX_SCALE = 1.5;

// Workaround for worker-loader failing on Webpack 4
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function useResume() {
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(0);

  const onDocumentLoadSuccess = (pdf) => {
    setNumPages(get(pdf, 'numPages', 1));
  };

  const onLoadSuccess = (pdf) => {
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
