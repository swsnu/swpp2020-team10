import React from 'react';
import { mount } from 'enzyme';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { Notification } from './Notification';
import { getMockStore } from '../test-utils/mocks';


jest.mock('../store/actions/index', () => ({
  notification: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const notiJSON = {
  'recent_comments': [
    {
      'comment_author': 'test',
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
      'name': 'some_food_name',
      'quantity': 3,
      'left_days': 2
    }
  ]
};

const defaultMessage = 'You have no new notifications.';

const mockStore = getMockStore({});

describe('<Notification />', () => {
  let component;

  beforeEach(() => {
    component = (
      <Provider store={mockStore}>
        <Router>
          <Notification />
        </Router>
      </Provider>
    );

    useDispatch.mockImplementation(() => () => Promise.resolve());

    useSelector.mockImplementation(selector =>
      selector({
        user: {
          id: 1,
          isAuthorized: true,
          name: 'test',
          noti: null,
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });

    expect(wrapper.length).toBe(1);
  });

  it('not authorized', async () => {
    useSelector.mockImplementation(selector =>
      selector({
        user: {
          id: 1,
          isAuthorized: false,
          name: 'test',
          noti: null,
        },
      })
    );

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });

    expect(wrapper.text()).toBe(defaultMessage);
  });

  it('renders default message if null', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });

    expect(wrapper.text()).toBe(defaultMessage);
  });

  it('has noti', async () => {
    useSelector.mockImplementation(selector =>
      selector({
        user: {
          id: 1,
          isAuthorized: true,
          name: 'test',
          noti: notiJSON,
        },
      })
    );

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();    
  });

  it('empty notification', async () => {
    useSelector.mockImplementation(selector =>
      selector({
        user: {
          id: 1,
          isAuthorized: true,
          name: 'test',
          noti: {
            recent_comments: [],
            near_expired_items: [],
          },
        },
      })
    );

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();
  });
});
