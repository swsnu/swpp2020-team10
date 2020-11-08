import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getReviewList_ = (reviews) => {
  return {type: actionTypes.GET_RECIPE_REVIEWS, reviews: reviews};
};

export const getReviewList = (id) => {
  return dispatch => {
    return axios.get('/api/recipe/' + id + '/reviews/')
      .then(response => {
        dispatch(getReviewList_(response.data));
      });
  };
};

export const getReview_ = (review) => {
  return {type: actionTypes.GET_REVIEW, target: review};
};

export const getReview = (id) => {
  return dispatch => {
    return axios.get('/api/reviews/' + id)
      .then(response => {
        dispatch(getReview_(response.data));
      });
  };
};

//I made this by mistake. If you are implementing review editor, 
// please edit this freely and erase this comment if you're done.
export const postReview_ = (review) => {
  return {
    type: actionTypes.ADD_REVIEW,
    id: review.id,
    title: review.title,
    content: review.content,
    recipe: review.recipe,
    user: review.user,
    likes: review.likes,
    reports: review.reports,
  };
};

//I made this by mistake. If you are implementing review editor, 
// please edit this freely and erase this comment if you're done.
export const postReview = (id, review) => {};

export const likeReview_ = (id) => {
  return {type: actionTypes.LIKE_REVIEW, targetId: id};
};

export const likeReview = (id, review) => {
  return dispatch => {
    return axios.put('/api/review/' + id + '/reaction/', review)
      .then(() => {
        dispatch(likeReview_(id));
      });
  };
};

export const dislikeReview_ = (id) => {
  return {type: actionTypes.DISLIKE_REVIEW, targetId: id};
};

export const dislikeReview = (id, review) => {
  return dispatch => {
    return axios.put('/api/review/' + id + '/reaction/', review)
      .then(() => {
        dispatch(dislikeReview_(id));
      });
  };
};

export const reportReview_ = (id) => {
  return {type: actionTypes.LIKE_REVIEW, targetId: id};
};

export const reportReview = (id, review) => {
  return dispatch => {
    return axios.put('/api/review/' + id + '/reaction/', review)
      .then(() => {
        dispatch(reportReview_(id));
      });
  };
};

export const deleteReview_ = (id) => {
  return {type: actionTypes.DELETE_REVIEW, targetId: id};
};

export const deleteReview = (id) => {
  return dispatch => {
    return axios.delete('/api/review/' + id + '/')
      .then(() => {
        dispatch(deleteReview_(id));
      });
  };
};