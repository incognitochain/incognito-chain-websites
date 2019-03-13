const isProduction = process.env.NODE_ENV === "production";

const BASE = process.env.REACT_APP_SERVICE_API;

if (isProduction) {
  console.log("production");
}

function addBaseToUrls(urls) {
  return Object.entries(urls).reduce(
    (acc, [name, url]) => ({
      ...acc,
      [name]: `${BASE}/${url}`
    }),
    {}
  );
}

// NOTE: BELOW IS UNNECESSARY
export const API = addBaseToUrls({
  STATS: "portal/borrows_stats",
  STATS_ALL: "portal/borrows_all_stats",
  LOAN_PARAMS: "common/loanparams",
  LOAN_DETAIL: "portal/borrows",
  LOAN_SUBMIT: "portal/borrows",
  LOAN_LIST: "portal/borrows",
  LOAN_ACTION: "portal/borrows",
  LOAN_LIST_FOR_LENDER: "portal/all_borrows",
  USER_DATA: "auth/me",
  WALLET_BALANCES: "wallet/balances",
  WALLET_WITHDRAW: "wallet/withdraw",
  VOTING_DATA: "voting/my_candidate",
  VOTING_APPLY: "voting/candidate",
  VOTING_LIST: "voting/candidates",
  VOTING_VOTE: "voting/candidate/vote",
  VOTING_DCB_PARAMS: "voting/dcbparams",
  VOTING_GOV_PARAMS: "voting/govparams",
  PROPOSAL_LIST: "voting/proposals",
  PROPOSAL_VOTE: "voting/proposal/vote",
  USER_UPDATE: "auth/update",
  AUTH_KYC: "auth/kyc",
  STORAGE_UPLOAD: "storage/upload",
});

export const BLOCKCHAIN = {
  BLOCK_IN_SECOND: 600
};
