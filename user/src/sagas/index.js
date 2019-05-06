import { takeLatest, all } from 'redux-saga/effects'
import { types as authTypes } from '../actions/auth'
import { types as walletTypes } from '../actions/wallet'
import { types as votingTypes } from '../actions/voting'
import { types as oracleTypes } from '../actions/oracle'
import * as authSagas from './auth'
import * as walletSagas from './wallet'
import * as votingSagas from './voting'
import * as oracleSagas from './oracle'

export default function* rootSaga () {
  yield all([
    takeLatest(authTypes.FIRST_AUTHORIZE, authSagas.firstAuthorize),
    takeLatest(authTypes.LOGIN, authSagas.login),
    takeLatest(authTypes.REGISTER, authSagas.register),
    takeLatest(authTypes.LOGOUT, authSagas.logout),
    takeLatest(authTypes.UPDATE_BIO, authSagas.updateBio),

    takeLatest(walletTypes.LOAD_BALANCES, walletSagas.loadBalances),
    takeLatest(walletTypes.WITHDRAW, walletSagas.withdraw),

    takeLatest(votingTypes.LOAD_VOTING_DATA, votingSagas.loadVotingData),
    takeLatest(votingTypes.APPLY, votingSagas.apply),
    takeLatest(votingTypes.CREATE_GOV_PROPOSAL, votingSagas.createGovProposal),
    takeLatest(votingTypes.CREATE_DCB_PROPOSAL, votingSagas.createDcbProposal),
    takeLatest(votingTypes.LOAD_CANDIDATES, votingSagas.loadCandidates),
    takeLatest(votingTypes.VOTE_CANDIDATE, votingSagas.voteCandidate),

    takeLatest(oracleTypes.LOAD_ORACLE_DATA, oracleSagas.loadOracleData),
  ])
}