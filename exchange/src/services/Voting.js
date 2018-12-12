import axios from 'axios';
import auth from '@ui/auth';

// const BoardType = {
//   DCB: 1,
//   CMB: 2,
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

    options['url'] = url + func;console.log(options);
    return options;
  }

  static async listCookedCandidate(boardType){
    let list = [];
    const result = await this.listCandidate(boardType);console.log(result);
    
    if(result){
      if(result.error){
        return {error: true, message: 'Please login first'};
      }
      else{
        for(let c of result){
        
          list.push({...c.User, 
            VoteNum: c.VoteNum,
            CMB: c.CMB,
            GOV: c.GOV,
            DCB: c.DCB,
            Date: "2016-09-08T16:33:08.696Z"
          });
        }
      }
    }

    return list;
  }

  static async listProposal(BoardType) {
    let data = {
      BoardType
    };

    try{
      const response = await axios(Voting.getOption({func: "/voting/proposals", data}));
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

  static async listCandidate(BoardType) {
    let data = {
      BoardType
    };

    try{
      const response = await axios(Voting.getOption({func: "/voting/candidates", data}));
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

  static async voteCandidate(BoardType, CandidateID, VoteAmount) {
    let data = {
      BoardType,
      CandidateID,
      VoteAmount
    };

    try{
      const response = await axios(Voting.getOption({method: "POST", func: "/voting/candidate/vote", data}));
      if (response.status === 200) {
        if(response.data && response.data.Result){
          return response.data.Result;
        }
      }
    }
    catch (e) {
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
      const response = await axios(Voting.getOption({method: "POST", func: "/voting/candidate", data}));
      if (response.status === 200) {
        if(response.data && response.data.Result){
          return response.data.Result;
        }
      }
    }
    catch (e) {
      return { error: true, message: e.message };
    }
    
    return false;
  }

  static async createProposal(BoardType) {

    let url = "/voting/dcbparams";
    if(BoardType == 2) url = "/voting/govparams";

    try{
      const response = await axios(Voting.getOption({method: "GET", func: url}));
      if (response.status === 200) {
        if(response.data && response.data.Result){
          return response.data.Result;
        }
      }
    }
    catch (e) {
      return { error: true, message: e.message };
    }
    
    return false;
  }

  static async submitProposal(Type, nameProposal, Prosposal) {

    let data = {
      "Type": Type,
      "Name": nameProposal
    };

    if(Type == 1) data['DCB'] = Prosposal;
    else data['GOV'] = Prosposal;

    try{
      const response = await axios(Voting.getOption({method: "POST", func: "/voting/proposal", data}));
      if (response.status === 200) {
        if(response.data && response.data.Result){
          return response.data.Result;
        }
      }
    }
    catch (e) {
      return { error: true, message: e.message };
    }
    
    return false;
  }


  static async myCandidate() {
    let data = {};

    try{
      const response = await axios(Voting.getOption({method: "GET", func: "/voting/my_candidate", data}));
      if (response.status === 200) {
        if(response.data && response.data.Result){
          return response.data.Result;
        }
      }
    }
    catch (e) {
      return { error: true, message: e.message };
    }
    
    return false;
  }
}