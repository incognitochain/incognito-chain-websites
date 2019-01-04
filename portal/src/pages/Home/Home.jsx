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
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
import dayjs from 'dayjs';
import { Dialog, toaster } from 'evergreen-ui';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      borrows: [],
      borrowsForLender: [],
      active: 1,
      dialogApprove: false,
      dialogDeny: false,
      dialogWithdraw: false,
      currentBorrow: {},
    }

    this.loadBorrows();
    this.loadBorrows(true);
  }

  loadBorrows = (forLender = false) => {
    let api = API.LOAN_LIST;
    if (forLender) {
      api = API.LOAN_LIST_FOR_LENDER;
    }
    axios.get(api).then(res => {
      const { data } = res;
      const { Result } = data;
      if (Result && Result.length) {
        let keyName = 'borrows';
        if (forLender) {
          keyName = 'borrowsForLender';
        }
        this.setState({ [keyName]: Result });
        return;
      }
    }).catch(e => {
      catchError(e);
      console.log(e);
    });
  }

  clickAction = (borrow, approve = true) => {
    if (approve) {
      this.setState({ dialogApprove: true, currentBorrow: borrow });
    } else {
      this.setState({ dialogDeny: true, currentBorrow: borrow });
    }
  }

  action = (approve = true) => {
    const { currentBorrow } = this.state;
    const action = approve ? 'a' : 'r';
    axios.post(`${API.LOAN_ACTION}/${currentBorrow.ID}/process?action=${action}`).then(res => {
      this.loadBorrows();
      this.loadBorrows(true);
      this.setState({ dialogApprove: false, dialogDeny: false, isLoading: false });
    }).catch(e => {
      this.setState({ dialogApprove: false, dialogDeny: false, isLoading: false });
      catchError(e);
      toaster.warning('Have a error', e);
    });
  }

  clickWithdraw = (borrow) => {
    this.setState({ dialogWithdraw: true, currentBorrow: borrow });
  }

  withdraw = () => {

  }

  render() {
    const { isLoading, borrows, borrowsForLender, active, dialogApprove, dialogDeny, dialogWithdraw, currentBorrow } = this.state;
    return (
      <div className="home-page">
        <Dialog
          isShown={dialogApprove}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title={`Approve borrow id: ${currentBorrow.ID}`}
          cancelLabel="Cancel"
          confirmLabel="Confirm"
          isConfirmLoading={isLoading}
          onCloseComplete={() => this.setState({ dialogApprove: false, isLoading: false })}
          onConfirm={() => { this.setState({ isLoading: true }); this.action(); }}
        >
          Confirm your approve.
        </Dialog>
        <Dialog
          isShown={dialogDeny}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title={`Deny borrow id: ${currentBorrow.ID}`}
          intent="danger"
          cancelLabel="Cancel"
          confirmLabel="Confirm"
          isConfirmLoading={isLoading}
          onCloseComplete={() => this.setState({ dialogDeny: false, isLoading: false })}
          onConfirm={() => { this.setState({ isLoading: true }); this.action(false); }}
        >
          Confirm your deny.
        </Dialog>
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
        <div className="tabs-container">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="c-card">
                  <div className="tabs">
                    <div className={`tab ${active === 0 ? 'active' : ''}`} onClick={() => this.setState({ active: 0 })}>Your borrows</div>
                    {borrowsForLender.length ? <div className={`tab ${active === 1 ? 'active' : ''}`} onClick={() => this.setState({ active: 1 })}>Lender role</div> : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="borrows-container" style={{ display: `${active === 0 ? 'block' : 'none'}` }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="c-card c-card-no-padding">
                  <table className="c-table-portal-home">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Collateral</th>
                        <th>Interest rate</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Status</th>
                        <th width="364">Your decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrows.map(borrow => (
                        <tr key={borrow.ID}>
                          <td><Link to={`/loan/${borrow.ID}`}>{borrow.ID}</Link></td>
                          <td>{borrow.LoanAmount} CST</td>
                          <td>{borrow.CollateralAmount} {borrow.CollateralType}</td>
                          <td>{borrow.InterestRate}%</td>
                          <td>{dayjs(borrow.CreatedAt).format('MM-DD-YYYY')}</td>
                          <td>{dayjs(borrow.EndDate).format('MM-DD-YYYY')}</td>
                          <td className={`state state-${borrow.State}`}>{borrow.State}</td>
                          <td>
                            {borrow.State === 'pending' ? 'Wait until the borrower make their collateral' : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="borrows-container" style={{ display: `${active === 1 ? 'block' : 'none'}` }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="c-card c-card-no-padding">
                  <table className="c-table-portal-home">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Collateral</th>
                        <th>Interest rate</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Status</th>
                        <th width="364">Your decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowsForLender.map(borrow => (
                        <tr key={borrow.ID}>
                          <td><Link to={`/loan/${borrow.ID}`}>{borrow.ID}</Link></td>
                          <td>{borrow.LoanAmount} CST</td>
                          <td>{borrow.CollateralAmount} {borrow.CollateralType}</td>
                          <td>{borrow.InterestRate}%</td>
                          <td>{dayjs(borrow.CreatedAt).format('MM-DD-YYYY')}</td>
                          <td>{dayjs(borrow.EndDate).format('MM-DD-YYYY')}</td>
                          <td className={`state state-${borrow.State}`}>{borrow.State}</td>
                          {
                            borrow.State === 'pending'
                              ? (
                                <td>
                                  <button className="c-a-btn c-a-btn-approve" onClick={() => this.clickAction(borrow)}>Approve</button>
                                  <button className="c-a-btn c-a-btn-deny" onClick={() => this.clickAction(borrow, false)}>Deny</button>
                                </td>
                              ) : ''
                          }
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
