import reducer from './fridgeItem';
import * as actionTypes from '../actions/actionTypes';

const stubFridgeItem = {
  id: 1,
  name: 'test_name',
  type: 'test_type',
  quantity: 'test_quantity',
  unit: 'test_unit',
  expiryDate: 'test_date',
  nutritionFacts: ['test_calorie', 'test_sodium', 'test_protein'],
};

const stubFridgeItem2 = {
  id: 2,
  name: 'test_name2',
  type: 'test_type2',
  quantity: 'test_quantity2',
  unit: 'test_unit2',
  expiryDate: 'test_date2',
  nutritionFacts: ['test_calorie2', 'test_sodium2', 'test_protein2'],
};

const stubEditFridgeItem = {
  id: 1,
  name: 'edit_name',
  type: 'edit_type',
  quantity: 'edit_quantity',
  unit: 'edit_unit',
  expiryDate: 'edit_date',
  nutritionFacts: ['edit_calorie', 'edit_sodium', 'edit_protein'],
};

const emptyState = {
  fridgeItems: [],
  selectedFridgeItem: null
}

describe('fridgeItem reducer', () => {
  it('should return default state', () => {
    const newState = reducer(emptyState, {});
    expect(newState).toEqual({fridgeItems: [], selectedFridgeItem: null});
  });

  it('should get fridgeItems', () => {
    const stubFridgeItems = [stubFridgeItem, stubFridgeItem2];
    const newState = reducer(emptyState, {
      type: actionTypes.GET_FRIDGE_ITEMS, 
      fridgeItems: stubFridgeItems,
    });
    expect(newState).toEqual({fridgeItems: stubFridgeItems, selectedFridgeItem: null});
  });
  it('should get fridgeItem', () => {
    const newState = reducer(emptyState, {
      type: actionTypes.GET_FRIDGE_ITEM,
      fridgeItem: stubFridgeItem,
    });
    expect(newState).toEqual({fridgeItems: [], selectedFridgeItem: stubFridgeItem});
  });
  it('should add fridgeItem', () => {
    const newState = reducer(emptyState, {
      type: actionTypes.ADD_FRIDGE_ITEM,
      fridgeItem: stubFridgeItem
    });
    expect(newState).toEqual({fridgeItems:[stubFridgeItem], selectedFridgeItem: null});
  });
  it('should update fridgeItem', () => {
    const stubInitialState = {fridgeItems: [stubFridgeItem, stubFridgeItem2], selectedFridgeItem: null};
    const newState = reducer(stubInitialState, {
      type: actionTypes.EDIT_FRIDGE_ITEM,
      fridgeItem: stubEditFridgeItem
    });
    expect(newState).toEqual({fridgeItems: [stubEditFridgeItem, stubFridgeItem2], selectedFridgeItem: null});
  });
  it('should delete fridgeItem', () => {
    const stubInitialState = {fridgeItems: [stubFridgeItem, stubFridgeItem2], selectedFridgeItem: null};
    const newState = reducer(stubInitialState, {
      type: actionTypes.DELETE_FRIDGE_ITEM,
      targetId: 1
    });
    expect(newState).toEqual({fridgeItems: [stubFridgeItem2], selectedFridgeItem: null});
  });
  it('should clear fridgeItems', () => {
    const stubInitialState = {fridgeItems: [stubFridgeItem, stubFridgeItem2], selectedFridgeItem: null};
    const newState = reducer(stubInitialState, {
      type: actionTypes.CLEAR_FRIDGE_ITEMS
    });
    expect(newState).toEqual({fridgeItems: [], selectedFridgeItem: null});
  });
});
