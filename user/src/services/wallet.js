import axios from 'axios';
import { API } from '../constants'

export const loadBalances = async (token) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
    url: API.WALLET_BALANCES,
  };
  const response = await axios(options);
  return response
}

export const withdraw = async (token, balance = {}, paymentAddress = "", amount = 1, isPrivacy = false) => {
  const data = {
    IsPrivacy: false,
    Amount: amount,
    TokenID: balance.TokenID,
    PaymentAddress: paymentAddress,
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
    url: API.WALLET_WITHDRAW,
    data,
  };
  const response = await axios(options);
  return response
}