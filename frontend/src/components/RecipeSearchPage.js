import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actionCreators from '../store/actions/index';


export const RecipeSearchPage = ({ match }) => {
  const [searchInput, setSearchInput] = useState(match.params.q);
  const [showFilterTab, setShowFilterTab] = useState(false);

  // filter tab attributes
  const [enableFridge, setEnableFridge] = useState(false);

  const [enableCookingTime, setEnableCookingTime] = useState(false);
  const [cookingTime, setCookingTime] = useState('');

  const [enableMinRating, setEnableMinRating] = useState(false);
  const [minRating, setMinRating] = useState('');

  const [includeTags, setIncludeTags] = useState('');
  const [excludeTags, setExcludeTags] = useState('');

  // checks if recipes have been fetched
  const [hasRecipes, setHasRecipes] = useState(false);

  const dispatch = useDispatch();

  if (!hasRecipes) {
    dispatch(actionCreators.fetchAllRecipes())
      .then(setHasRecipes(true));
  }

  const recipes = useSelector(state => state.recipe.recipes);

  const searchResult = recipes.map(recipe => (
    <div key={recipe.id}>
      <img src='https://picsum.photos/200' />
      <div><Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link></div>
      <div>Rating: {recipe.rating}</div>
      <div>{recipe.tag.map(tag => `${tag} `)}</div>
      <div>Cooking time: {recipe.cooking_time}</div>
      <div>Serving: {recipe.serving}</div>
    </div>
  ));

  return (
    <div>
      <div>
        <input
          type='search'
          id='searchInput'
          placeholder='Search recipes...'
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>
      <div>
        <select id='sortOptions'>
          <option value=''>Sort by...</option>
          <option value='relevance'>Relevance</option>
          <option value='rating'>Rating</option>
          <option value='time'>Cooking time</option>
        </select>
        <button onClick={() => setShowFilterTab(!showFilterTab)}>Filter</button>
      </div>
      { showFilterTab &&
        <div>
          <div>
            <input
              type='checkbox'
              id='enableFridgeInput'
              checked={enableFridge}
              onChange={() => setEnableFridge(!enableFridge)}
            />
            <label htmlFor='enableFridgeInput'>
              Check availability from My Fridge
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='enableCookingTimeInput'
              checked={enableCookingTime}
              onChange={() => setEnableCookingTime(!enableCookingTime)}
            />
            <label htmlFor='enableCookingTimeInput'>
              Maximum cooking time
            </label>
            <input
              type='range'
              id='cookingTimeRangeInput'
              value={cookingTime}
              onChange={e => setCookingTime(e.target.value)}
            />
            <input
              type='number'
              id='cookingTimeNumberInput'
              value={cookingTime}
              onChange={e => setCookingTime(e.target.value)}
            />
          </div>
          <div>
            <input
              type='checkbox'
              id='enableMinRatingInput'
              checked={enableMinRating}
              onChange={() => setEnableMinRating(!enableMinRating)}
            />
            <label htmlFor='enableMinRatingInput'>
              Minimum rating
            </label>
            <input
              type='range'
              id='minRatingRangeInput'
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
            />
            <input
              type='number'
              id='minRatingNumberInput'
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='includeTagsInput'>Include tags: </label>
            <input
              type='text'
              id='includeTagsInput'
              value={includeTags}
              onChange={e => setIncludeTags(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='excludeTagsInput'>Exclude tags: </label>
            <input
              type='text'
              id='excludeTagsInput'
              value={excludeTags}
              onChange={e => setExcludeTags(e.target.value)}
            />
          </div>
          <button>Save preferences</button>
        </div>
      }
      <div>
        {searchResult}
      </div>
    </div>
  );
};