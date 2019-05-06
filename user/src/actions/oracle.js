export const types = {
  LOAD_ORACLE_DATA: 'ORACLE/LOAD_DATA',
  CHECK_USER_IN_BOARD: 'ORACLE/CHECK_USER_IN_BOARD',
  IS_USER_IN_BOARD: 'ORACLE/IS_USER_IN_BOARD',
}

export const actions = {
  loadOracleData : () => ({ type: types.LOAD_ORACLE_DATA }),
  checkUserInBoard: () => ({ type: types.CHECK_USER_IN_BOARD }),
  isUserInBoard: (isUserInBoard) => ({ type: types.IS_USER_IN_BOARD, payload: { isUserInBoard } }),
}