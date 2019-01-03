// 0xbatutut

const isProduction = process.env.MODE !== 'dev' && process.env.NODE_ENV === 'production';

let BASE = 'http://localhost:8888';

if (isProduction) {
  BASE = 'http://localhost:8888';
}

const API = {
  LOAN_PARAMS: 'common/loanparams',
  GET_LOAN_LIST: 'portal/borrows',
};

Object.keys(API).map(api => { API[api] = `${BASE}/${API[api]}`; return null; });

// 0xhakawai

const API_URL = {
  GET_LOAN_LIST: 'portal/borrows',
}

const BASE_API = {
  BASE_URL: process.env.BASE_API_URL,
  TIMEOUT: 10000
};

module.exports = { API, API_URL, BASE_API };
