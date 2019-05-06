import { put, call, select } from 'redux-saga/effects'
import Cookies from "js-cookie";
import { toaster } from "evergreen-ui";
import { actions } from '../actions/auth'
import { actions as votingActions } from '../actions/voting'
import { actions as oracleActions } from '../actions/oracle'
import * as services from '../services/auth'
import { history } from '../store'


const domain = process.env.REACT_APP_DOMAIN;

export function* firstAuthorize(action) {
  try {
    const token = Cookies.get('token');
    if (token) {
      const resp = yield call(services.profile, token)
      if (!resp.data.Error) {
        const profile = resp.data.Result
        yield put(actions.loginSuccess(token, profile))

        yield put(votingActions.loadVotingData())
        yield put(oracleActions.loadOracleData())
        // redirect to home
        //console.log('call redirect', action.payload && action.payload.path ? action.payload.path : '/')
        //yield call(history.push, action.payload && action.payload.path ? action.payload.path : '/')
      }
    }
  } catch (e) {
    console.log("first authorize failed: ", e.message)
  }
  yield put(actions.firstAuthorized())
}

export function* login(action) {
  const { email, password } = action.payload
  yield put(actions.loginRequest())
  try {
    const resp = yield services.login(email, password)
    if (resp.data.Error != null) {
      yield put(actions.loginFailure(resp.data.Error.Message))
    } else {
      const token = resp.data.Result.Token
      Cookies.set("token", token, {
        domain: domain,
        expires: 30
      });
      // todo Cookie storage token
      const respProfile = yield services.profile(token)
      if (respProfile.Error != null) {
        yield put(actions.loginFailure(respProfile.Error.Message))
      } else {
        const profile = respProfile.data.Result
        yield put(actions.loginSuccess(token, profile))

        yield put(votingActions.loadVotingData())
        yield put(oracleActions.loadOracleData())
        
        // redirect to home
        const state = yield select()
        const params = new URLSearchParams(state.router.location.search);
        const path = params.get('redirect') || '/'
        yield call(history.push, path)
      }
    }
  } catch (e) {
    yield put(actions.loginFailure(e.message))
  }
}

export function* register(action) {
  const { firstName, lastName, email, newPassword, confirmPassword } = action.payload
  yield put(actions.registerRequest())
  try {
    const resp = yield services.register(firstName, lastName, email, newPassword, confirmPassword)
    if (resp.data.Error != null) {
      yield put(actions.registerFailure(resp.data.Error.Message))
    } else {
      yield put(actions.registerSuccess())
      // redirect to login page
      yield call(history.push, '/login')
    }
  } catch (e) {
    yield put(actions.registerFailure(e.message))
  }
}

export function* verifyEmail(action) {
  const { emailToken } = action.payload
  yield put(actions.verifyEmailRequest())
  try {
    const resp = yield services.verifyEmail(emailToken)
    if (resp.data.Error != null) {
      yield put(actions.verifyEmailFailure(resp.data.Error.Message))
    } else {
      yield put(actions.verifyEmailSuccess())
      // redirect to home
      yield call(history.push, '/login')
    }
  } catch (e) {
    yield put(actions.verifyEmailFailure(e.message))
  }
}

export function* updateBio(action) {
  const state = yield select()
  const { accessToken: token } = state.auth
  yield put(actions.updateBioRequest())
  try {
    const data = {
      Bio: action.payload.bio
    }
    const resp = yield call(services.update, token, data)
    if (resp.data.Error) {
      yield put(actions.updateBioFailure(resp.data.Error.Message))
    } else {
      const profileResp = yield call(services.profile, token)
      if (resp.data.Error) {
        yield put(actions.updateBioFailure(resp.data.Error.Message))
        yield call(toaster.warning, "Error update profile")
        // redirect to home
        //console.log('call redirect', action.payload && action.payload.path ? action.payload.path : '/')
        //yield call(history.push, action.payload && action.payload.path ? action.payload.path : '/')
      } else {
        const profile = profileResp.data.Result
        yield put(actions.updateBioSuccess(profile))
        yield call(toaster.success, "Updated your bio");
      }
    }
  } catch (e) {
    yield put(actions.updateBioFailure(e.message))
    yield call(toaster.warning, "Error update profile");
  }
}

export function* logout() {
  yield call(Cookies.remove, 'token', { domain, path: '/' });
}