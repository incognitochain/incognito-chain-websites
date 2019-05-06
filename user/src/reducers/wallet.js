import { types } from "../actions/wallet";

export const initialState = {
  balances: [],
  isLoading: false,
  paymentAddress: "",
  withdrawingBalance: null,
  withdrawDialog: false,
  isWithdrawing: false,
  depositDialog: false,
  error: null,
  withdrawError: null,
}

export default (
  state = initialState,
  action
) => {
  switch (action.type) {
    case types.LOAD_BALANCES: {
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    }
    case types.LOAD_BALANCES_SUCCESS: {
      return {
        ...state,
        error: null,
        balances: action.payload.balances || [],
        paymentAddress: action.payload.paymentAddress || "",
        isLoading: false,
      };
    }
    case types.LOAD_BALANCES_FAILURE: {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }

    case types.DEPOSIT_DIALOG_OPEN: {
      return {
        ...state,
        depositDialog: true,
      };
    }
    case types.DEPOSIT_DIALOG_CLOSE: {
      return {
        ...state,
        depositDialog: false,
      };
    }

    case types.WITHDRAW_DIALOG_OPEN: {
      return {
        ...state,
        withdrawDialog: true,
        withdrawingBalance: action.payload.balance || null,
      };
    }
    case types.WITHDRAW_DIALOG_CLOSE: {
      return {
        ...state,
        withdrawDialog: false,
        withdrawingBalance: null,
      };
    }
    case types.WITHDRAW_REQUEST: {
      return {
        ...state,
        isWithdrawing: true,
      };
    }
    case types.WITHDRAW_SUCCESS: {
      return {
        ...state,
        isWithdrawing: false,
        withdrawDialog: false,
        withdrawingBalance: null,
      };
    }
    case types.WITHDRAW_FAILURE: {
      return {
        ...state,
        isWithdrawing: false,
        withdrawError: action.error || null,
      };
    }

    default: {
      return state;
    }
  }
};
