import axios from 'axios';
import auth from '@ui/auth';

// const BoardType = {
//   DCB: 1,
//   MCB: 2,
//   GOV: 3
// }
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
    return options;
  }

  static async listCookedCandidate(){
    let list = [];
    const result = await this.listCandidate();
    if(result){
      for(let c of result){
        list.push(c.User);
      }
      console.log('listCookedCandidate', list);
      return list;  
    }

    return list;
  }

  static async listCandidate() {
    try{
      const response = await axios(Voting.getOption({func: "/voting/candidates"}));
      if (response.status === 200) {console.log('listCandidate', response.data.Result);
        if(response.data && response.data.Result)
          return response.data.Result;
      }
    }
    catch (e) {console.log(e);
      return { error: true, message: e.message };
    }
    
    return false;
  }

  static async createCandidate(PaymentAddress, BoardType) {
    let data = {
      BoardType,
      PaymentAddress
    };

    try{
      const response = await axios(Voting.getOption({method: "POST", func: "/voting/candidate", data}));//console.log(response);
      if (response.status === 200) {
        if(response.data && response.data.Result){
          return response.data.Result;
        }
      }
    }
    catch (e) {console.log(e);
      return { error: true, message: e.message };
    }
    
    return false;
  }

  static async myCandidate() {
    let data = {};

    try{
      const response = await axios(Voting.getOption({method: "GET", func: "/voting/my_candidate", data}));//console.log(response);
      if (response.status === 200) {
        if(response.data && response.data.Result){
          return response.data.Result;
        }
      }
    }
    catch (e) {console.log(e);
      return { error: true, message: e.message };
    }
    
    return false;
  }
}