import * as actionTypes from '../actions/actionTypes';

const initialState = {
  recipes: [],
  selectedRecipe: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPE:
    return {...state, selectedRecipe: action.target};
    case actionTypes.RATE_RECIPE:
    const modified = state.recipes.map((recipe) => {
      if (recipe.id == action.targetID) {
        return {...recipe, count_ratings: recipe.count_ratings + 1,
          rating: (recipe.rating * recipe.count_ratings + action.rating) / (recipe.count_ratings + 1)};
        } else {
          return {...recipe};
        }
      });
      return {...state, recipes: modified};
      default:
      break;
    }
    return state;
  };
  
  export default reducer;