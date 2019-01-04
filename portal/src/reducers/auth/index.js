import Log from '@/services/log';
import { ACTIONS } from '@/reducers/auth/action';

export default (state = {
  inited: false,
  logged: false,
  // temp
  inited: true,
  logged: true,
  // /temp
  data: {},
}, action) => {
  switch (action.type) {
    case ACTIONS.LOGGED: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
};
