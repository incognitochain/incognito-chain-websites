import axios from 'axios';
import auth from '@ui/auth';

export default class BondMarket {

    static getOption(param){
      let {method, func, data, params} = param;
      if(!method)
        method = "GET";

      let authorization = "", token = auth.isLogged();
      if(token){
        authorization = "Bearer " + token;
      }

      let url = process.env.serviceAPI,
      options = {
        method,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': authorization
        }
      };

      if(data){
        options['data'] = data;
      }
      if(params) {
          options['params'] = params;
      }

      if(func && func.charAt(0) !== "/"){
        url += "/";
      }

      options['url'] = url + func;
      return options;
    }

    static async getBondMarketList() {

        try{
          const response = await axios(BondMarket.getOption({func: "/bond-market/bonds"}));
          if (response.status === 200) {
            if(response.data && response.data.Result)
              return response.data.Result;
          }
        }
        catch (e) {console.log(e);
          return { error: true, message: e.message };
        }

        return false;
    }
    static async buy(params) {

        try{
          const response = await axios(BondMarket.getOption({method: "POST", func: '/bond-market/buy', params}));
          if (response.status === 200) {
            if(response.data && response.data.Result)
              return response.data.Result;
          }
        }
        catch (e) {console.log(e);
          return { error: true, message: e.message };
        }

        return false;
    }

    static async getHistoryList() {

        try{
          const response = await axios(BondMarket.getOption({func: "/bond-market/buy/history"}));
          if (response.status === 200) {
            if(response.data && response.data.Result)
              return response.data.Result;
          }
        }
        catch (e) {console.log(e);
          return { error: true, message: e.message };
        }

        return false;
    }

    static async buyBack(params) {

      try{
        const response = await axios(BondMarket.getOption({method: "POST", func: '/bond-market/buy-back', params}));
        if (response.status === 200) {
          if(response.data && response.data.Result)
            return response.data.Result;
        }
      }
      catch (e) {console.log(e);
        return { error: true, message: e.message };
      }

      return false;
  }
}
