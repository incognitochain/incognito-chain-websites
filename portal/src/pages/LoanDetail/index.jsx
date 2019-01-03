import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import "./style.scss"
import Portal from "@/services/portal";
import { Icon, Row, Col, Modal as Modals } from 'antd';
import moment from "moment"
import Button from '@ui/uielements/button';

class LoanDetail extends React.Component {
  static propTypes = {}

  constructor(props) {
    super(props);
    this.state = {
      loan: null,
      id: null,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    try {
      Portal.getLoan(id).then((loan) => {
        this.setState({
          loan: loan,
          id: id,
        });
      })
    } catch (err) {
      alert(err);
    }
  }

  payNow = () => {
    const { id } = this.state
    try {
      Portal.payLoan(id).then((result) => {
        alert(result);
      })
    } catch (err) {
      alert(err);
    }
  }

  render() {
    const { loan } = this.state;
    return (
      <div className="loan-detail">
        <div className="container">
          <Row>
            <Col span={16}>
              <Row>Loan Detail</Row>
              <Row>
                <Col span={8}>
                  <Row>
                    {loan && (loan.LoanAmount / 100)}
                    <br />
                    Constant loan
                  </Row>
                  <Row>
                    {loan && loan.InterestRate} %
                    <br />
                    Interest rate</Row>
                </Col>
                <Col span={8}>
                  <Row>
                    {loan && loan.CollateralAmount}
                    {loan && loan.CollateralType}
                    <br />
                    Collateral amount
                  </Row>
                  <Row>Monthly payment</Row>
                </Col>
                <Col span={8}>
                  <Row>Upcomming payment</Row>
                  <Row>
                    {loan && (((loan.LoanAmount / 10000) * loan.InterestRate) + loan.LoanAmount) / 100} CST
                  </Row>
                  <Row>
                    <Button onClick={this.payNow}>Pay now</Button>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>Summary</Row>
              <Row>
                <Col>Status</Col>
                <Col>{loan && loan.State.toUpperCase()}</Col>
              </Row>
              <Row>
                <Col>Start date:</Col>
                <Col>{loan && moment(loan.StartDate).format('DD-MM-YYYY')}</Col>
              </Row>
              <Row>
                <Col>End date:</Col>
                <Col>{loan && moment(loan.EndDate).format('DD-MM-YYYY')}</Col>
              </Row>
              <Row>
                <Col>Txhash:</Col>
                <Col>{loan && loan.ConstantLoanRequestTxID}</Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default LoanDetail;
