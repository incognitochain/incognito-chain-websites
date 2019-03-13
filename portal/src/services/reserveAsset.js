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
    url: `${process.env.serviceAPI}${url}`,
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

export async function buyAsset(assetType, amount) {
  let data = {
    "BuyingAsset" : assetType,
    "Amount": amount,
  }

  const result = await callAPIService({data, method: "POST", url:"/reserves/purchase"});
  return result;
}
