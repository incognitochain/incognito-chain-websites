import { types } from "../actions/auth";

export default (
  state = {
    firstAuthorized: false,
    profile: {},
    accessToken: "",
    isAuthorized: false,
    isLoading: false,
    loginError: null,
    registerError: null,
    verifyEmailError: null,

    isUpdatingBio: false,
    bioDialog: false,
  },
  action
) => {
  switch (action.type) {
    case types.LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
        isAuthorized: false,
      };
    }
    case types.LOGIN_SUCCESS: {
      return {
        ...state,
        profile: action.payload.profile || {},
        accessToken: action.payload.token || "",
        isAuthorized: true,
        isLoading: false,
      };
    }
    case types.LOGIN_FAILURE: {
      return {
        ...state,
        isAuthorized: false,
        isLoading: false,
        loginError: action.error || null,
      };
    }
    case types.REGISTER_REQUEST:
    case types.VERIFY_EMAIL_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case types.REGISTER_SUCCESS: 
    case types.VERIFY_EMAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case types.REGISTER_FAILURE: {
      return {
        ...state,
        isLoading: false,
        registerError: action.error || null,
      };
    }
    case types.VERIFY_EMAIL_FAILURE: {
      return {
        ...state,
        isLoading: false,
        verifyEmailError: action.error || null,
      };
    }

    case types.UPDATE_BIO_DIALOG_OPEN: {
      return {
        ...state,
        bioDialog: true,
      };
    }
    case types.UPDATE_BIO_DIALOG_CLOSE: {
      return {
        ...state,
        bioDialog: false,
      };
    }
    case types.UPDATE_BIO_REQUEST: {
      return {
        ...state,
        isUpdatingBio: true,
      };
    }
    case types.UPDATE_BIO_SUCCESS: {
      return {
        ...state,
        profile: action.payload.profile || {},
        isUpdatingBio: false,
        bioDialog: false,
      };
    }
    case types.UPDATE_BIO_FAILURE: {
      return {
        ...state,
        isUpdatingBio: false,
        updateBioError: action.error || null,
      };
    }

    case types.FIRST_AUTHORIZED: {
      return {
        ...state,
        firstAuthorized: true,
      };
    }
    case types.LOGOUT: {
      return {
        ...state,
        isAuthorized: false,
        profile: {},
        token: "",
      };
    }
    default: {
      return state;
    }
  }
};
