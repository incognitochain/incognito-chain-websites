import React, { Component } from 'react';
import LayoutWrapper from 'core-components/utility/layoutWrapper.js';
import IntlMessages from 'core-components/utility/intlMessages';
import DataTradeHistory from './dataTradeHistory';
import DataOrderBook from './dataOrderBook';
import TradeHistory from './table/tradeHistory';
import OrderBook from './table/orderBook';
import OrderForm from './table/orderForm';
import { Row, Col } from 'antd';
import Box from 'core-components/utility/box';
import { TableStyle, rowStyle, colStyle, boxStyle } from './custom.style';
import exchange from '../../services/Exchange';
import ContentHolder from '../../components/utility/contentHolder';

//const dataTradeHistory= new DataTradeHistory(10);
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
              <Box title={this.headerBox("Exchange.PriceChart", "ion-android-globe", "#1f2d83")} >
              <ContentHolder>

                Chart
              </ContentHolder>

              <ContentHolder>
                list fill  
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

