import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getFridgeItemList_ = (fridgeItems) => {
  return { type: actionTypes.GET_FRIDGE_ITEMS, fridgeItems };
};

export const getFridgeItemList = (userId) => {
  return dispatch => {
    return axios.get(`/api/fridge/${userId}/user/`)
      .then(response => {
        dispatch(getFridgeItemList_(response.data));
      });
  };
};

export const getFridgeItem_ = (fridgeItem) => {
  return { type: actionTypes.GET_FRIDGE_ITEM, fridgeItem };
};

export const getFridgeItem = (fridgeItemId) => {
  return dispatch => {
    return axios.get(`/api/fridge/item/${fridgeItemId}/`)
      .then(response => {
        dispatch(getFridgeItem_(response.data));
      });
  };
};

export const postFridgeItem_ = (fridgeItem) => {
  return { type: actionTypes.ADD_FRIDGE_ITEM, fridgeItem };
};

export const postFridgeItem = (userId, fridgeItem) => {
  return dispatch => {
    return axios.post(`/api/fridge/${userId}/user/`, fridgeItem)
      .then(response => {
        dispatch(postFridgeItem_(response.data));
      });
  };
};

export const editFridgeItem_ = (fridgeItem) => {
  return { type: actionTypes.EDIT_FRIDGE_ITEM, fridgeItem };
};

export const editFridgeItem = (fridgeItemId, fridgeItem) => {
  return dispatch => {
    return axios.put(`/api/fridge/item/${fridgeItemId}/`, fridgeItem)
      .then(() => {
        dispatch(editFridgeItem_(fridgeItem));
      });
  };
};

export const deleteFridgeItem_ = (fridgeItemId) => {
  return { type: actionTypes.DELETE_FRIDGE_ITEM, targetId: fridgeItemId };
};

export const deleteFridgeItem = (fridgeItemId) => {
  return dispatch => {
    return axios.delete(`/api/fridge/item/${fridgeItemId}/`)
      .then(() => {
        dispatch(deleteFridgeItem_(fridgeItemId));
      });
  };
};

export const clearFridgeItems_ = () => {
  return { type: actionTypes.CLEAR_FRIDGE_ITEMS };
};

export const clearFridgeItems = (userId) => {
  return dispatch => {
    return axios.delete(`/api/fridge/${userId}/user/`)
      .then(() => {
        dispatch(clearFridgeItems_());
      });
  };
};