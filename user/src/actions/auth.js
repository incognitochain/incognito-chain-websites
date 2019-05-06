export const types = {
  FIRST_AUTHORIZE: 'AUTH/FIRST_AUTHORIZE',
  FIRST_AUTHORIZED: 'AUTH/FIRST_AUTHORIZED',

  LOGIN: 'AUTH/LOGIN',
  LOGIN_REQUEST: 'AUTH/LOGIN_REQUEST',
  LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
  LOGIN_FAILURE: 'AUTH/LOGIN_FAILURE',

  REGISTER: 'AUTH/REGISTER',
  REGISTER_REQUEST: 'AUTH/REGISTER_REQUEST',
  REGISTER_SUCCESS: 'AUTH/REGISTER_SUCCESS',
  REGISTER_FAILURE: 'AUTH/REGISTER_FAILURE',

  VERIFY_EMAIL: 'AUTH/VERIFY_EMAIL',
  VERIFY_EMAIL_REQUEST: 'AUTH/VERIFY_EMAIL_REQUEST',
  VERIFY_EMAIL_SUCCESS: 'AUTH/VERIFY_EMAIL_SUCCESS',
  VERIFY_EMAIL_FAILURE: 'AUTH/VERIFY_EMAIL_FAILURE',

  UPDATE_BIO: 'AUTH/UPDATE_BIO',
  UPDATE_BIO_DIALOG_OPEN: 'AUTH/UPDATE_BIO_DIALOG_OPEN',
  UPDATE_BIO_DIALOG_CLOSE: 'AUTH/UPDATE_BIO_DIALOG_CLOSE',
  UPDATE_BIO_REQUEST: 'AUTH/UPDATE_BIO_REQUEST',
  UPDATE_BIO_SUCCESS: 'AUTH/UPDATE_BIO_SUCCESS',
  UPDATE_BIO_FAILURE: 'AUTH/UPDATE_BIO_FAILURE',

  LOGOUT: 'AUTH/LOGOUT'
}

export const actions = {
  firstAuthorize: () => ({ type: types.FIRST_AUTHORIZE }),
  firstAuthorized: () => ({ type: types.FIRST_AUTHORIZED }),

  login: (email, password) => ({ type: types.LOGIN, payload: { email, password } }),
  loginRequest: () => ({ type: types.LOGIN_REQUEST }),
  loginSuccess: (token, profile) => ({ type: types.LOGIN_SUCCESS, payload: { token, profile } }),
  loginFailure: (error) => ({ type: types.LOGIN_FAILURE, error }),

  register: (firstName, lastName, email, newPassword, confirmPassword) => ({ type: types.REGISTER, payload: { firstName, lastName, email, newPassword, confirmPassword } }),
  registerRequest: () => ({ type: types.REGISTER_REQUEST }),
  registerSuccess: (profile) => ({ type: types.REGISTER_SUCCESS, profile }),
  registerFailure: (error) => ({ type: types.REGISTER_FAILURE, error }),

  verifyEmail: (emailToken) => ({ type: types.VERIFY_EMAIL }),
  verifyEmailRequest: () => ({ type: types.VERIFY_EMAIL_REQUEST }),
  verifyEmailSuccess: () => ({ type: types.VERIFY_EMAIL_SUCCESS }),
  verifyEmailFailure: (error) => ({ type: types.VERIFY_EMAIL_FAILURE, error }),

  updateBio: (bio) => ({ type: types.UPDATE_BIO, payload: { bio } }),
  updateBioDialogOpen: () => ({ type: types.UPDATE_BIO_DIALOG_OPEN }),
  updateBioDialogClose: () => ({ type: types.UPDATE_BIO_DIALOG_CLOSE }),
  updateBioRequest: () => ({ type: types.UPDATE_BIO_REQUEST }),
  updateBioSuccess: (profile) => ({ type: types.UPDATE_BIO_SUCCESS, payload: { profile } }),
  updateBioFailure: (error) => ({ type: types.UPDATE_BIO_FAILURE, error }),

  logout: () => ({ type: types.LOGOUT }),
  clearAuthorize: () => ({ type: types.CLEAR_AUTHORIZE })
}