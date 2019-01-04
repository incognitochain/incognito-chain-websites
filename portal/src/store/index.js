import {
  createStore, applyMiddleware, combineReducers, compose,
} from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import reducers from '@/reducers';
import history from '@/store/history';


const rootReducer = combineReducers({
  ...reducers,
});

const store = createStore(
  connectRouter(history)(rootReducer),
  {},
  compose(
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk),
  ),
);

export default store;
