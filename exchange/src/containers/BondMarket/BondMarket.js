import React, {Component} from "react";

import LayoutWrapper from "@ui/utility/layoutWrapper.js";
import PageHeader from "@ui/utility/pageHeader";
import IntlMessages from "@ui/utility/intlMessages";
import auth from "@ui/auth";
import Loader from "@ui/utility/loader";
import BreadcrumbBar from "@/containers/Breadcrumb/Breadcrumb";

import TableStyle from "./customStyle";
import DataBondMarket from "./dataBondMarket";
import SortView from "./tableViews/sortView";
import bondmarket from "@/services/BondMarket";
import styled from "styled-components";

let testData = [
  {
    BondName: 'TokenName1',
    BondSymbol: 'TokenName1',
    BondID: '0000000000000000000000000000000000000000000000000000000000000001',
    BondImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PAVfiWe8geIAAAAjElEQVR4nOzasQ2AMAxFwWQSVmVsOmgtBQxEpkC6134dA5g0SZL0Vcs+tOYDRVEURVEURVWqraV1iqIoiqIoiqpXJ2Ps5nMURVEURVEUNa/+crmlKIqiKIqiKIqiKIqiKIqqUrE+quc3WIqiKIqiKIp6qeJ4+Wc/fZtKURRFURRFUXNKkiQVdwQAAP//Zdx8MyWkQr4AAAAASUVORK5CYII=',
    BuyBackDate: '2019-10-10',
    TotalIssue: 1000000,
    Available: (new Date("Wed, 27 July 2020 13:30:00")).getTime(),
    Rate: 10,
    BuyBackPrice: '11',
  }
]

export default class BondMarket extends Component {
  state = {
    auth: false,
    dataList: false,
    list: false,
    loading: true
  };

  async componentDidMount() {
    const token = auth.isLogged();

    if (token) {
      await this.getData();
    }

    this.setState({auth: token, loading: false});
  }

  async getData() {
    this.setState({loading: true});
    let result = await bondmarket.getBondMarketList();
    //TODO remove when live
    result = testData;
    if (!result.error) {
      let listData = result;
      for (let i in listData) {
        listData[i].key = i;
      }

      this.setState({list: listData});
    } else {
      console.log("Error", result.error);
    }
    this.setState({loading: false});
  }

  handleOnBuySuccess = () => {
    this.getData();
  };

  renderTable(tableInfo) {
    const {list} = this.state;

    if (list) {
      const data = new DataBondMarket(10, list);

      return (
        <TableStyle className="isoLayoutContent">
          <SortView dataList={data} onBuySuccess={this.handleOnBuySuccess}/>
        </TableStyle>
      );
    } else {
      return (
        <p style={{textAlign: "center",}}>
          <IntlMessages id="BondMarket.DataNotFound"/>
        </p>
      );
    }
  }

  renderBreadcrumb() {
    const urls = [
      {
        name: "Bond Market",
        url: "/bond-market"
      },
      {
        name: "History",
        url: "/bond-market/history"
      }
    ];

    return <BreadcrumbBar urls={urls}/>;
  }

  render() {
    const {loading} = this.state;

    if (loading) return <Loader/>;

    return (
      <>
        {this.renderBreadcrumb()}
        <Wrapper>
          <PageHeader>{<IntlMessages id="BondMarket.PageHeader"/>}</PageHeader>
          <TableWrapper>
            {this.renderTable()}
          </TableWrapper>
        </Wrapper>
      </>
    );
  }
}

const Wrapper = styled.div`
  padding: 2rem;
`;

const TableWrapper = styled.div`
  background-color: white;
  padding: 2rem;
`;

export {SortView, DataBondMarket};
