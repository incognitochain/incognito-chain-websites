import {REACT_APP_SERVICE_API} from "../constants"
import axios from 'axios';

export async function callNodeRpcFunction({data = {}, method = "POST"}) {
  if (!method) method = "POST";

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: `${process.env.REACT_APP_BLOCKCHAIN_API}`,
    data,
  };
  try {
    const response = await axios(options);
    const {status, data = {}} = response;
    if (!status === 200 || data.Error) {
      const {Message = ""} = data.Error
      return {error: Message, data: {}}
    }

    return {result: data.Result, error: ""}
  } catch (e) {
    console.log(e)
    return {error: e.message, data: {}};
  }
}
