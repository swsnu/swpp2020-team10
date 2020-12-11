import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../test-utils/mocks';
import { act } from 'react-dom/test-utils';

import ReviewEditor from './ReviewEditor';
import * as reviewActionCreators from '../store/actions/review';
//import * as fridgeItemActionCreators from '../store/actions/fridgeItem';

const stubInitialState = {
  user: {
    id: 1,
    name: 'Tester',
    isAuthorized: true
  },
  selectedRecipe: {
    id: 1,
    food_id: 3,
    title: 'Kimchi',
    content: 'K-food Kimchi recipe blahblah',
    rating: 3.44,
    count_ratings: 1,
    ingredients: {
      cabbage: 100
    },
    cooking_time: 120,
    tag: {
      difficulty: 'hard'
    },
    serving: 1
  },
  
  selectedReview: {
    id: 1,
    recipe_id: 1,
    user_id: 1,
    title: 'Kimchi review!!!',
    content: 'Kimchi is good modify content',
    likes: 5,
    dislikes: 5,
    reports: 3
  },
};

const mockStore = getMockStore(stubInitialState);

describe('<ReviewEditor />', () => {
  let reviewEditor;
  const history = createBrowserHistory();
  let spyGoBack = jest.spyOn(history, 'goBack')
    .mockImplementation(() => {});
  //let spyOnPostFridgeItem = jest.spyOn(fridgeItemActionCreators, 'postFridgeItem')
  //  .mockImplementation({});
  
  let spyGetReview, spyEditReview;
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  
  beforeEach(() => {
    reviewEditor = (
      <Provider store={mockStore}>
        <Router history={history}>
          <Switch>
            <Route path='/' component={ReviewEditor}
              match={{params: {review_id: 1}, isExact: true, path: '', url: ''}}/>
          </Switch>
        </Router>
      </Provider>
    );
    useStateSpy.mockImplementation((init) => [init, setState]);
    spyGetReview = jest.spyOn(reviewActionCreators, 'getReview')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubInitialState.selectedReview
          };
          resolve(result);
        });
      };});
    spyEditReview = jest.spyOn(reviewActionCreators, 'editReview')
      .mockImplementation(() => {return () => {};});
  });

  it('should render ReviewEditor with initial values', async () => {
    let component;
    await act(async () => {
      component = mount(reviewEditor);
    });
    component.update();
    let wrapper = component.find('#submitButton');
    expect(wrapper.exists()).toBeTruthy();
    expect(spyGetReview).toBeCalledTimes(1);
    expect(spyEditReview).toBeCalledTimes(0);

    /*wrapper = component.find('MenuItem').at(1);
    wrapper.simulate('click');

    let subcomp = component.find('#title').at(0);
    expect(subcomp.text()).toBe(stubInitialState.selectedReview.title);
    subcomp = component.find('#contentPreview').at(0);
    expect(subcomp.text()).toBe(stubInitialState.selectedReview.content);*/
  });

  it('should change tab properly on click tab buttons', async () => {
    let component;
    await act(async () => {
      component = mount(reviewEditor);
    });
    component.update();
    let wrapper = component.find('MenuItem').at(1);
    wrapper.simulate('click');
    let subcomp = component.find('PreviewTab');
    expect(subcomp.exists()).toBeTruthy();

    wrapper = component.find('MenuItem').at(0);
    wrapper.simulate('click');
    subcomp = component.find('WriteTab');
    expect(subcomp.exists()).toBeTruthy();
  });

  it(`should change value properly on title input`, async () => {
    const title = 'TEST_TITLE';
    const content = 'TEST_CONTENT';
    let component;
    await act(async () => {
      component = mount(reviewEditor);
    });
    component.update();
    let wrapper = component.find('#titleInput').at(0).find('input');
    wrapper.simulate('change', { target: { value: title } });
    wrapper = component.find('#contentInput').at(0).find('textarea');
    wrapper.simulate('change', { target: { value: content } });

    wrapper = component.find('MenuItem').at(1);
    wrapper.simulate('click');
  });

  it(`should change value properly on content input`, async () => {
    const content = 'TEST_CONTENT';
    let component;
    await act(async () => {
      component = mount(reviewEditor);
    });
    component.update();
    let wrapper = component.find('#imageInput').at(0).find('input');
    wrapper.simulate('change', { target: { value: content } });

    wrapper = component.find('MenuItem').at(1);
    wrapper.simulate('click');
  });

  it('should press submit button', async () => {
    let component;
    await act(async () => {
      component = mount(reviewEditor);
    });
    component.update();
    let wrapper = component.find('#submitButton').at(0);
    wrapper.simulate('click');
    
    //expect(spyGoBack).toHaveBeenCalledTimes(0);
    //expect(spyOnPostFridgeItem).toHaveBeenCalledTimes(1);
  });

  it('should press cancel button', async () => {
    let component;
    await act(async () => {
      component = mount(reviewEditor);
    });
    component.update();
    let wrapper = component.find('#cancelButton').at(0);
    wrapper.simulate('click');
    expect(spyGoBack).toHaveBeenCalledTimes(1);
  });
});