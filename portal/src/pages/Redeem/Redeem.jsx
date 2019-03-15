import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Link from '@/components/Link';
import bgImage from '@/assets/create-a-proposal.svg';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';

class Redeem extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
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

  render() {
    const {
      auth,
    } = this.props;
    const {
      data,
    } = this.state;
    return (
      <div className="home-page">
        <section className="coin-information">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-8">
                <div className="c-card">
                  <div className="hello">
                    {`Hello, ${auth.data.Email}`}
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
        {
          data ?
            (
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="c-card c-card-no-padding">
                      <table className="c-table-portal-home" style={{ width: "100%", tableLayout: "fixed" }}>
                        <colgroup>
                          <col style={{ "width": "5%" }} />
                          <col style={{ "width": "30%" }} />
                          <col style={{ "width": "25%" }} />
                          <col style={{ "width": "10%" }} />
                          <col style={{ "width": "20%" }} />
                          <col style={{ "width": "10%" }} />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Transaction ID</th>
                            <th>Address</th>
                            <th>Amount</th>
                            <th>Date Created</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            data.map(r => (
                              <tr>
                                <td className="text-truncate">{r.ID}</td>
                                <td className="text-truncate">{r.EthTxHash}</td>
                                <td className="text-truncate">{r.ReceiverAddress}</td>
                                <td className="text-truncate">{r.ConstantAmount}</td>
                                <td className="text-truncate">{r.CreatedAt ? r.CreatedAt.replace(/T/, ' ').replace(/Z/, '') : ''}</td>
                                <td className="text-truncate">{r.Status}</td>
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
        }
      </div>
    );
  }
}

export default Redeem;
