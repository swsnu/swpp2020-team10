import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';

import MyFridge from './MyFridge';
//import * as fridgeItemActionCreators from '../../store/actions/fridgeItem';

const stubInitialState = {
  user: {
    id: 1,
    name: 'Tester',
    isAuthorized: true
  },

  fridgeItems: [{
    id: 1,
    name: 'test_name',
    type: 'test_type',
    quantity: 'test_quantity',
    unit: 'test_unit',
    expiryDate: 'test_date',
    nutritionFacts: ['test_calorie', 'test_sodium', 'test_protein'],
  },
  {
    id: 2,
    name: 'test_name2',
    type: 'test_type2',
    quantity: 'test_quantity2',
    unit: 'test_unit2',
    expiryDate: 'test_date2',
    nutritionFacts: ['test_calorie2', 'test_sodium2', 'test_protein2'],
  }],
  selectedFridgeItem: {
    id: 1,
    name: 'test_name',
    type: 'test_type',
    quantity: 'test_quantity',
    unit: 'test_unit',
    expiryDate: 'test_date',
    nutritionFacts: ['test_calorie', 'test_sodium', 'test_protein'],
  }
};

const mockStore = getMockStore(stubInitialState);

describe('<MyFridge />', () => {
  let myFridge;
  const history = createBrowserHistory();
  let spyPush = jest.spyOn(history, 'push')
    .mockImplementation(() => {});
  //let spyOnClearFridgeItems = jest.spyOn(fridgeItemActionCreators, 'clearFridgeItems')
  //  .mockImplementation({});
  
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
  });

  it('should render MyFridge', () => {
    const component = mount(myFridge);
    const wrapper = component.find('#MyFridge');
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should render fridgeItems', () => {
    const component = mount(myFridge);
    const wrapper = component.find('.card');
    expect(wrapper.length).toBe(stubInitialState.fridgeItems.length);
  });

  it('should redirect to recipe search page on click button', () => {
    const component = mount(myFridge);
    const wrapper = component.find('#searchRecipeButton').at(0);
    wrapper.simulate('click');
    expect(spyPush).toBeCalledTimes(1);
    expect(spyPush).toBeCalledWith('/search');
  });

  it('should press add button', () => {
    const component = mount(myFridge);
    let wrapper = component.find('#addFoodButton').at(0);
    wrapper.simulate('click');
    
    wrapper = component.find('#FoodCreate');
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should press clear button', () => {
    const component = mount(myFridge);
    let wrapper = component.find('#clearFridgeButton').at(0);
    wrapper.simulate('click');
    
    wrapper = component.find('.card');
    //do the followings after axios is ready
    //expect(wrapper.length).toBe(0);
    //expect(spyOnClearFridgeItems).toBeCalledTimes(0);
  });

  it('should press fridgeItem', () => {
    const component = mount(myFridge);
    let wrapper = component.find('.card').at(0);
    wrapper.simulate('click');
    
    wrapper = component.find('#FoodDetail');
    expect(wrapper.exists()).toBeTruthy();
  });
});