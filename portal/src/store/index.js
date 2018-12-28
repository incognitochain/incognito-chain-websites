import {
  createStore, applyMiddleware, combineReducers, compose,
} from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import reducers from '@/reducers';
import createSagaMiddleware from 'redux-saga';
import history from './history';
import rootSaga from './sagas';

const rootReducer = combineReducers({
  ...reducers,
});
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  connectRouter(history)(rootReducer),
  {},
  compose(
    applyMiddleware(thunk, routerMiddleware(history), sagaMiddleware)
  )
);

sagaMiddleware.run(rootSaga);

export default store;

/*import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducers from '../reducers';
import rootSaga from './sagas';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, sagaMiddleware, routeMiddleware];

const store = createStore(
  combineReducers({
      ...reducers,
    router: routerReducer
  }),
  compose(
    applyMiddleware(...middlewares),
    applyMiddleware(thunk),
  )
);

//store.subscribe(data => console.log('STORE', store.getState()));
sagaMiddleware.run(rootSaga);
export { store, history };*/
