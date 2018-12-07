import axios from 'axios';
import auth from '@ui/auth';

export default class Voting {

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
      method,
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
    console.log(options);
    return options;
  }

  static async getBalances() {

    try{
      const response = await axios(Wallet.getOption({func: "/wallet/balances"}));
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

  static async send(PaymentAddress, Amount) {
    let data = {
      "Type": 0,
      "TokenID": "TokenID.....",
      "PaymentAddresses": {
        [PaymentAddress]:  Number(Amount)
      }
    };

    try{
      const response = await axios(Wallet.getOption({method: "POST", func: "/wallet/send", data}));
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

