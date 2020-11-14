import * as actionTypes from '../actions/actionTypes';

const initialState = {
  comments: [],
  selectedComment: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REVIEW_COMMENTS:
      return { ...state, comments: action.comments };
    case actionTypes.GET_COMMENT:
      return { ...state, selectedComment: action.target };
    case actionTypes.ADD_COMMENT:
      var newComment = {
        id: action.id,
        review_id: action.review_id,
        user_id: action.user_id,
        content: action.content,
        likes: action.likes,
        dislikes: action.dislikes,
        reports: action.reports,
      };
      return { ...state, comments: state.comments.concat(newComment) };
    case actionTypes.EDIT_COMMENT:
      var modified = state.comments.map((comment) => {
        if (comment.id === action.targetId) {
          return { ...comment, content: action.content };
        } else {
          return { ...comment };
        }
      });
      return { ...state, comments: modified };
    case actionTypes.LIKE_COMMENT:
      var modifiedLikeComments = state.comments.map((comment) => {
        if (comment.id === action.targetId) {
          return { ...comment, likes: comment.likes + 1 };
        } else {
          return { ...comment };
        }
      });
      return { ...state, comments: modifiedLikeComments };
    case actionTypes.DISLIKE_COMMENT:
      var modifiedDislikeComment = state.comments.map((comment) => {
        if (comment.id === action.targetId) {
          return { ...comment, dislikes: comment.dislikes + 1 };
        } else {
          return { ...comment };
        }
      });
      return { ...state, comments: modifiedDislikeComment };
    case actionTypes.REPORT_COMMENT:
      var modifiedReportComment = state.comments.map((comment) => {
        if (comment.id === action.targetId) {
          return { ...comment, reports: comment.reports + 1 };
        } else {
          return { ...comment };
        }
      });
      return { ...state, comments: modifiedReportComment };
    case actionTypes.DELETE_COMMENT:
      var deletedComments = state.comments.filter((comment) => {
        return comment.id !== action.targetId;
      });
      return { ...state, comments: deletedComments };
    default:
      break;
  }
  return state;
};

export default reducer;