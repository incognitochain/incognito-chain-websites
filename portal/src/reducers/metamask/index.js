import { ACTIONS } from '@/reducers/metamask/action';
import { isEmpty } from 'lodash';

export default (state = {
  detecting: false,
  installed: false,
  unlocked: false,
  address: '',
  web3: {},
}, action) => {
  switch (action.type) {
    case ACTIONS.METAMASK_DETECTING: {
      return {
        ...state,
        detecting: true,
      };
    }
    case ACTIONS.METAMASK_DETECTED: {
      return {
        ...state,
        detecting: false,
        installed: action.installed || state.installed,
        unlocked: action.unlocked || state.unlocked,
        web3: !isEmpty(action.web3) ? action.web3 : !isEmpty(state.web3) ? state.web3 : {},
        address: action.address || state.address || '',
      };
    }
    default: {
      return state;
    }
  }
};
