import * as actionTypes from '../actions/actionTypes';

const initialState = {
  reviews: [],
  selectedReview: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPE_REVIEWS:
      return {...state, reviews: action.reviews};
    case actionTypes.GET_REVIEW:
      return {...state, selectedReview: action.target};
    case actionTypes.ADD_REVIEW:
      // I made this by mistake. If you are implementing review editor, 
      // please edit this freely and erase this comment if you're done.
      var newReview = {
        id: action.id,
        recipe: action.recipe,
        user: action.user,
        title: action.title,
        content: action.content,
        likes: action.likes,
        reports: action.reports,
      };
      return {...state, reviews: state.reviews.concat(newReview)};
    case actionTypes.EDIT_REVIEW:
      // I made this by mistake. If you are implementing review editor, 
      // please edit this freely and erase this comment if you're done.
      var modified = state.reviews.map((review) => {
        if (review.id === action.targetId) {
          return {...review, title: action.title, content: action.content};
        } else {
          return {...review};
        }
      });
      return {...state, reviews: modified};
    case actionTypes.LIKE_REVIEW:
      var modifiedLikeReview = state.reviews.map((review) => {
        if (review.id === action.targetId) {
          return {...review, likes: review.likes + 1};
        } else {
          return {...review};
        }
      });
      return {...state, reviews: modifiedLikeReview};
    case actionTypes.DISLIKE_REVIEW:
      var modifiedDislikeReview = state.reviews.map((review) => {
        if (review.id === action.targetId) {
          return {...review, likes: review.likes - 1};
        } else {
          return {...review};
        }
      });
      return {...state, reviews: modifiedDislikeReview};
    case actionTypes.REPORT_REVIEW:
      var modifiedReportReview = state.reviews.map((review) => {
        if (review.id === action.targetId) {
          return {...review, reports: review.reports + 1};
        } else {
          return {...review};
        }
      });
      return {...state, reviews: modifiedReportReview};
    case actionTypes.DELETE_REVIEW:
      var deletedReviews = state.reviews.filter((review) => {
        return review.id !== action.targetId;
      });
      return {...state, reviews: deletedReviews};
    default:
      break;
  }
  return state;
};

export default reducer;