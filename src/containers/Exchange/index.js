import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper.js';
import TableDemoStyle from './demo.style';
import dataTest from './dataTest';
import { tableinfo } from './configs';
import SortView from './tableViews/sortView';

const dataList = new dataTest(3);

export default class Exchange extends Component {

  render() {
    return (
      <LayoutContentWrapper>
        <TableDemoStyle className="isoLayoutContent">
          <SortView tableInfo={tableinfo} dataList={dataList} />
        </TableDemoStyle>
      </LayoutContentWrapper>
    );
  }
}
export { SortView, tableinfo, dataTest };
