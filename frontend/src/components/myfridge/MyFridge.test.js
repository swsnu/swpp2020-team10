import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import { act } from 'react-dom/test-utils';

import MyFridge from './MyFridge';
import * as fridgeItemActionCreators from '../../store/actions/fridgeItem';

const stubInitialState = {
  user: {
    id: 1,
    name: 'Tester',
    isAuthorized: true,
    noti: null,
    recommendation: null,
  },

  fridgeItems: [{
    id: 1,
    name: 'test_name',
    type: 'test_type',
    quantity: 'test_quantity',
    unit: 'test_unit',
    expiryDate: 'test_date',
  },
  {
    id: 2,
    name: 'test_name2',
    type: 'test_type2',
    quantity: 'test_quantity2',
    unit: 'test_unit2',
    expiryDate: 'test_date2',
  }],
  selectedFridgeItem: {
    id: 1,
    name: 'test_name',
    type: 'test_type',
    quantity: 'test_quantity',
    unit: 'test_unit',
    expiryDate: 'test_date',
  }
};

const mockStore = getMockStore(stubInitialState);

describe('<MyFridge />', () => {
  let myFridge;
  const history = createBrowserHistory();
  let spyGetFridgeItemList, spyClearFridgeItems, spyGetFridgeItem;
  
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  beforeEach(() => {
    myFridge = (
      <Provider store={mockStore}>
        <Router history={history}>
          <Switch>
            <Route path='/' exact component={MyFridge}
              match={{params: {user_id: 1}}} />
          </Switch>
        </Router>
      </Provider>
    );
    useStateSpy.mockImplementation((init) => [init, setState]);
    spyGetFridgeItemList = jest.spyOn(fridgeItemActionCreators, 'getFridgeItemList')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyClearFridgeItems = jest.spyOn(fridgeItemActionCreators, 'clearFridgeItems')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyGetFridgeItem = jest.spyOn(fridgeItemActionCreators, 'getFridgeItem')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
  });

  it('should render MyFridge', async () => {
    let component;
    await act(async () => {
      component = mount(myFridge);
    });
    component.update();
    const wrapper = component.find('#MyFridge');
    expect(wrapper.exists()).toBeTruthy();
    expect(spyGetFridgeItemList).toHaveBeenCalledTimes(1);
  });

  it('should render fridgeItems', async () => {
    let component;
    await act(async () => {
      component = mount(myFridge);
    });
    component.update();
    const wrapper = component.find('.card');
    expect(wrapper.length).toBe(stubInitialState.fridgeItems.length);
  });

  it('should press add button', async () => {
    let component;
    await act(async () => {
      component = mount(myFridge);
    });
    component.update();
    let wrapper = component.find('#addFoodButton').at(0);
    wrapper.simulate('click');
    
    wrapper = component.find('#FoodCreate');
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should press clear button', async () => {
    let component;
    await act(async () => {
      component = mount(myFridge);
    });
    component.update();
    let wrapper = component.find('#clearFridgeButton').at(0);
    wrapper.simulate('click');
    
    wrapper = component.find('.card');
    expect(wrapper.length).toBe(2);//
    expect(spyClearFridgeItems).toBeCalledTimes(1);
  });

  it('should press fridgeItem', async () => {
    let component;
    await act(async () => {
      component = mount(myFridge);
    });
    component.update();
    let wrapper = component.find('.card').at(0);
    wrapper.simulate('click');
    
    await act(async () => {
      wrapper = component.find('#FoodDetail');
    });
    wrapper.update();
    
    expect(wrapper.exists()).toBeFalsy();//
    expect(spyGetFridgeItem).toBeCalledTimes(1);
  });
});