import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import * as actionCreators from '../store/actions/index';

import { Rating, Container, Header, Button, Item, Table, Tab, Card, Icon } from 'semantic-ui-react';


export const RecipeDetail = ({ match }) => {
  const recipeId = match.params.recipe_id;

  const dispatch = useDispatch();

  const storedRecipe = useSelector(state => state.recipe.selectedRecipe);
  const storedReviews = useSelector(state => state.review.reviews);

  // fetch recipe and reviews on initial mount
  useEffect(() => {
    dispatch(actionCreators.selectRecipeById(recipeId));
    dispatch(actionCreators.getReviewList(recipeId));
  }, []);

  if (!storedRecipe || !storedReviews) {
    return null;
  }

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
        <Tab.Pane key='0' attached={false}>
          {ingredients}
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Directions',
      pane: (
        <Tab.Pane key='1' attached={false}>
          {storedRecipe.content}
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Reviews',
      pane: (
        <Tab.Pane key='2' attached={false}>
          <ReviewTab reviews={storedReviews} recipeId={recipeId} />
        </Tab.Pane>
      )
    }
  ];

  return (
    <Container text className='RecipeDetail'>
      <Item.Group>
        <Item>
          <Item.Image
            size='medium'
            src={`https://source.unsplash.com/512x512/?soup`} />
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
                icon='star'
                size='small'
                disabled
              />
            </Item.Meta>
            <Item.Description>
              <b>{storedRecipe.serving}</b>&ensp;serving{storedRecipe.serving == 1 ? '' : 's'}
              <br />
              <b>{storedRecipe.cooking_time}</b>&ensp;minute{storedRecipe.cooking_time == 1 ? '' : 's'}
              <br />
              <b>{storedRecipe.calories}</b>&ensp;calorie{storedRecipe.calorie == 1 ? '' : 's'} / serving
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
        menu={{ color: 'blue', secondary: true, pointing: true }}
        panes={panes}
        renderActiveOnly={false}
      />
    </Container>
  );
};


const ReviewTab = ({ reviews, recipeId }) => {
  const history = useHistory();

  if (!reviews) {
    return null;
  }

  return (
    <div className='review'>
      <Button
        id='writeButton'
        content='Write a review'
        onClick={() => history.push(`/review/${recipeId}/create`)}
        fluid
        basic
        color='blue'
      />
      <br />
      <Card.Group>
        {reviews.map((review, key) => (
          <Card key={key} fluid>
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
                {review.content.substr(0, 70)}
                {review.content.length > 70 ? '...' : ''}
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
    </div>
  );
};

export default RecipeDetail;