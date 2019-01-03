import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ui/uielements/button';

import {
  TableStyle,
} from "@/styles/custom.style";
import Moment from 'react-moment';

import Table from '@ui/uielements/table';

const { Column, ColumnGroup } = Table;

import './LoanList.scss';

const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAYMENT: 'payment',
};

class LoanList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    onRowClick: PropTypes.func,
  }

  getStatusColor = (status) => {
    switch (status) {
      case STATUS.APPROVED:
        return '#4ce0a5';
      case STATUS.REJECTED:
        return 'red';
      case STATUS.PAYMENT:
        return 'yellow';
      default:// Pending
        return '#f5a458';
    }
  }

  handleWithdrawClick = (record) => {

  }

  handleOnRow = (record) => {
    return {
      onClick: () => { this.props.onRowClick(record); },
    };
  }

  renderBorrowAmount() {
    return (
      <Column
        title="Borrow Amount"
        dataIndex="LoanAmount"
        key="LoanAmount"
        align="center"
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
        align="center"
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
        align="center"
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
        align="center"
        render={(text) => (
          <span>
            <Moment format="MM-DD-YYYY">{text}</Moment>
          </span>
        )}
      />
    );
  }

  renderEndDate = () => {
    return (
      <Column
        title="End date"
        dataIndex="EndDate"
        key="EndDate"
        align="center"
        render={(text) => (
          <span>
            <Moment format="MM-DD-YYYY">{text}</Moment>
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
        align="center"
        render={(text) => (
          <span style={{ color: this.getStatusColor(text) }}>
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
        align="center"
        render={(text, record) => {
          if (record.State !== STATUS.APPROVED) return <span>Wait until the borrower make their collateral</span>
          return (
            <span>
              <Button onClick={() => this.handleWithdrawClick(record)}>Withdraw</Button>
            </span>
          );
        }}
      />
    );
  }

  render() {
    const { list } = this.props;
    return (
      <TableStyle className="isoLayoutContent">
        <Table
          rowKey={record => record.ID}
          dataSource={list}
          onRow={this.handleOnRow}
        >
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
