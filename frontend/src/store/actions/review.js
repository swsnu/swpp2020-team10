import * as actionTypes from './actionTypes';
import axios from 'axios';


export const getReviewList_ = (reviews) => {
  return {type: actionTypes.GET_RECIPE_REVIEWS, reviews: reviews};
};

export const getReviewList = (id) => {
  return dispatch => {
    return axios.get('/api/recipe/' + id + '/review/')
      .then(response => {
        dispatch(getReviewList_(response.data));
        return response;
      });
  };
};


export const getReview_ = (review) => {
  return {type: actionTypes.GET_REVIEW, target: review};
};

export const getReview = (id) => {
  return dispatch => {
    return axios.get('/api/review/' + id)
      .then(response => {
        dispatch(getReview_(response.data));
        return response;
      });
  };
};


export const postReview_ = (review) => {
  return {type: actionTypes.ADD_REVIEW, review};
};

export const postReview = (recipeId, review) => {
  return dispatch => {
    return axios.post(`/api/recipe/${recipeId}/review/`, review)
      .then(response => {
        dispatch(postReview_(response.data));
      });
  };
};


export const editReview_ = (review) => {
  return {type: actionTypes.EDIT_REVIEW, review};
};

export const editReview = (reviewId, review) => {
  return dispatch => {
    return axios.put(`/api/review/${reviewId}`, review)
      .then(response => {
        dispatch(editReview_(response.data));
      });
  };
};


export const likeReview_ = (id) => {
  return {type: actionTypes.LIKE_REVIEW, targetId: id};
};

export const likeReview = (id) => {
  return dispatch => {
    return axios.put('/api/review/' + id + '/reaction/', 
      {'like': 1, 'dislike': 0, 'report': 0})
      .then(() => {
        dispatch(likeReview_(id));
      });
  };
};


export const dislikeReview_ = (id) => {
  return {type: actionTypes.DISLIKE_REVIEW, targetId: id};
};

export const dislikeReview = (id) => {
  return dispatch => {
    return axios.put('/api/review/' + id + '/reaction/', 
      {'like': 0, 'dislike': 1, 'report': 0})
      .then(() => {
        dispatch(dislikeReview_(id));
      });
  };
};


export const reportReview_ = (id) => {
  return {type: actionTypes.LIKE_REVIEW, targetId: id};
};

export const reportReview = (id) => {
  return dispatch => {
    return axios.put('/api/review/' + id + '/reaction/', 
      {'like': 0, 'dislike': 0, 'report': 1})
      .then(() => {
        dispatch(reportReview_(id));
      });
  };
};


export const deleteReview_ = (reviewId) => {
  return {type: actionTypes.DELETE_REVIEW, targetId: reviewId};
};

export const deleteReview = (reviewId) => {
  return dispatch => {
    return axios.delete(`/api/review/${reviewId}/`)
      .then(response => {
        dispatch(deleteReview_(reviewId));
        return response;
      });
  };
};