const isProduction = process.env.MODE !== 'dev' && process.env.NODE_ENV === 'production';

const BASE = process.env.serviceAPI;

if (isProduction) {
  console.log('production');
}

const API = {
  STATS: 'portal/borrows_stats',
  STATS_ALL: 'portal/borrows_all_stats',
  LOAN_PARAMS: 'common/loanparams',
  LOAN_DETAIL: 'portal/borrows',
  LOAN_SUBMIT: 'portal/borrows',
  LOAN_LIST: 'portal/borrows',
  LOAN_ACTION: 'portal/borrows',
  LOAN_LIST_FOR_LENDER: 'portal/all_borrows',
  USER_DATA: 'auth/me',
  WALLET_BALANCES: 'wallet/balances',
  VOTING_DATA: 'voting/my_candidate',
  VOTING_APPLY: 'voting/candidate',
  VOTING_LIST: 'voting/candidates',
  VOTING_VOTE: 'voting/candidate/vote',
  PROPOSAL_LIST: 'voting/proposals',
  PROPOSAL_VOTE: 'voting/proposal/vote',
  USER_UPDATE: 'auth/update',
};

const BLOCKCHAIN = {
  BLOCK_IN_SECOND: 600,
};

Object.keys(API).map((api) => { API[api] = `${BASE}/${API[api]}`; return null; });

module.exports = { API, BLOCKCHAIN };
