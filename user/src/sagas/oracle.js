import { select, put, call } from 'redux-saga/effects'
import { actions } from '../actions/oracle'
import * as services from '../services/oracle'

export function* loadOracleData() {
  const state = yield select();
  const { accessToken: token } = state.auth

  // check user is in board
  const resp = yield call(services.checkIsUserInBoard, token)
  const isUserInBoard = !!resp.data.Result
  yield put(actions.isUserInBoard(isUserInBoard))
}

export function* checkUserInBoard() {
  const state = yield select();
  const { accessToken: token } = state.auth

  // check user is in board
  const resp = yield call(services.checkIsUserInBoard, token)
  const isUserInBoard = !!resp.data.Result
  yield put(actions.isUserInBoard(isUserInBoard))
}