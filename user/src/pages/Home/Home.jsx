import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import Link from '@/components/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import bgApplyGOV from '@/assets/apply-gov.svg';
import bgApplyDCB from '@/assets/apply-dcb.svg';
import bgApplyMCB from '@/assets/apply-mcb.svg';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
import cn from '@sindresorhus/class-names';
import { Dialog, toaster, TextInput } from 'evergreen-ui';

const CheckInit = ({ children, inited }) => {
  if (!inited) {
    return <div />;
  }
  return children;
};

const Applied = ({ applied, children }) => {
  if (applied) return 'Applied';
  return children;
};

class Home extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      candidate: {},
      inited: false,
      address: '',
    };

    this.loadUserCandidate();
  }

  apply = (type, ev, denyCall) => {
    ev.preventDefault();
    const { address } = this.state;

    if (!denyCall) {
      axios.post(API.VOTING_APPLY, {
        PaymentAddress: address,
        BoardType: type,
      }).then((res) => {
        const { data } = res;
        if (data) {
          const { Result } = data;
          if (Result) {
            this.loadUserCandidate();
            toaster.success('Apply success!');
          }
        }
      }).catch((e) => {
        catchError(e);
      });
    }
  }

  loadUserCandidate = () => {
    axios.get(API.VOTING_DATA).then((res) => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result) {
          this.setState({
            candidate: Result,
            inited: true,
          });
        }
      }
    }).catch((e) => {
      catchError(e);
    });
  }

  render() {
    const { candidate, inited } = this.state;

    return (
      <div className="page user-page">
        <div className="apply">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-4">
                <div className="c-card" style={{ backgroundImage: `url(${bgApplyGOV})` }}>
                  <div className="title c-color-blue-1000">Apply GOV board</div>
                  <div className="description">Control the new internet</div>
                  <CheckInit inited={inited}>
                    <Link className={cn('c-btn', { active: candidate.GOVAppliedAt })} to="/" onClick={e => this.apply(2, e, candidate.GOVAppliedAt)}>
                      <Applied applied={candidate.GOVAppliedAt}>
                        <>
                          {'Apply now '}
                          <FontAwesomeIcon icon={faArrowRight} />
                        </>
                      </Applied>
                    </Link>
                  </CheckInit>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="c-card" style={{ backgroundImage: `url(${bgApplyDCB})` }}>
                  <div className="title c-color-blue-1000">Apply DCB Board</div>
                  <div className="description">A decentralized bank</div>
                  <CheckInit inited={inited}>
                    <Link className={cn('c-btn', { active: candidate.DCBAppliedAt })} to="/" onClick={e => this.apply(1, e, candidate.DCBAppliedAt)}>
                      <Applied applied={candidate.DCBAppliedAt}>
                        <>
                          {'Apply now '}
                          <FontAwesomeIcon icon={faArrowRight} />
                        </>
                      </Applied>
                    </Link>
                  </CheckInit>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="c-card" style={{ backgroundImage: `url(${bgApplyMCB})` }}>
                  <div className="title c-color-blue-1000">Apply MCB Board</div>
                  <div className="description">Lorem ipsum ador</div>
                  <CheckInit inited={inited}>
                    <Link className={cn('c-btn', { active: candidate.CMBAppliedAt })} to="/" onClick={e => this.apply(3, e, candidate.CMBAppliedAt)}>
                      <Applied applied={candidate.CMBAppliedAt}>
                        <>
                          {'Apply now '}
                          <FontAwesomeIcon icon={faArrowRight} />
                        </>
                      </Applied>
                    </Link>
                  </CheckInit>
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
