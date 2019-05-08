import {select, put, call} from 'redux-saga/effects'
import {toaster} from "evergreen-ui";
import {actions} from '../actions/wallet'
import * as services from '../services/wallet'

export function* loadBalances() {
  yield put(actions.loadBalancesRequest())
  try {
    const state = yield select();
    const response = yield call(services.loadBalances, state.auth.accessToken)
    if (response.data.Error) {
      yield put(actions.loadBalancesFailure(response.data.Error.Message))
    } else {
      const {ListBalances, PaymentAddress} = response.data.Result
      yield put(actions.loadBalancesSuccess(
        Object.keys(ListBalances).map(key => ListBalances[key]),
        PaymentAddress
      ))
    }
  } catch (e) {
    yield put(actions.loadBalancesFailure(e.message))
  }
}

export function* withdraw(action) {
  const state = yield select()
  const {accessToken: token} = state.auth
  const {withdrawingBalance, withdrawAddress, withdrawAmount} = action.payload
  yield put(actions.withdrawRequest())
  try {
    const resp = yield call(services.withdraw, token, withdrawingBalance, withdrawAddress, withdrawAmount)
    if (resp.data.Error) {
      yield put(actions.withdrawFailure(resp.data.Error.Message))
    } else {
      yield put(actions.withdrawSuccess())
      yield call(toaster.success, "Apply success!");
    }
  } catch (e) {
    yield put(actions.withdrawFailure(e.message))
    yield call(toaster.danger, "Apply error. Please try again later!")
  }
}
