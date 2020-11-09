import * as actionTypes from './actionTypes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const selectRecipeById_ = (recipe) => {
  return { type: actionTypes.GET_RECIPE, target: recipe };
};

export const selectRecipeById = (id) => {
  return dispatch => {
    return axios.get('/api/recipe/' + id + '/')
      .then(response => {
        dispatch(selectRecipeById_(response.data));
      });
  };
};


const addRecipeRatingById_ = (id) => {
  return { type: actionTypes.RATE_RECIPE, targetId: id };
};

export const addRecipeRatingById = (id, recipe) => {
  return dispatch => {
    return axios.put('/api/recipe/' + id + '/', {'recipe_id': recipe.id, 'rating': recipe.rating})
      .then(() => {
        dispatch(addRecipeRatingById_(id));
      });
  };
};


const fetchAllRecipes_ = (response_data) => {
  return { type: actionTypes.FETCH_ALL_RECIPES, recipes: response_data };
};

export const fetchAllRecipes = () => {
  return dispatch => {
    return axios.get('/api/recipes/')
      .then(response => {
        dispatch(fetchAllRecipes_(response.data));
      });
  };
};