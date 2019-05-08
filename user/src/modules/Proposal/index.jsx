import React from "react";
import {connect} from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Dialog, TextInputField} from "evergreen-ui";
import _ from "lodash";
import {ProposalListItem} from "./ProposalListItem";
import {ProposalData} from "./ProposalData";
import {RightContent} from "../Voting/RightContent";

import {actions as votingActions} from '../../actions/voting'
import {BOARD_TYPES} from "../../constants";
import * as votingService from "../../services/voting"
import {hideOverlayLoading, showOverlayLoading} from "../../components/App/Layout";

const renderIf = condition => component => (condition ? component : null);

class Proposals extends React.Component {
  state = {
    selectedProposal: null,
    voteAmount: "",
  };

  componentDidMount() {
    const {boardType} = this.props
    this.loadProposals(boardType)
  }

  changeBoardType = e => {
    const boardType = e.target.value
    this.loadProposals(boardType)
  };

  loadProposals = (boardType) => {
    const {loadProposals} = this.props
    loadProposals(boardType)
  }

  voteProposal = () => {
    const {
      selectedProposal,
      voteAmount,
    } = this.state;
    const {boardType, voteProposal} = this.props
    voteProposal(boardType, selectedProposal, Number(voteAmount))
  };

  onlyNumber = (value, cb) => {
    if (!Number.isNaN(Number(value))) {
      cb();
    }
  };

  onSelectApplicant = async (index) => {
    showOverlayLoading();
    const {auth, proposals} = this.props
    const resp = await votingService.loadProposalDetail(auth.accessToken, proposals[index].ID)
    console.log("proposal detail", resp)
    if (resp.data.Result) {
      const selectedProposal = Object.assign({}, proposals[index], resp.data.Result)
      this.setState(() => ({selectedProposal}))
    }
    hideOverlayLoading();
  };

  render() {
    const {
      selectedProposal,
      voteAmount,
    } = this.state;

    const {
      boardType,
      proposals,
      isLoadingProposals,
      voteProposalDialog,
      isVotingProposal,
      proposalBuyingAssets,
      proposalSellingAssets,
      // actions
      voteProposalDialogOpen,
      voteProposalDialogClose,
    } = this.props

    console.log('render', proposals, BOARD_TYPES)

    return (
      <div className="page user-page proposals-page">
        <Dialog
          isShown={voteProposalDialog}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title="Vote"
          confirmLabel="Vote"
          isConfirmLoading={isVotingProposal}
          onCloseComplete={() =>
            voteProposalDialogClose()
          }
          onConfirm={() => {
            this.voteProposal();
          }}
        >
          <div className="withdraw-dialog">
            <div style={{margin: "0", textAlign: "center"}}>
              {<TextInputField
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
              />}
              <h4>Are you SURE?</h4>
            </div>
          </div>
        </Dialog>
        <div className="proposal-list">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-lg-3 left-side">
                <div className="c-card">
                  <div className="title">
                    <span>Proposals</span>
                    <div className="select" style={{float: "right"}}>
                      <Select
                        disabled={isLoadingProposals}
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
                    {renderIf(isLoadingProposals)("Loading...")}
                    {renderIf(!isLoadingProposals)(
                      proposals.map((item, index) => (
                        <ProposalListItem
                          key={item.ID}
                          active={selectedProposal ? item.ID === selectedProposal.ID : false}
                          proposal={item}
                          onClick={this.onSelectApplicant.bind(this, index)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
              <ProposalData
                type={boardType}
                data={selectedProposal ? selectedProposal : null}
                options={{
                  buyingAssetOptions: proposalBuyingAssets,
                  sellingAssetOptions: proposalSellingAssets,
                }}
              />

              <RightContent
                placeholder="Please select proposal"
                user={selectedProposal ? selectedProposal.User : {}}
                balances={selectedProposal && selectedProposal.Balances ? selectedProposal.Balances.ListBalances : []}
                vote={selectedProposal ? selectedProposal.VoteNum : 0}
                onClickVote={() => {
                  voteProposalDialogOpen()
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
    proposals: state.voting.proposals,
    isLoadingProposals: state.voting.isLoadingProposals,
    voteProposalDialog: state.voting.voteProposalDialog,
    isVotingProposal: state.voting.isVotingProposal,
    proposalBuyingAssets: state.voting.proposalBuyingAssets,
    proposalSellingAssets: state.voting.proposalSellingAssets,
  }),
  {
    voteProposal: votingActions.voteProposal,
    voteProposalDialogOpen: votingActions.voteProposalDialogOpen,
    voteProposalDialogClose: votingActions.voteProposalDialogClose,
    loadProposals: votingActions.loadProposals,
  }
)(Proposals);
