import axios from 'axios';
import React from 'react';
import { mount } from 'enzyme';
import { Provider, useSelector } from 'react-redux';
import { act } from 'react-dom/test-utils';

import { BrowserRouter as Router } from 'react-router-dom';
import { RecipeSearchPage } from './RecipeSearchPage';
import { getMockStore } from '../test-utils/mocks';


jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('axios');

const stubRecipes = [
  {
    title: 'Recipe 4',
    content: ['content'],
    image: '',
    rating: 3.5,
    serving: 1,
    cooking_time: 1,
    calorie: 1,
    diet_labels: ['diet1', 'diet2'],
    health_labels: ['health1', 'health2'],
  },
];

const mockStore = getMockStore({});

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

    axios.get = jest.fn((url) => {
      if (url === '/api/user/setting/') {
        return new Promise(resolve => resolve(
          {
            data: {
              cooking_time: 22,
              rating: 2,
              calorie: 222,
              diet_labels: ['d1', 'd2'],
              health_labels: ['h1', 'h2'],
            }
          }
        ));
      } else {
        let recipes = [];
        for (let i = 0; i < 20; i++) {
          recipes.push({
            title: 'Recipe 4',
            content: [
              '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
              '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
              '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
            ],
            image: '',
            rating: 3.5,
            serving: 10,
            cooking_time: 10,
            calorie: 10,
            diet_labels: ['diet1', 'diet2'],
            health_labels: ['health1', 'health2'],
          });
        }
        return new Promise(resolve => resolve({ data: { recipes } }));
      }
    });

    axios.put = jest.fn((url, data) => new Promise(resolve => resolve(data)));
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
    wrapper.find('#searchInput').simulate('keyDown', { key: '' });
    wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
  });

  it('changes filter options', () => {
    const wrapper = mount(component);
    wrapper.find('#showFilterTabButton').first().simulate('click');
    wrapper.find('#enableFridge').first().simulate('change');
    wrapper.find('#enableMaxCookingTime').first().simulate('change');
    wrapper.find('#maxCookingTimeInput').first().simulate('change', { target: { value: 90 } });
    wrapper.find('#enableMinRating').first().simulate('change');
    wrapper.find('#minRatingInput').first().simulate('change', { target: { value: 4.3 } });
    wrapper.find('#enableMaxCalorie').first().simulate('change');
    wrapper.find('#maxCalorieInput').first().simulate('change', { target: { value: 400 } });
    wrapper.find('#dietLabelsInput').first().simulate('change', { target: { value: 'dl1 dl2' } });
    wrapper.find('#healthLabelsInput').first().simulate('change', { target: { value: 'hl1 hl2' } });

    wrapper.find('#searchInput').simulate('change', { target: { value: 'test' } });
    wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
  });

  it('changes sort options', () => {
    const wrapper = mount(component);
    wrapper.find('#sortOption').first().prop('onChange')(undefined, { value: ['time'] });
    wrapper.update();
    
    wrapper.find('#searchInput').simulate('change', { target: { value: 'test' } });
    wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
  });

  it('singular recipe attributes', () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: { recipes: stubRecipes } })));

    const wrapper = mount(component);
    wrapper.find('#searchInput').simulate('change', { target: { value: 'test' } });
    wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
  });

  it('empty search result', () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: { recipes: [] } })));

    const wrapper = mount(component);
    wrapper.find('#searchInput').simulate('change', { target: { value: 'test' } });
    wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
  });

  describe('when user is not authorized', () => {
    beforeEach(() => {
      useSelector.mockImplementation(selector => selector({ user: { isAuthorized: false } }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('apply filter button works', async () => {
      let wrapper;
      await act(async () => {
        wrapper = mount(component);
      });
      wrapper.update();

      wrapper.find('#showFilterTabButton').first().simulate('click');
      wrapper.find('#applyFilterButton').first().simulate('click');
    });
  });

  describe('when user is authorized', () => {
    beforeEach(() => {
      useSelector.mockImplementation(selector => selector({ user: { isAuthorized: true } }));
    });

    afterEach(() => {
      jest.clearAllMocks();
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

    it('save preferences button works', async () => {
      let wrapper;
      await act(async () => {
        wrapper = mount(component);
      });
      wrapper.update();

      wrapper.find('#showFilterTabButton').first().simulate('click');
      wrapper.find('#saveFilterButton').first().simulate('click');
    });

    it('save preferences button works with changed filters', async () => {
      let wrapper;
      await act(async () => {
        wrapper = mount(component);
      });
      wrapper.update();

      wrapper.find('#showFilterTabButton').first().simulate('click');
      wrapper.find('#enableMaxCookingTime').first().simulate('change');
      wrapper.find('#enableMinRating').first().simulate('change');
      wrapper.find('#enableMaxCalorie').first().simulate('change');
      wrapper.find('#saveFilterButton').first().simulate('click');
    });
  });

});