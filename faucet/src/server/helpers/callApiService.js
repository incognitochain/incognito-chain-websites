import {REACT_APP_SERVICE_API} from "../constants"
import axios from 'axios';

export async function callAPIService({data = {}, method = "", url = ""}){
  // const token = getCurrentUserToken();
  // if (!token) {
  //   return {error: "unauthorized", data: {}}
  // };

  if (!method) method = "GET";

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      // 'Authorization': `Bearer ${token}`,
    },
    // url: `${process.env.REACT_APP_SERVICE_API}${url}`,
    url: `${REACT_APP_SERVICE_API}${url}`,
    data,
  };
  try {
    const response = await axios(options);
    const {status, data = {}} = response;
    if (!status === 200 || data.Error) {
      return {error:data.Error, data: {}}
    }

    return {result: data.Result, error: ""}
  }
  catch (e) {
    console.log(e)
    return { error: e.message, data: {} };
  }
}
