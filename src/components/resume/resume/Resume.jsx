import React, { Component } from 'react';
// https://github.com/wojtekmaj/react-pdf
import { pdfjs, Document, Page } from 'react-pdf';
import resume from '../../../images/kenneth_bigler_resume.pdf';
// Parents: Main

const MAX_SCALE = 1.5;

// Workaround for worker-loader failing on Webpack 4
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default class Resume extends Component {
  state = {
    file: resume,
    numPages: null,
    width: 0,
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  onLoadSuccess = (pdf) => {
    const pdfWidth = pdf.pageInfo.view[2];
    const screenWidth = document.body.clientWidth - 32;
    const width = screenWidth > pdfWidth * MAX_SCALE ? pdfWidth * MAX_SCALE : screenWidth;

    this.setState({ width });
  }

  render() {
    const { file, numPages, width } = this.state;

    return (
      <div>
        <Document file={file} onLoadSuccess={this.onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              onLoadSuccess={this.onLoadSuccess}
              onRenderSuccess={this.onPageRenderSuccess}
              pageNumber={index + 1}
              width={width}
            />
          ))}
        </Document>
      </div>
    );
  }
}
