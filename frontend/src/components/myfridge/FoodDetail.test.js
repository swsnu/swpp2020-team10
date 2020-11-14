import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';

import FoodDetail from './FoodDetail';
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

describe('<FoodDetail />', () => {
  let foodDetail;
  const history = createBrowserHistory();
  //let spyOnPostFridgeItem = jest.spyOn(fridgeItemActionCreators, 'postFridgeItem')
  //  .mockImplementation({});
  
  const setIsEdit = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  
  beforeEach(() => {
    foodDetail = (
      <Provider store={mockStore}>
        <Router history={history}>
          <Switch>
            <Route path='/' exact render={() => <FoodDetail onEnd={(input) => setIsEdit(input)} />} />
          </Switch>
        </Router>
      </Provider>
    );
    useStateSpy.mockImplementation((init) => [init, setIsEdit]);
  });

  it('should render FoodDetail with initial values', () => {
    const component = mount(foodDetail);
    let wrapper = component.find('#FoodDetail');
    expect(wrapper.exists()).toBeTruthy();

    wrapper = component.find('#nameInput').at(0).find('input');
    expect(wrapper.props().value).toBe(stubInitialState.selectedFridgeItem.name);
    wrapper = component.find('#typeInput').at(0).find('input');
    expect(wrapper.props().value).toBe(stubInitialState.selectedFridgeItem.type);
    wrapper = component.find('#quantityInput').at(0).find('input');
    expect(wrapper.props().value).toBe(stubInitialState.selectedFridgeItem.quantity);
    wrapper = component.find('#unitInput').at(0).find('input');
    expect(wrapper.props().value).toBe(stubInitialState.selectedFridgeItem.unit);
    wrapper = component.find('#expiryDateInput').at(0).find('input');
    expect(wrapper.props().value).toBe(stubInitialState.selectedFridgeItem.expiryDate);
    wrapper = component.find('#calorieInput').at(0).find('input');
    expect(wrapper.props().value).toBe(stubInitialState.selectedFridgeItem.nutritionFacts[0]);
    wrapper = component.find('#sodiumInput').at(0).find('input');
    expect(wrapper.props().value).toBe(stubInitialState.selectedFridgeItem.nutritionFacts[1]);
    wrapper = component.find('#proteinInput').at(0).find('input');
    expect(wrapper.props().value).toBe(stubInitialState.selectedFridgeItem.nutritionFacts[2]);
  });

  it(`should set state properly on name input`, () => {
    const name = 'TEST_NAME';
    const component = mount(foodDetail);
    let wrapper = component.find('#nameInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: name } });
    wrapper = component.find('#nameInput').at(0).find('input');
    expect(wrapper.props().value).toBe(name);
  });

  it(`should set state properly on type input`, () => {
    const type = 'TEST_TYPE';
    const component = mount(foodDetail);
    let wrapper = component.find('#typeInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: type } });
    wrapper = component.find('#typeInput').at(0).find('input');
    expect(wrapper.props().value).toBe(type);
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

  it(`should set state properly on calorie input`, () => {
    const calorie = 'TEST_CALORIE';
    const component = mount(foodDetail);
    let wrapper = component.find('#calorieInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: calorie } });
    wrapper = component.find('#calorieInput').at(0).find('input');
    expect(wrapper.props().value).toBe(calorie);
  });

  it(`should set state properly on sodium input`, () => {
    const sodium = 'TEST_SODIUM';
    const component = mount(foodDetail);
    let wrapper = component.find('#sodiumInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: sodium } });
    wrapper = component.find('#sodiumInput').at(0).find('input');
    expect(wrapper.props().value).toBe(sodium);
  });

  it(`should set state properly on protein input`, () => {
    const protein = 'TEST_PROTEIN';
    const component = mount(foodDetail);
    let wrapper = component.find('#proteinInput').at(0).find('input');
    
    wrapper.simulate('change', { target: { value: protein } });
    wrapper = component.find('#proteinInput').at(0).find('input');
    expect(wrapper.props().value).toBe(protein);
  });

  it('should show nutritions on click Accordion', () => {
    const component = mount(foodDetail);
    let wrapper = component.find('#showNutritions');
    
    wrapper.at(1).simulate('click');
    let subcomp = component.find('.active');
    expect(subcomp.exists()).toBeTruthy();

    wrapper.at(1).simulate('click');
    subcomp = component.find('.active');
    expect(subcomp.length).toBe(0);
  });

  it('should press edit button', () => {
    const component = mount(foodDetail);
    let wrapper = component.find('#editButton').at(0);
    wrapper.simulate('click');
    
    //expect(spyOnPostFridgeItem).toHaveBeenCalledTimes(1);
    expect(setIsEdit).toHaveBeenCalledTimes(1);
  });

  it('should press delete button', () => {
    const component = mount(foodDetail);
    let wrapper = component.find('#deleteButton').at(0);
    wrapper.simulate('click');
    
    //expect(spyOnPostFridgeItem).toHaveBeenCalledTimes(1);
    expect(setIsEdit).toHaveBeenCalledTimes(1);
  });

  it('should press back button', () => {
    const component = mount(foodDetail);
    let wrapper = component.find('#backButton').at(0);
    wrapper.simulate('click');
    
    expect(setIsEdit).toHaveBeenCalledTimes(1);
  });
});