import React, { Component } from 'react';
import LayoutWrapper from '../../components/utility/layoutWrapper.js';
import basicStyle from '../../settings/basicStyle';
import ContentHolder from '../../components/utility/contentHolder';
import TableStyle from './customStyle';
import PageHeader from '../../components/utility/pageHeader';
import IntlMessages from '../../components/utility/intlMessages';
import Data from './data';
import { tableinfo } from './configs';
import SortView from './tableViews/sortView';
import { Row, Col } from 'antd';
import Box from '../../components/utility/box';

const dataList = new Data(3);

export default class Exchange2 extends Component {

  render() {
    const { rowStyle, colStyle, gutter } = basicStyle;

    return (
      <LayoutWrapper style={{padding: 0}}>
        <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={4} sm={8} xs={24} style={{ padding: '0 8px' }}>
              1
            </Col>
            <Col md={4} sm={8} xs={24} style={{ padding: '0 8px' }}>
              2
            </Col>
            <Col md={12} sm={8} xs={24} style={{ padding: '0 8px' }}>
              3
            </Col>
            <Col md={4} sm={8} xs={24} style={{ padding: '0 8px' }}>
              4
            </Col>
        </Row>
        <TableStyle className="isoLayoutContent">
          <SortView tableInfo={tableinfo} dataList={dataList} />
        </TableStyle>
      </LayoutWrapper>
    );
  }
}
export { SortView, tableinfo, Data };
