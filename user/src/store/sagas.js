import {spawn} from 'redux-saga/effects';
import authSagas from '../reducers/auth/saga';
import homeSagas from 'reducers/home/saga';

export default function* rootSaga() {
  yield spawn(authSagas);
  yield spawn(homeSagas);
}
