import axios from 'axios';
import {API} from '../constants'

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
  let realAmount = Number(amount);

  if (balance.SymbolName === "CONST") {
    realAmount *= 100;
  }
  const data = {
    IsPrivacy: false,
    Amount: realAmount,
    TokenID: balance.TokenID,
    PaymentAddress: paymentAddress,
  }
  // debugger;
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
