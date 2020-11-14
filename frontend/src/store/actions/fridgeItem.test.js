import axios from 'axios';

import * as actionCreators from './fridgeItem';
import store from '../store';

const stubFridgeItem = {
  id: 1,
  name: 'test_name',
  type: 'test_type',
  quantity: 'test_quantity',
  unit: 'test_unit',
  expiryDate: 'test_date',
  nutritionFacts: ['test_calorie', 'test_sodium', 'test_protein'],
};

describe('fridgeItem actionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch fridgeItems correctly', () => {
    const stubFridgeItems = [stubFridgeItem];
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubFridgeItems
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getFridgeItemList(1)).then(() => {
      const newState = store.getState();
      expect(newState.fridgeItem.fridgeItems).toBe(stubFridgeItems);
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should get fridgeItem correctly', () => {
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubFridgeItem
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getFridgeItem()).then(() => {
      const newState = store.getState();
      expect(newState.fridgeItem.selectedFridgeItem).toBe(stubFridgeItem);
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should post fridgeItem correctly', () => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubFridgeItem
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.postFridgeItem(stubFridgeItem)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should edit fridgeItem', () => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.editFridgeItem(stubFridgeItem)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should delete fridgeItem', () => {
    const spy = jest.spyOn(axios, 'delete')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.deleteFridgeItem()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should clear fridgeItems', () => {
    const spy = jest.spyOn(axios, 'delete')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.clearFridgeItems()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });
});