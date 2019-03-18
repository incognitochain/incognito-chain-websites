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
  RESERVE_CONVERT_ETH_TO_DCB: 'reserves/convert-eth-to-dcb-token',
  RESERVE_REDEEM_STATS: 'reserves/redeem-stats',
  RESERVE_RAISE_INFO: 'reserves/get-raise-reserve-info',
  RESERVE_SPEND_INFO: 'reserves/get-spend-reserve-info',
};

const BLOCKCHAIN = {
  BLOCK_IN_SECOND: 600,
};

const BUYING_ASSET = {
  CONSTANT: 1,
  DCB_TOKEN: 2,
};

const RESERVE_HISTORY_STATUS_COLOR = {
  "pending": "processing",
  "purchasing": "processing",
  "coin minting": "processing",
  "coin burning": "processing",
  "coin burned": "processing",
  "transfering": "processing",
  "redeeming": "processing",
  "cancelled": "finished",
  "done": "successed",
  "holding": "processing",
  "failed to burn coin": "failed",
  "failed to mint coin": "failed",
  "failed to transfer coin": "failed",
};

Object.keys(API).map((api) => { API[api] = `${BASE}/${API[api]}`; return null; });

module.exports = { API, BLOCKCHAIN, BUYING_ASSET, RESERVE_HISTORY_STATUS_COLOR };
