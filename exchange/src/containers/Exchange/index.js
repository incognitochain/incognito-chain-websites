import React, { Component } from 'react';
import LayoutWrapper from '../../components/utility/layoutWrapper.js';
import ContentHolder from '../../components/utility/contentHolder';
import { palette } from 'styled-theme';
import IntlMessages from '../../components/utility/intlMessages';
import Data from './data';
import { tableinfo } from './configs';
import SimpleView from './tableViews/simpleView';
import { Row, Col } from 'antd';
import Box from '../../components/utility/box';
import { borderRadius } from '../../settings/style-util';
import { TableStyle, rowStyle, colStyle, boxStyle } from './custom.style';

const dataList = new Data(10);

export default class Exchange extends Component {

  headerBox(text, icon, color){
    return <h3 style={{color}}>
      <i className={icon} style={{fontSize: '1.1rem', marginRight: '0.5rem'}} />
      <IntlMessages id={text} />
    </h3>;
  }

  render() {
    
    return (
      <LayoutWrapper style={{padding: 0, height: 'calc(100vh - 120px)'}}>
        <Row style={rowStyle} gutter={16} justify="start">
            <Col md={4} sm={8} xs={24} style={colStyle} >
              <Box title="Order Form" subtitle="Login form OR place BUY/SELL">
              </Box>
            </Col>
            <Col md={5} sm={8} xs={24} style={colStyle} >
              <Box title="Order Book" subtitle="Table list order BUY/SELL">
              </Box>
            </Col>
            <Col md={10} sm={8} xs={24} style={colStyle} >
              <Box title="Price Chart" subtitle="Chart and table list Order/Fills">
              </Box>
            </Col>
            <Col md={5} sm={8} xs={24} style={colStyle} >
              <Box title={this.headerBox("Exchange.TradeHistory", "ion-android-chat", "#1f2d83")} style={boxStyle}>
                <TableStyle className="isoLayoutContent">
                  <SimpleView tableInfo={tableinfo} dataList={dataList} />
                </TableStyle>
              </Box>
            </Col>
        </Row>
      </LayoutWrapper>
    );
  }
}
export { SimpleView, tableinfo, Data };
