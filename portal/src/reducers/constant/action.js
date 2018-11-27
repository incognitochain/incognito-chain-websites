import axios from 'axios';

export const ACTIONS = {
  CONSTANT_INFO: 'CONSTANT_INFO',
  CONSTANT_MEMPOOL: 'CONSTANT_MEMPOOL',
  CONSTANT_PRODUCER: 'CONSTANT_PRODUCER',
  CONSTANT_CANDIDATE: 'CONSTANT_CANDIDATE',
  CONSTANT_DCB: 'CONSTANT_DCB',
  CONSTANT_CB: 'CONSTANT_CB',
  CONSTANT_GOV: 'CONSTANT_GOV',
  CONSTANT_BLOCKS: 'CONSTANT_BLOCKS',
  CONSTANT_TOKENS: 'CONSTANT_TOKENS',
  CONSTANT_CHECKHASH: 'CONSTANT_CHECKHASH',
  CONSTANT_BLOCK: 'CONSTANT_BLOCK',
  CONSTANT_TX: 'CONSTANT_TX',
  CONSTANT_TX_PENDING: 'CONSTANT_TX_PENDING',
  CONSTANT_TOKEN: 'CONSTANT_TOKEN',
};

let idRequest = 1;

const emptyFn = () => { };

const createRPCRequest = (
  storeName, firebaseWatch, actionName, method, params, successFn = emptyFn, errorFn = emptyFn,
) => (dispatch) => {
  dispatch({ type: actionName });
  axios.post(`${process.env.internalAPI}`, {
    jsonrpc: '1.0',
    method,
    params,
    id: idRequest += 1,
  }).then((res) => {
    successFn(res);
    dispatch({
      type: `${actionName}_SUCCESS`, payload: res.data, id: idRequest, params,
    });
  }).catch((e) => {
    errorFn(e);
    dispatch({
      type: `${actionName}_FAILED`, payload: e, id: idRequest, params,
    });
  });
};

export const getBlockchainInfo = () => createRPCRequest('chainInfo', false, ACTIONS.CONSTANT_INFO, 'getblockchaininfo', '');
export const getMempoolInfo = () => createRPCRequest('mempool', false, ACTIONS.CONSTANT_MEMPOOL, 'getmempoolinfo', []);
export const getBlockProducer = () => createRPCRequest('producers', false, ACTIONS.CONSTANT_PRODUCER, 'getblockproducer', []);
export const getCommitteeCandidate = () => createRPCRequest('candidates', false, ACTIONS.CONSTANT_CANDIDATE, 'getcommitteecandidate', []);
export const getDCB = () => createRPCRequest('dcb', false, ACTIONS.CONSTANT_DCB, 'getlistdcbboard', []);
export const getCB = () => createRPCRequest('cb', false, ACTIONS.CONSTANT_CB, 'getlistcbboard', []);
export const getGOV = () => createRPCRequest('gov', false, ACTIONS.CONSTANT_GOV, 'getlistgovboard', []);
export const getBlocks = chainId => createRPCRequest('chainBlocks', true, ACTIONS.CONSTANT_BLOCKS, 'getblocks', [20, chainId]);
export const getTokens = () => createRPCRequest('tokens', true, ACTIONS.CONSTANT_TOKENS, 'listcustomtoken', []);
export const checkHash = hash => createRPCRequest('search', false, ACTIONS.CONSTANT_CHECKHASH, 'checkhashvalue', [hash]);
export const getBlock = blockHash => createRPCRequest('block', true, ACTIONS.CONSTANT_BLOCK, 'retrieveblock', [blockHash, '2']);
export const getTx = txHash => createRPCRequest('tx', false, ACTIONS.CONSTANT_TX, 'gettransactionbyhash', [txHash]);
export const getTxPending = txHash => createRPCRequest('txPending', false, ACTIONS.CONSTANT_TX_PENDING, 'gettransactionbyhash', [txHash]);
export const getToken = customTokenId => createRPCRequest('token', false, ACTIONS.CONSTANT_TOKEN, 'customtoken', [customTokenId]);
