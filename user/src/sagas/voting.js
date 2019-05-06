import { select, put, call, all } from 'redux-saga/effects'
import { toaster } from "evergreen-ui";
import { actions } from '../actions/voting'
import * as services from '../services/voting'

export function* loadVotingData() {
  const state = yield select();
  const { accessToken: token } = state.auth

  // load user candidate
  yield put(actions.loadUserCandidateRequest())
  const response = yield call(services.loadUserCandidate, token)
  if (response.data.Error) {
    yield put(actions.loadUserCandidateError(response.data.Error.Message))
  } else {
    const userCandidates = response.data.Result || {}
    yield put(actions.loadUserCandidateSuccess(userCandidates))
  }

  // load gov & dcb params
  let govParams = {}
  let dcbParams = {}
  const [ govParamsResp, dcbParamsResp ] = yield all([
    call(services.loadGovParams, token),
    call(services.loadDcbParams, token),
  ])
  // console.log('params', govParamsResp, dcbParamsResp)
  if (!govParamsResp.data.Error) {
    govParams = govParamsResp.data.Result.GOVParams
  }
  if (!dcbParamsResp.data.Error) {
    dcbParams = dcbParamsResp.data.Result.DCBParams
  }
  yield put(actions.updateParams(govParams, dcbParams))

  // load proposal buy & sell assets
  const [ proposalBuyingAssetsResp, proposalSellingAssetsResp ] = yield all([
    call(services.loadProposalBuyingAssets, token),
    call(services.loadProposalSellingAssets, token),
  ])
  //console.log('proposal', proposalBuyingAssetsResp, proposalSellingAssetsResp)

  let proposalBuyingAssets = []
  let proposalSellingAssets = []

  if (!proposalBuyingAssetsResp.data.Error && proposalBuyingAssetsResp.data.Result) {
    proposalBuyingAssets = Object.entries(proposalBuyingAssetsResp.data.Result).map(
      ([key, value]) => ({
        value: value,
        label: key
      })
    )
  }
  if (!proposalSellingAssetsResp.data.Error && proposalSellingAssetsResp.data.Result) {
    proposalSellingAssets = Object.entries(proposalSellingAssetsResp.data.Result).map(
      ([key, value]) => ({
        value: value,
        label: key
      })
    )
  }
  
  yield put(actions.updateProposalAssets(proposalSellingAssets, proposalBuyingAssets))
}

export function* loadCandidates(action) {
  const state = yield select()
  const { accessToken: token } = state.auth
  let { boardType } = action.payload
  if (boardType === "") {
    boardType = state.voting.selectedBoardType
  }
  // load candidates
  yield put(actions.loadCandidatesRequest())
  const response = yield call(services.loadCandidates, token, boardType)
  if (response.data.Error) {
    yield put(actions.loadCandidatesError(response.data.Error.Message))
  } else {
    const candidates = response.data.Result
    yield put(actions.loadCandidatesSuccess(boardType, candidates))
  }
}

export function* loadProposals(action) {
  const state = yield select()
  const { accessToken: token } = state.auth
  let { boardType } = action.payload
  if (boardType === "") {
    boardType = state.voting.selectedBoardType
  }
  // load candidates
  yield put(actions.loadProposalsRequest())
  const response = yield call(services.loadProposals, token, boardType)
  if (response.data.Error) {
    yield put(actions.loadProposalsError(response.data.Error.Message))
  } else {
    const proposals = response.data.Result
    yield put(actions.loadProposalsSuccess(boardType, proposals))
  }
}

export function* voteCandidate(action) {
  const state = yield select()
  const { accessToken: token } = state.auth
  const { boardType, candidate, voteAmount } = action.payload
  yield put(actions.voteCandidateRequest())
  try {
    const resp = yield call(services.voteCandidate, token, boardType, candidate, voteAmount)
    if (resp.data.Error) {
      yield put(actions.voteCandidateFailure(resp.data.Error.Message))
    } else {
      yield put(actions.voteCandidateSuccess())
      yield call(toaster.success, "Vote success!");
      // reload candidates
      yield put(actions.loadCandidates())
    }
  } catch (e) {
    yield put(actions.voteCandidateFailure(e.message))
    yield call(toaster.success, "Vote error. Please try again later!")
  }
}

export function* voteProposal(action) {
  const state = yield select()
  const { accessToken: token } = state.auth
  const { boardType, proposal, voteAmount } = action.payload
  yield put(actions.voteProposalRequest())
  try {
    const resp = yield call(services.voteProposal, token, boardType, proposal, voteAmount)
    if (resp.data.Error) {
      yield put(actions.voteProposalFailure(resp.data.Error.Message))
    } else {
      yield put(actions.voteProposalSuccess())
      yield call(toaster.success, "Vote success!");
      // reload candidates
      yield put(actions.loadProposals())
    }
  } catch (e) {
    yield put(actions.voteProposalFailure(e.message))
    yield call(toaster.success, "Vote error. Please try again later!")
  }
}

export function* apply(action) {
  const state = yield select()
  const { accessToken: token, profile: { PaymentAddress: paymentAddress } } = state.auth
  yield put(actions.applyRequest())
  try {
    const resp = yield call(services.apply, token, paymentAddress, action.payload.boardType)
    if (resp.data.Error) {
      yield put(actions.applyFailure(resp.data.Error.Message))
    } else {
      const userCandidateResp = yield call(services.loadUserCandidate, token)
      if (userCandidateResp.data.Error) {
        yield put(actions.applyFailure(resp.data.Error.Message))
        yield call(toaster.success, "Apply error. Please try again later!")
      } else {
        const userCandidate = userCandidateResp.data.Result
        yield put(actions.applySuccess(userCandidate))
        yield call(toaster.success, "Apply success!");
      }
    }
  } catch (e) {
    yield put(actions.applyFailure(e.message))
    yield call(toaster.success, "Apply error. Please try again later!")
  }
}

export function* createGovProposal(action) {
  const state = yield select()
  const { accessToken: token } = state.auth
  const { name, executeDuration, explanation, govParams } = action.payload
  yield put(actions.createGovProposalRequest())
  try {
    const resp = yield call(services.createGovProposal, token, name, executeDuration, explanation, govParams)
    if (resp.data.Error) {
      yield put(actions.createGovProposalFailure(resp.data.Error.Message))
      yield call(toaster.danger, "Create GOV Proposal Error. Please try again later!")
    } else {
      yield put(actions.createGovProposalSuccess())
      yield call(toaster.success, "Create GOV Proposal success!")
    }
  } catch (e) {
    yield call(toaster.danger, "Create GOV Proposal Error. Please try again later!")
    yield put(actions.createGovProposalFailure(e.message))
  }
}

export function* createDcbProposal(action) {
  const state = yield select()
  const { accessToken: token } = state.auth
  const { name, executeDuration, explanation, dcbParams } = action.payload
  yield put(actions.createDcbProposalRequest())
  try {
    const resp = yield call(services.createDcbProposal, token, name, executeDuration, explanation, dcbParams)
    console.log("create dcb proposal", resp)
    if (resp.data.Error) {
      yield put(actions.createDcbProposalFailure(resp.data.Error.Message))
      yield call(toaster.danger, "Create DCB Proposal Error. Please try again later!")
    } else {
      yield put(actions.createDcbProposalSuccess())
      yield call(toaster.success, "Create DCB Proposal success!");
    }
  } catch (e) {
    yield put(actions.createDcbProposalFailure(e.message))
    yield call(toaster.danger, "Create DCB Proposal Error. Please try again later!")
  }
}