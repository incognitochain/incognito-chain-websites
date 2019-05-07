import axios from 'axios';
import {API} from '../constants'

export async function getOracleMetadatas(token, perPage = 10, page = 1) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.ORACLE_METADATAS}?page=${page}&limit=${perPage}`,
  };
  const response = await axios(options);
  return response
}

export async function checkIsUserInBoard(token) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.ORACLE_IS_IN_BOARD,
  };
  const response = await axios(options);
  return response
}

export async function createAndSignMetadata(token, pubkeys = [], action = "", bio) {
  const data = {
    Action: action,
    PubKeys: pubkeys,
    Bio: bio,
  }

  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.ORACLE_CREATE_AND_SIGN_METADATA,
    data
  };

  const response = await axios(options);
  return response
}

export async function signMetadata(token, id) {
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.ORACLE_SIGN_METADATA}/${id}`,
  };

  const response = await axios(options);
  return response
}

export async function feedPrice(token, price, asset = "") {
  const data = {
    Price: price,
    Asset: asset,
  }
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.ORACLE_FEED_PRICE}`,
    data
  };
  let response = null;
  try {
    response = await axios(options);
  } catch (error) {
    throw error
  }
  return response
}

export async function getMetadataDetail(token, id) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.ORACLE_DETAIL}/${id}`,
  };

  const response = await axios(options);
  return response
}

export async function getAssets(token) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.ORACLE_ASSETS}`,
  };

  const response = await axios(options);
  return response
}

export async function getCurrentPrice(token) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.ORACLE_CURRENT_PRICES}`,
  };

  const response = await axios(options);
  return response
}

export async function getFeedPriceHistory(token, perPage = 10, page = 1, assetType = "") {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.ORACLE_FEED_PRICE}?page=${page}&limit=${perPage}&asset_type=${assetType}`,
  };

  const response = await axios(options);
  return response
}
