import rawAxios from 'axios';
import { get } from 'js-cookie';
import auth from '@ui/auth';

let authorization = "";
let token = auth.isLogged();
if (token) {
  authorization = "Bearer " + token;
}

export const axios = rawAxios.create({
  timeout: 1800000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': authorization
  },
});
