import React, { Component } from 'react';

import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import PageHeader from '@ui/utility/pageHeader';
import IntlMessages from '@ui/utility/intlMessages';
import auth from '@ui/auth';
import Loader from '@ui/utility/loader';

import TableStyle from './customStyle';
import Data from './data';
import SortView from './tableViews/sortView';
import wallet from '@/services/Wallet';

export default class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      dataList: false,
      paymentAddress: '',
      listBalances: false,
      loading: true,
    }
    
  }

  async componentDidMount(){
    const token = auth.isLogged();
    let paymentAddress = "", listBalances = [];

    if(token){
      await this.getBalances();
    }
    
    this.setState({auth: token, loading: false});
  }

  async getBalances(){
    let result = await wallet.getBalances();
    if(!result.error){
      let listBalances = result.ListBalances, paymentAddress = result.PaymentAddress;
      for(let i in listBalances){
        listBalances[i].key = i;
      }

      this.setState({paymentAddress, listBalances});
    }
    else{
      //return false;
    }
  }

  renderTable(tableInfo) {
    const { paymentAddress, listBalances } = this.state;

    if(listBalances){
      const data = new Data(10, listBalances);

      return <TableStyle className="isoLayoutContent">
        <SortView dataList={data} paymentAddress={paymentAddress} />
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
      <PageHeader>{<IntlMessages id="Wallet.PageHeader" />}</PageHeader>
      {
        this.renderTable()
      }
      </LayoutWrapper>
    );
  }
}
export { SortView, Data };
