import axios from 'axios';

import * as actionCreators from './recipe';
import store from '../store';

const stubRecipe = {
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
            data: {rating: 3, count_ratings: 3}
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.addRecipeRatingById(1, stubRecipe.rating)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

});