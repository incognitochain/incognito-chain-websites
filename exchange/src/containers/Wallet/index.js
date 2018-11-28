import React, { Component } from 'react';
import LayoutWrapper from '@/components/utility/layoutWrapper.js';
import TableStyle from './customStyle';
import Data from './data';
//import { tableinfo } from './configs';
import SortView from './tableViews/sortView';
import PageHeader from '@/components/utility/pageHeader';
import IntlMessages from '@/components/utility/intlMessages';
import wallet from '@/services/Wallet';
import auth from '@/components/auth';

export default class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      dataList: false,
      paymentAddress: '',
      listBalances: false,
    }
    
  }

  async componentDidMount(){
    const token = auth.isLogged();
    let paymentAddress = "", listBalances = [];

    if(token){
      await this.getBalances();
    }
    
    this.setState({auth: token});
  }

  async getBalances(){
    //market settings 
    let result = await wallet.getBalances();console.log(result);
    if(!result.error){
      this.setState({paymentAddress: result.PaymentAddress, listBalances: result.ListBalances});
    }
    else{
      //return false;
    }
  }

  renderTable(tableInfo) {
    const { paymentAddress, listBalances } = this.state;console.log(listBalances, paymentAddress);

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
    const { paymentAddress, listBalances } = this.state;

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
