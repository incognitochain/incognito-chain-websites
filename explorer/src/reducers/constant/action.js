import axios from 'axios';

export const ACTIONS = {
  CONSTANT_INFO: 'CONSTANT_INFO',
  CONSTANT_MEMPOOL: 'CONSTANT_MEMPOOL',
  CONSTANT_PRODUCER: 'CONSTANT_PRODUCER',
  CONSTANT_LIST_COMMITTEE: 'CONSTANT_LIST_COMMITTEE',
  CONSTANT_LIST_REWARD_AMOUNT: 'CONSTANT_LIST_REWARD_AMOUNT',
  CONSTANT_DCB: 'CONSTANT_DCB',
  CONSTANT_CB: 'CONSTANT_CB',
  CONSTANT_GOV: 'CONSTANT_GOV',
  CONSTANT_BLOCKS: 'CONSTANT_BLOCKS',
  CONSTANT_TOKENS: 'CONSTANT_TOKENS',
  CONSTANT_PRIVACY_TOKENS: 'CONSTANT_PRIVACY_TOKENS',
  CONSTANT_CHECKHASH: 'CONSTANT_CHECKHASH',
  CONSTANT_BLOCK: 'CONSTANT_BLOCK',
  CONSTANT_TX: 'CONSTANT_TX',
  CONSTANT_TX_PENDING: 'CONSTANT_TX_PENDING',
  CONSTANT_TOKEN: 'CONSTANT_TOKEN',
  CONSTANT_TOKEN_HOLDER: 'CONSTANT_TOKEN_HOLDER',
  CONSTANT_BEACON_BEST_STATE: 'CONSTANT_BEACON_BEST_STATE',
  CONSTANT_PRODUCER_BLACK_LIST_DETAIL: 'CONSTANT_PRODUCER_BLACK_LIST_DETAIL'
};

let idRequest = 1;

const emptyFn = () => {};

const createRPCRequest = (
  storeName,
  firebaseWatch,
  actionName,
  method,
  params,
  successFn = emptyFn,
  errorFn = emptyFn
) => dispatch => {
  dispatch({ type: actionName });
  return axios
    .post(`${process.env.blockchainAPI}`, {
      jsonrpc: '1.0',
      method,
      params,
      id: (idRequest += 1)
    })
    .then(res => {
      successFn(res);
      dispatch({
        type: `${actionName}_SUCCESS`,
        payload: res.data,
        id: idRequest,
        params
      });
      return res;
    })
    .catch(e => {
      errorFn(e);
      dispatch({
        type: `${actionName}_FAILED`,
        payload: e,
        id: idRequest,
        params
      });
    });
};

export const getBlockchainInfo = () =>
  createRPCRequest(
    'chainInfo',
    false,
    ACTIONS.CONSTANT_INFO,
    'getblockchaininfo',
    ''
  );
export const getMempoolInfo = () =>
  createRPCRequest(
    'mempool',
    false,
    ACTIONS.CONSTANT_MEMPOOL,
    'getmempoolinfo',
    []
  );
export const getListCommittee = () =>
  createRPCRequest(
    'committees',
    false,
    ACTIONS.CONSTANT_LIST_COMMITTEE,
    'getcommitteelist',
    []
  );
export const getListRewardAmount = () =>
  createRPCRequest(
    'listrewardamount',
    false,
    ACTIONS.CONSTANT_LIST_REWARD_AMOUNT,
    'listrewardamount',
    []
  );
export const getDCB = () =>
  createRPCRequest('dcb', false, ACTIONS.CONSTANT_DCB, 'getlistdcbboard', []);
export const getBlocks = chainId =>
  createRPCRequest('chainBlocks', true, ACTIONS.CONSTANT_BLOCKS, 'getblocks', [
    20,
    chainId
  ]);
export const getTokens = () =>
  createRPCRequest(
    'tokens',
    true,
    ACTIONS.CONSTANT_TOKENS,
    'listcustomtoken',
    []
  );
export const getPrivacyTokens = () =>
  createRPCRequest(
    'privacyTokens',
    true,
    ACTIONS.CONSTANT_PRIVACY_TOKENS,
    'listprivacycustomtoken',
    [1]
  );
export const checkHash = hash =>
  createRPCRequest(
    'search',
    false,
    ACTIONS.CONSTANT_CHECKHASH,
    'checkhashvalue',
    [hash]
  );
export const getBlock = (blockHash, beacon = false) => {
  if (!beacon) {
    return createRPCRequest(
      'block',
      true,
      ACTIONS.CONSTANT_BLOCK,
      'retrieveblock',
      [blockHash, '2']
    );
  }
  return createRPCRequest(
    'block',
    true,
    ACTIONS.CONSTANT_BLOCK,
    'retrievebeaconblock',
    [blockHash, '2']
  );
};
export const getTx = txHash =>
  createRPCRequest('tx', false, ACTIONS.CONSTANT_TX, 'gettransactionbyhash', [
    txHash
  ]);
export const getTokenTxs = customTokenId =>
  createRPCRequest('token', false, ACTIONS.CONSTANT_TOKEN, 'customtoken', [
    customTokenId
  ]);
export const getTokenHolder = customTokenId =>
  createRPCRequest(
    'tokenHolders',
    false,
    ACTIONS.CONSTANT_TOKEN_HOLDER,
    'customtokenholder',
    [customTokenId]
  );
export const getPrivacyTokenTxs = customTokenId =>
  createRPCRequest(
    'token',
    false,
    ACTIONS.CONSTANT_TOKEN,
    'privacycustomtoken',
    [customTokenId]
  );
export const getBeaconBeststateDetail = () =>
  createRPCRequest(
    'beaconBeststate',
    false,
    ACTIONS.CONSTANT_BEACON_BEST_STATE,
    'getbeaconbeststatedetail',
    []
  );
export const getProducersBlacklistDetail = beaconHeigh =>
  createRPCRequest(
    'producersBlacklistDetail',
    false,
    ACTIONS.CONSTANT_PRODUCER_BLACK_LIST_DETAIL,
    'getproducersblacklistdetail',
    [beaconHeigh]
  );
