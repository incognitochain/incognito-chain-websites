import React, { Component } from 'react';

import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import PageHeader from '@ui/utility/pageHeader';
import IntlMessages from '@ui/utility/intlMessages';
import auth from '@ui/auth';
import Loader from '@ui/utility/loader';

import TableStyle from './customStyle';
import DataBondMarket from './dataBondMarket';
import SortView from './tableViews/sortView';
import bondmarket from '@/services/BondMarket';

const list = [
  {
    BondName: 'ABC',
    BondSymbol: 'CST',
    BondID: 1,
    ExpiredDate: "2018-12-26T04:06:35",
    TotalIssue: 23,
    Available: 5,
    Rate: 4.5,
  },
  {
    BondName: 'DFC',
    BondSymbol: 'CST',
    BondID: 2,
    ExpiredDate: "2018-12-26T04:06:35",
    TotalIssue: 23,
    Available: 5,
    Rate: 4.5,
  }
];
export default class BondMarket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      dataList: false,
      list: false,
      loading: true,
    }
    
  }

  async componentDidMount(){
    const token = auth.isLogged();

    if(token){
      await this.getData();
    }
    
    this.setState({auth: token, loading: false});
  }

  async getData(){
    let result = await bondmarket.getBondMarketList();
    if(!result.error){
      let listData = result; 
      for(let i in listData){
        listData[i].key = i;
      }

      this.setState({list:listData});
    }
    else{
      //return false;
    }
  }

  renderTable(tableInfo) {
    const { list } = this.state;

    if(list){
      const data = new DataBondMarket(10, list);

      return <TableStyle className="isoLayoutContent">
        <SortView dataList={data}/>
      </TableStyle>;
    }
    else{
      return <p><IntlMessages id="Market.DataNotFound" /></p>;
    }
  }
  
  
  render() {
    const { paymentAddress, listBalances, loading } = this.state;

    if(loading)
      return <Loader />;

    return (
      <LayoutWrapper>
      <PageHeader>{<IntlMessages id="BondMarket.PageHeader" />}</PageHeader>
      {
        this.renderTable()
      }
      </LayoutWrapper>
    );
  }
  
}
export { SortView, DataBondMarket };
