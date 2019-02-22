import React, { Component } from "react";

import Tabs, { TabPane } from "@ui/uielements/tabs";
import LayoutWrapper from "@ui/utility/layoutWrapper.js";
import PageHeader from "@ui/utility/pageHeader";
import IntlMessages from "@ui/utility/intlMessages";
import Loader from "@ui/utility/loader";

import TableStyle from "./custom.style";
import Data from "./data";
import SortView, { tableinfos } from "./tableViews/sortView";
import market from "@/services/Market";

export default class Market extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: false,
      loading: true
    };
  }

  async componentDidMount() {
    let { dataList } = this.state;

    if (!dataList) {
      dataList = {};

      let result = await this.getData("24h");
      if (result) dataList["24h"] = result;

      result = await this.getData("4h");
      if (result) dataList["4h"] = result;

      result = await this.getData("1h");
      if (result) dataList["1h"] = result;

      if (dataList["24h"] || dataList["4h"] || dataList["1h"])
        this.setState({ dataList });
    }

    this.setState({ loading: false });
  }

  async getData(time = "24h") {
    //market settings
    let result = await market.getMarkets();
    if (!result.error) {
      let markets = {};
      for (let s of result) {
        const { DisplayName, Status, SymbolCode } = s;
        markets[SymbolCode] = { DisplayName, Status };
      }

      //market datas
      result = await market.getSymbolRates(time);
      let rates = [],
        key = 0;
      for (let s of result) {
        const setting = markets[s.SymbolCode];
        if (setting) {
          if (setting.Status !== "online") {
            break;
          }

          s.key = key;
          s.DisplayName = setting.DisplayName;
          key++;
        }

        rates.push(s);
      }
      return rates;
    } else {
      return false;
    }
  }

  renderTable(tableInfo) {
    const { dataList } = this.state;
    if (dataList && dataList[tableInfo.value]) {
      const data = new Data(10, dataList[tableInfo.value]);
      //console.log(dataList, data);
      let Component;
      switch (tableInfo.value) {
        case "1h":
          Component = SortView;
          break;
        case "4h":
          Component = SortView;
          break;
        default:
          Component = SortView;
      }
      return <Component tableInfo={tableInfo} dataList={data} />;
    } else {
      return (
        <p>
          <IntlMessages id="Market.DataNotFound" />
        </p>
      );
    }
  }

  render() {
    const { loading } = this.state;

    if (loading) return <Loader />;

    return (
      <LayoutWrapper>
        <PageHeader>{<IntlMessages id="Exchange.PageHeader" />}</PageHeader>
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
export { SortView, Data };
