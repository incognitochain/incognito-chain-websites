import { axios } from '@/services/api';
import Cookies from 'js-cookie';
import { API } from '@/constants';
import { isEmpty } from 'lodash';

export const ACTIONS = {
  LOGGED: 'AUTH_LOGGED',
};

export const checkAuth = () => dispatch => {
  const auth = Cookies.get('auth');
  axios.get(API.USER_DATA).then(res => {
    const { data } = res;
    if (data && !isEmpty(data)) {
      dispatch({ type: ACTIONS.LOGGED, logged: true, payload: data });
    }
  }).catch(e => {
    dispatch({ type: ACTIONS.LOGGED, logged: false });
  });
};

export const logout = () => {
  Cookies.remove('auth', { domain: '.constant.money', path: '/' });
}
