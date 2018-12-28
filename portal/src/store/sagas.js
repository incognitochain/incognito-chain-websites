import {spawn} from 'redux-saga/effects';
import authSagas from '../reducers/auth/saga';

export default function* rootSaga() {
  yield spawn(authSagas);
}
