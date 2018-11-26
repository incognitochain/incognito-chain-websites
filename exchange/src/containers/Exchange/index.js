import React, { Component } from 'react';
import LayoutWrapper from '@/components/utility/layoutWrapper.js';
import IntlMessages from '@/components/utility/intlMessages';
import ContentHolder from '@/components/utility/contentHolder';
import Box from '@/components/utility/box';
import exchange from '@/services/Exchange';

import { Row, Col } from 'antd';
import { TableStyle, rowStyle, colStyle, boxStyle } from './custom.style';

import dataTradeHistory from './dataTradeHistory';
import DataOrderBook from './dataOrderBook';
import DataOpenOrder from './dataOpenOrder';

import TradeHistory from './table/tradeHistory';
import OrderBook from './table/orderBook';
import OrderForm from './table/orderForm';
import OpenOrder from './table/openOrder';

import TradingViewWidget from 'react-tradingview-widget';

//const dataTradeHistory= new DataTradeHistory(10);
const dataOpenOrder= new DataOpenOrder(10);
const dataOrderBook= new DataOrderBook(10);

export default class Exchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderHistory: false,
    }
    
  }

  async componentDidMount(){
    let { orderHistory } = this.state;

    if(!orderHistory){
      orderHistory = await this.getData();
      this.setState({orderHistory});
    }
  }

  async getData(){console.log('getData');
    let result = await exchange.OrderHistory("btcusdt", 1, 10);
    if(result && result.length)
      return result;

    return false;
  }

  headerBox(text, icon, color) {
    return <div>
      <h3 style={{ color }}>
        <i className={icon} style={{ fontSize: '1.1rem', marginRight: '0.5rem' }} />
        <IntlMessages id={text} />
      </h3>
    </div>;
  }

  render() {
    const { orderHistory } = this.state
    return (
      <LayoutWrapper style={{ padding: 0, height: 'calc(100vh - 120px)' }}>
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
              <Box title={this.headerBox("Exchange.PriceChart", "ion-android-globe", "#1f2d83")} style={{height:'calc(50% - 0.6rem)', marginBottom: '0.7rem'}}>
                <ContentHolder style={{height: 'calc(100% - 50px'}}>
                  
                <TradingViewWidget
                  symbol="BITTREX:BTCUSDT"
                  theme="Light"
                  locale="vi_VN"
                  hide_top_toolbar
                  autosize
                />
                </ContentHolder>
              </Box>
              <Box title={this.headerBox("Exchange.OpenOrder", "ion-android-globe", "#1f2d83")} style={{height:'50%'}}>
              <ContentHolder>
                <TableStyle className="">
                  <OpenOrder dataList={dataOpenOrder} />
                </TableStyle>
              </ContentHolder>              
              </Box>
            </Col>
            <Col md={5} sm={8} xs={24} style={colStyle} >
              <Box title={this.headerBox("Exchange.TradeHistory", "ion-ios-list-outline", "#1f2d83")} style={boxStyle}>
                {
                  orderHistory && 
                  <TableStyle className="">
                    <TradeHistory dataList={orderHistory} />
                  </TableStyle>
                }
                
              </Box>
            </Col>
        </Row>
      </LayoutWrapper>
    );
  }
}

