import Log from '@/services/log';
import { ACTIONS } from '@/reducers/app/action';

export default (state = {
  isNotFound: false,
}, action) => {
  Log.Info('Redux action', action);
  switch (action.type) {
    default: {
      return state;
    }
  }
};
