import { mount } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { BrowserRouter as Router } from 'react-router-dom';
import { RecipeSearchPage } from './RecipeSearchPage';


const initialState = {
  user: {

  },
  recipe: {
    recipes: [
      {
        id: 1,
        title: 'title 1',
        rating: 3,
        serving: 1,
        cooking_time: 30,
        content: 'content 1',
        tag: [
          'tag 1',
        ],
      }
    ],
  },
  fridgeItem: {
    fridgeItems: [
      {
        name: 'name 1',
        quantity: 2,
      }
    ]
  },
};

const mockStore = createStore((state = initialState) => state);

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../store/actions/index', () => ({
  fetchAllRecipes: jest.fn(),
}));


describe('<RecipeSearchPage />', () => {
  let component;

  beforeEach(() => {
    mockDispatch.mockImplementation(() => ({ then: resolve => resolve() }));

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
    wrapper.find('#enableCookingTime').first().simulate('change', { target: { checked: true } });
    wrapper.find('#cookingTimeRangeInput').first().simulate('change', { target: { value: 60 } });
    wrapper.find('#cookingTimeNumberInput').first().simulate('change', { target: { value: 90 } });
    wrapper.find('#enableMinRating').first().simulate('change', { target: { checked: true } });
    wrapper.find('#minRatingRangeInput').first().simulate('change', { target: { value: 4 } });
    wrapper.find('#minRatingNumberInput').first().simulate('change', { target: { value: 4.3 } });
    wrapper.find('#includeTagsInput').first().simulate('change', { target: { value: 'include' } });
    wrapper.find('#excludeTagsInput').first().simulate('change', { target: { value: 'exclude' } });
  });

});