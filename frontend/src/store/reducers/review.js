import * as actionTypes from '../actions/actionTypes';


const initialState = {
  reviews: [],
  selectedReview: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPE_REVIEWS:
      return { ...state, reviews: action.reviews };
    case actionTypes.GET_REVIEW:
      return { ...state, selectedReview: action.target };
    case actionTypes.ADD_REVIEW:
      return { ...state, reviews: state.reviews.concat(action.review) };
    case actionTypes.EDIT_REVIEW: {
      const reviews = state.reviews.map(review => {
        if (review.id === action.review.id) {
          return action.review;
        } else {
          return review;
        }
      });
      return { ...state, reviews };
    }
    case actionTypes.LIKE_REVIEW: {
      const review = state.selectedReview;
      return {
        ...state,
        selectedReview: {
          ...review,
          likes: review.likes + 1,
        }
      };
    }
    case actionTypes.DISLIKE_REVIEW: {
      const review = state.selectedReview;
      return {
        ...state,
        selectedReview: {
          ...review,
          dislikes: review.dislikes + 1,
        }
      };
    }
    case actionTypes.REPORT_REVIEW: {
      const review = state.selectedReview;
      return {
        ...state,
        selectedReview: {
          ...review,
          reports: review.reports + 1,
        }
      };
    }
    case actionTypes.DELETE_REVIEW:
      const reviews = state.reviews.filter(review => review.id !== action.targetId);
      return { ...state, reviews };
    default:
      break;
  }
  return state;
};

export default reducer;