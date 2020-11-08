import * as actionTypes from '../actions/actionTypes';


const initialState = {
  isAuthorized: null,
  id: null,
  name: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
      return {
        ...state,
        users: {
          isAuthorized: true,
          id: action.id,
          name: action.name,
        }
      };
    case actionTypes.SIGN_OUT:
      return {
        ...state,
        users: {
          isAuthorized: false,
          id: null,
          name: null,
        }
      };
  }
};

export default reducer;