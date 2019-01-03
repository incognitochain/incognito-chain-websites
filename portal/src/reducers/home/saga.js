import { takeLatest, put } from 'redux-saga/effects';
import { apiSaga } from '@/store/api';


import {
  apiLoadLoans,
  loadLoanList,
  updateLoans,
} from './action';

function* handleLoadLoans() {
  try {
    const { Result } = yield apiSaga(apiLoadLoans());

    yield put(updateLoans(Result));
  } catch (e) {
    console.error(e);
  }
}

export default function* createHomeSaga() {
  yield takeLatest(loadLoanList().type, handleLoadLoans);

}
