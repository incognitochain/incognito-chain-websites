import React from 'react';
// import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import Link from '@/components/Link';
import bgImage from '@/assets/create-a-proposal.svg';
import bgApplyGOV from '@/assets/apply-gov.svg';
import bgApplyDCB from '@/assets/apply-dcb.svg';
import bgApplyMCB from '@/assets/apply-mcb.svg';
import { axios } from '@/services/api';
import { API } from '@/constants';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      borrows: [],
    }

    this.loadBorrows();
  }

  loadBorrows = () => {
    axios.get(API.LOAN_LIST).then(res => {
      const { data } = res;
      const { Result } = data;
      if (Result && Result.length) {
        this.setState({ borrows: Result, loading: false });
        return;
      }
      this.setState({ loading: false });
    }).catch(e => {
      console.log(e);
      this.setState({ loading: false });
    });
  }

  render() {
    const { loading, borrows } = this.state;
    return (
      <div className="home-page">
        <section className="coin-information">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-8">
                <div className="c-card">

                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})` }}>
                  <p>Wanna join the Constant network - the new era of Internet?</p>
                  <Link to="/create" className="c-btn c-bg-green">Create a proposal <FontAwesomeIcon icon={faAngleRight} /></Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="apply">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-4">
                <div className="c-card" style={{ backgroundImage: `url(${bgApplyGOV})` }}>
                  <div className="title c-color-blue-1000">Apply GOV board</div>
                  <div className="description">Control the new internet</div>
                  <Link className="c-btn" to="/">Apply now <FontAwesomeIcon icon={faArrowRight} /></Link>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="c-card" style={{ backgroundImage: `url(${bgApplyDCB})` }}>
                  <div className="title c-color-blue-1000">Apply DCB Board</div>
                  <div className="description">A decentralized bank</div>
                  <Link className="c-btn" to="/">Apply now <FontAwesomeIcon icon={faArrowRight} /></Link>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="c-card" style={{ backgroundImage: `url(${bgApplyMCB})` }}>
                  <div className="title c-color-blue-1000">Apply MCB Board</div>
                  <div className="description">Lorem ipsum ador</div>
                  <Link className="c-btn" to="/">Apply now <FontAwesomeIcon icon={faArrowRight} /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="borrows-container">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="c-card c-card-no-padding">
                  <table className="c-table">
                    <thead>
                      <tr>
                        <th>Borrow amount</th>
                        <th>Collateral</th>
                        <th>Interest rate</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Status</th>
                        <th>Your decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrows.map(borrow => (
                        <tr key={borrow.ID}>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
