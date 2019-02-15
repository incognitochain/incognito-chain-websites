import { ACTIONS } from "reducers/auth/action";

export default (
  state = {
    inited: false,
    logged: false,
    data: {}
  },
  action
) => {
  switch (action.type) {
    case ACTIONS.LOGGED: {
      return {
        ...state,
        data: action.payload || {},
        inited: true,
        logged: action.logged
      };
    }
    default: {
      return state;
    }
  }
};
