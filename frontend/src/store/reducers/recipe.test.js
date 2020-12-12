import reducer from './recipe';
import * as actionTypes from '../actions/actionTypes';

const stubRecipe = {
  id: 1,
  food_id: 3,
  title: 'Kimchi',
  content: ['step1', 'step2'],
  image: 'http://domain/image.jpg',
  rating: 1,
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
};

const ratedStubRecipe = {
  id: 1,
  food_id: 3,
  title: 'Kimchi',
  content: ['step1', 'step2'],
  image: 'http://domain/image.jpg',
  rating: 3,
  count_ratings: 2,
  ingredients: {
    'cabbage': 100
  },
  ingredient_lines: ['first', 'second' ,'third'],
  health_labels: ['label1', 'label2'],
  diet_labels: ['label3', 'label4'],
  calories: 500,
  cooking_time: 120,
  serving: 2,
};

const stubRecipe2 = {
  id: 2,
  food_id: 3,
  title: 'Kimchi 2',
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
};

describe('recipe reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual({recipes: [], selectedRecipe: null});
  });

  it('should get recipe', () => {
    const stubRecipes = [stubRecipe, stubRecipe2];
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
    const stubInitialState = {recipes: [stubRecipe, stubRecipe2], selectedRecipe: stubRecipe};
    const newState = reducer(stubInitialState, {
      type: actionTypes.RATE_RECIPE,
      rating: 3,
      count_ratings: 2
    });
    expect(newState).toEqual({recipes: [stubRecipe, stubRecipe2], selectedRecipe: ratedStubRecipe});
  });
});