import React from 'react';
import { mount } from 'enzyme';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { Recommendation } from './Recommendation';
import { getMockStore } from '../test-utils/mocks';


jest.mock('axios');

jest.mock('../store/actions/index', () => ({
  getRecommendation: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const stubState = {
  user: {
    isAuthorized: true,
    id: 1,
    name: 'test',
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
  }
};

const stubStateSingular = {
  user: {
    isAuthorized: true,
    id: 1,
    name: 'test',
    recommendation: {
      title: 'recipe',
      content: [],
      rating: 1,
      serving: 1,
      cooking_time: 1,
      calories: 1,
    }
  }
};

const mockStore = getMockStore({});

describe('<Recommendation />', () => {
  let component;

  beforeEach(() => {
    component = (
      <Provider store={mockStore}>
        <Router>
          <Recommendation />
        </Router>
      </Provider>
    );

    useDispatch.mockImplementation(() => () => Promise.resolve());
    useSelector.mockImplementation(selector => selector(stubState));
  });

  it('renders without crashing', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    expect(wrapper.length).toBe(1);
  });

  it('thumbs up', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#thumbsUpButton').first().simulate('click');
    });
    wrapper.update();
  });

  it('thumbs down', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();
    
    await act(async () => {
      wrapper.find('#thumbsDownButton').first().simulate('click');
    });
    wrapper.update();
  });

  it('singular attributes', async () => {
    useSelector.mockImplementation(selector => selector(stubStateSingular));

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();
  });
});