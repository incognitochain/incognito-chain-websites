export const types = {
  LOAD_VOTING_DATA: 'VOTING/LOAD_DATA',

  LOAD_CANDIDATES: 'VOTING/LOAD_CANDIDATES',
  LOAD_CANDIDATES_REQUEST: 'VOTING/LOAD_CANDIDATES_REQUEST',
  LOAD_CANDIDATES_SUCCESS: 'VOTING/LOAD_CANDIDATES_SUCCESS',
  LOAD_CANDIDATES_FAILURE: 'VOTING/LOAD_CANDIDATES_FAILURE',

  LOAD_PROPOSALS: 'VOTING/LOAD_PROPOSALS',
  LOAD_PROPOSALS_REQUEST: 'VOTING/LOAD_PROPOSALS_REQUEST',
  LOAD_PROPOSALS_SUCCESS: 'VOTING/LOAD_PROPOSALS_SUCCESS',
  LOAD_PROPOSALS_FAILURE: 'VOTING/LOAD_PROPOSALS_FAILURE',

  VOTE_CANDIDATE: 'VOTING/VOTE_CANDIDATE',
  VOTE_CANDIDATE_DIALOG_OPEN: 'VOTING/VOTE_CANDIDATE_DIALOG_OPEN',
  VOTE_CANDIDATE_DIALOG_CLOSE: 'VOTING/VOTE_CANDIDATE_DIALOG_CLOSE',
  VOTE_CANDIDATE_REQUEST: 'VOTING/VOTE_CANDIDATE_REQUEST',
  VOTE_CANDIDATE_SUCCESS: 'VOTING/VOTE_CANDIDATE_SUCCESS',
  VOTE_CANDIDATE_FAILURE: 'VOTING/VOTE_CANDIDATE_FAILURE',

  VOTE_PROPOSAL: 'VOTING/VOTE_PROPOSAL',
  VOTE_PROPOSAL_DIALOG_OPEN: 'VOTING/VOTE_PROPOSAL_DIALOG_OPEN',
  VOTE_PROPOSAL_DIALOG_CLOSE: 'VOTING/VOTE_PROPOSAL_DIALOG_CLOSE',
  VOTE_PROPOSAL_REQUEST: 'VOTING/VOTE_PROPOSAL_REQUEST',
  VOTE_PROPOSAL_SUCCESS: 'VOTING/VOTE_PROPOSAL_SUCCESS',
  VOTE_PROPOSAL_FAILURE: 'VOTING/VOTE_PROPOSAL_FAILURE',

  LOAD_USER_CANDIDATE_REQUEST: 'VOTING/LOAD_USER_CANDIDATE_REQUEST',
  LOAD_USER_CANDIDATE_SUCCESS: 'VOTING/LOAD_USER_CANDIDATE_SUCCESS',
  LOAD_USER_CANDIDATE_FAILURE: 'VOTING/LOAD_USER_CANDIDATE_FAILURE',

  APPLY: 'VOTING/APPLY',
  APPLY_REQUEST: 'VOTING/APPLY_REQUEST',
  APPLY_SUCCESS: 'VOTING/APPLY_SUCCESS',
  APPLY_FAILURE: 'VOTING/APPLY_FAILURE',

  /*CREATE_GOV_PROPOSAL: 'VOTING/CREATE_GOV_PROPOSAL',
  CREATE_GOV_PROPOSAL_DIALOG_OPEN: 'VOTING/CREATE_GOV_PROPOSAL_DIALOG_OPEN',
  CREATE_GOV_PROPOSAL_DIALOG_CLOSE: 'VOTING/CREATE_GOV_PROPOSAL_DIALOG_CLOSE',
  CREATE_GOV_PROPOSAL_REQUEST: 'VOTING/CREATE_GOV_PROPOSAL_REQUEST',
  CREATE_GOV_PROPOSAL_SUCCESS: 'VOTING/CREATE_GOV_PROPOSAL_SUCCESS',
  CREATE_GOV_PROPOSAL_FAILURE: 'VOTING/CREATE_GOV_PROPOSAL_FAILURE',*/

  CREATE_DCB_PROPOSAL: 'VOTING/CREATE_DCB_PROPOSAL',
  CREATE_DCB_PROPOSAL_DIALOG_OPEN: 'VOTING/CREATE_DCB_PROPOSAL_DIALOG_OPEN',
  CREATE_DCB_PROPOSAL_DIALOG_CLOSE: 'VOTING/CREATE_DCB_PROPOSAL_DIALOG_CLOSE',
  CREATE_DCB_PROPOSAL_REQUEST: 'VOTING/CREATE_DCB_PROPOSAL_REQUEST',
  CREATE_DCB_PROPOSAL_SUCCESS: 'VOTING/CREATE_DCB_PROPOSAL_SUCCESS',
  CREATE_DCB_PROPOSAL_FAILURE: 'VOTING/CREATE_DCB_PROPOSAL_FAILURE',

  UPDATE_PARAMS: 'VOTING/UPDATE_PARAMS',
  UPDATE_PROPOSAL_ASSETS: 'VOTING/UPDATE_PROPOSAL_ASSETS'
}

