import axios from 'axios';

export default class Market {

  static getOption(func, data){
    //const auth = "Basic " + new Buffer(server.username+':'+server.password).toString('base64');
    let url = 'http://localhost:8888',
    options = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json;charset=UTF-8',
        //'Authorization': auth
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

  static async getMarkets() {

    try{
      const response = await axios(Market.getOption("/exchange/markets"));
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

  static async getSymbolRates(range) {

    try{
      const response = await axios(Market.getOption(`/exchange/symbol_rates?range=${range}`));
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

