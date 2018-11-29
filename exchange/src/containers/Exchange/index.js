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
import Websocket from 'react-websocket';


export default class Exchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradeHistory: false,
      openOrders: false,
      symbolCode: '',
      orderBookBuy: false,
      coinBase: '',
      coinUsing: '',
    }
    
  }

  componentDidMount(){
    const url = window.location.href, key = '/exchange';
    let symbolCode = 'constbond', coinBase = 'constant', coinUsing = 'BOND';

    if(url.lastIndexOf(key) + key.length < url.length){
      symbolCode = url.substr(url.lastIndexOf(key) + key.length + 1);
      if(symbolCode.indexOf("_") > 0){
        symbolCode = symbolCode.toLowerCase();
        coinBase = symbolCode.substr(0, symbolCode.indexOf("_"));
        coinUsing = symbolCode.substr(symbolCode.indexOf("_")+1);

        symbolCode = symbolCode.replace("_", "");
      }
    }
    this.setState({symbolCode, coinBase, coinUsing}, async ()=>{
      //get data form api
      let { tradeHistory, openOrders } = this.state;

      if(!tradeHistory){
        tradeHistory = await this.getData('tradeHistory');
        this.setState({tradeHistory});
      }

      if(!openOrders){
        this.getOpenOrders();
      }
    });
  }

  async getOpenOrders(){
    let openOrders = await this.getData('openOrders');console.log('getOpenOrders', openOrders);
    this.setState({openOrders});
  }

  async getData(type){
    let result = false;
    
    if(type == 'tradeHistory'){
      result = await exchange.TradeHistory(this.state.symbolCode, 1, 10);
    }
    else{
      result = await exchange.OpenOrders(this.state.symbolCode, 1, 10);
    }
    
    if(result && result.length){
      for(let i in result){
        result[i].key = i;
      }
      
      return result;
    }

    return false;
  }

  handleOpenBook(data) {
    let result = JSON.parse(data);
    console.log(result);

    if(result){
      let orderBookBuy = [], orderBookSell = [];
      const buys = result.buy, sells = result.sell;

      if(buys && buys.length){
        for(let i in buys){
          orderBookBuy.push({price: buys[i][0], size: buys[i][1], side: "buy", key: i});
        }
      }

      if(sells && sells.length){
        for(let i in sells){
          orderBookSell.push({price: sells[i][0], size: sells[i][1], side: "sell", key: i});
        }
      }
      console.log(orderBookSell, orderBookBuy);
      this.setState({orderBookBuy, orderBookSell});
    }
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
    if(openOrders){
      const dataOpenOrders = new DataOpenOrder(5, openOrders);
      return <TableStyle className="">
        <OpenOrder dataList={dataOpenOrders} />
      </TableStyle>;
    }
    else{
      return "";
    }
  }

  renderTradeHistory(){
    const { tradeHistory } = this.state;
    if(tradeHistory){
      const dataTradeHistory = new DataTradeHistory(10, tradeHistory);
      return <TableStyle className="">
        <TradeHistory dataList={dataTradeHistory} />
      </TableStyle>;
    }
    else{
      return "";
    }
  }

  renderOrderBookBuy(){
    const { orderBookBuy } = this.state;
    if(orderBookBuy){
      const dataOrderBook = new DataOrderBook(10, orderBookBuy);
      return <TableStyle className="">
      <OrderBook dataList={dataOrderBook} />
    </TableStyle>
    }
    else{
      return "";
    } 
  }

  renderOrderBookSell(){
    const { orderBookSell } = this.state;
    if(orderBookSell){
      const dataOrderBook = new DataOrderBook(10, orderBookSell);
      return <TableStyle className="">
      <OrderBook dataList={dataOrderBook} />
    </TableStyle>
    }
    else{
      return "";
    } 
  }

  render() {
    const { symbolCode, coinBase, coinUsing } = this.state;
  
    return (
      <LayoutWrapper style={{ padding: 0, height: 'calc(100vh - 120px)' }}>
        <Row style={rowStyle} gutter={16} justify="start">
            <Col md={4} sm={8} xs={24} style={colStyle} >
              <Box title={this.headerBox("Exchange.OrderForm", "ion-beer", "#1f2d83")}>
                <OrderForm onFinish={() => this.getOpenOrders()} symbolCode={symbolCode} coinBase={coinBase} coinUsing={coinUsing} />
              </Box>
            </Col>
            <Col md={5} sm={8} xs={24} style={colStyle} >
              <Box title={this.headerBox("Exchange.OrderBook", "ion-ios-book", "#1f2d83")}>
                {
                  this.renderOrderBookBuy()
                }
                {
                  this.renderOrderBookSell()
                }
                <Websocket url='ws://localhost:8888/exchange/ws/trades'
                  onMessage={this.handleOpenBook.bind(this)}/>
              </Box>
            </Col>
            <Col md={10} sm={8} xs={24} style={colStyle} >
              <Box style={{height:'calc(50% - 0.6rem)', marginBottom: '0.7rem', padding: 0}}>
                <ContentHolder style={{height: '100%', padding: 0, margin: 0}}>
                {/* title={this.headerBox("Exchange.PriceChart", "ion-android-globe", "#1f2d83")}  */}
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
                  this.renderTradeHistory()                  
                }
              </Box>
            </Col>
        </Row>
      </LayoutWrapper>
    );
  }
}

