import {types} from "../actions/voting";
import {types as authTypes} from "../actions/auth";
import {BOARD_TYPES} from "../constants";

export const initialState = {
  govParams: {},
  dcbParams: {},
  proposalSellingAssets: [],
  proposalBuyingAssets: [],

  userCandidate: {},
  loadUserCandidateError: null,

  selectedBoardType: BOARD_TYPES.DCB,

  candidates: [],
  loadCandidatesError: null,
  isLoadingCandidates: false,

  voteCandidateError: null,
  voteCandidateDialog: false,
  isVotingCandidate: false,

  applyError: null,
  applyLoading: false,

  proposals: [],
  loadProposalsError: null,
  isLoadingProposals: false,

  voteProposalError: null,
  voteProposalDialog: false,
  isVotingProposal: false,

  createGovProposalDialog: false,
  isCreatingGovProposal: false,

  createDcbProposalDialog: false,
  isCreatingDcbProposal: false,
}

export default (
  state = initialState,
  action
) => {
  switch (action.type) {
    case types.LOAD_CANDIDATES_REQUEST: {
      return {
        ...state,
        loadCandidatesError: null,
        isLoadingCandidates: true,
      };
    }
    case types.LOAD_CANDIDATES_SUCCESS: {
      return {
        ...state,
        loadCandidatesError: null,
        isLoadingCandidates: false,
        candidates: action.payload.candidates || [],
        selectedBoardType: action.payload.boardType,
      };
    }
    case types.LOAD_CANDIDATES_FAILURE: {
      return {
        ...state,
        selectedBoardType: action.payload.boardType,
        loadCandidatesError: action.error,
        isLoadingCandidates: false,
      };
    }

    case types.LOAD_PROPOSALS_REQUEST: {
      return {
        ...state,
        loadProposalsError: null,
        isLoadingProposals: true,
      };
    }
    case types.LOAD_PROPOSALS_SUCCESS: {
      return {
        ...state,
        loadProposalsError: null,
        isLoadingProposals: false,
        proposals: action.payload.proposals || [],
        selectedBoardType: action.payload.boardType,
      };
    }
    case types.LOAD_PROPOSALS_FAILURE: {
      return {
        ...state,
        selectedBoardType: action.payload.boardType,
        loadProposalsError: action.error,
        isLoadingProposals: false,
      };
    }

    case types.LOAD_USER_CANDIDATE_REQUEST: {
      return {
        ...state,
        loadUserCandidateError: null,
      };
    }
    case types.LOAD_USER_CANDIDATE_SUCCESS: {
      return {
        ...state,
        loadUserCandidateError: null,
        userCandidate: action.payload.userCandidate || [],
      };
    }
    case types.LOAD_USER_CANDIDATE_FAILURE: {
      return {
        ...state,
        loadUserCandidateError: action.error,
      };
    }

    case types.APPLY_REQUEST: {
      return {
        ...state,
        applyError: null,
        applyLoading: true,
      };
    }
    case types.APPLY_SUCCESS: {
      return {
        ...state,
        applyError: null,
        applyLoading: false,
        userCandidate: action.payload.userCandidate || [],
      };
    }
    case types.APPLY_FAILURE: {
      return {
        ...state,
        applyError: action.error,
        applyLoading: false,
      };
    }

    case types.VOTE_CANDIDATE_DIALOG_OPEN: {
      return {
        ...state,
        voteCandidateDialog: true,
      };
    }
    case types.VOTE_CANDIDATE_DIALOG_CLOSE: {
      return {
        ...state,
        voteCandidateDialog: false,
      };
    }
    case types.VOTE_CANDIDATE_REQUEST: {
      return {
        ...state,
        voteCandidateError: null,
        isVotingCandidate: true,
      };
    }
    case types.VOTE_CANDIDATE_SUCCESS: {
      return {
        ...state,
        voteCandidateError: null,
        isVotingCandidate: false,
        voteCandidateDialog: false,
      };
    }
    case types.VOTE_CANDIDATE_FAILURE: {
      return {
        ...state,
        voteCandidateError: action.error,
        isVotingCandidate: false,
      };
    }

    case types.VOTE_PROPOSAL_DIALOG_OPEN: {
      return {
        ...state,
        voteProposalDialog: true,
      };
    }
    case types.VOTE_PROPOSAL_DIALOG_CLOSE: {
      return {
        ...state,
        voteProposalDialog: false,
      };
    }
    case types.VOTE_PROPOSAL_REQUEST: {
      return {
        ...state,
        voteProposalError: null,
        isVotingProposal: true,
      };
    }
    case types.VOTE_PROPOSAL_SUCCESS: {
      return {
        ...state,
        voteProposalError: null,
        isVotingProposal: false,
        voteProposalDialog: false,
      };
    }
    case types.VOTE_PROPOSAL_FAILURE: {
      return {
        ...state,
        voteProposalError: action.error,
        isVotingProposal: false,
      };
    }

    case types.CREATE_GOV_PROPOSAL_DIALOG_OPEN: {
      return {
        ...state,
        createGovProposalDialog: true,
      };
    }
    case types.CREATE_GOV_PROPOSAL_DIALOG_CLOSE: {
      return {
        ...state,
        createGovProposalDialog: false,
      };
    }
    case types.CREATE_GOV_PROPOSAL_REQUEST: {
      return {
        ...state,
        isCreatingGovProposal: true,
      };
    }
    case types.CREATE_GOV_PROPOSAL_SUCCESS: {
      return {
        ...state,
        isCreatingGovProposal: false,
        createGovProposalDialog: false,
      };
    }
    case types.CREATE_GOV_PROPOSAL_FAILURE: {
      return {
        ...state,
        isCreatingGovProposal: false,
        createGovProposalError: action.error || null,
      };
    }

    case types.CREATE_DCB_PROPOSAL_DIALOG_OPEN: {
      return {
        ...state,
        createDcbProposalDialog: true,
      };
    }
    case types.CREATE_DCB_PROPOSAL_DIALOG_CLOSE: {
      return {
        ...state,
        createDcbProposalDialog: false,
      };
    }
    case types.CREATE_DCB_PROPOSAL_REQUEST: {
      return {
        ...state,
        isCreatingDcbProposal: true,
      };
    }
    case types.CREATE_DCB_PROPOSAL_SUCCESS: {
      return {
        ...state,
        isCreatingDcbProposal: false,
        createDcbProposalDialog: false,
      };
    }
    case types.CREATE_DCB_PROPOSAL_FAILURE: {
      return {
        ...state,
        isCreatingDcbProposal: false,
        createDcbProposalError: action.error || null,
      };
    }

    case types.UPDATE_PARAMS: {
      return {
        ...state,
        govParams: action.payload.govParams || {},
        dcbParams: action.payload.dcbParams || {},
      };
    }

    case types.UPDATE_PROPOSAL_ASSETS: {
      return {
        ...state,
        proposalSellingAssets: action.payload.proposalSellingAssets || [],
        proposalBuyingAssets: action.payload.proposalBuyingAssets || [],
      };
    }

    case authTypes.LOGOUT: {
      return {
        ...state,
        ...initialState
      };
    }

    default: {
      return state;
    }
  }
};
