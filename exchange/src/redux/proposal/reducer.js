import actions from './actions';

const initState = {
  allProposals: [],
  tag: undefined,
  selectedProposal: -1,
  filterAttr: { },
  composeProposal: false,
  replyProposal: false,
  searchString: ''
};

export default function proposalReducer(state = initState, action) {

  switch (action.type) {
    case actions.STORE_PROPOSAL:
      return {
        ...state,
        allProposals: action.proposals || []
      }
    case actions.FILTER_ATTRIBUTE:
      return {
        ...state,
        composeProposal: false,
        replyProposal: false,
        selectedproposal: -1,
        filterAttr: { ...action.filterAttr }
      };
    case actions.SELECTED_PROPOSAL:
      return {
        ...state,
        replyProposal: false,
        selectedProposal: action.selectedproposal,
        allProposals: action.allproposals
      };
    case actions.REPLY_PROPOSAL:
      return {
        ...state,
        replyProposal: action.replyProposal
      };
    case actions.SEARCH_STRING:
      return {
        ...state,
        searchString: action.searchString
      };
    default:
      return state;
  }
}
