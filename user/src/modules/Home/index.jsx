import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Link from "components/Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons";
import {faArrowRight, faEdit} from "@fortawesome/pro-regular-svg-icons";
import bgApplyDCB from "assets/apply-dcb.svg";
import {BOARD_TYPES} from "../../constants";
import cn from "classnames";
import bgImage from "assets/create-a-proposal.svg";
import {Dialog, Textarea} from "evergreen-ui";
import DcbProposalDialog from "./DcbProposalDialog";
import _ from "lodash";

import {actions as authActions} from '../../actions/auth'
import {actions as votingActions} from '../../actions/voting'
// import { actions as oracleActions } from '../../actions/oracle'


const Applied = ({applied, children}) => {
  if (applied) return "Applied";
  return children;
};

class Home extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    authCheckAuth: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const {auth} = props;

    this.state = {
      candidate: {},
      dialogDCBProposal: false,
      isLoading: false,
      bio: auth.profile.Bio,
    };
  }

  submitCreateDCB = async (values = {}) => {
    const {createDcbProposal} = this.props
    console.log(values)
    createDcbProposal(values.Name, values.ExecuteDuration, values.Explanation, values.dcbParams)
  };

  apply = (boardType, ev, denyCall) => {
    alert("Comming soon")
    return;
    /*ev.preventDefault();
    const {apply} = this.props;

    if (!denyCall) {
      apply(boardType)
    }*/
  };

  render() {
    const {
      isLoading,
      bio,
    } = this.state;

    const {
      auth,
      isUserInBoard,
      candidate,
      dcbParams,
      proposalSellingAssets,
      proposalBuyingAssets,

      createDcbProposalDialog,
      isCreatingDcbProposal,

      // actions
      updateBio,
      updateBioDialogOpen,
      updateBioDialogClose,

      createDcbProposalDialogOpen,
      createDcbProposalDialogClose,
    } = this.props;

    return (
      <div className="page user-page home-page">
        <Dialog
          isShown={auth.bioDialog}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title="Edit your bio"
          confirmLabel="Submit"
          isConfirmLoading={auth.isUpdatingBio}
          onCloseComplete={() => {
            updateBioDialogClose()
          }}
          onConfirm={() => {
            updateBio(this.state.bio)
          }}
        >
          <div className="withdraw-dialog">
            <div style={{margin: "0"}}>
              <Textarea
                rows={15}
                label="Your bio"
                placeholder="..."
                autoComplete="off"
                width="100%"
                value={bio}
                onChange={e => {
                  this.setState({bio: e.target.value});
                }}
              />
            </div>
          </div>
        </Dialog>
        <DcbProposalDialog
          options={{
            sellingAssetOptions: proposalSellingAssets,
            buyingAssetOptions: proposalBuyingAssets,
          }}
          isShown={createDcbProposalDialog}
          dcbParams={dcbParams}
          isLoading={isCreatingDcbProposal}
          innerRef={form => {
            this.dcbForm = form;
          }}
          onClose={() =>
            createDcbProposalDialogClose()
          }
          onConfirm={() => {
            this.dcbForm.submitForm();
          }}
          submitCreateDCB={this.submitCreateDCB}
        />
        <div className="coin-information">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="c-card">
                  <div className="hello">
                    {`Hello, ${auth.profile.FirstName}`}
                    <div
                      className="edit"
                      onClick={() => {
                        updateBioDialogOpen()
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit}/>
                    </div>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<p>${auth.profile.Bio.replace(
                        /\n{2,}/g,
                        "</p><p>"
                      ).replace(/\n/g, "<br>")}</p>`
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div
                  className="c-card card-create-a-proposal-container"
                  style={{backgroundImage: `url(${bgImage})`, height: "94%"}}
                >
                  <p>
                    Wanna make a new Proposal for Constant?
                  </p>
                  <button
                    className="c-btn c-bg-green"
                    type="button"
                    onClick={() => {
                      alert("Comming soon");
                      return;
                      createDcbProposalDialogOpen();
                    }}
                  >
                    {"DCB Proposal "}
                    <FontAwesomeIcon icon={faAngleRight}/>
                  </button>
                  {!isUserInBoard ?
                    <Link
                      className="c-btn c-bg-green"
                      // to={'/oracle/feed-price'}
                      to={"/"}
                      onClick={() => {
                        alert("Comming soon");
                        return false;
                      }}
                    >
                      {"Oracle Proposal"}
                      <FontAwesomeIcon icon={faAngleRight}/>
                    </Link>
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="apply">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-4">
                <div
                  className="c-card"
                  style={{backgroundImage: `url(${bgApplyDCB})`}}
                >
                  <div className="title c-color-blue-1000">Apply DCB Board</div>
                  <div className="description">A decentralized bank</div>
                  <Link
                    className={cn("c-btn", {
                      active: candidate.DCBAppliedAt
                    })}
                    to="/"
                    onClick={e => this.apply(BOARD_TYPES.DCB, e, candidate.DCBAppliedAt)}
                  >
                    <Applied applied={candidate.DCBAppliedAt}>
                      <>
                        {"Apply now "}
                        <FontAwesomeIcon icon={faArrowRight}/>
                      </>
                    </Applied>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(
  state => ({
    auth: state.auth,
    candidate: state.voting.userCandidate,
    dcbParams: state.voting.dcbParams,
    proposalBuyingAssets: state.voting.proposalBuyingAssets,
    proposalSellingAssets: state.voting.proposalSellingAssets,
    isUserInBoard: state.oracle.isUserInBoard,
    createDcbProposalDialog: state.voting.createDcbProposalDialog,
    isCreatingDcbProposal: state.voting.isCreatingDcbProposal
  }),
  {
    updateBio: authActions.updateBio,
    updateBioDialogOpen: authActions.updateBioDialogOpen,
    updateBioDialogClose: authActions.updateBioDialogClose,
    apply: votingActions.apply,
    createDcbProposal: votingActions.createDcbProposal,
    createDcbProposalDialogOpen: votingActions.createDcbProposalDialogOpen,
    createDcbProposalDialogClose: votingActions.createDcbProposalDialogClose,
  }
)(Home);
