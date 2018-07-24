// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ms } from '../../styles/helpers';
import { fileToDataURL } from '../../utils/file';

type Props = {
  pdfUrl?: string
};

const Container = styled.div`
  flex-grow: 1;
  padding: ${ms(5)} 0;
`;

const LoadingPdf = styled.div``;

const initialState = {
  numPages: null,
  fetching: false,
  pdf: null
};

export default class Delegate extends Component<Props> {
  props: Props;
  state = initialState;

  async componentWillMount() {
    const { pdfUrl } = this.props;
    if (pdfUrl && /.pdf$/.test(pdfUrl)) {
      this.setState({ fetching: true });
      const pdf = await fileToDataURL(pdfUrl).catch(() => {
        return false;
      });
      const updatedState = { fetching: false };
      if (pdf) {
        updatedState.pdf = pdf;
      }
      this.setState(updatedState);
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  render() {
    const { numPages, pdf, fetching } = this.state;

    return (
      <Container>
        {fetching ? (
          <LoadingPdf>Loading ...</LoadingPdf>
        ) : (
          <Document file={pdf} onLoadSuccess={this.onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        )}
      </Container>
    );
  }
}
