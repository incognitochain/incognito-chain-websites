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
  USER_DATA: 'auth/profile',
  RESERVE_REDEEM_ETH_LIST: 'reserves/redeem-eth',
  RESERVE_REDEEM_ETH_CREATE: 'reserves/redeem-eth',
  RESERVE_REDEEM_USD_LIST: 'reserves/usd?type=1&buying_asset=1',
  RESERVE_REDEEM_USD_CREATE: 'reserves/redeem-usd',
  RESERVE_CONVERT_CST_TO_ETH: 'reserves/convert-cst-to-eth',
};

const BLOCKCHAIN = {
  BLOCK_IN_SECOND: 600,
};

const BUYING_ASSET = {
  CONSTANT: 1,
  DCB_TOKEN: 2,
};

Object.keys(API).map((api) => { API[api] = `${BASE}/${API[api]}`; return null; });

module.exports = { API, BLOCKCHAIN, BUYING_ASSET };
