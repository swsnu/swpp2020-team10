import * as actionTypes from '../actions/actionTypes';


const initialState = {
  isAuthorized: false,
  id: null,
  name: null,
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
      };
  }
  return state;
};

export default reducer;