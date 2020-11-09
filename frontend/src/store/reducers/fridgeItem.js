import * as actionTypes from '../actions/actionTypes';

const initialState = {
  fridgeItems: [
    {
      name: 'beef',
      type: 'meat',
      quantity: '3',
      unit: 'kg',
      expiryDate: '2020-11-09',
      nutritionFacts: ['beef_calorie', 'beef_sodium', 'beef_protein'],
    },
    {
      name: 'seoul milk',
      type: 'milk',
      quantity: '1000',
      unit: 'mL',
      expiryDate: '2020-11-20',
      nutritionFacts: ['milk_calorie', 'milk_sodium', 'milk_protein'],
    },
  ],
  selectedFridgeItem: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_FRIDGE_ITEMS:
      return { ...state, fridgeItems: action.fridgeItems };
    case actionTypes.GET_FRIDGE_ITEM:
      return { ...state, selectedFridgeItem: action.fridgeItem };
    case actionTypes.ADD_FRIDGE_ITEM:
      return { ...state, comments: state.comments.concat(action.fridgeItem) };
    case actionTypes.EDIT_FRIDGE_ITEM:
      var modifiedFridgeItems = state.fridgeItems.map((fridgeItem) => {
        if (fridgeItem.id === action.fridgeItem.id) {
          return action.fridgeItem;
        } else {
          return fridgeItem;
        }
      });
      return { ...state, fridgeItems: modifiedFridgeItems };
    case actionTypes.DELETE_FRIDGE_ITEM:
      var deletedFridgeItems = state.fridgeItems.filter((fridgeItem) => {
        return fridgeItem.id === action.targetId;
      });
      return { ...state, fridgeItems: deletedFridgeItems };
    case actionTypes.CLEAR_FRIDGE_ITEMS:
      return { ...state, fridgeItems: [] };
    default:
      break;
  }
  return state;
};

export default reducer;