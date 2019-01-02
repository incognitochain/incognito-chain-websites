import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  TableStyle,
} from "@/styles/custom.style";
import Table from '@ui/uielements/table';
import 'antd/dist/antd.css';


const columns = [{
  title: 'Borrow Amount',
  dataIndex: 'LoanAmount',
  key: 'LoanAmount',
  render: text => <a href="javascript:;">{text}</a>,
}, {
  title: 'Collateral',
  dataIndex: 'CollateralAmount',
  key: 'CollateralAmount',
}, {
  title: 'Interest rate',
  dataIndex: 'InterestRate',
  key: 'InterestRate',
}, {
  title: 'Start date',
  key: 'StartDate',
  dataIndex: 'StartDate',
}, {
  title: 'End date',
  dataIndex: 'EndDate',
  key: 'EndDate',
},
{
  title: 'Status',
  key: 'State',
  dataIndex: 'State',

},
];

class LoanList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired
  }
  render(){
    const { list } = this.props;
    return (
      <TableStyle className="isoLayoutContent">
        <Table rowKey={record => record.ID} columns={columns} dataSource={list} />
      </TableStyle>
    );
  }
}
export default LoanList;
