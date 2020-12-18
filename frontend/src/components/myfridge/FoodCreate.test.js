import React from 'react';
import axios from 'axios';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import { act } from 'react-dom/test-utils';

import { FoodCreate } from './FoodCreate';
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
    ingredient_id: 'test_ingredient',
    quantity: 'test_quantity',
    unit: 'test_unit',
    expiry_date: 'test_date',
  },
  {
    id: 2,
    name: 'test_name2',
    ingredient_id: 'test_ingredient2',
    quantity: 'test_quantity2',
    unit: 'test_unit2',
    expiry_date: 'test_date2',
  }],
};

const mockStore = getMockStore(stubInitialState);
jest.mock('axios');

describe('<FoodCreate />', () => {
  let foodCreate;
  const history = createBrowserHistory();
  let spyPostFridgeItem;
  
  const setIsCreate = jest.fn();
  
  beforeEach(() => {
    foodCreate = (
      <Provider store={mockStore}>
        <Router history={history}>
          <Switch>
            <Route path='/' exact render={() => <FoodCreate open={true} setOpen={setIsCreate} />} />
          </Switch>
        </Router>
      </Provider>
    );
    spyPostFridgeItem = jest.spyOn(fridgeItemActionCreators, 'postFridgeItem')
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

  it('should render FoodCreate', () => {
    const component = mount(foodCreate);
    const wrapper = component.find('#FoodCreate');
    expect(wrapper.exists()).toBeTruthy();
  });

  it(`should set state properly on name input`, () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result= {
            status: 200, 
            data: [{id: 1, name: 'username1'}]
          };
          resolve(result);
        }
        );}
      );
    const name = 'TEST_NAME';
    const component = mount(foodCreate);
    let wrapper = component.find('#nameInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: name } });
    wrapper.simulate('blur');
    wrapper = component.find('#nameInput').at(0).find('input');
    expect(wrapper.props().value).toBe(name);
  });

  it(`should set state properly on type input`, () => {
    const type = 'TEST_TYPE';
    const component = mount(foodCreate);
    let wrapper = component.find('#typeInput').last();
    
    wrapper.simulate('change', { target: { value: type } });
    const event = {type};
    wrapper.simulate('click', event);
    wrapper.update();
    wrapper = component.find('#typeInput').last();
    expect(wrapper.length).toBe(1);
  });

  it(`should set state properly on quantity input`, () => {
    const quantity = 'TEST_QUANTITY';
    const component = mount(foodCreate);
    let wrapper = component.find('#quantityInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: quantity } });
    wrapper = component.find('#quantityInput').at(0).find('input');
    expect(wrapper.props().value).toBe(quantity);
  });

  it(`should set state properly on unit input`, () => {
    const unit = 'TEST_UNIT';
    const component = mount(foodCreate);
    let wrapper = component.find('#unitInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: unit } });
    wrapper = component.find('#unitInput').at(0).find('input');
    expect(wrapper.props().value).toBe(unit);
  });

  it(`should set state properly on expiry date input`, () => {
    const expiry = 'TEST_EXPIRY';
    const component = mount(foodCreate);
    let wrapper = component.find('#expiryDateInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: expiry } });
    wrapper = component.find('#expiryDateInput').at(0).find('input');
    expect(wrapper.props().value).toBe(expiry);
  });

  it('should press add button', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result= {
            status: 200, 
            data: []
          };
          resolve(result);
        }
        );}
      );
    let component;
    await act(async () => {
      component = mount(foodCreate);
    });
    let wrapper = component.find('#nameInput').at(0).find('input');
    await act(async () => {
      wrapper.simulate('blur');
    });
    component.update();
    wrapper = component.find('#typeInput').last();
    
    const event = {value: 1};
    wrapper.simulate('change', event);
    const quantity = 'TEST_QUANTITY';
    wrapper = component.find('#quantityInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: quantity } });
    component.update();
    //console.log(component.debug());
    wrapper = component.find('#addButton').at(0);
    wrapper.simulate('click');
    expect(spyPostFridgeItem).toHaveBeenCalledTimes(0);
    await act(async () => {
      expect(setIsCreate).toHaveBeenCalledTimes(0);//
    });
  });

  it('should press back button', () => {
    const component = mount(foodCreate);
    let wrapper = component.find('#backButton').at(0);
    wrapper.simulate('click');
    
    expect(setIsCreate).toHaveBeenCalledTimes(1);
  });
});