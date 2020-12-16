import axios from 'axios';
import * as actionTypes from './actionTypes';


const authorize = (responseData) => {
  return {
    type: actionTypes.SIGN_IN,
    id: responseData.user_id,
    name: responseData.username,
  };
};

export const signin = (requestData) => {
  return dispatch => {
    return axios.post('/api/user/signin/', requestData)
      .then(response => {
        dispatch(authorize(response.data));
        return response;
      });
  };
};


const unauthorize = () => {
  return { type: actionTypes.SIGN_OUT };
};

export const signout = () => {
  return dispatch => {
    return axios.get('/api/user/signout/')
      .then(response => {
        dispatch(unauthorize());
        return response;
      });
  };
};


export const checkUserStatus = () => {
  return dispatch => {
    return axios.get('/api/user/status/')
      .then(response => {
        dispatch(authorize(response.data));
        return response;
      })
      .catch(error => {
        dispatch(unauthorize());
        return error;
      });
  };
};


const notification_ = (noti) => {
  return {
    type: actionTypes.GET_NOTIFICATION,
    noti: noti,
  };
};

export const notification = (userId) => {
  return dispatch => {
    return axios.get(`/api/user/${userId}/notification/`)
      .then(response => {
        dispatch(notification_(response.data));
        return response;
      });
  };
};


const getRecommendation_ = (recommendation) => {
  return {
    type: actionTypes.GET_RECOMMENDATION,
    recommendation,
  };
};

export const getRecommendation = () => {
  return dispatch => {
    return axios.get('/api/recommendation/')
      .then(response => {
        dispatch(getRecommendation_(response.data));
        return response;
      });
  };
};


export const setTabIndex = (index) => {
  return {
    type: actionTypes.SET_TAB_INDEX,
    index,
  };
};