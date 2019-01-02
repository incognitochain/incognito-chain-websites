const isProduction = process.env.MODE !== 'dev' && process.env.NODE_ENV === 'production';

let BASE = 'http://localhost:8888';

if (isProduction) {
  BASE = 'http://localhost:8888';
}

const API = {
  LOAN_PARAMS: 'common/loanparams',
};

Object.keys(API).map(api => { API[api] = `${BASE}/${API[api]}`; return null; });

module.exports = { API };


