const isProduction = process.env.NODE_ENV === "production";
const baseUrl = process.env.REACT_APP_SERVICE_API;

if (isProduction) {
  console.log("production");
}

// NOTE: BELOW IS UNNECESSARY
export const API = {
  LOAN_PARAMS: `${baseUrl}/common/loanparams`,
  // portal
  STATS: `${baseUrl}/portal/borrows_stats`,
  STATS_ALL: `${baseUrl}/portal/borrows_all_stats`,
  LOAN_DETAIL: `${baseUrl}/portal/borrows`,
  LOAN_SUBMIT: `${baseUrl}/portal/borrows`,
  LOAN_LIST: `${baseUrl}/portal/borrows`,
  LOAN_ACTION: `${baseUrl}/portal/borrows`,
  LOAN_LIST_FOR_LENDER: `${baseUrl}/portal/all_borrows`,

  // auth
  USER_DATA: `${baseUrl}/auth/me`,
  USER_PROFILE: `${baseUrl}/auth/profile`,
  USER_LOGIN: `${baseUrl}/auth/login`,
  USER_REGISTER: `${baseUrl}/auth/register`,
  USER_UPDATE: `${baseUrl}/auth/update`,
  USER_VERIFY_EMAIL: `${baseUrl}/auth/verify-email`,
  USER_KYC: `${baseUrl}/auth/kyc`,

  // wallet
  WALLET_BALANCES: `${baseUrl}/wallet/balances`,
  WALLET_WITHDRAW: `${baseUrl}/wallet/withdraw`,

  // voting
  VOTING_CANDIDATE_ME: `${baseUrl}/voting/my_candidate`,
  VOTING_CANDIDATE_APPLY: `${baseUrl}/voting/candidate`,
  VOTING_CANDIDATE_LIST: `${baseUrl}/voting/candidates`,
  VOTING_CANDIDATE_DETAIL: `${baseUrl}/voting/candidate`,
  VOTING_CANDIDATE_VOTE: `${baseUrl}/voting/candidate/vote`,
  VOTING_DCB_PARAMS: `${baseUrl}/voting/dcbparams`,
  // VOTING_GOV_PARAMS: `${baseUrl}/voting/govparams`,
  VOTING_PROPOSAL_SELLING_ASSETS: `${baseUrl}/voting/proposalsellingassets`,
  VOTING_PROPOSAL_BUYING_ASSETS: `${baseUrl}/voting/proposalbuyingassets`,
  VOTING_PROPOSAL: `${baseUrl}/voting/proposal`,
  VOTING_PROPOSAL_LIST: `${baseUrl}/voting/proposals`,
  VOTING_PROPOSAL_DETAIL: `${baseUrl}/voting/proposal`,
  VOTING_PROPOSAL_VOTE: `${baseUrl}/voting/proposal/vote`,

  // storage
  STORAGE_UPLOAD: `${baseUrl}/storage/upload`,
  STORAGE_KYC_DOCUMENTS: `${baseUrl}/storage/kyc/documents`,

  // oracle
  ORACLE_METADATAS: `${baseUrl}/oracle/metadatas`,
  ORACLE_IS_IN_BOARD: `${baseUrl}/oracle/is-in-board`,
  ORACLE_CREATE_AND_SIGN_METADATA: `${baseUrl}/oracle/create-and-sign-md`,
  ORACLE_SIGN_METADATA: `${baseUrl}/oracle/sign-md`,
  ORACLE_FEED_PRICE: `${baseUrl}/oracle/feed-price`,
  ORACLE_DETAIL: `${baseUrl}/oracle/detail`,
  ORACLE_ASSETS: `${baseUrl}/oracle/assets`,
  ORACLE_CURRENT_PRICES: `${baseUrl}/oracle/current-prices`
};

export const BLOCKCHAIN = {
  BLOCK_IN_SECOND: 600
};

export const ORACLE_REQUEST_ACTION = {
  ADD: 1,
  REMOVE: 2,
}

export const BOARD_TYPES = {
  DCB: 1,
  // GOV: 2,
  // CMB: 3,
}
