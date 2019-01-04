import rawAxios from 'axios';
import Cookies, { get } from 'js-cookie';
import auth from '@ui/auth';
import { BASE_API, APP } from '@/constants';

let authorization = "";
let token = auth.isLogged();
if (token) {
  authorization = `Bearer ${token}`;
}

export const axios = rawAxios.create({
  TIMEOUT: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': authorization
  },
});
