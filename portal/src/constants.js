const isProduction = process.env.MODE !== 'dev' && process.env.NODE_ENV === 'production';

let BASE = 'http://localhost:8888';

if (isProduction) {
  BASE = 'http://localhost:8888';
}

const API = {
  STATS: 'portal/borrows_stats',
  LOAN_PARAMS: 'common/loanparams',
  LOAN_DETAIL: 'portal/borrows',
  LOAN_SUBMIT: 'portal/borrows',
  LOAN_LIST: 'portal/borrows',
  LOAN_ACTION: 'portal/borrows',
  LOAN_LIST_FOR_LENDER: 'portal/all_borrows',
  USER_DATA: 'auth/me',
};

const BLOCKCHAIN = {
  BLOCK_IN_SECOND: 600,
};

Object.keys(API).map(api => { API[api] = `${BASE}/${API[api]}`; return null; });

module.exports = { API, BLOCKCHAIN };