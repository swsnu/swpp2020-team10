import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Button, Card, Container, Dimmer, Form, Grid, Header, Icon, Image, Message, Rating, Segment } from 'semantic-ui-react';

import * as actionCreators from '../store/actions/index';


export const FrontPage = () => {
  const [searchInput, setSearchInput] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  // checks if recipes have been fetched
  const [hasRecipes, setHasRecipes] = useState(false);

  if (!hasRecipes) {
    dispatch(actionCreators.fetchAllRecipes())
      .then(() => { setHasRecipes(true); });
  }

  const recipes = useSelector(state => state.recipe.recipes);

  const fridgeItems = useSelector(state => state.fridgeItem.fridgeItems);

  const fridgeItemList = fridgeItems.map(item =>
    <div key={item.name}>
      {item.name}&ensp;x&ensp;{item.quantity}
    </div>
  );

  const recommendations = recipes.slice(-2).map(recipe => (
    <Card key={recipe.id} fluid>
      <Image src={`https://source.unsplash.com/512x512/?food,${recipe.id}`} />
      <Card.Content>
        <Card.Header>
          <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
        </Card.Header>
        <Card.Meta>
          {recipe.rating.toFixed(1)}&ensp;
          <Rating
            rating={recipe.rating}
            maxRating={5}
            clearable={false} icon='star' size='mini'
          />
          <br />
          Serving&ensp;{recipe.serving}&emsp;
          Cooking time&ensp;{recipe.cooking_time}
        </Card.Meta>
        <Card.Description>
          {recipe.content.substr(0, 160)}
        </Card.Description>
      </Card.Content>
    </Card>
  ));

  const userIsAuthorized = useSelector(state => state.user.isAuthorized);
  const userId = useSelector(state => state.user.id);

  const dimmer = (
    <Dimmer
      active={userIsAuthorized !== true}
      content='Please sign in to use this feature'
    />
  );

  return (
    <Container text style={{ marginTop: '1em' }}>
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
              as={Link} to={`fridge/${userId}`}
              content='Go to My Fridge'
            />
            {dimmer}
          </Segment>
          <Segment>
            <Header content='Notifications' />
            <Message color='red'>
              Your review on <b>Spam</b> has been reported.
            </Message>
            <Message color='orange'>
              <b>Milk</b>[3] expires in 2 days.
            </Message>
            <Message color='olive'>
              <b>Toirdhealbhach</b> has commented to your review on <b>Bouillabaisse</b>.
            </Message>
            {dimmer}
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};