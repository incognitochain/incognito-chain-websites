import { createSelector } from 'reselect';

const allProposalsSelector = state => state.allProposals;
const filterAttrSelector = state => state.filterAttr;
const searchStringSelector = state => state.searchString;

const filterBucket = (proposals) => {
  const newProposals = [];
  if(proposals){
    proposals.forEach(proposal => {
      //if (bucket === proposal.bucket) {
        newProposals.push(proposal);
      //}
    });
  }
  
  return newProposals;
};
const filterTag = (proposals, tag) => {
  const newProposals = [];
  proposals.forEach(proposal => {
    if (proposal.tags && proposal.tags.indexOf(tag) !== -1) {
      newProposals.push(proposal);
    }
  });
  return newproposals;
};
const filterProposal = (allproposals, filterAttr, searchString) => {
  let newProposals = filterBucket(allproposals);
  //if (filterAttr.tag) {
    //newproposals = filterTag(allproposals, filterAttr.tag);
  //}
  if (searchString) {
    const search = searchString.toUpperCase();
    newProposals = newProposals.filter(proposal =>
      `${proposal.eproposal}${proposal.body}${proposal.subject}`.toUpperCase().includes(search)
    );
  }
  return newProposals;
};

export default createSelector(
  allProposalsSelector,
  filterAttrSelector,
  searchStringSelector,
  filterProposal
);
