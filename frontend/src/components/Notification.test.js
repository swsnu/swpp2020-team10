import { mount, shallow } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { Notification } from './Notification'
import { BrowserRouter as Router } from 'react-router-dom';


let initialState = {
  user: {
    noti : notiJSON,
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
const notiJSON = {
  'recent_comments': [
    {
      'comment_author': 'RandomUser',
      'review_id': 3,
      'review_title': 'noti testing',
      'review_recipe': 'Recipe 1'
    },
    {
      'comment_author': 'someMoreRandomUserWithVeryVeryLongUserName',
      'review_id': 4,
      'review_title': 'someReviewIwroteWithVeryVeryLongTitle',
      'review_recipe': 'Recipe 1'
    }
  ],
  'near_expired_items': [
    {
      'name' : 'some_food_name',
      'quantity' : 3,
      'left_days' : 2
    }
  ]
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
  notification: jest.fn((userId) => {return notiJSON;}),
}));


describe('<Notification />', () => {
  let component;

  beforeEach(() => {
    mockDispatch.mockImplementation(() => ({ then: resolve => resolve() }));

    component = (
      <Provider store={mockStore}>
        <Router>
          <Notification userId={1} />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    initialState.user.noti = notiJSON;
    let wrapper = mount(component);
    expect(wrapper.length).toBe(1);
  });

  it('renders nothing if null', () => {
    initialState.user.noti = null;
    let wrapper = mount(component);
    expect(wrapper.instance()).toBe(null);
  });

});
