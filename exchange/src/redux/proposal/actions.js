const proposalActions = {
  STORE_PROPOSAL: 'STORE_PROPOSAL',
  FILTER_ATTRIBUTE: 'FILTER_ATTRIBUTE',
  SELECTED_PROPOSAL: 'SELECTED_PROPOSAL',
  REPLY_PROPOSAL: 'REPLY_PROPOSAL',
  SEARCH_STRING: 'SEARCH_STRING',
  storeproposals: proposals => {
    return {
      type: proposalActions.STORE_PROPOSAL,
      proposals
    };
  },
  filterAction: newFilterAttr => {
    return (dispatch, getState) => {
      const filterAttr = getState().proposals.filterAttr;
      if (newFilterAttr) {
        if (newFilterAttr.bucket) {
          filterAttr.bucket = newFilterAttr.bucket;
          filterAttr.tag = newFilterAttr.tag;
        } else if (newFilterAttr.tag) {
          filterAttr.tag = newFilterAttr.tag;
        }
      }
      dispatch({
        type: proposalActions.FILTER_ATTRIBUTE,
        filterAttr
      });
    };
  },
  selectproposal: (selectedProposal, proposals) => {
    return (dispatch, getState) => {
      let allproposals = getState().proposals.allproposals;
      if(!allproposals) allproposals = proposals;

      allproposals[
        allproposals.findIndex(proposal => proposal.ID === selectedProposal)
      ].read = true;

      dispatch({
        type: proposalActions.SELECTED_PROPOSAL,
        selectedProposal,
        allproposals
      });
    };
  },
  changeReplyproposal: replyproposal => ({
    type: proposalActions.REPLY_PROPOSAL,
    replyproposal
  }),
  changeSearchString: searchString => ({
    type: proposalActions.SEARCH_STRING,
    searchString
  })
};
export default proposalActions;
