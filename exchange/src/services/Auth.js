import Cookies from 'js-cookie';
import axios from 'axios';

export default class Auth {

  static getOption(param){
    let {method, func, data} = param;
    if(!method)
      method = "GET";

    let authorization = "", token = Auth.isLogged();
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

    if(func && func.charAt(0) !== "/"){
      url += "/";
    }

    options['url'] = url + func;
    return options;
  }

  static isLogged(){
    const result = Cookies.get('user');
    return result || '';
  }

  static async update(param={}) {
    let data = {};

    if(param.FirstName) data['FirstName'] = param.FirstName;
    if(param.LastName) data['LastName'] = param.LastName;
    if(param.UserName) data['UserName'] = param.UserName;
    if(param.Bio) data['Bio'] = param.Bio;

    try{
      const response = await axios(Auth.getOption({method: "PUT", func: "/auth/update", data}));
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

