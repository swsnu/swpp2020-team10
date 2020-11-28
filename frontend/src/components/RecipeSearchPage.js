import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Container, Dropdown, Form, Grid, Icon, Item, Loader, Rating, Segment, Visibility } from 'semantic-ui-react';


export const RecipeSearchPage = ({ match }) => {
  const userIsAuthorized = useSelector(state => state.user.isAuthorized);

  const [searchInput, setSearchInput] = useState(match.params.q);
  const [showFilterTab, setShowFilterTab] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [hasSetting, setHasSetting] = useState(false);

  // search result
  const [recipes, setRecipes] = useState([]);
  const [hasRecipes, setHasRecipes] = useState(false);

  // number of currently loaded pages (pageCount * pageSize recipes)
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;

  // flag indicating whether search results have been exhausted
  const [hasFetchedAll, setHasFetchedAll] = useState(false);

  // filter attributes
  const [enableFridge, setEnableFridge] = useState(false);

  const [enableMaxCookingTime, setEnableMaxCookingTime] = useState(false);
  const [maxCookingTime, setMaxCookingTime] = useState(30);
  const maxCookingTimeMaxInput = 360;

  const [enableMinRating, setEnableMinRating] = useState(false);
  const [minRating, setMinRating] = useState(2.5);

  const [enableMaxCalorie, setEnableMaxCalorie] = useState(false);
  const [maxCalorie, setMaxCalorie] = useState(500);
  const maxCalorieMaxInput = 2000;

  const [dietLabels, setDietLabels] = useState('');
  const [healthLabels, setHealthLabels] = useState('');

  const sortOptions = [
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
          cooking_time,
          rating,
          calorie,
          diet_labels,
          health_labels,
        } = response.data;

        if (cooking_time) {
          setEnableMaxCookingTime(cooking_time);
        }
        if (rating) {
          setMinRating(rating);
        }
        if (calorie) {
          setMaxCalorie(calorie);
        }
        if (diet_labels.length) {
          setDietLabels(diet_labels.join(' '));
        }
        if (health_labels.length) {
          setHealthLabels(health_labels.join(' '));
        }

        return response;
      });
  };

  const saveSetting = () => {
    return axios.put('/api/user/setting/', {
      cooking_time: enableMaxCookingTime ? maxCookingTime : null,
      rating: enableMinRating ? minRating : null,
      calorie: enableMaxCalorie ? maxCalorie : null,
      diet_labels: dietLabels.trim().split(/\s+/),
      health_labels: healthLabels.trim().split(/\s+/),
    });
  };

  const fetchResults = (reset) => {
    let fromParam = 'from=' + pageCount * pageSize;
    let toParam = 'to=' + (pageCount + 1) * pageSize;
    let sortParam = sortBy ? 'sort=' + sortBy : '';
    let timeParam = enableMaxCookingTime ? 'time=' + maxCookingTime : '';
    let ratingParam = enableMinRating ? 'rating=' + minRating : '';
    let calorieParam = enableMaxCalorie ? 'calorie=' + maxCalorie : '';
    let dietParam = dietLabels.trim().split(/\s+/).map(label => 'diet_labels=' + label).join('&');
    let healthParam = healthLabels.trim().split(/\s+/).map(label => 'health_labels=' + label).join('&');

    let params = [
      fromParam,
      toParam,
      sortParam,
      timeParam,
      ratingParam,
      calorieParam,
      dietParam,
      healthParam,
    ].filter(Boolean).join('&');

    setHasFetchedAll(false);

    return axios.get('/api/search/?' + params)
      .then(response => {
        const recipes_new = response.data.recipes;
        if (!recipes_new.length) {
          setHasFetchedAll(true);
        }

        if (reset) {
          setPageCount(0);
          setRecipes(recipes_new);
        } else {
          setPageCount(pageCount + 1);
          setRecipes(recipes.concat(recipes_new));
        }

        return response;
      });
  };

  if (userIsAuthorized && !hasSetting) {
    fetchSetting().finally(() => setHasSetting(true));
  }

  if (!hasRecipes) {
    fetchResults();
    setHasRecipes(true);
  }

  const filterTab = (
    <Segment>
      <Form>
        <Form.Field>
          <Checkbox
            id='enableFridge'
            label='Check availability from My Fridge'
            checked={enableFridge}
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
            min={0}
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
            min={0}
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
            checked={enableMaxCalorie}
            onChange={() => setEnableMaxCalorie(!enableMaxCalorie)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Field disabled={!enableMaxCalorie} width={3}>
            <input
              type='number'
              id='maxCalorieInput'
              min={0}
              max={maxCalorieMaxInput}
              value={maxCalorie}
              onChange={e => setMaxCalorie(e.target.value)}
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
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor='healthLabelsInput'>Health labels</label>
          <input
            type='text'
            id='healthLabelsInput'
            value={healthLabels}
            onChange={e => setHealthLabels(e.target.value)}
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
            />
          </Form.Field>
          <Form.Field>
            <Button
              basic
              id='saveFilterButton'
              content='Save preferences'
              onClick={() => saveSetting()}
              disabled={userIsAuthorized !== true}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </Segment>
  );

  const searchResults = recipes.map((recipe, key) => (
    <Item key={key} as={Link} to={`/recipe/${recipe.id}`}>
      <Item.Image
        src={`https://source.unsplash.com/512x512/?soup,${key}`}
        size='small'
      />
      <Item.Content>
        <Item.Header>
          {recipe.title}
        </Item.Header>
        <Item.Meta>
          {recipe.rating.toFixed(1)}&ensp;
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
          {recipe.calorie}&ensp;calorie{recipe.calorie == 1 ? '' : 's'} / serving
        </Item.Meta>
        <Item.Description>
          {recipe.content.substr(0, 160)}
          {recipe.content.length > 160 ? '...' : ''}
        </Item.Description>
        <Item.Extra>
          {recipe.diet_labels.map((tag, key) => <span key={key}>{tag}&emsp;</span>)}
          {recipe.health_labels.map((tag, key) => <span key={key}>{tag}&emsp;</span>)}
        </Item.Extra>
      </Item.Content>
    </Item>
  ));

  return (
    <Container text style={{ marginTop: '1em' }}>
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
                  onKeyDown={() => fetchResults()}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
      <Dropdown
        button
        basic
        clearable
        id='sortOption'
        placeholder='Sort by...'
        options={sortOptions}
        value={sortBy}
        onChange={(e, { value }) => {
          setSortBy(value);
          fetchResults(true);
        }}
        style={{ width: '11em' }}
      />
      <Button
        id='showFilterTabButton'
        onClick={() => setShowFilterTab(!showFilterTab)}
        content='Filter'
      />
      { showFilterTab &&
        filterTab
      }
      <Visibility onBottomVisible={() => fetchResults(false)}>
        <Item.Group divided>
          {searchResults}
        </Item.Group>
      </Visibility>
      <br />
      <Loader active={!hasFetchedAll} inline='centered' />
    </Container >
  );
};