import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  TableStyle,
} from "@/styles/custom.style";

import Table from '@ui/uielements/table';

const { Column, ColumnGroup } = Table;

import 'antd/dist/antd.css';

const columns = [{
  title: 'Borrow Amount',
  dataIndex: 'LoanAmount',
  key: 'LoanAmount',
  render: text => <div href="javascript:;">{text}</div>,
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
  renderBorrowAmount() {
    return (
      <Column
        title="Borrow Amount"
        dataIndex="LoanAmount"
        key="LoanAmount"
        render={value => (
          <span>
            {value} CST
          </span>
        )}
      />
    );
  }
  renderCollateral() {
    return (
      <Column
        title="Collateral"
        dataIndex="CollateralType"
        key="CollateralType"
        render={(text, record) => (
          <span>
            {text} {record.CollateralAmount}
          </span>
        )}
      />
    );
  }
  renderInterestRate() {
    return (
      <Column
        title="Interest rate"
        dataIndex="InterestRate"
        key="InterestRate"
        render={(text) => (
          <span>
            {text}%
          </span>
        )}
      />
    );
  }
  renderStartDate() {
    return (
      <Column
        title="Start date"
        dataIndex="StartDate"
        key="StartDate"
        render={(text) => (
          <span>
            {text}
          </span>
        )}
      />
    );
  }

  renderEndDate() {
    return (
      <Column
        title="End date"
        dataIndex="EndDate"
        key="EndDate"
        render={(text) => (
          <span>
            {text}
          </span>
        )}
      />
    );
  }
  renderStatus() {
    return (
      <Column
        title="Status"
        dataIndex="State"
        key="State"
        render={(text) => (
          <span>
            {text}
          </span>
        )}
      />
    );
  }
  renderDecision() {
    return (
      <Column
        title="Your Decision"
        render={(text) => (
          <span>
            Withdraw
          </span>
        )}
      />
    );
  }

  render(){
    const { list } = this.props;
    return (
      <TableStyle className="isoLayoutContent">
        <Table rowKey={record => record.ID} dataSource={list} >
          {this.renderBorrowAmount()}
          {this.renderCollateral()}
          {this.renderInterestRate()}
          {this.renderStartDate()}
          {this.renderEndDate()}
          {this.renderStatus()}
          {this.renderDecision()}
        </Table>
      </TableStyle>
    );
  }
}
export default LoanList;
