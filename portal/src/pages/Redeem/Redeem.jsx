import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Link from '@/components/Link';
import bgImage from '@/assets/create-a-proposal.svg';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
import queryString from 'query-string';
import dayjs from 'dayjs';

class Redeem extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      summary: {},
      leftToken: 0
    };
  }

  componentDidMount() {
    this.getSummaryData()
    let url = this.props.location.search;
    let params = queryString.parse(url);
    const { type = 'usd' } = params
    if (type == 'eth') {
      this.getETHData()
    } else {
      this.getUSDData()
    }
  }

  getETHData = () => {
    this.setState({ tabIndex: 1, data: [] })
    axios.get(API.RESERVE_REDEEM_ETH_LIST, null).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          this.setState({ data: res.data.Result })
        } else {
          this.setState({ data: [] })
        }
      }
    }).catch((e) => {
      this.setState({ data: [] })
      console.log(e);
      catchError(e);
    });
  }

  getUSDData = () => {
    this.setState({ tabIndex: 0, data: [] })
    axios.get(API.RESERVE_REDEEM_USD_LIST, null).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          this.setState({ data: res.data.Result })
        } else {
          this.setState({ data: [] })
        }
      }
    }).catch((e) => {
      this.setState({ data: [] })
      console.log(e);
      catchError(e);
    });
  }

  getSummaryData = () => {
    axios.get(API.RESERVE_REDEEM_STATS, null).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          this.setState({ summary: res.data.Result })
        } else {
          this.setState({ summary: {} })
        }
      }
    }).catch((e) => {
      this.setState({ summary: {} })
      console.log(e);
      catchError(e);
    });
  }

  render() {
    const {
      auth,
    } = this.props;
    const {
      data,
      tabIndex,
      summary,
      leftToken,
    } = this.state;
    return (
      <div className="home-page">
        <section className="coin-information">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-8">
                <div className="c-card">
                  <div className="hello">
                    {`Hello, ${auth.data.UserName}`}
                  </div>
                  <div className="row stats-container">
                    <div className="col-12 col-lg-3 stats">
                      <div className="value">
                        {summary.UsdFinished ? summary.UsdFinished : 0}
                        {' '}
                        <sup>USD</sup>
                      </div>
                      <div>Are finished</div>
                    </div>
                    <div className="col-12 col-lg-3 stats">
                      <div className="value">
                        {summary.UsdFailed ? summary.UsdFailed : 0}
                        {' '}
                        <sup>USD</sup>
                      </div>
                      <div>Are failed</div>
                    </div>
                    <div className="col-12 col-lg-3 stats">
                      <div className="value">
                        {summary.EthFinished ? summary.EthFinished : 0}
                        {' '}
                        <sup>ETH</sup>
                      </div>
                      <div>Are finished</div>
                    </div>
                    <div className="col-12 col-lg-3 stats">
                      <div className="value">
                        {summary.EthFailed ? summary.EthFailed : 0}
                        {' '}
                        <sup>ETH</sup>
                      </div>
                      <div>Are failed</div>
                    </div>
                  </div>
                  <div className="row stats-container">
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})` }}>
                  <p>Wanna to redeem usd or ether?</p>
                  <Link to="/redeem/create" className="c-btn c-bg-green">
                    {'Create a request '}
                    <FontAwesomeIcon icon={faAngleRight} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="tabs-container">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="c-card">
                  <div className="tabs">
                    <div className={`tab ${tabIndex === 0 ? 'active' : ''}`} onClick={() => this.getUSDData()}>USD</div>
                    <div className={`tab ${tabIndex === 1 ? 'active' : ''}`} onClick={() => this.getETHData()}>ETH</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          data && tabIndex == 1 ?
            (
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="c-card c-card-no-padding">
                      <table className="c-table-portal-home" style={{ width: "100%", tableLayout: "fixed" }}>
                        <colgroup>
                          <col style={{ "width": "7%" }} />
                          <col style={{ "width": "12%" }} />
                          <col style={{ "width": "9%" }} />
                          <col style={{ "width": "12%" }} />
                          <col style={{ "width": "12%" }} />
                          <col style={{ "width": "10%" }} />
                          <col style={{ "width": "18%" }} />
                          <col style={{ "width": "20%" }} />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>TX ID</th>
                            <th>CONST</th>
                            <th>Ether TX ID</th>
                            <th>Address</th>
                            <th>ETH</th>
                            <th>Created At</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            data.map(r => (
                              <tr>
                                <td className="text-truncate">{r.ID}</td>
                                <td className="text-truncate"><a target={'_blank'} href={r.ConstantTxHash ? `${process.env.explorerUrl}/tx/${r.ConstantTxHash}` : ''}>{r.ConstantTxHash}</a></td>
                                <td className="text-truncate">{r.ConstantAmount}</td>
                                <td className="text-truncate"><a target={'_blank'} href={r.EthTxHash ? `${process.env.etherScanUrl}/tx/${r.EthTxHash}` : ''}>{r.EthTxHash}</a></td>
                                <td className="text-truncate"><a target={'_blank'} href={r.ReceiverAddress ? `${process.env.etherScanUrl}/address/${r.ReceiverAddress}` : ''}>{r.ReceiverAddress}</a></td>
                                <td className="text-truncate">{r.EthAmount}</td>
                                <td className="text-truncate">{dayjs(r.CreatedAt).format('MM-DD-YYYY HH:mm:ss')}</td>
                                <td className={`text-truncate c-status ${
                                  r.Status == 0 ? 'processing'
                                    : (r.Status == 1 ? 'processing'
                                      : (r.Status == 2 ? 'failed'
                                        : (r.Status == 10 ? 'processing'
                                          : (r.Status == 11 ? 'finished'
                                            : (r.Status == 12 ? 'failed'
                                              : (r.Status == 20 ? 'failed'
                                                : (r.Status == 21 ? 'failed'
                                                  : (r.Status == 22 ? 'failed'
                                                    : 'processing'
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  }`}>{
                                    r.Status == 0 ? 'Burn coin processing'
                                      : (r.Status == 1 ? 'Burn coin finished'
                                        : (r.Status == 2 ? 'Burn coin failed'
                                          : (r.Status == 10 ? 'Spend ether processing'
                                            : (r.Status == 11 ? 'Spend ether finished'
                                              : (r.Status == 12 ? 'Spend ether failed'
                                                : (r.Status == 20 ? 'Issuse coin processing'
                                                  : (r.Status == 21 ? 'Issue coin finished'
                                                    : (r.Status == 22 ? 'Issue coin failed'
                                                      : r.Status
                                                    )
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                  }
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              data && tabIndex == 0 ? (
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="c-card c-card-no-padding">
                        <table className="c-table-portal-home" style={{ width: "100%", tableLayout: "fixed" }}>
                          <colgroup>
                            <col style={{ "width": "7%" }} />
                            <col style={{ "width": "23%" }} />
                            <col style={{ "width": "10%" }} />
                            <col style={{ "width": "10%" }} />
                            <col style={{ "width": "10%" }} />
                            <col style={{ "width": "20%" }} />
                            <col style={{ "width": "20%" }} />
                          </colgroup>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>TX ID</th>
                              <th>CONST</th>
                              <th>USD</th>
                              <th>Fee</th>
                              <th>Created At</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              data.map(r => (
                                <tr>
                                  <td className="text-truncate">{r.ID}</td>
                                  <td className="text-truncate"><a target={'_blank'} href={r.TxHash ? `${process.env.explorerUrl}/tx/${r.TxHash}` : ''}>{r.TxHash}</a></td>
                                  <td className="text-truncate">{r.Amount}</td>
                                  <td className="text-truncate">{r.Amount}</td>
                                  <td className="text-truncate">{r.Fee}</td>
                                  <td className="text-truncate">{dayjs(r.CreatedAt).format('MM-DD-YYYY HH:mm:ss')}</td>
                                  <td className={`text-truncate c-status ${
                                    r.Status == 'pending' ? 'processing'
                                      : (r.Status == 'pending' ? 'processing'
                                        : (r.Status == 'coin minting' ? 'processing'
                                          : (r.Status == 'coin burning' ? 'processing'
                                            : (r.Status == 'coin burned' ? 'processing'
                                              : (r.Status == 'transfering' ? 'processing'
                                                : (r.Status == 'redeeming' ? 'processing'
                                                  : (r.Status == 'cancelled' ? 'failed'
                                                    : (r.Status == 'done' ? 'finished'
                                                      : (r.Status == 'holding' ? 'processing'
                                                        : (r.Status == 'failed to burn coin' ? 'failed'
                                                          : (r.Status == 'failed to mint coin' ? 'failed'
                                                            : (r.Status == 'failed to transfer coin' ? 'failed'
                                                              : 'processing'
                                                            )
                                                          )
                                                        )
                                                      )
                                                    )
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    }`}>{
                                      r.Status == 'pending' ? 'Pending'
                                        : (r.Status == 'pending' ? 'Purchasing'
                                          : (r.Status == 'coin minting' ? 'Coin Minting'
                                            : (r.Status == 'coin burning' ? 'Coin Burning'
                                              : (r.Status == 'coin burned' ? 'Coin Burned'
                                                : (r.Status == 'transfering' ? 'Transfering'
                                                  : (r.Status == 'redeeming' ? 'Redeeming'
                                                    : (r.Status == 'cancelled' ? 'Cancelled'
                                                      : (r.Status == 'done' ? 'Done'
                                                        : (r.Status == 'holding' ? 'Holding'
                                                          : (r.Status == 'failed to burn coin' ? 'Coin Burning Failed'
                                                            : (r.Status == 'failed to mint coin' ? 'Coin Minting Failed'
                                                              : (r.Status == 'failed to transfer coin' ? 'Transfering Failed'
                                                                : r.Status
                                                              )
                                                            )
                                                          )
                                                        )
                                                      )
                                                    )
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                    }
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            )
        }
      </div>
    );
  }
}

export default Redeem;
