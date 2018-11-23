import React, { Component } from 'react';
import LayoutWrapper from '../../components/utility/layoutWrapper.js';
import IntlMessages from '../../components/utility/intlMessages';
import DataTradeHistory from './dataTradeHistory';
import DataOrderBook from './dataOrderBook';
import TradeHistory from './table/tradeHistory';
import OrderBook from './table/orderBook';
import OrderForm from './table/orderForm';
import { Row, Col } from 'antd';
import Box from '../../components/utility/box';
import { TableStyle, rowStyle, colStyle, boxStyle } from './custom.style';

const dataTradeHistory= new DataTradeHistory(10);
const dataOrderBook= new DataOrderBook(10);

export default class Exchange extends Component {

  headerBox(text, icon, color){
    return <div>
      <h3 style={{color}}>
        <i className={icon} style={{fontSize: '1.1rem', marginRight: '0.5rem'}} />
        <IntlMessages id={text} />
      </h3>
    </div>;
  }

  render() {
    
    return (
      <LayoutWrapper style={{padding: 0, height: 'calc(100vh - 120px)'}}>
        <Row style={rowStyle} gutter={16} justify="start">
            <Col md={4} sm={8} xs={24} style={colStyle} >
              <Box title={this.headerBox("Exchange.OrderForm", "ion-beer", "#1f2d83")}>
                <OrderForm  />
              </Box>
            </Col>
            <Col md={5} sm={8} xs={24} style={colStyle} >
              <Box title={this.headerBox("Exchange.OrderBook", "ion-ios-book", "#1f2d83")}>
                <TableStyle className="">
                  <OrderBook dataList={dataOrderBook} />
                </TableStyle>
                <TableStyle className="">
                  <OrderBook dataList={dataOrderBook} />
                </TableStyle>
              </Box>
            </Col>
            <Col md={10} sm={8} xs={24} style={colStyle} >
              <Box title={this.headerBox("Exchange.PriceChart", "ion-android-globe", "#1f2d83")} >
              </Box>
            </Col>
            <Col md={5} sm={8} xs={24} style={colStyle} >
              <Box title={this.headerBox("Exchange.TradeHistory", "ion-ios-list-outline", "#1f2d83")} style={boxStyle}>
                <TableStyle className="">
                  <TradeHistory dataList={dataTradeHistory} />
                </TableStyle>
              </Box>
            </Col>
        </Row>
      </LayoutWrapper>
    );
  }
}

