import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';

import userReducer from './store/reducers/user';
import recipeReducer from './store/reducers/recipe';
import reviewReducer from './store/reducers/review';
import commentReducer from './store/reducers/comment';
import fridgeItemReducer from './store/reducers/fridgeItem';
import * as actionCreators from './store/actions/index';

import App from './App';
import reportWebVitals from './reportWebVitals';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const reducer = combineReducers({
  user: userReducer,
  recipe: recipeReducer,
  review: reviewReducer,
  comment: commentReducer,
  fridgeItem: fridgeItemReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

store.dispatch(actionCreators.checkUserStatus());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
