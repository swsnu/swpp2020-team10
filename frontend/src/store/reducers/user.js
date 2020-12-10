import * as actionTypes from '../actions/actionTypes';


const initialState = {
  isAuthorized: null,
  id: null,
  name: null,
  noti: null,
  recommendation: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
      return {
        ...state,
        isAuthorized: true,
        id: action.id,
        name: action.name,
      };
    case actionTypes.SIGN_OUT:
      return {
        ...state,
        isAuthorized: false,
        id: null,
        name: null,
        noti: null,
      };
    case actionTypes.GET_NOTIFICATION:
      return {
        ...state,
        noti: action.noti,
      };
    case actionTypes.GET_RECOMMENDATION:
      return {
        ...state,
        recommendation: action.recommendation,
      };
    default:
      return state;
  }
};

export default reducer;