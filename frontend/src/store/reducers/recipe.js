import * as actionTypes from '../actions/actionTypes';


const initialState = {
  recipes: [],
  selectedRecipe: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPE:
      return { ...state, selectedRecipe: action.target };
    case actionTypes.RATE_RECIPE: {
      const recipe = state.selectedRecipe;
      return {
        ...state,
        selectedRecipe: {
          ...recipe,
          rating: (recipe.rating * recipe.count_ratings + action.rating) / (recipe.count_ratings + 1),
          count_ratings: recipe.count_ratings + 1,
        }
      };
    }
    case actionTypes.FETCH_ALL_RECIPES:
      return { ...state, recipes: action.recipes };
  }
  return state;
};

export default reducer;