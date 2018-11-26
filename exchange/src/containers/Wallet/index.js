import React, { Component } from 'react';
import LayoutWrapper from '@/components/utility/layoutWrapper.js';
import TableStyle from './customStyle';
import dataTest from './dataTest';
//import { tableinfo } from './configs';
import SortView from './tableViews/sortView';
import PageHeader from '@/components/utility/pageHeader';
import IntlMessages from '@/components/utility/intlMessages';
const dataList = new dataTest(10);

export default class Wallet extends Component {

  render() {
    return (
      <LayoutWrapper>
      <PageHeader>{<IntlMessages id="Wallet.PageHeader" />}</PageHeader>
        <TableStyle className="isoLayoutContent">
          <SortView dataList={dataList} />
        </TableStyle>
      </LayoutWrapper>
    );
  }
}
export { SortView, dataTest };
