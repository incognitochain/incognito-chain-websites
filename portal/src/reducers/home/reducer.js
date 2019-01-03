/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  updateLoans,
} from './action';

const initialState = {
  loans: [],
};

const homeReducer = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case updateLoans().type:
        draft.loans = action.payload;
        break;
      default:
        break;
    }
  });
};

export default homeReducer;
