import * as actionTypes from './actionTypes';
import axios from 'axios';


const selectRecipeById_ = (recipe) => {
  return { type: actionTypes.GET_RECIPE, target: recipe };
};

export const selectRecipeById = (id) => {
  return dispatch => {
    return axios.get(`/api/recipe/${id}/`)
      .then(response => {
        dispatch(selectRecipeById_(response.data));
        return response;
      });
  };
};


const addRecipeRatingById_ = (rating) => {
  return { type: actionTypes.RATE_RECIPE, rating };
};

export const addRecipeRatingById = (id, rating) => {
  return dispatch => {
    return axios.put(`/api/recipe/${id}/`, { rating })
      .then(response => {
        dispatch(addRecipeRatingById_(rating));
        return response;
      });
  };
};


const fetchAllRecipes_ = (response_data) => {
  return { type: actionTypes.FETCH_ALL_RECIPES, recipes: response_data };
};

export const fetchAllRecipes = () => {
  return dispatch => {
    return axios.get('/api/recipe/')
      .then(response => {
        dispatch(fetchAllRecipes_(response.data));
        return response;
      });
  };
};