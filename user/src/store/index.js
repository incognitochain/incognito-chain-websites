import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import createSagaMiddleware from 'redux-saga'
import reducers from "../reducers";
import rootSaga from '../sagas';

export const history = createBrowserHistory()

const rootReducer = combineReducers({
  ...reducers,
  router: connectRouter(history),
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  {},
  composeEnhancers(
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk),
    applyMiddleware(sagaMiddleware)
  )
);

sagaMiddleware.run(rootSaga)

export default store;
