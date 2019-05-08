import React from "react";
import {connect} from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Dialog, TextInputField} from "evergreen-ui";
import _ from "lodash";
import {RightContent} from "./RightContent";
import {CenterContent} from "./CenterContent";
import {ApplicantListItem} from "./ApplicantListItem";
import {actions as votingActions} from '../../actions/voting'
import {BOARD_TYPES} from "../../constants";
import * as votingService from "../../services/voting"
import {hideOverlayLoading, showOverlayLoading} from "../../components/App/Layout";

const renderIf = condition => component => (condition ? component : null);

class Voting extends React.Component {
  state = {
    selectedCandidate: null,
    voteAmount: ""
  };

  componentDidMount() {
    const {boardType} = this.props
    this.loadCandidates(boardType)
  }

  changeBoardType = e => {
    const boardType = e.target.value
    this.loadCandidates(boardType)
  };

  loadCandidates = async (boardType) => {
    const {loadCandidates} = this.props
    loadCandidates(boardType)

    this.setState(() => ({selectedCandidate: null}))
  }

  voteCandidate = async () => {
    const {
      selectedCandidate,
      voteAmount,
    } = this.state;
    const {boardType, voteCandidate} = this.props
    voteCandidate(boardType, selectedCandidate, Number(voteAmount))
  };

  onlyNumber = (value, cb) => {
    if (!Number.isNaN(Number(value))) {
      cb();
    }
  };

  onSelectApplicant = async (index) => {
    showOverlayLoading();
    const {auth, candidates} = this.props
    const resp = await votingService.loadCandidateDetail(auth.accessToken, candidates[index].ID)
    console.log("candidate detail", resp)
    if (resp.data.Result) {
      const selectedCandidate = Object.assign({}, candidates[index], resp.data.Result)
      this.setState(() => ({selectedCandidate}))
    }
    hideOverlayLoading();
  };

  render() {
    const {
      selectedCandidate,
      voteAmount,
    } = this.state;

    const {
      boardType,
      candidates,
      isLoadingCandidates,
      voteCandidateDialog,
      isVotingCandidate,
      // actions
      voteCandidateDialogOpen,
      voteCandidateDialogClose,
    } = this.props

    return (
      <div className="page user-page proposals-page">
        <Dialog
          isShown={voteCandidateDialog}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title="Vote"
          confirmLabel="Vote"
          isConfirmLoading={isVotingCandidate}
          onCloseComplete={() =>
            voteCandidateDialogClose()
          }
          onConfirm={() => {
            this.voteCandidate()
          }}
        >
          <div className="withdraw-dialog">
            <div style={{margin: "0"}}>
              <TextInputField
                label="Amount"
                placeholder="0.00"
                autoComplete="off"
                width="100%"
                type="text"
                value={voteAmount}
                onChange={e => {
                  this.onlyNumber(e.target.value, () => {
                    this.setState({voteAmount: e.target.value});
                  });
                }}
              />
            </div>
          </div>
        </Dialog>
        <div className="proposal-list">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-lg-3 left-side">
                <div className="c-card">
                  <div className="title">
                    <span>Applicants</span>
                    <div className="select" style={{float: "right"}}>
                      <Select
                        disabled={isLoadingCandidates}
                        value={boardType}
                        onChange={this.changeBoardType}
                        inputProps={{
                          name: "proposalsType",
                          id: "proposals-type"
                        }}
                      >
                        {Object.keys(BOARD_TYPES).map(key => (
                          <MenuItem key={BOARD_TYPES[key]} value={BOARD_TYPES[key]}>
                            {key}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div className="clearfix"/>
                  </div>
                  <div className="content">
                    {renderIf(isLoadingCandidates)("Loading..")}
                    {renderIf(!isLoadingCandidates && candidates.length)(
                      candidates.map((applicant, index) => (
                        <ApplicantListItem
                          key={applicant.ID}
                          active={selectedCandidate ? applicant.ID === selectedCandidate.ID : false}
                          applicant={applicant}
                          onClick={this.onSelectApplicant.bind(this, index)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              <CenterContent applicant={selectedCandidate}/>
              <RightContent
                placeholder="Please select applicant"
                user={selectedCandidate ? selectedCandidate.User : {}}
                balances={selectedCandidate && selectedCandidate.Balances ? selectedCandidate.Balances.ListBalances : []}
                vote={selectedCandidate ? selectedCandidate.VoteNum : 0}
                onClickVote={() => {
                  voteCandidateDialogOpen()
                }}
              />
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
    isUserInBoard: state.oracle.isUserInBoard,
    boardType: state.voting.selectedBoardType,
    candidates: state.voting.candidates,
    isLoadingCandidates: state.voting.isLoadingCandidates,
    voteCandidateDialog: state.voting.voteCandidateDialog,
    isVotingCandidate: state.voting.isVotingCandidate,
  }),
  {
    voteCandidate: votingActions.voteCandidate,
    voteCandidateDialogOpen: votingActions.voteCandidateDialogOpen,
    voteCandidateDialogClose: votingActions.voteCandidateDialogClose,

    loadCandidates: votingActions.loadCandidates,
  }
)(Voting);
