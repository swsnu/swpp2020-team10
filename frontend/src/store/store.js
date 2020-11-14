import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import userReducer from './reducers/user';
import recipeReducer from './reducers/recipe';
import reviewReducer from './reducers/review';
import commentReducer from './reducers/comment';
import fridgeItemReducer from './reducers/fridgeItem';

const reducer = combineReducers({
  user: userReducer,
  recipe: recipeReducer,
  review: reviewReducer,
  comment: commentReducer,
  fridgeItem: fridgeItemReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
export default store;