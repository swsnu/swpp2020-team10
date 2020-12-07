import axios from 'axios';
import * as actionTypes from './actionTypes';


const authorize = (response_data) => {
  return {
    type: actionTypes.SIGN_IN,
    id: response_data.user_id,
    name: response_data.username,
  };
};

export const signin = (request_data) => {
  return dispatch => {
    return axios.post('/api/user/signin/', request_data)
      .then(response => {
        dispatch(authorize(response.data));
        return response;
      })
      .catch(error => error);
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
    return axios.get('/api/user/status')
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


export const notification_ = (noti) => {
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
      })
      .catch(error => error);
  };
};