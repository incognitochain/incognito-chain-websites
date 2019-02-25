import { axios } from "services/api";
import Cookies from "js-cookie";
import { API } from "constants/index";
import { isEmpty } from "lodash";

export const ACTIONS = {
  LOGGED: "AUTH_LOGGED"
};

export const checkAuth = () => dispatch => {
  axios
    .get(API.USER_DATA, { timeout: 1000 })
    .then(res => {
      debugger;
      console.log("res", res);
      const { data } = res;
      if (data && !isEmpty(data)) {
        const { Result } = data;
        if (!isEmpty(Result)) {
          dispatch({
            type: ACTIONS.LOGGED,
            logged: true,
            payload: data.Result
          });
          return true;
        }
      }
      dispatch({ type: ACTIONS.LOGGED, logged: false });
      return false;
    })
    .catch(() => {
      debugger;
      dispatch({ type: ACTIONS.LOGGED, logged: false });
    });
};

export const logout = () => {
  Cookies.remove("auth", { domain: ".constant.money", path: "/" });
};
