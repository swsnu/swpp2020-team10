import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../test-utils/mocks';

import RecipeDetail from './RecipeDetail';
//import * as recipeActionCreators from '../store/actions/recipe';
//import * as reviewActionCreators from '../store/actions/review';

const stubInitialState = {
  'user': {
    'id': 1,
    'name': 'John',
    'isAuthorized': true
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

  'selectedRecipe': {
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
};

const mockStore = getMockStore(stubInitialState);


describe('<RecipeDetail />', () => {
  let recipeDetail; //spySelectRecipeById, spyGetReviewList, spyAddRecipeRatingById;
  const history = createBrowserHistory();
  let spyPush = jest.spyOn(history, 'push')
    .mockImplementation(() => {});
  beforeEach(() => {
    recipeDetail = (
      <Provider store={mockStore}>
        <Router history={history}>
          <Switch>
            <Route path='/' exact component={RecipeDetail} 
              match={{params: {recipe_id: 1}}} />
          </Switch>
        </Router>
      </Provider>
    );
    /*spySelectRecipeById = jest.spyOn(recipeActionCreators, 'selectRecipeById')
      .mockImplementation(() => {return () => {};});
    spyGetReviewList = jest.spyOn(reviewActionCreators, 'getReviewList')
      .mockImplementation(() => {return () => {};});
    spyAddRecipeRatingById = jest.spyOn(recipeActionCreators, 'addRecipeRatingById')
      .mockImplementation(() => {return () => {};});*/
      
  });

  it('should render recipe detail', () => {
    const component = mount(recipeDetail);
    const wrapper = component.find('.RecipeDetail');
    expect(wrapper.length).toBe(1);
  });

  it('should press my fridge button', () => {
    const component = mount(recipeDetail);
    const wrapper = component.find('#myFridgeButton').at(0);
    wrapper.simulate('click');
    expect(wrapper.length).toBe(1);
    expect(spyPush).toBeCalledTimes(1);
  });

  it('should press write button', () => {
    const component = mount(recipeDetail);
    const wrapper = component.find('#writeButton').at(0);
    wrapper.simulate('click');
    expect(wrapper.length).toBe(1);
  });

  it('should change rating', () => {
    const component = mount(recipeDetail);
    const event = {rating: 1}; 
    const wrapper = component.find('RatingIcon').last();
    wrapper.simulate('click', event);
    expect(wrapper.length).toBe(1);
  });
});