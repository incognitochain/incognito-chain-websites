import React from 'react';
import PropTypes from 'prop-types';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Link from '@/components/Link';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons';
import { Dialog, toaster, TextInput } from 'evergreen-ui';
import NotFound from '@/pages/NotFound';

class Loan extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { match } = this.props;
    const { params } = match;
    const { id } = params;

    if (id) {
      this.loadLoan(id);
    }

    this.state = {
      inited: false,
      data: {},
      error: null,
      id,
      dialogPay: false,
      isLoading: false,
      pay: '',
      valid: true,
    };
  }

  loadLoan = (id) => {
    axios.get(`${API.LOAN_DETAIL}/${id}`).then((res) => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result) {
          let pay = '';
          const { BorrowPaymentInfo } = Result;
          if (BorrowPaymentInfo) {
            pay = (BorrowPaymentInfo.Interest + BorrowPaymentInfo.Principle).constant();
          }
          this.setState({ inited: true, data: Result, pay });
        }
      }
    }).catch((e) => {
      this.setState({ inited: true, data: {}, error: e });
    });
  }

  clickPayLoan = () => {
    this.setState({ dialogPay: true });
  }

  payLoan = () => {
    const { id, pay } = this.state;
    axios.post(`${API.LOAN_DETAIL}/${id}/pay?amount=${parseInt(Number(pay) * 100, 10)}`).then((res) => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result) {
          toaster.success('Pay success!');
          console.log(Result);
          this.setState({ isLoading: false, dialogPay: false });
          this.loadLoan(id);
        }
      }
    }).catch((e) => {
      this.setState({ isLoading: false, dialogPay: false });
      catchError(e);
    });
  }

  onlyNumber = (value, cb) => {
    if (!Number.isNaN(Number(value))) {
      cb();
    }
  }

  render() {
    const {
      inited, error, data, dialogPay, id, isLoading, pay, valid,
    } = this.state;

    if (!inited) {
      return (
        <div />
      );
    }

    if (error) {
      return <NotFound />;
    }

    const { BorrowPaymentInfo, IsOwner } = data;

    return (
      <>
        <Dialog
          isShown={dialogPay}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title={`Pay for loan id: ${id.substr(0, 5)}...`}
          cancelLabel="Cancel"
          confirmLabel="Pay"
          isConfirmLoading={isLoading}
          onCloseComplete={() => this.setState({
            dialogPay: false, isLoading: false, pay: (BorrowPaymentInfo.Interest + BorrowPaymentInfo.Principle).constant(), valid: true,
          })}
          onConfirm={() => {
            if (valid) {
              this.setState({ isLoading: true }); this.payLoan();
            }
          }}
        >
          <div>
            {'Please enter your amount you want to pay, must '}
            &le;
            {' '}
            {(BorrowPaymentInfo.Interest + BorrowPaymentInfo.Principle).constant().numberFormat()}
            {' CST'}
          </div>
          <div>
            <TextInput
              autoComplete="off"
              type="text"
              style={{ display: 'block', margin: '10px 0' }}
              value={pay}
              onChange={(e) => {
                this.onlyNumber(e.target.value, () => {
                  const inputValid = Number(e.target.value) > Number(BorrowPaymentInfo.Interest + BorrowPaymentInfo.Principle).constant();
                  this.setState({ pay: e.target.value, valid: !inputValid });
                });
              }}
            />
          </div>
          <div className="c-error" style={{ display: `${!valid ? 'block' : 'none'}` }}>
            {'Must '}
            &le;
            {' '}
            {(BorrowPaymentInfo.Interest + BorrowPaymentInfo.Principle).constant().numberFormat()}
            {' CST'}
          </div>
        </Dialog>
        <div className="loan-page">
          <section className="loan-information">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-8">
                  <div className="c-card">
                    <div className="title">
                      Loan information
                      <div className="back">
                        <Link to="/loan">
                          <FontAwesomeIcon icon={faAngleLeft} />
                          {' Back to dashboard'}
                        </Link>
                      </div>
                    </div>
                    <div className="loan-information-content">
                      <div className="row">
                        <div className="col-12 col-lg-7 left-line">
                          <div className="row">
                            <div className="col-12 col-lg-6 value-container">
                              <div className="value c-color-green-500">
                                {data.LoanAmount.constant()}
                                {' CST'}
                              </div>
                              <div>Constant Loan</div>
                            </div>
                            <div className="col-12 col-lg-6 value-container">
                              <div className="value">
                                {data.CollateralAmount.coinUnitFormat(data.CollateralType)}
                                {' '}
                                {data.CollateralType}
                              </div>
                              <div>Collateral amount</div>
                            </div>
                            <div className="col-12 col-lg-6 value-container">
                              <div className="value">
                                {(data.InterestRate / 100).numberFormat()}
                                {' %'}
                              </div>
                              <div>Interest rate</div>
                            </div>
                            <div className="col-12 col-lg-6 value-container">
                              <div className="value">
                                {(BorrowPaymentInfo.Interest / 100).numberFormat()}
                                {' CST'}
                              </div>
                              <div>Loan Profit</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-5 upcoming">
                          <div className="row">
                            <div className="col-2 icon">
                              <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="#F55656" />
                            </div>
                            <div className="col-10">
                              <div>Upcoming payment</div>
                              <div className="value c-color-blue-700">
                                {(BorrowPaymentInfo.Interest + BorrowPaymentInfo.Principle).constant().numberFormat()}
                                {' CST'}
                              </div>
                              <div>
                                {IsOwner && BorrowPaymentInfo.Interest + BorrowPaymentInfo.Principle > 0 ? (
                                  <button type="button" className="c-btn c-btn-primary" onClick={() => this.clickPayLoan()}>Pay now</button>
                                ) : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <Link to={`/txs/${data.LoanID}`}>
                            <FontAwesomeIcon icon={faExchangeAlt} />
                            {' Go to transactions page'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="c-card">
                    <div className="title">Summary</div>
                    <div className="loan-summary-content">
                      <table>
                        <tbody>
                          <tr>
                            <td>Status</td>
                            <td className={`c-status ${data.State}`}>{data.State}</td>
                          </tr>
                          <tr>
                            <td>Start date</td>
                            <td>{dayjs(data.StartDate).format('MM-DD-YYYY')}</td>
                          </tr>
                          <tr>
                            <td>End date</td>
                            <td>{dayjs(data.EndDate).format('MM-DD-YYYY')}</td>
                          </tr>
                          <tr>
                            <td>Loan Tx Hash</td>
                            <td className="tx"><a href={`${process.env.explorerUrl}/tx/${data.ConstantLoanRequestTxID}`} target="_blank" rel="noopener noreferrer">{data.ConstantLoanRequestTxID}</a></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
}

export default Loan;
