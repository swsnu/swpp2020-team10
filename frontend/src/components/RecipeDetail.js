import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Rating, Image, Container, Header, Grid, Button, Segment } from 'semantic-ui-react';
import * as actionCreators from '../store/actions/index';

function RecipeDetail(props) {

  const history = useHistory();
  const dispatch = useDispatch();
  const recipeId = props.match.params.recipe_id;

  const [hasRecipe, setHasRecipe] = useState(false);
  const [hasReviews, setHasReviews] = useState(false);
  const [hasRated, setRated] = useState(false);
  // check
  if(!hasRecipe) {
    dispatch(actionCreators.selectRecipeById(recipeId));
    setHasRecipe(true);
  }
  if(!hasReviews){
    dispatch(actionCreators.getReviewList(recipeId));
    setHasReviews(true);
  }

  let storedRecipe = /*{
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
  };//*/useSelector(state => state.recipe.selectedRecipe);

  const storedReviews = /*[{
    'id': 1,
    'recipe_id': 1,
    'user_id': 1,
    'title': 'Kimchi review!!!',
    'content': 'Kimchi is good modify content',
    'likes': 5,
    'reports': 3
  },
  {
    'id': 2,
    'recipe_id': 1,
    'user_id': 1,
    'title': 'Review 2',
    'content': 'Review 22',
    'likes': 3,
    'reports': 0
  }];//*/useSelector(state => state.review.reviews);

  const userId = useSelector(state => state.user.id);

  // move to 'My Fridge' page
  const onClickMyFridgeButton = () => {
    if(userId !== null) {
      history.push('/fridge/' + userId);
    }
  };

  /*// move to 'Settings' page
  const onClickSettingsButton = () => {
    history.push('/settings/' + this.props.user.id);
  };

  // logout and go to index page
  const onClickSignOutButton = () => {};
  */
  // move to 'Review Editor' page
  const onClickWriteButton = () => {
    history.push('/review/' + recipeId + '/create');
  };

  // should be commented out until testing issues are solved
  const onChangeRatingInput = (e, {rating}) => {
    //const ratedRecipe = { ...storedRecipe, rating: rating };
    setRated(true);
    //dispatch(actionCreators.addRecipeRatingById(recipeId, ratedRecipe));
  };

  let title, rating, serving, cooking_time, content, ingredients;
  if(storedRecipe !== null){
    title = storedRecipe.title;
    rating = storedRecipe.rating;
    serving = storedRecipe.serving;
    cooking_time = storedRecipe.cooking_time;
    content = storedRecipe.content;
    ingredients = storedRecipe.ingredients;
  }

  let ingredient;
  if(ingredients != null) {
    ingredient = Object.keys(ingredients).map((key) => {
      return (
        <p key={key}>
          {key}: {ingredients[key]}
        </p>
      );
    });
  }


  /*<div className='row'>
        <Button id='settingsButton' onClick={onClickSettingsButton()}>
          To Settings
        </Button>
        <Button id='signOutButton' onClick={onClickSignOutButton()}>
          Sign Out
        </Button>
      </div>
  */ 

  return (
    <div className='RecipeDetail'>
      <Grid centered>
        <Grid.Row>
          <Image size='medium' src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Various_kimchi.jpg/330px-Various_kimchi.jpg' centered/>
        </Grid.Row>
        <Grid.Row>
          <Container textalign='center'>
            <Header textalign='center'>{title}</Header>
            <Rating id='ratingInput' icon='star' rating={1} maxRating={5} onRate={onChangeRatingInput} disabled={hasRated} />
            <p>Rating: {rating}</p>
            <Segment.Group horizontal  attached='top'>
              <Segment>
                <p>Ingredients</p>
              </Segment>
              <Segment>
                {ingredient}
              </Segment>
            </Segment.Group>
            <Segment.Group horizontal>
              <Segment>
                <p>Serving</p>
              </Segment> 
              <Segment>
                {serving}
              </Segment>
            </Segment.Group>
            <Segment.Group horizontal>
              <Segment>
                <p>Cooking time</p>
              </Segment> 
              <Segment>
                {cooking_time}
              </Segment>
            </Segment.Group>
            <Segment.Group horizontal attached='bottom'>
              <Segment>
                {content}
              </Segment>
            </Segment.Group>
          </Container>
        </Grid.Row>
        <Grid.Row>
          <Button id='myFridgeButton' align='center' onClick={() => onClickMyFridgeButton()}>
            My Fridge
          </Button>
        </Grid.Row>
        <Grid.Row>
          <h2 textalign='justified'> Reviews </h2>
        </Grid.Row>
      </Grid>
      <ReviewPart storedReviews={storedReviews}/>
      <Grid centered>
        <Grid.Row>
          <Button id='writeButton' onClick={() => onClickWriteButton()}>
            Write Review
          </Button>
        </Grid.Row>
      </Grid>
    </div>
  );
}

// return information about the recipe. Image should be inserted in future implementation.
// Rating should be inserted after confirming the use of external libraries.


// return list of reviews of this recipe w/ headerlines
function ReviewPart(props) {
  const reviewList = props.storedReviews.map((review) => {
    return (
      <div className='review' key={review.id}>
        <Grid centered>
          <Grid.Row>
            <Segment>
              <Grid.Column width={4}>
                <NavLink id='review-link' to={'/review/' + review.id}>
                  {review.title}
                </NavLink>
              </Grid.Column>
              <Grid.Column width={3}>
              Author: {review.author_name} | likes: {review.likes} | dislikes: {review.dislikes} | reports: {review.reports}
              </Grid.Column>
            </Segment>
          </Grid.Row>
        </Grid>
      </div>
    );
  });
  return reviewList;
}

/*const mapStateToProps = (state) => {
  return {
    storedRecipe: state.recipe.selectedRecipe,
    storedReviews: state.review.reviews,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetRecipe: (recipeId) => 
      dispatch(actionCreators.selectRecipeById(recipeId)),
    onGetReviews: (recipeId) => 
      dispatch(actionCreators.getReviewList(recipeId)),
    onRateRecipe: (recipeId, recipe) => 
      dispatch(actionCreators.addRecipeRatingById(recipeId, recipe)),
    onDeleteReview: (reviewId) => 
      dispatch(actionCreators.deleteReview(reviewId)),
  };
};*/

//export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetail);
export default RecipeDetail;