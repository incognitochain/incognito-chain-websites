import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import reducers from "reducers";
import history from "store/history";

const rootReducer = combineReducers({
  ...reducers,
  router: connectRouter(history)
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  {},
  composeEnhancers(
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk)
  )
);

export default store;
