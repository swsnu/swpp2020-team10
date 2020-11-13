import reducer from './recipe';
import * as actionTypes from '../actions/actionTypes';

const stubRecipe = {
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
};

describe('recipe reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual({recipes: [], selectedRecipe: null});
  });

  it('should get recipe', () => {
    const stubRecipes = [{
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
    }, {
      'id': 2,
      'food_id': 3,
      'title': 'Kimchi 2',
      'content': 'K-food recipe blahblah',
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
    }];
    const newState = reducer(undefined, {
      type: actionTypes.FETCH_ALL_RECIPES,
      recipes: stubRecipes,
    });
    expect(newState).toEqual({recipes: stubRecipes, selectedRecipe: null});
  });
  it('should get recipe', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GET_RECIPE,
      target: stubRecipe,
    });
    expect(newState).toEqual({recipes: [], selectedRecipe: stubRecipe});
  });
  it('should rate recipe', () => {
    const stubInitialState = {recipes: [{
      'id': 1,
      'food_id': 3,
      'title': 'Kimchi',
      'content': 'K-food Kimchi recipe blahblah',
      'rating': 1,
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
    {
      'id': 2,
      'food_id': 3,
      'title': 'Kimchi 2',
      'content': 'K-food recipe blahblah',
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
    }
    ], selectedRecipe: null};
    const newState = reducer(stubInitialState, {
      type: actionTypes.RATE_RECIPE,
      targetID: 1,
      rating: 1,
    });
    expect(newState).toEqual({recipes: [{
      'id': 1,
      'food_id': 3,
      'title': 'Kimchi',
      'content': 'K-food Kimchi recipe blahblah',
      'rating': 1,
      'count_ratings': 2,
      'ingredients': {
        'cabbage': '100'
      },
      'cooking_time': 120,
      'tag': {
        'difficulty': 'hard'
      },
      'serving': 1
    }, {
      'id': 2,
      'food_id': 3,
      'title': 'Kimchi 2',
      'content': 'K-food recipe blahblah',
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
    }
    ], selectedRecipe: null});
  });
});