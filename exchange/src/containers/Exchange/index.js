import React, { Component } from 'react';
import LayoutContentWrapper from 'core-components/utility/layoutWrapper.js';
import TableStyle from './customStyle';
import dataTest from './dataTest';
import { tableinfo } from './configs';
import SortView from './tableViews/sortView';

const dataList = new dataTest(3);

export default class Exchange2 extends Component {

  render() {
    return (
      <LayoutContentWrapper>
        <TableStyle className="isoLayoutContent">
          <SortView tableInfo={tableinfo} dataList={dataList} />
        </TableStyle>
      </LayoutContentWrapper>
    );
  }
}
export { SortView, tableinfo, dataTest };
