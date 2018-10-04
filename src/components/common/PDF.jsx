import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PdfJsLib from 'pdfjs-dist';

const MAX_SCALE = 1.5;

export default class ReactPdfJs extends Component {
  static propTypes = {
    file: PropTypes.string.isRequired,
    page: PropTypes.number,
    onDocumentComplete: PropTypes.func,
  }

  static defaultProps = {
    page: 1,
    onDocumentComplete: null,
  }

  state = {
    pdf: null,
    width: null,
  };

  componentDidMount() {
    const { file, onDocumentComplete, page: currentPage } = this.props;

    PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.489/pdf.worker.js';
    PdfJsLib.getDocument(file).then((pdf) => {
      this.setState({ pdf });
      if (onDocumentComplete) {
        onDocumentComplete(pdf.pdfInfo.numPages);
      }
      pdf.getPage(currentPage).then(this.getPDFRenderSizes);
    });
  }

  componentDidUpdate(prevProps) {
    const { page: currentPage } = this.props;
    const { pdf } = this.state;
    const { page: prevPage } = prevProps;

    if (prevPage !== currentPage) {
      pdf.getPage(prevPage).then(this.getPDFRenderSizes);
    }
  }

  getPDFRenderSizes = (page) => {
    const pdfWidth = page.pageInfo.view[2];
    const screenWidth = document.body.clientWidth - 32;
    const scale = screenWidth / pdfWidth;
    const viewport = page.getViewport(scale > MAX_SCALE ? MAX_SCALE : scale);

    const { canvas } = this;
    const canvasContext = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext,
      viewport,
    };
    page.render(renderContext);
    this.setState({ width: viewport.width });
  }

  render() {
    const { width } = this.state;

    const style = {
      display: 'block',
      margin: 'auto',
      width,
    };

    return (
      <div style={style}>
        <canvas ref={(canvas) => { this.canvas = canvas; }} />
      </div>
    );
  }
}
