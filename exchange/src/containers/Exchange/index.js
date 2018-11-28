import React, { Component } from 'react';
import LayoutWrapper from '@/components/utility/layoutWrapper.js';
import IntlMessages from '@/components/utility/intlMessages';
import ContentHolder from '@/components/utility/contentHolder';
import Box from '@/components/utility/box';
import exchange from '@/services/Exchange';

import { Row, Col } from 'antd';
import { TableStyle, rowStyle, colStyle, boxStyle } from './custom.style';

import DataTradeHistory from './dataTradeHistory';
import DataOrderBook from './dataOrderBook';
import DataOpenOrder from './dataOpenOrder';

import TradeHistory from './table/tradeHistory';
import OrderBook from './table/orderBook';
import OrderForm from './table/orderForm';
import OpenOrder from './table/openOrder';

import TradingViewWidget from 'react-tradingview-widget';

//const dataOpenOrder= new DataOpenOrder(10);
const dataOrderBook= new DataOrderBook(10);

export default class Exchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradeHistory: false,
      openOrders: false,
    }
    
  }

  async componentDidMount(){
    let { tradeHistory, openOrders } = this.state;

    if(!tradeHistory){
      tradeHistory = await this.getData('tradeHistory');
      this.setState({tradeHistory});
    }

    console.log(openOrders);
    if(!openOrders){
      openOrders = await this.getData('openOrders');
      this.setState({openOrders});
    }
  }

  async getData(type){
    let result = false;
    
    if(type == 'tradeHistory'){
      result = await exchange.TradeHistory("constantbond", 1, 10);
    }
    else{
      result = await exchange.OpenOrders("constantbond", 1, 10);
    }
    
    if(result && result.length){
      for(let i in result){
        result[i].key = i;
      }
      
      return result;
    }

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

  renderOpenOrder(){
    const { openOrders } = this.state;
    if(openOrders){console.log(openOrders);
      const dataOpenOrders = new DataOpenOrder(10, openOrders);
      return <TableStyle className="">
        <OpenOrder dataList={dataOpenOrders} />
      </TableStyle>;
    }
    else{
      return "";
    }
  }

  render() {
    const { tradeHistory } = this.state;
    const dataTradeHistory = new DataTradeHistory(10, tradeHistory);

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
                {
                  this.renderOpenOrder()
                }
              </ContentHolder>              
              </Box>
            </Col>
            <Col md={5} sm={8} xs={24} style={colStyle} >
              <Box title={this.headerBox("Exchange.TradeHistory", "ion-ios-list-outline", "#1f2d83")} style={boxStyle}>
                {
                  tradeHistory && 
                  <TableStyle className="">
                    <TradeHistory dataList={dataTradeHistory} />
                  </TableStyle>
                }
              </Box>
            </Col>
        </Row>
      </LayoutWrapper>
    );
  }
}

