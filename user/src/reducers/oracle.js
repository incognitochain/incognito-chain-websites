import { types } from "../actions/voting";

import { types as authTypes } from "../actions/auth";

export const initialState = {
  isUserInBoard: false,
}

export default (
  state = initialState,
  action
) => {
  switch (action.type) {
    case types.IS_USER_IN_BOARD: {
      return {
        ...state,
        isUserInBoard: action.payload.isUserInBoard || false,
      }
    }

    case authTypes.LOGOUT: {
      return {
        ...state,
        ...initialState
      };
    }

    default: {
      return state;
    }
  }
};
