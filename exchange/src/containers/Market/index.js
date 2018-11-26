import React, { Component } from 'react';
import Tabs, { TabPane } from '@/components/uielements/tabs';
import LayoutWrapper from '@/components/utility/layoutWrapper.js';
import ContentHolder from '@/components/utility/contentHolder';
import PageHeader from '@/components/utility/pageHeader';
import IntlMessages from '@/components/utility/intlMessages';
import basicStyle from '../../settings/basicStyle';
import { Row, Col } from 'antd';
import Box from '@/components/utility/box';
import Card from './card.style';

import TableStyle from './custom.style';
import Data from './data';
import { tableinfos } from './configs';
import * as TableViews from './tableViews/';
import market from '../../services/Market';

export default class Market extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: false,
    }
    
  }

  async componentDidMount(){
    let { dataList } = this.state;

    if(!dataList){
      dataList = {};

      let result = await this.getData("24h");
      if(!result)
        dataList["24h"] = result;

      result = await this.getData("4h");
      if(!result)
        dataList["4h"] = result;

      result = await this.getData("1h");
      if(!result)
        dataList["1h"] = result;

      if(dataList["24h"] || dataList["4h"] || dataList["1h"])
        this.setState({dataList});
    }
  }

  async getData(time="24h"){
    //market settings 
    let result = await market.getMarkets();console.log(result);
    if(!result.error){
      let markets = {};
      for(let s of result){
        const { DisplayName, State, SymbolCode } = s;
        markets[SymbolCode] = { DisplayName, State };
      }
  
      //market datas
      result = await market.getSymbolRates(time);
      let rates = [], key = 0;
      for(let s of result){
        const setting = markets[s.SymbolCode];
        if(setting){
          if(setting.State !== "online"){
            break;
          }
  
          s.key = key;
          s.DisplayName = setting.DisplayName;
          key ++;
        }
  
        rates.push(s);
      }
  
      //console.log(markets, rates);
      return rates;
    }
    else{
      return false;
    }
  }

  renderTable(tableInfo) {
    const { dataList } = this.state;

    if(dataList && dataList[tableInfo.value]){
      const data = new Data(10, dataList[tableInfo.value]);

      let Component;
      switch (tableInfo.value) {
        case '1h':
          Component = TableViews.oneHour;
          break;
        case '4h':
          Component = TableViews.fourHours;
          break;
        default:
          Component = TableViews.day;
      }
      return <Component tableInfo={tableInfo} dataList={data} />;
    }
    else{
      return <p>Data not found matchs this criti</p>;
    }
  }

  render() {
    const { rowStyle, colStyle, gutter } = basicStyle;

    return (
      <LayoutWrapper>
        <PageHeader>{<IntlMessages id="Market.PageHeader" />}</PageHeader>
        {/* <Row style={rowStyle} gutter={gutter} justify="start">
          <Col span={24} style={colStyle}>
            <Box
              title={<IntlMessages id="uiElements.cards.gridCard" />}
              subtitle={<IntlMessages id="uiElements.cards.gridCardSubTitle" />}
            >
              <Row>
                <ContentHolder style={{ overflow: 'hidden' }}>
                  <Col md={8} sm={8} xs={24} style={{ padding: '0 8px' }}>
                    <Card
                      title={<IntlMessages id="uiElements.cards.cardTitle" />}
                    >
                      {<IntlMessages id="uiElements.cards.cardContent" />}
                    </Card>
                  </Col>
                  <Col md={8} sm={8} xs={24} style={{ padding: '0 8px' }}>
                    <Card
                      title={<IntlMessages id="uiElements.cards.cardTitle" />}
                    >
                      {<IntlMessages id="uiElements.cards.cardContent" />}
                    </Card>
                  </Col>
                  <Col md={8} sm={8} xs={24} style={{ padding: '0 8px' }}>
                    <Card
                      title={<IntlMessages id="uiElements.cards.cardTitle" />}
                    >
                      {<IntlMessages id="uiElements.cards.cardContent" />}
                    </Card>
                  </Col>
                </ContentHolder>
              </Row>
            </Box>
          </Col>
        </Row> */}
        <TableStyle className="isoLayoutContent">
          <Tabs className="isoTableDisplayTab">
            {tableinfos.map(tableInfo => (
              <TabPane tab={tableInfo.title} key={tableInfo.value}>
                {this.renderTable(tableInfo)}
              </TabPane>
            ))}
          </Tabs>
        </TableStyle>
      </LayoutWrapper>
    );
  }
}
export { TableViews, tableinfos, Data };
