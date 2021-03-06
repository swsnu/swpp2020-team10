import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { Rating, Container, Header, Button, Item, Table, Tab, Card, Icon, List, Loader, Popup } from 'semantic-ui-react';
import { ImageWrapper } from '../misc';

import * as actionCreators from '../store/actions/index';


export const RecipeDetail = ({ match }) => {
  const recipeId = match.params.recipe_id;

  const dispatch = useDispatch();

  const storedRecipe = useSelector(state => state.recipe.selectedRecipe);
  const storedReviews = useSelector(state => state.review.reviews);
  const initialTabIndex = useSelector(state => state.user.tabIndex);


  const [hasRecipe, setHasRecipe] = useState(false);
  const [hasReviews, setHasReviews] = useState(false);
  const [tabIndex, setTabIndex] = useState(initialTabIndex);

  const [enableRating, setEnableRating] = useState(true);

  // fetch recipe and reviews on initial mount
  useEffect(() => {
    dispatch(actionCreators.selectRecipeById(recipeId))
      .then(() => setHasRecipe(true));
    dispatch(actionCreators.getReviewList(recipeId))
      .then(() => setHasReviews(true));
  }, []);

  if (!hasRecipe) {
    return null;
  }

  const onRate = (e, { rating }) => {
    setEnableRating(false);
    dispatch(actionCreators.addRecipeRatingById(recipeId, rating))
      .then(() => setEnableRating(true));
  };

  const ingredients = (
    <Table striped>
      <Table.Body>
        {storedRecipe.ingredient_lines.map((ingredient_line, key) => {
          return (
            <Table.Row key={key}>
              <Table.Cell content={ingredient_line} />
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );

  const panes = [
    {
      menuItem: 'Ingredients',
      pane: (
        <Tab.Pane key={0}>
          {ingredients}
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Directions',
      pane: (
        <Tab.Pane key={1}>
          <List ordered relaxed>
            {storedRecipe.content.map((line, key) => {
              return (
                <List.Item content={line} key={key} />
              );
            })}
          </List>
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Reviews',
      pane: (
        <Tab.Pane key={2}>
          {
            hasReviews
              ? <ReviewTab reviews={storedReviews} recipeId={recipeId} />
              : <Loader active inline='centered' />
          }
        </Tab.Pane>
      )
    },
  ];

  return (
    <Container text id='RecipeDetail'>
      <Item.Group>
        <Item>
          <Item.Image size='medium'>
            <ImageWrapper src={storedRecipe.image} />
          </Item.Image>
          <Item.Content>
            <Item.Header>
              <Header as='h1' content={storedRecipe.title} />
            </Item.Header>
            <Item.Meta>
              ({storedRecipe.rating.toFixed(1)})&ensp;
              <Rating
                id='ratingInput'
                rating={storedRecipe.rating}
                maxRating={5}
                onRate={onRate}
                disabled={!enableRating}
                icon='star'
                size='small'
              />
            </Item.Meta>
            <Item.Description>
              <b>{storedRecipe.serving}</b>&ensp;serving{storedRecipe.serving == 1 ? '' : 's'}
              <br />
              <b>{storedRecipe.cooking_time}</b>&ensp;minute{storedRecipe.cooking_time == 1 ? '' : 's'}
              <br />
              <b>{storedRecipe.calories.toFixed(0)}</b>&ensp;calories / serving
            </Item.Description>
            <Item.Extra>
              {storedRecipe.diet_labels.map((label, key) => <span key={key}>{label}</span>)}
              <br />
              {storedRecipe.health_labels.map((label, key) => <span key={key}>{label}</span>)}
            </Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
      <Tab
        panes={panes}
        activeIndex={tabIndex}
        onTabChange={(e, { activeIndex }) => {
          setTabIndex(activeIndex);
          dispatch(actionCreators.setTabIndex(activeIndex));
        }}
        renderActiveOnly={false}
      />
    </Container>
  );
};


const ReviewTab = ({ reviews, recipeId }) => {
  const history = useHistory();

  const userIsAuthorized = useSelector(state => state.user.isAuthorized);

  const reviewCards = (
    <Card.Group>
      {reviews.map(review => (
        <Card key={review.id} fluid>
          <Card.Content>
            <Card.Header>
              <Link id='review-link' to={`/review/${review.id}`}>
                {review.title}
              </Link>
            </Card.Header>
            <Card.Meta>
              By {review.author_name}
            </Card.Meta>
            <Card.Description>
              {review.content.substr(0, 100)}
              {review.content.length > 100 ? '...' : ''}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Icon name='thumbs up' /> {review.likes}&emsp;
            <Icon name='thumbs down' /> {review.dislikes}&emsp;
            <Icon name='warning circle' /> {review.reports}
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );

  return (
    <div className='review'>
      <div>
        <Popup
          content='Please signin to write a review.'
          disabled={userIsAuthorized}
          trigger={
            <Button
              id='writeButton'
              content='Write a review'
              onClick={() => {
                if (userIsAuthorized) {
                  history.push(`/recipe/${recipeId}/create-review`);
                } else {
                  history.push('/signin');
                }
              }}
              basic
              color='blue'
            />
          }
        />
      </div>
      <br />
      {
        reviews.length
          ? reviewCards
          : 'No reviews yet.'
      }
    </div>
  );
};

export default RecipeDetail;