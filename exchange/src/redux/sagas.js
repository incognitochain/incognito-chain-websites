import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import mailSagas from './mail/saga';

export default function* rootSaga(getState) {
  yield all([
    mailSagas(),
    authSagas()
  ]);
}
