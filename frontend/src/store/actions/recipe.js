import * as actionTypes from './actionTypes';
import axios from 'axios';

export const selectRecipeById_ = (recipe) => {
  return {type: actionTypes.GET_RECIPE, target: recipe};
};

export const selectRecipeById = (id) => {
  return dispatch => {
    return axios.get('/api/recipe/' + id + '/')
      .then(response => {
        dispatch(selectRecipeById_(response.data));
      });
  };
};

export const addRecipeRatingById_ = (id) => {
  return {type: actionTypes.RATE_RECIPE, targetId: id};
};

export const addRecipeRatingById = (id, recipe) => {
  return dispatch => {
    return axios.put('/api/recipe/' + id + '/', recipe)
      .then(() => {
        dispatch(addRecipeRatingById_(id));
      });
  };
};