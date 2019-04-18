import {callNodeRpcFunction} from "../helpers/callNodeRpcFunction";

export const getBlockchainInfo = async () => {
  let body = {"jsonrpc": "1.0", "method": "getblockchaininfo", "params": "", "id": 4};
  let resp = await callNodeRpcFunction({data: body});
  return resp
}
