import * as actionTypes from '../actions/actionTypes';

const initialState = {
  comments: [],
  selectedComment: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REVIEW_COMMENTS:
    return { ...state, comments: action.comments };
    case actionTypes.GET_REVIEW:
    return { ...state, selectedComment: action.target };
    case actionTypes.ADD_COMMENT:
    const newComment = {
      id: action.id,
      review: action.review,
      user: action.user,
      content: action.content,
      likes: action.likes,
      reports: action.reports,
    };
    return { ...state, comments: state.comments.concat(newComment) };
    case actionTypes.EDIT_COMMENT:
    const modified = state.comments.map((comment) => {
      if (comment.id === action.targetId) {
        return { ...comment, content: action.content };
      } else {
        return { ...comment }
      }
    });
    return { ...state, comments: modified };
    case actionTypes.LIKE_COMMENT:
    const modified = state.comments.map((comment) => {
      if (comment.id === action.targetId) {
        return { ...comment, likes: comment.likes + 1 };
      } else {
        return { ...comment }
      }
    });
    return { ...state, comments: modified };
    case actionTypes.DISLIKE_COMMENT:
    const modified = state.comments.map((comment) => {
      if (comment.id === action.targetId) {
        return { ...comment, likes: comment.likes - 1 };
      } else {
        return { ...comment }
      }
    });
    return { ...state, comments: modified };
    case actionTypes.REPORT_COMMENT:
    const modified = state.comments.map((comment) => {
      if (comment.id === action.targetId) {
        return { ...comment, reports: comment.reports + 1 };
      } else {
        return { ...comment }
      }
    });
    return { ...state, comments: modified };
    case actionTypes.DELETE_REVIEW:
    const deletedComments = state.comments.filter((comment) => {
      return comment.id === action.targetId;
    });
    return { ...state, comments: deletedComments };
    default:
    break;
  }
  return state;
};

export default reducer;