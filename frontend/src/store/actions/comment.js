import * as actionTypes from './actionTypes';
import axios from 'axios';


export const getCommentList_ = (comments) => {
  return { type: actionTypes.GET_REVIEW_COMMENTS, comments: comments };
};

export const getCommentList = (id) => {
  return dispatch => {
    return axios.get(`/api/review/${id}/comment/`)
      .then(response => {
        dispatch(getCommentList_(response.data));
        return response;
      });
  };
};


export const getComment_ = (comment) => {
  return { type: actionTypes.GET_COMMENT, target: comment };
};

export const getComment = (id) => {
  return dispatch => {
    return axios.get(`/api/comment/${id}/`)
      .then(response => {
        dispatch(getComment_(response.data));
        return response;
      });
  };
};


export const postComment_ = (comment) => {
  return { type: actionTypes.ADD_COMMENT, comment };
};

export const postComment = (id, content) => {
  return dispatch => {
    return axios.post(`/api/review/${id}/comment/`, { content })
      .then(response => {
        dispatch(postComment_(response.data));
        return response;
      });
  };
};


export const editComment_ = (id, content) => {
  return { type: actionTypes.EDIT_COMMENT, targetId: id, content };
};

export const editComment = (id, content) => {
  return dispatch => {
    return axios.put(`/api/comment/${id}/`, { content })
      .then(response => {
        dispatch(editComment_(id, content));
        return response;
      });
  };
};


export const likeComment_ = ({ id, likes, dislikes, reports }) => {
  return {
    type: actionTypes.LIKE_COMMENT,
    targetId: id,
    likes,
    dislikes,
    reports,
  };
};

export const likeComment = (id) => {
  return dispatch => {
    return axios.put(`/api/comment/${id}/reaction/`, { like: 1, dislike: 0, report: 0 })
      .then(response => {
        dispatch(likeComment_(response.data));
        return response;
      });
  };
};


export const dislikeComment_ = ({ id, likes, dislikes, reports }) => {
  return {
    type: actionTypes.DISLIKE_COMMENT,
    targetId: id,
    likes,
    dislikes,
    reports,
  };
};

export const dislikeComment = (id) => {
  return dispatch => {
    return axios.put(`/api/comment/${id}/reaction/`, { like: 0, dislike: 1, report: 0 })
      .then(response => {
        dispatch(dislikeComment_(response.data));
        return response;
      });
  };
};


export const reportComment_ = ({ id, likes, dislikes, reports }) => {
  return {
    type: actionTypes.REPORT_COMMENT,
    targetId: id,
    likes,
    dislikes,
    reports,
  };
};

export const reportComment = (id) => {
  return dispatch => {
    return axios.put(`/api/comment/${id}/reaction/`, { like: 0, dislike: 0, report: 1 })
      .then(response => {
        dispatch(reportComment_(response.data));
        return response;
      });
  };
};


export const deleteComment_ = (id) => {
  return { type: actionTypes.DELETE_COMMENT, targetId: id };
};

export const deleteComment = (id) => {
  return dispatch => {
    return axios.delete(`/api/comment/${id}/`)
      .then(response => {
        dispatch(deleteComment_(id));
        return response;
      });
  };
};