import * as actionTypes from '../actions/actionTypes';

const initialState = {
  recipes: [],
  selectedRecipe: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPE:
<<<<<<< HEAD
      return {...state, selectedRecipe: action.target};
    case actionTypes.RATE_RECIPE:
      var modified = state.recipes.map((recipe) => {
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
=======
      return { ...state, selectedRecipe: action.target };
    case actionTypes.RATE_RECIPE:
      var modified = state.recipes.map((recipe) => {
        if (recipe.id == action.targetID) {
          return {
            ...recipe,
            count_ratings: recipe.count_ratings + 1,
            rating: (recipe.rating * recipe.count_ratings + action.rating) / (recipe.count_ratings + 1)
          };
        } else {
          return { ...recipe };
        }
      });
      return { ...state, recipes: modified };
    case actionTypes.FETCH_ALL_RECIPES:
      return { ...state, recipes: action.recipes };
>>>>>>> 7998c48d89459634d21a018f81bcb164fae3ff90
  }
  return state;
};

export default reducer;