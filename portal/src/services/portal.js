import axios from 'axios';
import auth from '@ui/auth';

export default class Portal {
  static getOption(param) {
    let {method, func, data} = param;
    if (!method)
      method = "GET";

    let authorization = "", token = auth.isLogged();
    if (token) {
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

    if (data) {
      options['data'] = data;
    }

    if (func && func.charAt(0) !== "/") {
      url += "/";
    }

    options['url'] = url + func;
    console.log(options);
    return options;
  }

  static async getLoanParams(){
    var data = {}
    try{
      const response = await axios(Portal.getOption({func: `/common/loanparams`, data: data}));
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

  static async createLoanRequest(startDate, endDate, params, loanID, colType, colAmount, loanAmount, keyDigest) {
    var data = {
      "StartDate": startDate,
      "EndDate": endDate,
      "LoanRequest": {
        "Params": params,
        "LoanID": loanID,
        "CollateralType": colType,
        "CollateralAmount": colAmount,
        "LoanAmount": loanAmount,
        "ReceiveAddress": "",
        "KeyDigest": keyDigest,
      }
    }
    try {
      const response = await axios(Portal.getOption({func: `/portal/borrows`, data: data, method: "POST"}));
      if (response.status === 200) {
        if (response.data && response.data.Result) {
          return response.data.Result;
        }
      }
    }
    catch (e) {
      return {error: true, message: e.message};
    }

    return false;
  }

  static async getLoan(borrowId) {
    try {
      const response = await axios(Portal.getOption({func: `/portal/borrows/${borrowId}`}));
      if (response.status === 200) {
        if (response.data && response.data.Result) {
          return response.data.Result;
        } else {
          if (response.data && response.data.Error) {
            throw response.data.Error;
          } else {
            throw "Can not get data of load detail";
          }
        }
      }
      throw "Can not get data of load detail";
    }
    catch (e) {
      return {error: true, message: e.message};
    }
  }

  static async payLoan(borrowId) {
    try {
      const response = await axios(Portal.getOption({func: `/portal/borrows/${borrowId}/pay`, data: {}, method: "POST"}));
      if (response.status === 200) {
        if (response.data && response.data.Result) {
          return response.data.Result;
        } else {
          if (response.data && response.data.Error) {
            throw response.data.Error;
          } else {
            throw "Can not get data of load detail";
          }
        }
      }
      throw "Can not get data of load detail";
    }
    catch (e) {
      throw e;
    }
  }
}
