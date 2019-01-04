import { axios } from '@/services/api';
import Cookies from 'js-cookie';
import { API } from '@/constants';

export const ACTIONS = {

};

export const checkAuth = () => dispatch => {
  const auth = Cookies.get('auth');
  axios.get(API.USER_DATA).then(res => {
    console.log(res);
  }).catch(e => {

  });
};
