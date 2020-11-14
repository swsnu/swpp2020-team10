import axios from 'axios';

import * as actionCreators from './recipe';
import store from '../store';

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

describe('recipe actionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch recipes correctly', () => {
    const stubRecipes = [stubRecipe];
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubRecipes
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.fetchAllRecipes()).then(() => {
      const newState = store.getState();
      expect(newState.recipe.recipes).toBe(stubRecipes);
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should get recipe correctly', () => {
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubRecipe
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.selectRecipeById()).then(() => {
      const newState = store.getState();
      expect(newState.recipe.selectedRecipe).toBe(stubRecipe);
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should rate recipe', () => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.addRecipeRatingById(1, stubRecipe)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

});