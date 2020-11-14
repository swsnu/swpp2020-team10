import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';

import FoodCreate from './FoodCreate';
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
};

const mockStore = getMockStore(stubInitialState);

describe('<FoodCreate />', () => {
  let foodCreate;
  const history = createBrowserHistory();
  //let spyOnPostFridgeItem = jest.spyOn(fridgeItemActionCreators, 'postFridgeItem')
  //  .mockImplementation({});
  
  const setIsCreate = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  
  beforeEach(() => {
    foodCreate = (
      <Provider store={mockStore}>
        <Router history={history}>
          <Switch>
            <Route path='/' exact render={() => <FoodCreate onEnd={(input) => setIsCreate(input)} />} />
          </Switch>
        </Router>
      </Provider>
    );
    useStateSpy.mockImplementation((init) => [init, setIsCreate]);
  });

  it('should render FoodCreate', () => {
    const component = mount(foodCreate);
    const wrapper = component.find('#FoodCreate');
    expect(wrapper.exists()).toBeTruthy();
  });

  it(`should set state properly on name input`, () => {
    const name = 'TEST_NAME';
    const component = mount(foodCreate);
    let wrapper = component.find('#nameInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: name } });
    wrapper = component.find('#nameInput').at(0).find('input');
    expect(wrapper.props().value).toBe(name);
  });

  it(`should set state properly on type input`, () => {
    const type = 'TEST_TYPE';
    const component = mount(foodCreate);
    let wrapper = component.find('#typeInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: type } });
    wrapper = component.find('#typeInput').at(0).find('input');
    expect(wrapper.props().value).toBe(type);
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

  it(`should set state properly on calorie input`, () => {
    const calorie = 'TEST_CALORIE';
    const component = mount(foodCreate);
    let wrapper = component.find('#calorieInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: calorie } });
    wrapper = component.find('#calorieInput').at(0).find('input');
    expect(wrapper.props().value).toBe(calorie);
  });

  it(`should set state properly on sodium input`, () => {
    const sodium = 'TEST_SODIUM';
    const component = mount(foodCreate);
    let wrapper = component.find('#sodiumInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: sodium } });
    wrapper = component.find('#sodiumInput').at(0).find('input');
    expect(wrapper.props().value).toBe(sodium);
  });

  it(`should set state properly on protein input`, () => {
    const protein = 'TEST_PROTEIN';
    const component = mount(foodCreate);
    let wrapper = component.find('#proteinInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: protein } });
    wrapper = component.find('#proteinInput').at(0).find('input');
    expect(wrapper.props().value).toBe(protein);
  });

  it('should show nutritions on click Accordion', () => {
    const component = mount(foodCreate);
    let wrapper = component.find('#showNutritions');
    
    wrapper.at(1).simulate('click');
    let subcomp = component.find('.active');
    expect(subcomp.exists()).toBeTruthy();

    wrapper.at(1).simulate('click');
    subcomp = component.find('.active');
    expect(subcomp.length).toBe(0);
  });

  it('should press add button', () => {
    const component = mount(foodCreate);
    let wrapper = component.find('#addButton').at(0);
    wrapper.simulate('click');
    
    //expect(spyOnPostFridgeItem).toHaveBeenCalledTimes(1);
    expect(setIsCreate).toHaveBeenCalledTimes(1);
  });

  it('should press back button', () => {
    const component = mount(foodCreate);
    let wrapper = component.find('#backButton').at(0);
    wrapper.simulate('click');
    
    expect(setIsCreate).toHaveBeenCalledTimes(1);
  });
});