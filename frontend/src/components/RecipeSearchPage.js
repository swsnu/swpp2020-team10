import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Container, Dropdown, Form, Grid, Header, Icon, Item, Rating, Segment } from 'semantic-ui-react';

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

  const dispatch = useDispatch();

  // checks if recipes have been fetched
  const [hasRecipes, setHasRecipes] = useState(false);

  if (!hasRecipes) {
    dispatch(actionCreators.fetchAllRecipes())
      .then(setHasRecipes(true));
  }

  const recipes = useSelector(state => state.recipe.recipes);

  const userIsAuthorized = useSelector(state => state.user.isAuthorized);

  const sortOptions = [
    {
      key: 'Relevance',
      text: 'Relevance',
      value: 'Relevance',
    },
    {
      key: 'Rating',
      text: 'Rating',
      value: 'Rating',
    },
    {
      key: 'Cooking time',
      text: 'Cooking time',
      value: 'Cooking time',
    }
  ];

  const filterTab = (
    <Segment>
      <Form>
        <Form.Field>
          <Checkbox
            label='Check availability from My Fridge'
            checked={enableFridge}
            onChange={() => setEnableFridge(!enableFridge)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Set maximum cooking time'
            checked={enableCookingTime}
            onChange={() => setEnableCookingTime(!enableCookingTime)}
          />
        </Form.Field>
        <Form.Group>
          <Form.Field disabled={!enableCookingTime}>
            <label>Cooking time</label>
            <input
              type='range'
              id='cookingTimeRangeInput'
              max={180}
              value={cookingTime}
              onChange={e => setCookingTime(e.target.value)}
            />
          </Form.Field>
          <Form.Field disabled={!enableCookingTime} width={2}>
            <input
              type='number'
              id='cookingTimeNumberInput'
              max={180}
              value={cookingTime}
              onChange={e => setCookingTime(e.target.value)}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <Checkbox
            label='Set minimum Rating'
            checked={enableMinRating}
            onChange={() => setEnableMinRating(!enableMinRating)}
          />
        </Form.Field>
        <Form.Group>
          <Form.Field disabled={!enableMinRating}>
            <label>Rating</label>
            <input
              type='range'
              id='minRatingRangeInput'
              max={5}
              step={0.1}
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
            />
          </Form.Field>
          <Form.Field disabled={!enableMinRating} width={2}>
            <input
              type='number'
              id='minRatingNumberInput'
              max={5}
              step={0.1}
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
            />
          </Form.Field>
        </Form.Group>
      </Form>
      <Header content='Tags' as='h4' />
      <Form>
        <Form.Field>
          <label htmlFor='includeTagsInput'>Include</label>
          <input
            type='text'
            id='includeTagsInput'
            value={includeTags}
            onChange={e => setIncludeTags(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor='excludeTagsInput'>Exclude</label>
          <input
            type='text'
            id='excludeTagsInput'
            value={excludeTags}
            onChange={e => setExcludeTags(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Button basic
            content='Save preferences'
            disabled={userIsAuthorized !== true}
          />
        </Form.Field>
      </Form>
    </Segment>
  );

  const searchResults = recipes.map(recipe => (
    <Item key={recipe.id}>
      <Item.Image
        src={`https://source.unsplash.com/512x512/?soup,${recipe.id}`}
        size='small'
        as={Link} to={`/recipe/${recipe.id}`}
      />
      <Item.Content>
        <Item.Header>
          <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
        </Item.Header>
        <Item.Meta>
          {recipe.rating.toFixed(1)}&ensp;
          <Rating
            rating={recipe.rating}
            maxRating={5}
            clearable={false} icon='star' size='mini'
          />&emsp;
          Serving&ensp;{recipe.serving}&emsp;
          Cooking time&ensp;{recipe.cooking_time}
        </Item.Meta>
        <Item.Description>
          {recipe.content.substr(0, 160)}
        </Item.Description>
        <Item.Extra>
          {recipe.tag.map(tag => <span key={tag}>{tag}&emsp;</span>)}
        </Item.Extra>
      </Item.Content>
    </Item>
  ));

  return (
    <Container text style={{ marginTop: '2em' }}>
      <Segment color='blue' inverted tertiary>
        <Grid>
          <Grid.Column verticalAlign='middle'>
            <label htmlFor='searchInput'><Icon name='search' size='big' /></label>
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
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
      <Dropdown button basic
        placeholder='Sort by...'
        options={sortOptions}
        style={{ width: 150 }}
      />
      <Button
        onClick={() => setShowFilterTab(!showFilterTab)}
        content='Filter'
      />
      { showFilterTab &&
        filterTab
      }
      <Item.Group divided>
        {searchResults}
      </Item.Group>
    </Container>
  );
};