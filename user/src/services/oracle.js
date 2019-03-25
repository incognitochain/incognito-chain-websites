import axios from 'axios';
import Cookies from 'js-cookie';

function getCurrentUserToken() {
  const result = Cookies.get('user');
  return result || '';
}

async function callAPIService({data = {}, method = "", url = ""}){
  const token = getCurrentUserToken();
  if (!token) {
    return {error: "unauthorized", data: {}}
  };

  if (!method) method = "GET";

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${process.env.REACT_APP_SERVICE_API}${url}`,
    data,
  };

  try {
    const response = await axios(options);
    const {status, data = {}} = response;
    if (!status === 200 || data.Error) {
      return {error:data.Error, data: {}}
    }

    return {result: data.Result, error: ""}
  }
  catch (e) {
    console.log(e)
    return { error: e.message, data: {} };
  }
}

export async function getOracleMetadatas(perPage=10, page = 1){
  let url = `/oracle/metadatas?page=${page}&limit=${perPage}`;
  const result = await callAPIService({data: {}, method: "GET", url});
  return result;
}

export async function checkIsUserInBoard(){
  let url = `/oracle/is-in-board`;
  const result = await callAPIService({data: {}, method: "GET", url});
  return result;
}

export async function createAndSignMetadata(pubkeys=[], action="", bio){
  if (pubkeys == null || pubkeys.length <= 0) return;
  let url = `/oracle/create-and-sign-md`;
  const result = await callAPIService({data: {
    Action: action,
    PubKeys: pubkeys,
    Bio: bio,
  }, method: "POST", url});
  return result;
}

export async function signMetadata(id){
  if (!id) return;
  let url = `/oracle/sign-md/${id}`;
  const result = await callAPIService({data: {}, method: "POST", url});
  return result;
}

export async function feedPrice(price,asset=""){
  if (!asset) return;

  let url = `/oracle/feed-price`;
  const result = await callAPIService({data: {
    Price: price,
    Asset: asset,
  }, method: "POST", url});
  return result;
}

export async function getMetadataDetail(id){
  if (!id) return;
  let url = `/oracle/detail/${id}`;
  const result = await callAPIService({data: {}, method: "GET", url});
  return result;
}

export async function getAssets(){
  let url = `/oracle/assets`;
  const result = await callAPIService({data: {}, method: "GET", url});
  return result;
}
