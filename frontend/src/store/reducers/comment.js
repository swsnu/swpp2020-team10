import * as actionTypes from '../actions/actionTypes';


const initialState = {
  comments: [],
  selectedComment: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REVIEW_COMMENTS:
      return { ...state, comments: action.comments };
    case actionTypes.GET_COMMENT:
      return { ...state, selectedComment: action.target };
    case actionTypes.ADD_COMMENT:
      return { ...state, comments: state.comments.concat(action.comment) };
    case actionTypes.EDIT_COMMENT: {
      const comments = state.comments.map(comment => {
        if (comment.id === action.targetId) {
          return { ...comment, content: action.content };
        } else {
          return comment;
        }
      });
      return { ...state, comments };
    }
    case actionTypes.LIKE_COMMENT:
    case actionTypes.DISLIKE_COMMENT:
    case actionTypes.REPORT_COMMENT: {
      const comments = state.comments.map(comment => {
        if (comment.id === action.targetId) {
          return {
            ...comment,
            likes: action.likes,
            dislikes: action.dislikes,
            reports: action.reports,
          };
        } else {
          return comment;
        }
      });
      return { ...state, comments };
    }
    case actionTypes.DELETE_COMMENT: {
      const comments = state.comments.filter(comment => comment.id !== action.targetId);
      return { ...state, comments };
    }
    default:
      break;
  }
  return state;
};

export default reducer;