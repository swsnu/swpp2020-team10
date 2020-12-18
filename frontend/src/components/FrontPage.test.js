import { mount } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { FrontPage } from './FrontPage';
import { BrowserRouter as Router } from 'react-router-dom';


const initialState = {
  user: {
    isAuthorized: true,
    recommendation: {
      title: 'recipe',
      content: [
        '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
        '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
      ],
      rating: 2,
      serving: 2,
      cooking_time: 2,
      calories: 2,
    }
  },
  recipes: [
    {
      id: 1,
      title: 'title 1',
      rating: 3,
      serving: 1,
      cooking_time: 30,
      content: ['content 1', 'content 2'],
    }
  ],
  fridgeItem: {
    fridgeItems: [
      {
        name: 'name 1',
        quantity: 2,
      }
    ]
  },
};

const unAuthorizedState = {
  user: {
    isAuthorized: false,
    recommendation: {
      title: 'recipe',
      content: [
        '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
        '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
      ],
      rating: 2,
      serving: 2,
      cooking_time: 2,
      calories: 2,
    }
  },
  recipes: [
    {
      id: 1,
      title: 'title 1',
      rating: 3,
      serving: 1,
      cooking_time: 30,
      content: ['content 1', 'content 2'],
    }
  ],
  fridgeItem: {
    fridgeItems: []
  },
};

const mockStore = createStore((state = initialState) => state);
const mockStore2 = createStore((state = unAuthorizedState) => state);

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
  getFridgeItemList: jest.fn(),
  getRecommendation: jest.fn(),
  notification: jest.fn(),
}));


describe('<FrontPage />', () => {
  let component, component2;

  beforeEach(() => {
    mockDispatch.mockImplementation(() => ({ then: resolve => resolve() }));

    component = (
      <Provider store={mockStore}>
        <Router>
          <FrontPage />
        </Router>
      </Provider>
    );
    component2 = (
      <Provider store={mockStore2}>
        <Router>
          <FrontPage />
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

  it('renders on unauthorized user', () => {
    expect(mount(component2).length).toBe(1);
  });

  it('routes to recipe search page', () => {
    const value = 'apple';
    const wrapper = mount(component);
    wrapper.find('#searchInput').simulate('change', { target: { value } });
    expect(wrapper.find('#searchInput').prop('value')).toBe(value);
    wrapper.find('#searchInput').simulate('keydown', { key: 'Retarded' });
    wrapper.find('#searchInput').simulate('keydown', { key: 'Enter' });
    expect(mockHistoryPush).toBeCalledWith(`/search/${value}`);
  });

});
