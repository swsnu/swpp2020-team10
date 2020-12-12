import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../test-utils/mocks';
import { act } from 'react-dom/test-utils';

import RecipeDetail from './RecipeDetail';
import * as recipeActionCreators from '../store/actions/recipe';
import * as reviewActionCreators from '../store/actions/review';

const stubInitialState = {
  name: 'John',
  isAuthorized: true,
  noti: null,
  recommendation: null,
  
  user: {
    id: 1,
    name: 'John',
    isAuthorized: true,
    noti: null,
    recommendation: null,
  },

  recipes: [{
    id: 1,
    food_id: 3,
    title: 'Kimchi',
    content: ['step1', 'step2'],
    image: 'http://domain/image.jpg',
    rating: 3.44,
    count_ratings: 1,
    ingredients: {
      'cabbage': 100
    },
    ingredient_lines: ['first', 'second' ,'third'],
    health_labels: ['label1', 'label2'],
    diet_labels: ['label3', 'label4'],
    calories: 500,
    cooking_time: 120,
    serving: 2,
  }],

  selectedRecipe: {
    id: 1,
    food_id: 3,
    title: 'Kimchi',
    content: ['step1', 'step2'],
    image: 'http://domain/image.jpg',
    rating: 3.44,
    count_ratings: 1,
    ingredients: {
      'cabbage': 100
    },
    ingredient_lines: ['first', 'second' ,'third'],
    health_labels: ['label1', 'label2'],
    diet_labels: ['label3', 'label4'],
    calories: 500,
    cooking_time: 120,
    serving: 2,
  },

  reviews: [{
    id: 1,
    recipe_id: 1,
    user_id: 1,
    title: 'Kimchi review!!!',
    content: 'Kimchi is good modify content',
    likes: 5,
    dislikes: 5,
    reports: 3
  },
  {
    id: 2,
    recipe_id: 1,
    user_id: 1,
    title: 'Review 2',
    content: 'Review 22',
    likes: 3,
    dislikes: 5,
    reports: 0
  }],
};

const stubInitialState2 = {
  name: 'John',
  isAuthorized: true,
  noti: null,
  recommendation: null,

  recipes: [{
    id: 1,
    food_id: 3,
    title: 'Kimchi',
    content: ['step1', 'step2'],
    image: '',
    rating: 3.44,
    count_ratings: 1,
    ingredients: {
      'cabbage': 100
    },
    ingredient_lines: ['first', 'second' ,'third'],
    health_labels: ['label1', 'label2'],
    diet_labels: ['label3', 'label4'],
    calories: 1,
    cooking_time: 1,
    serving: 1,
  }],

  selectedRecipe: {
    id: 1,
    food_id: 3,
    title: 'Kimchi',
    content: ['step1', 'step2'],
    image: '',
    rating: 3.44,
    count_ratings: 1,
    ingredients: {
      'cabbage': 100
    },
    ingredient_lines: ['first', 'second' ,'third'],
    health_labels: ['label1', 'label2'],
    diet_labels: ['label3', 'label4'],
    calories: 1,
    cooking_time: 1,
    serving: 1,
  },

  reviews: [{
    id: 1,
    recipe_id: 1,
    user_id: 1,
    title: 'Kimchi review!!!',
    content: 'Kimchi is good modify content',
    likes: 5,
    dislikes: 5,
    reports: 3
  },
  {
    id: 2,
    recipe_id: 1,
    user_id: 1,
    title: 'Review 2',
    content: 'This review is too long to show in a card description in card content in card in card group in a div classname review',
    likes: 3,
    dislikes: 5,
    reports: 0
  }],
};

const mockStore = getMockStore(stubInitialState);
const mockStore2 = getMockStore(stubInitialState2);

describe('<RecipeDetail />', () => {
  let recipeDetail, recipeDetail2, spySelectRecipeById, spyGetReviewList, spyAddRecipeRatingById;
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
    recipeDetail2 = (
      <Provider store={mockStore2}>
        <Router history={history}>
          <Switch>
            <Route path='/' exact component={RecipeDetail} 
              match={{params: {recipe_id: 1}}} />
          </Switch>
        </Router>
      </Provider>
    );
    spySelectRecipeById = jest.spyOn(recipeActionCreators, 'selectRecipeById')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyGetReviewList = jest.spyOn(reviewActionCreators, 'getReviewList')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyAddRecipeRatingById = jest.spyOn(recipeActionCreators, 'addRecipeRatingById')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
  });

  it('should render recipe detail', async () => {
    let component;
    await act(async () => {
      component = mount(recipeDetail);
    });
    component.update();
    const wrapper = component.find('#RecipeDetail');
    expect(wrapper.exists()).toBeTruthy();
    expect(spySelectRecipeById).toHaveBeenCalledTimes(1);
    expect(spyGetReviewList).toHaveBeenCalledTimes(1);
  });

  it('should render recipe detail 2', async () => {
    let component;
    await act(async () => {
      component = mount(recipeDetail2);
    });
    component.update();
    const wrapper = component.find('#RecipeDetail');
    expect(wrapper.exists()).toBeTruthy();
    expect(spySelectRecipeById).toHaveBeenCalledTimes(1);
    expect(spyGetReviewList).toHaveBeenCalledTimes(1);
  });
  
  it('should press write button', async () => {
    let component;
    await act(async () => {
      component = mount(recipeDetail);
    });
    component.update();
    const wrapper = component.find('#writeButton').at(0);
    wrapper.simulate('click');
    expect(wrapper.length).toBe(1);
    expect(spyPush).toHaveBeenCalledTimes(1);
  });

  it('should change rating', async () => {
    let component;
    await act(async () => {
      component = mount(recipeDetail);
    });
    component.update();
    const event = {rating: 1}; 
    const wrapper = component.find('RatingIcon').last();
    wrapper.simulate('click', event);

    await act(async () => {
      expect(wrapper.length).toBe(1);
    })
  });
});