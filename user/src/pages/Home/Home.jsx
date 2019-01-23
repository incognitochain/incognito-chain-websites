import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '@/components/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight, faEdit } from '@fortawesome/pro-regular-svg-icons';
import bgApplyGOV from '@/assets/apply-gov.svg';
import bgApplyDCB from '@/assets/apply-dcb.svg';
import bgApplyMCB from '@/assets/apply-mcb.svg';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
import cn from '@sindresorhus/class-names';
import bgImage from '@/assets/create-a-proposal.svg';
import {
  Dialog, Textarea, toaster,
} from 'evergreen-ui';
import { checkAuth } from '@/reducers/auth/action';

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
    auth: PropTypes.object.isRequired,
    authCheckAuth: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { auth } = props;

    this.state = {
      candidate: {},
      inited: false,
      address: '',
      dialogBio: false,
      dialogDCBProposal: false,
      dialogGOVProposal: false,
      isLoading: false,
      bio: auth.data.Bio,
      oldBio: auth.data.Bio,
    };

    this.loadUserCandidate();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.data.Bio !== prevState.oldBio) {
      return { bio: nextProps.auth.data.Bio, oldBio: nextProps.auth.data.Bio };
    }
    return null;
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
        const { Result, Error: resError } = data;
        if (!resError) {
          this.setState({
            candidate: Result || {},
            inited: true,
          });
        }
      }
    }).catch((e) => {
      catchError(e);
    });
  }

  submitBio = () => {
    const { bio } = this.state;
    const { authCheckAuth } = this.props;

    if (!bio) {
      toaster.warning('Bio is required');
      this.setState({ isLoading: false });
      return;
    }

    axios.put(API.USER_UPDATE, {
      Bio: bio,
    }).then((res) => {
      const { data } = res;
      const { Result } = data;
      if (Result) {
        this.setState({ isLoading: false, dialogBio: false });
        toaster.success('Updated your bio');
        authCheckAuth();
      } else {
        toaster.warning('Error update profile');
      }
    }).catch((e) => {
      this.setState({ isLoading: false, dialogBio: false });
      toaster.warning('Error update profile');
      catchError(e);
    });
  }

  render() {
    const {
      candidate, inited, dialogBio, dialogDCBProposal, dialogGOVProposal, isLoading, bio,
    } = this.state;
    const { auth } = this.props;

    return (
      <div className="page user-page home-page">
        <Dialog
          isShown={dialogBio}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title="Edit your bio"
          confirmLabel="Submit"
          isConfirmLoading={isLoading}
          onCloseComplete={() => this.setState({
            dialogBio: false, isLoading: false, bio: auth.data.Bio,
          })}
          onConfirm={() => { this.setState({ isLoading: true }); this.submitBio(); }}
        >
          <div className="withdraw-dialog">
            <div style={{ margin: '0' }}>
              <Textarea
                label="Your bio"
                placeholder="..."
                autoComplete="off"
                width="100%"
                value={bio}
                onChange={(e) => {
                  this.setState({ bio: e.target.value });
                }}
              />
            </div>
          </div>
        </Dialog>
        <div className="coin-information">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="c-card">
                  <div className="hello">
                    {`Hello, ${auth.data.FirstName}`}
                    <div className="edit" onClick={() => { this.setState({ dialogBio: true }); }}><FontAwesomeIcon icon={faEdit} /></div>
                  </div>
                  <div>{`${auth.data.Bio}`}</div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})` }}>
                  <p>
                    Wanna know how to loan Constant instantly
                    <br />
                    <i>Create new one.</i>
                  </p>
                  <Link to="/" className="c-btn c-bg-green">
                    {'DCB '}
                    <FontAwesomeIcon icon={faAngleRight} />
                  </Link>
                  <Link to="/" className="c-btn c-bg-green">
                    {'GOV '}
                    <FontAwesomeIcon icon={faAngleRight} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default connect(state => ({ auth: state.auth }), ({
  authCheckAuth: checkAuth,
}))(Home);
