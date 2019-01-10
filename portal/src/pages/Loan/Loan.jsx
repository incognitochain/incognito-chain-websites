import React from 'react';
import PropTypes from 'prop-types';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Link from '@/components/Link';
import Layout from '@/components/App/Layout';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons';

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
    };
  }

  loadLoan = (id) => {
    axios.get(`${API.LOAN_DETAIL}/${id}`).then((res) => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result) {
          this.setState({ inited: true, data: Result });
        }
      }
    }).catch((e) => {
      catchError(e);
      this.setState({ inited: true, data: {}, error: e });
    });
  }

  payLoan = (id) => {
    axios.post(`${API.LOAN_DETAIL}/${id}/pay`).then((res) => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result) {
          console.log(Result);
        }
      }
    }).catch((e) => {
      catchError(e);
    });
  }

  render() {
    const { inited, error, data } = this.state;
    if (!inited || error) return <div />;

    const { BorrowPaymentInfo } = data;

    return (
      <Layout>
        <div className="loan-page">
          <section className="loan-information">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-8">
                  <div className="c-card">
                    <div className="title">
                      Loan information
                      <div className="back">
                        <Link to="/">
                          <FontAwesomeIcon icon={faAngleLeft} />
                          {' Back to home'}
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
                                {BorrowPaymentInfo.Interest}
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
                                {data.State !== 'pending' ? <button type="button" className="c-btn c-btn-primary" onClick={() => this.payLoan(data.ID)}>Pay now</button> : ''}
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
                            <td className="tx"><a href={`http://explorer.constant.money/tx/${data.ConstantLoanRequestTxID}`} target="_blank" rel="noopener noreferrer">{data.ConstantLoanRequestTxID}</a></td>
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
      </Layout>
    );
  }
}

export default Loan;
