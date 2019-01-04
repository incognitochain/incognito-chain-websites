const isProduction = process.env.MODE !== 'dev' && process.env.NODE_ENV === 'production';

let BASE = 'http://localhost:8888';

if (isProduction) {
  BASE = 'http://localhost:8888';
}

const API = {
  LOAN_PARAMS: 'common/loanparams',
  LOAN_SUBMIT: 'portal/borrows',
  LOAN_LIST: 'portal/borrows',
  USER_DATA: 'voting/my_candidate',
};

Object.keys(API).map(api => { API[api] = `${BASE}/${API[api]}`; return null; });

module.exports = { API };
