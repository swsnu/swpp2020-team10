import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getCommentList_ = (comments) => {
  return { type: actionTypes.GET_REVIEW_COMMENTS, comments: comments };
};

export const getCommentList = (id) => {
  return dispatch => {
    return axios.get('/api/review/' + id + '/comment/')
      .then(response => {
        dispatch(getCommentList_(response.data));
      });
  };
};

export const getComment_ = (comment) => {
  return { type: actionTypes.GET_COMMENT, target: comment };
};

export const getComment = (id) => {
  return dispatch => {
    return axios.get('/api/comment/' + id)
      .then(response => {
        dispatch(getComment_(response.data));
      });
  };
};

export const postComment_ = (comment) => {
  return {
    type: actionTypes.ADD_COMMENT,
    id: comment.id,
    content: comment.content,
    review_id: comment.review_id,
    user_id: comment.user_id,
    likes: comment.likes,
    reports: comment.reports,
  };
};

export const postComment = (id, comment) => {
  return dispatch => {
    return axios.post('/api/review/' + id + '/comment/', {'content': comment.content})
      .then(response => {
        dispatch(postComment_(response.data));
      });
  };
};

export const editComment_ = (id) => {
  return { type: actionTypes.EDIT_COMMENT, targetId: id };
};

export const editComment = (id, comment) => {
  return dispatch => {
    return axios.put('/api/comment/' + id + '/', {'content': comment.content})
      .then(() => {
        dispatch(editComment_(id));
      });
  };
};

export const likeComment_ = (id) => {
  return { type: actionTypes.LIKE_COMMENT, targetId: id };
};

export const likeComment = (id) => {
  return dispatch => {
    return axios.put('/api/comment/' + id + '/reaction/', 
      {'like': 1, 'dislike': 0, 'report': 0})
      .then(() => {
        dispatch(likeComment_(id));
      });
  };
};

export const dislikeComment_ = (id) => {
  return { type: actionTypes.DISLIKE_COMMENT, targetId: id };
};

export const dislikeComment = (id) => {
  return dispatch => {
    return axios.put('/api/comment/' + id + '/reaction/', 
      {'like': 0, 'dislike': 1, 'report': 0})
      .then(() => {
        dispatch(dislikeComment_(id));
      });
  };
};

export const reportComment_ = (id) => {
  return { type: actionTypes.REPORT_COMMENT, targetId: id };
};

export const reportComment = (id) => {
  return dispatch => {
    return axios.put('/api/comment/' + id + '/reaction/', 
      {'like': 0, 'dislike': 0, 'report': 1})
      .then(() => {
        dispatch(reportComment_(id));
      });
  };
};

export const deleteComment_ = (id) => {
  return { type: actionTypes.DELETE_COMMENT, targetId: id };
};

export const deleteComment = (id) => {
  return dispatch => {
    return axios.delete('/api/comment/' + id + '/')
      .then(() => {
        dispatch(deleteComment_(id));
      });
  };
};