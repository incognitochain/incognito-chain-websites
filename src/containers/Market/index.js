import React, { Component } from 'react';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import LayoutWrapper from '../../components/utility/layoutWrapper.js';
import PageHeader from '../../components/utility/pageHeader';
import IntlMessages from '../../components/utility/intlMessages';
import basicStyle from '../../settings/basicStyle';
import TableStyle from './custom.style';
import dataTest from './dataTest';
import { tableinfos } from './configs';
import * as TableViews from './tableViews/';

const dataList = new dataTest(3);

export default class Market extends Component {
  renderTable(tableInfo) {
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
    return <Component tableInfo={tableInfo} dataList={dataList} />;
  }

  render() {
    const { rowStyle, colStyle, gutter } = basicStyle;

    return (
      <LayoutWrapper>
        <PageHeader>{<IntlMessages id="Market.pageHeader" />}</PageHeader>
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
export { TableViews, tableinfos, dataTest };
