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
    id: 1,
    title: 'Recipe 4',
    content: ['content'],
    image: '',
    rating: 3.5,
    serving: 1,
    cooking_time: 1,
    calories: 1,
    diet_labels: ['diet1', 'diet2'],
    health_labels: ['health1', 'health2'],
  },
];

let uid = 0;

const getId = () => {
  return uid++;
};

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
              calories: 222,
              diet_labels: ['d1', 'd2'],
              health_labels: ['h1', 'h2'],
            }
          }
        ));
      } else {
        let recipes = [];
        for (let i = 0; i < 20; i++) {
          recipes.push({
            id: getId(),
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
            calories: 10,
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

  it('renders without crashing', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    expect(wrapper.length).toBe(1);
  });

  it('sets search input on change', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#searchInput').simulate('change', { target: { value: 'apple' } });
      wrapper.find('#searchInput').simulate('keyDown', { key: '' });
      wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
    });
    wrapper.update();
  });

  it('changes filter options', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#showFilterTabButton').first().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#enableFridge').first().simulate('change');
      wrapper.find('#enableMaxCookingTime').first().simulate('change');
      wrapper.find('#enableMinRating').first().simulate('change');
      wrapper.find('#enableMaxCalorie').first().simulate('change');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#maxCookingTimeInput').first().simulate('change', { target: { value: 90 } });
      wrapper.find('#minRatingInput').first().simulate('change', { target: { value: 4.3 } });
      wrapper.find('#maxCalorieInput').first().simulate('change', { target: { value: 400 } });
      wrapper.find('#dietLabelsInput').first().simulate('change', { target: { value: 'dl1 dl2' } });
      wrapper.find('#healthLabelsInput').first().simulate('change', { target: { value: 'hl1 hl2' } });
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#searchInput').simulate('change', { target: { value: 'test' } });
      wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
    });
    wrapper.update();
  });

  it('changes sort options', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#sortOption').first().prop('onChange')(undefined, { value: 'time' });
      wrapper.find('#searchInput').simulate('change', { target: { value: 'test' } });
      wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
    });
    wrapper.update();
  });

  it('singular recipe attributes', async () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: { recipes: stubRecipes } })));

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#searchInput').simulate('change', { target: { value: 'test' } });
      wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
    });
    wrapper.update();
  });

  it('empty search result', async () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: { recipes: [] } })));

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#searchInput').simulate('change', { target: { value: 'test' } });
      wrapper.find('#searchInput').simulate('keyDown', { key: 'Enter' });
    });
    wrapper.update();
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

      await act(async () => {
        wrapper.find('#showFilterTabButton').first().simulate('click');
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('#applyFilterButton').first().simulate('click');
      });
      wrapper.update();
    });
  });

  describe('when user is authorized', () => {
    beforeEach(() => {
      useSelector.mockImplementation(selector => selector({ user: { isAuthorized: true } }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('user may not have stored settings', async () => {
      axios.get = jest.fn((url) => {
        if (url === '/api/user/setting/') {
          return new Promise(resolve => resolve(
            {
              data: {
                cooking_time: null,
                rating: null,
                calories: null,
                diet_labels: [],
                health_labels: [],
              }
            }
          ));
        } else {
          return new Promise(resolve => resolve({ data: { recipes: stubRecipes } }));
        }
      });

      let wrapper;
      await act(async () => {
        wrapper = mount(component);
      });
      wrapper.update();
    });

    it('save preferences button works', async () => {
      let wrapper;
      await act(async () => {
        wrapper = mount(component);
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('#showFilterTabButton').first().simulate('click');
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('#saveFilterButton').first().simulate('click');
      });
      wrapper.update();
    });

    it('save preferences button works with changed filters', async () => {
      let wrapper;
      await act(async () => {
        wrapper = mount(component);
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('#showFilterTabButton').first().simulate('click');
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('#enableMaxCookingTime').first().simulate('change');
        wrapper.find('#enableMinRating').first().simulate('change');
        wrapper.find('#enableMaxCalorie').first().simulate('change');
      });
      wrapper.update();
      
      await act(async () => {
        wrapper.find('#saveFilterButton').first().simulate('click');
      });
      wrapper.update();
    });
  });

});