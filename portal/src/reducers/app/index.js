import Log from '@/services/log';
// import { ACTIONS } from './action';
import { ACTIONS as CONSTANT_ACTIONS } from '@/reducers/constant/action';

export default (state = {
  isNotFound: false,
}, action) => {
  Log.Info('Redux action', action);
  switch (action.type) {
    case `${CONSTANT_ACTIONS.CONSTANT_INFO}_FAILED`: {
      return {
        ...state,
        isNotFound: true,
      };
    }
    case `${CONSTANT_ACTIONS.CONSTANT_BLOCKS}_FAILED`: {
      return {
        ...state,
        isNotFound: true,
      };
    }
    case `${CONSTANT_ACTIONS.CONSTANT_BLOCK}_FAILED`: {
      return {
        ...state,
        isNotFound: true,
      };
    }
    case `${CONSTANT_ACTIONS.CONSTANT_TX}_FAILED`: {
      return {
        ...state,
        isNotFound: true,
      };
    }
    case `${CONSTANT_ACTIONS.CONSTANT_CANDIDATE}_FAILED`: {
      return {
        ...state,
        isNotFound: true,
      };
    }
    case `${CONSTANT_ACTIONS.CONSTANT_PRODUCER}_FAILED`: {
      return {
        ...state,
        isNotFound: true,
      };
    }
    default: {
      return state;
    }
  }
};
