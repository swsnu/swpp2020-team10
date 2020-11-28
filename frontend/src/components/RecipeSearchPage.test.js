//import axios from 'axios';
import axios from 'axios';
import React from 'react';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { BrowserRouter as Router } from 'react-router-dom';
import { RecipeSearchPage } from './RecipeSearchPage';


const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: () => mockUseSelector(),
}));

const initialState = {
  user: {

  },
};

const stubRecipes = [
  {
    title: 'Recipe 4',
    content: 'content',
    rating: 3.5,
    serving: 4,
    cooking_time: 30,
    calorie: 256,
    diet_labels: ['diet1', 'diet2'],
    health_labels: ['health1', 'health2'],
  },
];

const mockStore = createStore((state = initialState) => state);

describe('<RecipeSearchPage />', () => {
  let component;
  beforeEach(() => {
    component = (
      <Provider store={mockStore}>
        <Router>
          <RecipeSearchPage match={{ params: { q: 'banana' } }} />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(mount(component).length).toBe(1);
  });

  it('sets search input on change', () => {
    const value = 'apple';
    const wrapper = mount(component);
    wrapper.find('#searchInput').simulate('change', { target: { value } });
    expect(wrapper.find('#searchInput').prop('value')).toBe(value);
  });

  it('changes filter options', () => {
    const wrapper = mount(component);
    wrapper.find('#showFilterTabButton').first().simulate('click');
    wrapper.find('#enableFridge').first().simulate('change', { target: { checked: true } });
    wrapper.find('#enableMaxCookingTime').first().simulate('change', { target: { checked: true } });
    wrapper.find('#maxCookingTimeInput').first().simulate('change', { target: { value: 90 } });
    wrapper.find('#enableMinRating').first().simulate('change', { target: { checked: true } });
    wrapper.find('#minRatingInput').first().simulate('change', { target: { value: 4.3 } });
    wrapper.find('#enableMaxCalorie').first().simulate('change', { target: { checked: true } });
    wrapper.find('#maxCalorieInput').first().simulate('change', { target: { value: 400 } });
    wrapper.find('#dietLabelsInput').first().simulate('change', { target: { value: 'dl1 dl2' } });
    wrapper.find('#healthLabelsInput').first().simulate('change', { target: { value: 'hl1 hl2' } });
  });

  it('changes sort options', () => {
    const wrapper = mount(component);
    wrapper.find('#sortOption').first().simulate('change', { target: { value: 'rating' } });
  });

  describe('when user is not authorized', () => {
    beforeEach(() => {
      mockUseSelector.mockImplementation(() => false);
    });

    it('apply filter button works with empty response', () => {
      jest.spyOn(axios, 'get')
        .mockImplementation(() => new Promise(resolve => resolve({ data: { recipes: [] } })));

      const wrapper = mount(component);
      wrapper.find('#showFilterTabButton').first().simulate('click');
      wrapper.find('#applyFilterButton').first().simulate('click');
    });

    it('apply filter button works with nonempty response', () => {
      jest.spyOn(axios, 'get')
        .mockImplementation(() => new Promise(resolve => resolve({ data: { recipes: stubRecipes } })));

      const wrapper = mount(component);
      wrapper.find('#showFilterTabButton').first().simulate('click');
      wrapper.find('#applyFilterButton').first().simulate('click');
    });
  });

  describe('when user is authorized', () => {
    beforeEach(() => {
      mockUseSelector.mockImplementation(() => true);

      jest.spyOn(axios, 'get')
        .mockImplementation(() => new Promise(resolve => resolve(
          {
            data: {
              cooking_time: 22,
              rating: 2,
              calorie: 222,
              diet_labels: ['d1', 'd2'],
              health_labels: ['h1', 'h2'],
            }
          }
        )));

      jest.spyOn(axios, 'put').mockImplementation(() => Promise.resolve());
    });

    it('user may not have stored settings', () => {
      jest.spyOn(axios, 'get')
        .mockImplementation(() => new Promise(resolve => resolve(
          {
            data: {
              cooking_time: null,
              rating: null,
              calorie: null,
              diet_labels: [],
              health_labels: [],
            }
          }
        )));

      mount(component);
    });

    it('save preferences button works', () => {
      const wrapper = mount(component);
      wrapper.find('#showFilterTabButton').first().simulate('click');
      wrapper.find('#saveFilterButton').first().simulate('click');
    });
  });

});