export const actions = {
  loadVotingData: () => ({type: types.LOAD_VOTING_DATA}),
  loadUserCandidateRequest: () => ({type: types.LOAD_USER_CANDIDATE_REQUEST}),
  loadUserCandidateSuccess: (userCandidate) => ({type: types.LOAD_USER_CANDIDATE_SUCCESS, payload: {userCandidate}}),
  loadUserCandidateFailure: (error) => ({type: types.LOAD_USER_CANDIDATE_FAILURE, error}),

  loadCandidates: (boardType = "") => ({type: types.LOAD_CANDIDATES, payload: {boardType}}),
  loadCandidatesRequest: () => ({type: types.LOAD_CANDIDATES_REQUEST}),
  loadCandidatesSuccess: (boardType, candidates) => ({
    type: types.LOAD_CANDIDATES_SUCCESS,
    payload: {boardType, candidates}
  }),
  loadCandidatesFailure: (boardType, error) => ({type: types.LOAD_CANDIDATES_FAILURE, error}),

  loadProposals: (boardType = "") => ({type: types.LOAD_PROPOSALS, payload: {boardType}}),
  loadProposalsRequest: () => ({type: types.LOAD_PROPOSALS_REQUEST}),
  loadProposalsSuccess: (boardType, proposals) => ({
    type: types.LOAD_PROPOSALS_SUCCESS,
    payload: {boardType, proposals}
  }),
  loadProposalsFailure: (boardType, error) => ({type: types.LOAD_PROPOSALS_FAILURE, error}),

  voteCandidate: (boardType, candidate, voteAmount) => ({
    type: types.VOTE_CANDIDATE,
    payload: {boardType, candidate, voteAmount}
  }),
  voteCandidateDialogOpen: () => ({type: types.VOTE_CANDIDATE_DIALOG_OPEN}),
  voteCandidateDialogClose: () => ({type: types.VOTE_CANDIDATE_DIALOG_CLOSE}),
  voteCandidateRequest: () => ({type: types.VOTE_CANDIDATE_REQUEST}),
  voteCandidateSuccess: () => ({type: types.VOTE_CANDIDATE_SUCCESS}),
  voteCandidateFailure: (error) => ({type: types.VOTE_CANDIDATE_FAILURE, error}),

  voteProposal: (boardType, proposal, voteAmount) => ({
    type: types.VOTE_PROPOSAL,
    payload: {boardType, proposal, voteAmount}
  }),
  voteProposalDialogOpen: () => ({type: types.VOTE_PROPOSAL_DIALOG_OPEN}),
  voteProposalDialogClose: () => ({type: types.VOTE_PROPOSAL_DIALOG_CLOSE}),
  voteProposalRequest: () => ({type: types.VOTE_PROPOSAL_REQUEST}),
  voteProposalSuccess: () => ({type: types.VOTE_PROPOSAL_SUCCESS}),
  voteProposalFailure: (error) => ({type: types.VOTE_PROPOSAL_FAILURE, error}),

  apply: (boardType) => ({type: types.APPLY, payload: {boardType}}),
  applyRequest: () => ({type: types.APPLY_REQUEST}),
  applySuccess: (userCandidate) => ({type: types.APPLY_SUCCESS, payload: {userCandidate}}),
  applyFailure: (error) => ({type: types.APPLY_FAILURE, error}),

  // createGovProposal: (name, executeDuration, explanation, govParams) => ({ type: types.CREATE_GOV_PROPOSAL, payload: { name, executeDuration, explanation, govParams } }),
  // createGovProposalDialogOpen: () => ({ type: types.CREATE_GOV_PROPOSAL_DIALOG_OPEN }),
  // createGovProposalDialogClose: () => ({ type: types.CREATE_GOV_PROPOSAL_DIALOG_CLOSE }),
  // createGovProposalRequest: () => ({ type: types.CREATE_GOV_PROPOSAL_REQUEST }),
  // createGovProposalSuccess: () => ({ type: types.CREATE_GOV_PROPOSAL_SUCCESS }),
  // createGovProposalFailure: (error) => ({ type: types.CREATE_GOV_PROPOSAL_FAILURE, error }),

  createDcbProposal: (name, executeDuration, explanation, dcbParams) => ({
    type: types.CREATE_DCB_PROPOSAL,
    payload: {name, executeDuration, explanation, dcbParams}
  }),
  createDcbProposalDialogOpen: () => ({type: types.CREATE_DCB_PROPOSAL_DIALOG_OPEN}),
  createDcbProposalDialogClose: () => ({type: types.CREATE_DCB_PROPOSAL_DIALOG_CLOSE}),
  createDcbProposalRequest: () => ({type: types.CREATE_DCB_PROPOSAL_REQUEST}),
  createDcbProposalSuccess: () => ({type: types.CREATE_DCB_PROPOSAL_SUCCESS}),
  createDcbProposalFailure: (error) => ({type: types.CREATE_DCB_PROPOSAL_FAILURE, error}),

  updateParams: (govParams, dcbParams) => ({type: types.UPDATE_PARAMS, payload: {govParams, dcbParams}}),
  updateProposalAssets: (proposalBuyingAssets, proposalSellingAssets) => ({
    type: types.UPDATE_PROPOSAL_ASSETS,
    payload: {proposalBuyingAssets, proposalSellingAssets}
  }),
}