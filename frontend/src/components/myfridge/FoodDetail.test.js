import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import { act } from 'react-dom/test-utils';

import { FoodDetail } from './FoodDetail';
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
  selectedFridgeItem: {
    id: 1,
    name: 'test_name',
    ingredient_id: 'test_ingredient',
    quantity: 'test_quantity',
    unit: 'test_unit',
    expiry_date: 'test_date',
  }
};

const mockStore = getMockStore(stubInitialState);

describe('<FoodDetail />', () => {
  let foodDetail;
  const history = createBrowserHistory();
  let spyEditFridgeItem, spyDeleteFridgeItem;
  
  const setIsEdit = jest.fn();
  
  beforeEach(() => {
    foodDetail = (
      <Provider store={mockStore}>
        <Router history={history}>
          <Switch>
            <Route path='/' exact render={() => <FoodDetail open={true} setOpen={setIsEdit} />} />
          </Switch>
        </Router>
      </Provider>
    );
    spyEditFridgeItem = jest.spyOn(fridgeItemActionCreators, 'editFridgeItem')
    .mockImplementation(() => {return () => {
      return new Promise((resolve) => {
        const result = {
          status: 200,
          data: {}
        };
        resolve(result);
      });
    };});
    spyDeleteFridgeItem = jest.spyOn(fridgeItemActionCreators, 'deleteFridgeItem')
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

  it('should render FoodDetail with initial values', () => {
    const component = mount(foodDetail);
    let wrapper = component.find('#FoodDetail');
    expect(wrapper.exists()).toBeTruthy();

  });

  it(`should not change name input`, () => {
    const name = 'TEST_NAME';
    const component = mount(foodDetail);
    let wrapper = component.find('#nameInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: name } });
    wrapper = component.find('#nameInput').at(0).find('input');
    expect(wrapper.props().value).toBe(name);
  });

  it(`should not change type input`, () => {
    const type = 'TEST_TYPE';
    const component = mount(foodDetail);
    let wrapper = component.find('#typeInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: type } });
    wrapper = component.find('#typeInput').at(0).find('input');
    wrapper.update();
    expect(wrapper.props().value).toBe('');
  });

  it(`should set state properly on quantity input`, () => {
    const quantity = 'TEST_QUANTITY';
    const component = mount(foodDetail);
    let wrapper = component.find('#quantityInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: quantity } });
    wrapper = component.find('#quantityInput').at(0).find('input');
    expect(wrapper.props().value).toBe(quantity);
  });

  it(`should set state properly on unit input`, () => {
    const unit = 'TEST_UNIT';
    const component = mount(foodDetail);
    let wrapper = component.find('#unitInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: unit } });
    wrapper = component.find('#unitInput').at(0).find('input');
    expect(wrapper.props().value).toBe(unit);
  });

  it(`should set state properly on expiry date input`, () => {
    const expiry = 'TEST_EXPIRY';
    const component = mount(foodDetail);
    let wrapper = component.find('#expiryDateInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: expiry } });
    wrapper = component.find('#expiryDateInput').at(0).find('input');
    expect(wrapper.props().value).toBe(expiry);
  });

  it('should press edit button', async () => {
    const component = mount(foodDetail);
    let wrapper = component.find('#editButton').at(0);
    wrapper.simulate('click');
    
    expect(spyEditFridgeItem).toHaveBeenCalledTimes(1);
    await act(async () => {
      expect(setIsEdit).toHaveBeenCalledTimes(0);//
    });
  });

  it('should press delete button', () => {
    const component = mount(foodDetail);
    let wrapper = component.find('#deleteButton').at(0);
    wrapper.simulate('click');
    
    expect(spyDeleteFridgeItem).toHaveBeenCalledTimes(1);
    expect(setIsEdit).toHaveBeenCalledTimes(0);//
  });

  it('should press back button', () => {
    const component = mount(foodDetail);
    let wrapper = component.find('#backButton').at(0);
    wrapper.simulate('click');
    
    expect(setIsEdit).toHaveBeenCalledTimes(1);
  });
});