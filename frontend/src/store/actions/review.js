import * as actionTypes from './actionTypes';
import axios from 'axios';


export const getReviewList_ = (reviews) => {
  return { type: actionTypes.GET_RECIPE_REVIEWS, reviews: reviews };
};

export const getReviewList = (recipeId) => {
  return dispatch => {
    return axios.get(`/api/recipe/${recipeId}/review/`)
      .then(response => {
        dispatch(getReviewList_(response.data));
        return response;
      });
  };
};


export const getReview_ = (review) => {
  return { type: actionTypes.GET_REVIEW, target: review };
};

export const getReview = (id) => {
  return dispatch => {
    return axios.get(`/api/review/${id}/`)
      .then(response => {
        dispatch(getReview_(response.data));
        return response;
      });
  };
};


export const postReview_ = (review) => {
  return { type: actionTypes.ADD_REVIEW, review };
};

export const postReview = (recipeId, review) => {
  return dispatch => {
    return axios.post(`/api/recipe/${recipeId}/review/`, review)
      .then(response => {
        dispatch(postReview_(response.data));
        return response;
      });
  };
};


export const editReview_ = (review) => {
  return { type: actionTypes.EDIT_REVIEW, review };
};

export const editReview = (id, review) => {
  return dispatch => {
    return axios.put(`/api/review/${id}/`, review)
      .then(response => {
        dispatch(editReview_(response.data));
        return response;
      });
  };
};


export const likeReview_ = ({ likes, dislikes, reports }) => {
  return { type: actionTypes.LIKE_REVIEW, likes, dislikes, reports };
};

export const likeReview = (id) => {
  return dispatch => {
    return axios.put(`/api/review/${id}/reaction/`, { like: 1, dislike: 0, report: 0 })
      .then(response => {
        dispatch(likeReview_(response.data));
        return response;
      });
  };
};


export const dislikeReview_ = ({ likes, dislikes, reports }) => {
  return { type: actionTypes.DISLIKE_REVIEW, likes, dislikes, reports };
};

export const dislikeReview = (id) => {
  return dispatch => {
    return axios.put(`/api/review/${id}/reaction/`, { like: 0, dislike: 1, report: 0 })
      .then(response => {
        dispatch(dislikeReview_(response.data));
        return response;
      });
  };
};


export const reportReview_ = ({ likes, dislikes, reports }) => {
  return { type: actionTypes.REPORT_REVIEW, likes, dislikes, reports };
};

export const reportReview = (id) => {
  return dispatch => {
    return axios.put(`/api/review/${id}/reaction/`, { like: 0, dislike: 0, report: 1 })
      .then(response => {
        dispatch(reportReview_(response.data));
        return response;
      });
  };
};


export const deleteReview_ = (id) => {
  return { type: actionTypes.DELETE_REVIEW, targetId: id };
};

export const deleteReview = (id) => {
  return dispatch => {
    return axios.delete(`/api/review/${id}/`)
      .then(response => {
        dispatch(deleteReview_(id));
        return response;
      });
  };
};