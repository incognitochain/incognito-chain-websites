export const types = {
  LOAD_BALANCES: 'WALLET/LOAD_BALANCES',
  LOAD_BALANCES_REQUEST: 'WALLET/LOAD_BALANCES_REQUEST',
  LOAD_BALANCES_SUCCESS: 'WALLET/LOAD_BALANCES_SUCCESS',
  LOAD_BALANCES_FAILURE: 'WALLET/LOAD_BALANCES_FAILURE',

  DEPOSIT_DIALOG_OPEN: 'WALLET/DEPOSIT_DIALOG_OPEN',
  DEPOSIT_DIALOG_CLOSE: 'WALLET/DEPOSIT_DIALOG_CLOSE',

  WITHDRAW: 'WALLET/WITHDRAW',
  WITHDRAW_DIALOG_OPEN: 'WALLET/WITHDRAW_DIALOG_OPEN',
  WITHDRAW_DIALOG_CLOSE: 'WALLET/WITHDRAW_DIALOG_CLOSE',
  WITHDRAW_REQUEST: 'WALLET/WITHDRAW_REQUEST',
  WITHDRAW_SUCCESS: 'WALLET/WITHDRAW_SUCCESS',
  WITHDRAW_FAILURE: 'WALLET/WITHDRAW_FAILURE',
}

export const actions = {
  loadBalances: () => ({ type: types.LOAD_BALANCES }),
  loadBalancesRequest: () => ({ type: types.LOAD_BALANCES_REQUEST }),
  loadBalancesSuccess: (balances, paymentAddress) => ({ type: types.LOAD_BALANCES_SUCCESS, payload: { balances, paymentAddress } }),
  loadBalancesFailure: (error) => ({ type: types.LOAD_BALANCES_FAILURE, error }),

  depositDialogOpen: () => ({ type: types.DEPOSIT_DIALOG_OPEN }),
  depositDialogClose: () => ({ type: types.DEPOSIT_DIALOG_CLOSE }),

  withdraw: (withdrawAddress, amount) => ({ type: types.WITHDRAW, payload: { withdrawAddress, amount } }),
  withdrawDialogOpen: (balance) => ({ type: types.WITHDRAW_DIALOG_OPEN, payload: { balance } }),
  withdrawDialogClose: () => ({ type: types.WITHDRAW_DIALOG_CLOSE }),
  withdrawRequest: () => ({ type: types.WITHDRAW_REQUEST }),
  withdrawSuccess: () => ({ type: types.WITHDRAW_SUCCESS }),
  withdrawFailure: (error) => ({ type: types.WITHDRAW_FAILURE, error }),
}