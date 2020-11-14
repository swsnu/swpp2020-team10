import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../test-utils/mocks';

import ReviewCreator from './ReviewCreator';
//import * as fridgeItemActionCreators from '../store/actions/fridgeItem';

const stubInitialState = {
  user: {
    id: 1,
    name: 'Tester',
    isAuthorized: true
  },
  'recipes' : [{
    'id': 1,
    'food_id': 3,
    'title': 'Kimchi',
    'content': 'K-food Kimchi recipe blahblah',
    'rating': 3.44,
    'count_ratings': 1,
    'ingredients': {
      'cabbage': '100'
    },
    'cooking_time': 120,
    'tag': {
      'difficulty': 'hard'
    },
    'serving': 1
  }],
  
  'selectedReview': {
    'id': 1,
    'recipe_id': 1,
    'user_id': 1,
    'title': 'Kimchi review!!!',
    'content': 'Kimchi is good modify content',
    'likes': 5,
    'dislikes': 5,
    'reports': 3
  },
  
  'reviews' : [{
    'id': 1,
    'recipe_id': 1,
    'user_id': 1,
    'title': 'Kimchi review!!!',
    'content': 'Kimchi is good modify content',
    'likes': 5,
    'dislikes': 5,
    'reports': 3
  },
  {
    'id': 2,
    'recipe_id': 1,
    'user_id': 1,
    'title': 'Review 2',
    'content': 'Review 22',
    'likes': 3,
    'dislikes': 5,
    'reports': 0
  }],
  
  'comments': [{
    'id': 1,
    'review_id': 1,
    'user_id': 1,
    'content': 'some bad comment',
    'likes': 0,
    'reports': 0
  },
  {
    'id': 2,
    'review_id': 1,
    'user_id': 2,
    'content': 'review test 1',
    'likes': 0,
    'reports': 0
  }]
};

const mockStore = getMockStore(stubInitialState);

describe('<ReviewCreator />', () => {
  let reviewCreator;
  const history = createBrowserHistory();
  let spyGoBack = jest.spyOn(history, 'goBack')
    .mockImplementation(() => {});
  //let spyOnPostFridgeItem = jest.spyOn(fridgeItemActionCreators, 'postFridgeItem')
  //  .mockImplementation({});
  
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  
  beforeEach(() => {
    reviewCreator = (
      <Provider store={mockStore}>
        <Router history={history}>
          <Switch>
            <Route path='/' component={ReviewCreator}
              match={{params: {recipe_id: 1}, isExact: true, path: '', url: ''}}/>
          </Switch>
        </Router>
      </Provider>
    );
    useStateSpy.mockImplementation((init) => [init, setState]);
  });

  it('should render ReviewCreator', () => {
    const component = mount(reviewCreator);
    const wrapper = component.find('#ReviewCreator');
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should change tab properly on click tab buttons', () => {
    const component = mount(reviewCreator);
    let wrapper = component.find('MenuItem').at(1);
    wrapper.simulate('click');
    let subcomp = component.find('#PreviewTab');
    expect(subcomp.exists()).toBeTruthy();

    wrapper = component.find('MenuItem').at(0);
    wrapper.simulate('click');
    subcomp = component.find('#WriteTab');
    expect(subcomp.exists()).toBeTruthy();
  });

  it(`should change value properly on title input`, () => {
    const title = 'TEST_TITLE';
    const component = mount(reviewCreator);
    let wrapper = component.find('#titleInput').at(0).find('input');
    wrapper.simulate('change', { target: { value: title } });
    
    wrapper = component.find('MenuItem').at(1);
    wrapper.simulate('click');
    let subcomp = component.find('#title').at(0);
    expect(subcomp.text()).toBe(title);
  });

  it(`should change value properly on content input`, () => {
    const content = 'TEST_CONTENT';
    const component = mount(reviewCreator);
    let wrapper = component.find('#contentInput').at(0).find('textarea');
    wrapper.simulate('change', { target: { value: content } });
    
    wrapper = component.find('MenuItem').at(1);
    wrapper.simulate('click');
    let subcomp = component.find('#contentPreview').at(0);
    expect(subcomp.text()).toBe(content);
  });

  it('should press submit button', () => {
    const component = mount(reviewCreator);
    let wrapper = component.find('#submitButton').at(0);
    wrapper.simulate('click');
    
    //expect(spyGoBack).toHaveBeenCalledTimes(0);
    //expect(spyOnPostFridgeItem).toHaveBeenCalledTimes(1);
  });

  it('should press cancel button', () => {
    const component = mount(reviewCreator);
    let wrapper = component.find('#cancelButton').at(0);
    wrapper.simulate('click');
    expect(wrapper.length).toBe(1);
    expect(spyGoBack).toHaveBeenCalledTimes(1);
  });
});