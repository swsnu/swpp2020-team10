import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';                                           
//import * as actionTypes from '../store/actions/actionTypes';

const getMockRecipeReducer = jest.fn(
  initialstate => (state = initialstate, action) => {
    switch (action.type){
      default:
        break;
    }
    return state;
  }
);

const getMockReviewReducer = jest.fn(
  initialstate => (state = initialstate, action) => {
    switch (action.type){
      default:
        break;
    }
    return state;
  }
);

const getMockCommentReducer = jest.fn(
  initialstate => (state = initialstate, action) => {
    switch (action.type){
      default:
        break;
    }
    return state;
  }
);

const getMockUserReducer = jest.fn(
  initialstate => (state = initialstate, action) => {
    switch (action.type){
      default:
        break;
    }
    return state;
  }
);
  
export const getMockStore = (initialstate) => {
  const mockUserReducer = getMockUserReducer(initialstate);
  const mockRecipeReducer = getMockRecipeReducer(initialstate);
  const mockReviewReducer = getMockReviewReducer(initialstate);
  const mockCommentReducer = getMockCommentReducer(initialstate);
  const rootReducer = combineReducers({
    user: mockUserReducer,
    recipe: mockRecipeReducer,
    review: mockReviewReducer,
    comment: mockCommentReducer,
  });
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const mockStore = createStore(rootReducer,
    composeEnhancers(applyMiddleware(thunk)));
  return mockStore;
};