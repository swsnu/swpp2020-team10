import * as actionTypes from '../actions/actionTypes';


const initialState = {
  fridgeItems: [],
  selectedFridgeItem: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_FRIDGE_ITEMS:
      return { ...state, fridgeItems: action.fridgeItems };
    case actionTypes.GET_FRIDGE_ITEM:
      return { ...state, selectedFridgeItem: action.fridgeItem };
    case actionTypes.ADD_FRIDGE_ITEM:
      return { ...state, fridgeItems: state.fridgeItems.concat(action.fridgeItem) };
    case actionTypes.EDIT_FRIDGE_ITEM: {
      const fridgeItems = state.fridgeItems.map(fridgeItem => {
        if (fridgeItem.id === action.fridgeItem.id) {
          return action.fridgeItem;
        } else {
          return fridgeItem;
        }
      });
      return { ...state, fridgeItems };
    }
    case actionTypes.DELETE_FRIDGE_ITEM: {
      const fridgeItems = state.fridgeItems.filter(fridgeItem => {
        return fridgeItem.id !== action.targetId;
      });
      return { ...state, fridgeItems };
    }
    case actionTypes.SIGN_OUT:
    case actionTypes.CLEAR_FRIDGE_ITEMS:
      return { ...state, fridgeItems: [] };
    default:
      break;
  }
  return state;
};

export default reducer;