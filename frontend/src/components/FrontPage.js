import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { Button, Card, Container, Dimmer, Form, Grid, Header, Icon, Image, Rating, Segment } from 'semantic-ui-react';

import { Notification } from './Notification';
import * as actionCreators from '../store/actions/index';


export const FrontPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector(state => state.user);
  const recipes = useSelector(state => state.recipe.recipes);
  const fridgeItems = useSelector(state => state.fridgeItem.fridgeItems);

  const [searchInput, setSearchInput] = useState('');

  // fetch fridge items on initial mount
  useEffect(() => {
    dispatch(actionCreators.fetchAllRecipes());   // placeholder
    if (user.isAuthorized) {
      dispatch(actionCreators.getFridgeItemList(user.id));
    }
  }, []);

  const fridgeItemList = fridgeItems.map((item, key) =>
    <div key={key}>
      {`${item.name} ${item.quantity} ${item.unit}`}
    </div>
  );

  // placeholder
  const recommendations = recipes.slice(-2).map(recipe => (
    <Card key={recipe.id} fluid>
      <Image src={`https://source.unsplash.com/512x512/?food,${recipe.id}`} />
      <Card.Content>
        <Card.Header>
          <Link to={`/recipe/${recipe.id}/`}>{recipe.title}</Link>
        </Card.Header>
        <Card.Meta>
          {recipe.rating.toFixed(1)}&ensp;
          <Rating
            rating={recipe.rating}
            maxRating={5}
            clearable={false}
            disabled
            icon='star'
            size='mini'
          />
          <br />
          {recipe.serving}&ensp;serving{recipe.serving == 1 ? '' : 's'}&emsp;
          {recipe.cooking_time}&ensp;minute{recipe.cooking_time == 1 ? '' : 's'}
          <br />
          {recipe.calories.toFixed(0)}&ensp;calorie{recipe.calorie == 1 ? '' : 's'} / serving
        </Card.Meta>
        <Card.Description>
          {recipe.content.substr(0, 100)}
        </Card.Description>
      </Card.Content>
    </Card>
  ));

  const dimmer = (
    <Dimmer
      active={user.isAuthorized !== true}
      content='Please sign in to use this feature'
    />
  );

  return (
    <Container text style={{ marginTop: '1em' }}>
      <Segment color='blue' inverted tertiary>
        <Grid>
          <Grid.Column verticalAlign='middle'>
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
                  onKeyDown={e => { if (e.key === 'Enter') history.push(`/search/${searchInput}`); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
      <Grid columns={2}>
        <Grid.Column>
          <Segment>
            <Header content={'Recommendations'} />
            {recommendations}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1487560227971-981afbe1c020?ixlib)',
            backgroundSize: 'cover',
          }}>
            <Header content='My Fridge' />
            <Segment>
              {fridgeItemList}
            </Segment>
            <Button primary
              as={Link}
              to={'/fridge/'}
              content='Go to My Fridge'
            />
            {dimmer}
          </Segment>
          <Segment>
            <Header content='Notifications' />
            <Notification userId={user.id} />
            {dimmer}
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};