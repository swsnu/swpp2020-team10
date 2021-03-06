import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button, Checkbox, Container, Dimmer, Dropdown, Form, Grid, Icon, Item, Loader, Rating, Segment, Visibility } from 'semantic-ui-react';
import { ImageWrapper } from '../misc';


export const RecipeSearchPage = ({ match }) => {
  const userIsAuthorized = useSelector(state => state.user.isAuthorized);

  const [hasSettings, setHasSettings] = useState(false);

  const [searchInput, setSearchInput] = useState(match.params.q);

  // search result
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);

  // number of currently loaded pages
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;

  // filter attributes
  const [showFilterTab, setShowFilterTab] = useState(false);

  const [enableFridge, setEnableFridge] = useState(false);

  const [enableMaxCookingTime, setEnableMaxCookingTime] = useState(false);
  const [maxCookingTime, setMaxCookingTime] = useState(30);
  const maxCookingTimeMaxInput = 360;

  const [enableMinRating, setEnableMinRating] = useState(false);
  const [minRating, setMinRating] = useState(2.5);

  const [enableMaxCalories, setEnableMaxCalories] = useState(false);
  const [maxCalories, setMaxCalories] = useState(500);
  const maxCaloriesMaxInput = 2000;

  const [dietLabels, setDietLabels] = useState('');
  const [healthLabels, setHealthLabels] = useState('');

  // sort criteria
  const [sortBy, setSortBy] = useState('');

  const sortOptions = [
    {
      key: 0,
      text: 'None',
      value: '',
    },
    {
      key: 1,
      text: 'Rating',
      value: 'rating',
    },
    {
      key: 2,
      text: 'Cooking time',
      value: 'time',
    },
    {
      key: 3,
      text: 'Calorie',
      value: 'calorie',
    }
  ];

  const fetchSetting = () => {
    return axios.get('/api/user/setting/')
      .then(response => {
        let {
          fridge_able,
          cooking_time,
          rating,
          calories,
          diet_labels,
          health_labels,
        } = response.data;

        if (cooking_time) {
          setMaxCookingTime(cooking_time);
        }

        if (rating) {
          setMinRating(rating);
        }

        if (calories) {
          setMaxCalories(calories);
        }

        setDietLabels(diet_labels.join(' '));
        setHealthLabels(health_labels.join(' '));

        setEnableFridge(fridge_able);
        setEnableMaxCookingTime(Boolean(cooking_time));
        setEnableMinRating(Boolean(rating));
        setEnableMaxCalories(Boolean(calories));

        return response;
      });
  };

  const saveSetting = () => {
    return axios.put('/api/user/setting/', {
      fridge_able: enableFridge ? 'true' : 'false',
      cooking_time: enableMaxCookingTime ? maxCookingTime : 0,
      rating: enableMinRating ? minRating : 0,
      calories: enableMaxCalories ? maxCalories : 0,
      diet_labels: dietLabels.split(/\s+/).filter(Boolean),
      health_labels: healthLabels.split(/\s+/).filter(Boolean),
    });
  };

  const fetchResults = (reset, sort = sortBy) => {
    setHasFetchedAll(false);
    setLoadingRecipes(true);

    if (reset) {
      setRecipes([]);
      setPageCount(0);
    }

    let fromParam = 'from=' + (reset ? 0 : pageCount) * pageSize;
    let toParam = 'to=' + (reset ? 1 : pageCount + 1) * pageSize;
    let qParam = 'q=' + searchInput;
    let sortParam = sort ? 'sort=' + sort : '';
    let fridgeParam = enableFridge ? 'fridge_able=true' : '';
    let timeParam = enableMaxCookingTime ? 'time=' + maxCookingTime : '';
    let ratingParam = enableMinRating ? 'rating=' + minRating : '';
    let calorieParam = enableMaxCalories ? 'calorie=' + maxCalories : '';
    let dietParam = dietLabels.split(/\s+/).filter(Boolean).map(label => 'diet_labels=' + label).join('&');
    let healthParam = healthLabels.split(/\s+/).filter(Boolean).map(label => 'health_labels=' + label).join('&');

    let params = [
      fromParam,
      toParam,
      qParam,
      sortParam,
      fridgeParam,
      timeParam,
      ratingParam,
      calorieParam,
      dietParam,
      healthParam,
    ].filter(Boolean).join('&');

    return axios.get('/api/search/?' + params)
      .then(response => {
        const recipes_new = response.data.recipes;

        if (recipes_new.length < pageSize) {
          setHasFetchedAll(true);
        }

        setRecipes(prevRecipes => prevRecipes.concat(recipes_new));
        setPageCount(prevPageCount => prevPageCount + 1);
        setLoadingRecipes(false);

        return response;
      });
  };

  useEffect(() => {
    if (userIsAuthorized) {
      fetchSetting().then(() => setHasSettings(true));
    } else {
      setHasSettings(true);
    }
  }, []);

  useEffect(() => {
    if (hasSettings) {
      fetchResults(true);
    }
  }, [hasSettings]);

  const filterTab = (
    <Segment>
      {
        !hasSettings &&
        <Dimmer active inverted>
          <Loader active />
        </Dimmer>
      }
      <Form>
        <Form.Field>
          <Checkbox
            id='enableFridge'
            label='Check availability from My Fridge'
            checked={enableFridge}
            disabled={!userIsAuthorized}
            onChange={() => setEnableFridge(!enableFridge)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            id='enableMaxCookingTime'
            label='Set maximum cooking time'
            checked={enableMaxCookingTime}
            onChange={() => setEnableMaxCookingTime(!enableMaxCookingTime)}
          />
        </Form.Field>
        <Form.Field disabled={!enableMaxCookingTime} width={3}>
          <input
            type='number'
            id='maxCookingTimeInput'
            min={1}
            max={maxCookingTimeMaxInput}
            value={maxCookingTime}
            onChange={e => setMaxCookingTime(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            id='enableMinRating'
            label='Set minimum rating'
            checked={enableMinRating}
            onChange={() => setEnableMinRating(!enableMinRating)}
          />
        </Form.Field>
        <Form.Field disabled={!enableMinRating} width={3}>
          <input
            type='number'
            id='minRatingInput'
            min={0.1}
            max={5}
            step={0.1}
            value={minRating}
            onChange={e => setMinRating(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            id='enableMaxCalorie'
            label='Set maximum calories per serving'
            checked={enableMaxCalories}
            onChange={() => setEnableMaxCalories(!enableMaxCalories)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Field disabled={!enableMaxCalories} width={3}>
            <input
              type='number'
              id='maxCalorieInput'
              min={1}
              max={maxCaloriesMaxInput}
              value={maxCalories}
              onChange={e => setMaxCalories(e.target.value)}
            />
          </Form.Field>
        </Form.Field>
        <Form.Field>
          <label htmlFor='dietLabelsInput'>Diet labels</label>
          <input
            type='text'
            id='dietLabelsInput'
            value={dietLabels}
            onChange={e => setDietLabels(e.target.value)}
            placeholder='available:&emsp;Balanced&emsp;High-Protein&emsp;High-Fiber&emsp;Low-Fat&emsp;Low-Carb&emsp;Low-Sodium'
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor='healthLabelsInput'>Health labels</label>
          <input
            type='text'
            id='healthLabelsInput'
            value={healthLabels}
            onChange={e => setHealthLabels(e.target.value)}
            placeholder='others'
          />
        </Form.Field>
        <Form.Group>
          <Form.Field>
            <Button
              basic
              color='blue'
              id='applyFilterButton'
              content='Apply'
              onClick={() => fetchResults(true)}
              disabled={loadingRecipes || !hasSettings}
            />
          </Form.Field>
          <Form.Field>
            <Button
              basic
              id='saveFilterButton'
              content='Save preferences'
              onClick={() => { saveSetting(); fetchResults(true); }}
              disabled={userIsAuthorized !== true || loadingRecipes || !hasSettings}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </Segment>
  );

  const searchResults = recipes.map(recipe => {
    const recipeSteps = recipe.content.join(' ');
    return (
      <Item key={recipe.id} as={Link} to={`/recipe/${recipe.id}`}>
        <Item.Image size='small'>
          <ImageWrapper src={recipe.image} />
        </Item.Image>
        <Item.Content>
          <Item.Header>
            {recipe.title}
          </Item.Header>
          <Item.Meta>
            ({recipe.rating.toFixed(1)})&ensp;
            <Rating
              rating={recipe.rating}
              maxRating={5}
              icon='star'
              size='mini'
              disabled
            />
          </Item.Meta>
          <Item.Meta>
            {recipe.serving}&ensp;serving{recipe.serving == 1 ? '' : 's'}&emsp;
            {recipe.cooking_time}&ensp;minute{recipe.cooking_time == 1 ? '' : 's'}&emsp;
            {recipe.calories.toFixed(0)}&ensp;calories / serving
          </Item.Meta>
          <Item.Description>
            {recipeSteps.substr(0, 200)}
            {recipeSteps.length > 200 ? '...' : ''}
          </Item.Description>
          <Item.Extra>
            {recipe.diet_labels.map((tag, key) => <span key={key}>{tag}&emsp;</span>)}
            {recipe.health_labels.map((tag, key) => <span key={key}>{tag}&emsp;</span>)}
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  });

  return (
    <Container text>
      <Segment color='blue' inverted tertiary>
        <Grid>
          <Grid.Column verticalAlign='middle' width={1}>
            <label htmlFor='searchInput'>
              <Icon name='search' size='big' />
            </label>
          </Grid.Column>
          <Grid.Column width={15}>
            <Form>
              <Form.Field>
                <input
                  type='search'
                  id='searchInput'
                  placeholder='Search recipes...'
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => { if (searchInput && e.key === 'Enter') fetchResults(true); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
      <Dropdown
        button
        basic
        id='sortOption'
        placeholder='Sort by...'
        options={sortOptions}
        value={sortBy}
        onChange={(e, { value }) => { setSortBy(value); fetchResults(true, value); }}
        style={{ width: '11em', textAlign: 'right' }}
      />&ensp;
      <Button
        id='showFilterTabButton'
        onClick={() => {
          if (showFilterTab) {
            setShowFilterTab(false);
          } else {
            if (userIsAuthorized) {
              setHasSettings(false);
              setShowFilterTab(true);
              fetchSetting().then(() => setHasSettings(true));
            } else {
              setShowFilterTab(true);
            }
          }
        }}
        content='Filter'
      />
      {
        showFilterTab &&
        filterTab
      }
      <Item.Group divided>
        {
          searchResults.length
            ? searchResults
            : !loadingRecipes && 'No results found.'
        }
      </Item.Group>
      <Visibility
        once={false}
        onTopVisible={() => { if (!loadingRecipes && !hasFetchedAll) fetchResults(false); }}
      >
        <Loader
          active={!hasFetchedAll}
          content='Loading...'
          inline='centered'
        />
      </Visibility>
    </Container >
  );
};