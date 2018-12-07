import axios from 'axios';
import auth from '@ui/auth';

export default class Exchange {

  static getOption(param){
    let {method, func, data} = param;
    if(!method)
      method = "GET";

    let authorization = "", token = auth.isLogged();
    if(token){
      authorization = "Bearer " + token;
    }
    
    let url = 'http://localhost:8888',
    options = {
      method: method,
      headers: { 
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': authorization
      }
    };

    if(data){
      options['data'] = data;
    }

    if(func && func.charAt(0) !== "/"){
      url += "/";
    }

    options['url'] = url + func;
    return options;
  }

  static async TradeHistory(symbolCode, page, limit) {
    try{
      const options = {func: `/exchange/market_histories?symbol_code=${symbolCode}&page=${page}&limit=${limit}`};
      const response = await axios(Exchange.getOption(options));
      if (response.status === 200) {
        if(response.data && response.data.Result)
          return response.data.Result;
      }
    }
    catch (e) {
      return { error: true, message: e.message };
    }
    
    return false;
  }

  static async OpenOrders(symbolCode, page, limit) {
    try{
      const options = {func: `/exchange/orders?status=new&symbol_code=${symbolCode}&page=${page}&limit=${limit}`};
      const response = await axios(Exchange.getOption(options));
      if (response.status === 200) {
        if(response.data && response.data.Result)
          return response.data.Result;
      }
    }
    catch (e) {
      return { error: true, message: e.message };
    }
    
    return false;
  }

  static async FilledOrders(symbolCode, page, limit) {
    try{
      const options = {func: `/exchange/orders?status=filled&symbol_code=${symbolCode}&page=${page}&limit=${limit}`};
      const response = await axios(Exchange.getOption(options));
      if (response.status === 200) {
        if(response.data && response.data.Result)
          return response.data.Result;
      }
    }
    catch (e) {
      return { error: true, message: e.message };
    }
    
    return false;
  }

  static async CreateOrder(SymbolCode, Price, Quantity, Type, Side) {
    try{
      const data = Type === 'market' ?  {SymbolCode, Quantity, Type, Side} : {SymbolCode, Price, Quantity, Type, Side};
      const options = {method: 'POST', func: `/exchange/orders`, data};
      const response = await axios(Exchange.getOption(options));
      if (response.status === 200) {
        if(response.data && response.data.Result)
          return response.data.Result;
      }
    }
    catch (e) {
      return { error: true, message: e.message };
    }
    
    return false;
  }
}

