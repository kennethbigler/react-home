import React, { Component } from 'react';
// https://github.com/wojtekmaj/react-pdf
import { Document, Page } from 'react-pdf';
import resume from '../../../images/kenneth_bigler_resume.pdf';
// Parents: Main

export class Resume extends Component {
  state = {
    file: resume,
    pageNumber: null,
    numPages: null
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
      pageNumber: null
    });
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
