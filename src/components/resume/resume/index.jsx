import React, { Component } from 'react';
// https://github.com/wojtekmaj/react-pdf
import { pdfjs, Document, Page } from 'react-pdf';
import resume from '../../../images/kenneth_bigler_resume.pdf';
// Parents: Main

// Workaround for worker-loader failing on Webpack 4
pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.550/pdf.worker.js';

export default class Resume extends Component {
  state = {
    file: resume,
    numPages: null,
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  render() {
    const { file, numPages } = this.state;

    return (
      <Document file={file} onLoadSuccess={this.onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            onRenderSuccess={this.onPageRenderSuccess}
            pageNumber={index + 1}
            width={document.body.clientWidth - 42}
          />
        ))}
      </Document>
    );
  }
}
