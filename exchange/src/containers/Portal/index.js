import React, { Component } from 'react';
import Tabs, { TabPane } from '@ui/uielements/tabs';
import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import ContentHolder from '@ui/utility/contentHolder';
import PageHeader from '@ui/utility/pageHeader';
import IntlMessages from '@ui/utility/intlMessages';
import basicStyle from '@/settings/basicStyle';
import { Row, Col } from 'antd';
import Box from '@ui/utility/box';
import Button from '@ui/uielements/button';

import Data from './data';
import { tableinfos } from './configs';
import * as TableViews from './tableViews/';
import market from '@/services/Market';
import { TableStyle, FixedContainer, ProposalBox, ShareWrapper } from "./custom.style";

import bgGOV from '@/image/portal-bg-gov.png';
import bgDCB from '@/image/portal-bg-dcb.png';
import bgMCB from '@/image/portal-bg-mcb.png';

const boardCars = [
  {
    title: "Portal.Home.Gov.Title",
    subTitle: "Portal.Home.Gov.Description",
    background: bgGOV,
    btnAction: "",
    btnStyle: "",
    btnText: "Common.NowApply"
  },
  {
    title: "Portal.Home.Dcb.Title",
    subTitle: "Portal.Home.Dcb.Description",
    background: bgDCB,
    btnAction: "",
    btnStyle: "",
    btnText: "Common.NowApply"
  },
  {
    title: "Portal.Home.Mcb.Title",
    subTitle: "Portal.Home.Mcb.Description",
    background: bgMCB,
    btnAction: "",
    btnStyle: "",
    btnText: "Common.NowApply"
  }
];

export default class Portal extends Component {
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
      if(result)
        dataList["24h"] = result;

      result = await this.getData("4h");
      if(result)
        dataList["4h"] = result;
        
      result = await this.getData("1h");
      if(result)
        dataList["1h"] = result;
        
      if(dataList["24h"] || dataList["4h"] || dataList["1h"])
        this.setState({dataList});
    }
  }

  async getData(time="24h"){
    //market settings 
    let result = await market.getMarkets();
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
      return <p><IntlMessages id="Market.DataNotFound" /></p>;
    }
  }

  render() {
    const { rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter } = basicStyle;

    return (
      <FixedContainer>
        <LayoutWrapper>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={16} sm={24} xs={24} style={colStyle}>
              <Box
                title={<IntlMessages id="Portal.Home.BigBox.Hello" />}
              >
              </Box>
            </Col>
            <Col md={8} sm={24} xs={24} style={colStyle0}>
              <Box style={boxStyle0}>
                <ProposalBox>
                  <div className="desc"><IntlMessages id="Portal.Home.Proposal.Description" /></div>
                  <Button type="default" className="btn" >
                    <IntlMessages id="Portal.Home.Proposal.Create" />
                  </Button>
                </ProposalBox>
              </Box>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter}>
            {
              boardCars.map(box => {
                return (
                  <Col md={8} sm={24} xs={24} style={colStyle}>
                  <Box style={boxStyleBg(box.background)} className="cardBoard"
                    title={<IntlMessages id={box.title} />}
                    subtitle={<IntlMessages id={box.subTitle} />} 
                    >
                    <Button type="primary" className="btn" >
                      <IntlMessages id={box.btnText} />
                    </Button>
                  </Box>
                </Col>);
              })
            }
          </Row>
          <TableStyle className="isoLayoutContent">
            <Tabs className="isoTableDisplayTab">
              {tableinfos.map(tableInfo => (
                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                  {this.renderTable(tableInfo)}
                </TabPane>
              ))}
            </Tabs>
          </TableStyle>
          <ShareWrapper>
            <h3><IntlMessages id="Common.Share" /></h3>
            <Button type="default" className="" >
              <IntlMessages id="Common.Facebook" />
            </Button>
            <Button type="default" className="" >
              <IntlMessages id="Common.Twitter" />
            </Button>
            <Button type="default" className="" >
              <IntlMessages id="Common.CopyLink" />
            </Button>

          </ShareWrapper>
        </LayoutWrapper>
      </FixedContainer>
      
    );
  }
}
export { TableViews, tableinfos, Data };
