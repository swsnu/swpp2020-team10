import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Rating, Image, Container, Header, Grid } from 'semantic-ui-react';
import * as actionCreators from '../store/actions/index';

function RecipeDetail(props) {

  const history = useHistory();
  const dispatch = useDispatch();
  const recipeId = props.match.params.recipeId;

  const [hasRecipe, setHasRecipe] = useState(false);
  const [hasReviews, setHasReviews] = useState(false);
  const [hasRated, setRated] = useState(false);
  // check
  if(!hasRecipe) {
    dispatch(actionCreators.selectRecipeById(recipeId))
      .then(setHasRecipe(true));
  }
  if(!hasReviews){
    dispatch(actionCreators.getReviewList(recipeId))
      .then(setHasReviews(true));
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

  // move to 'My Fridge' page
  const onClickMyFridgeButton = () => {
    history.push('/fridge/' + this.props.user.id);
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
    history.push('/review/' + recipeId + '/editor');
  };

  const onChangeRatingInput = (e, {rating}) => {
    e.preventDefault();
    const ratedRecipe = { ...storedRecipe, rating: rating };
    setRated(true);
    dispatch(actionCreators.addRecipeRatingById(recipeId, ratedRecipe));
  };

  let title, rating, serving, cooking_time, content;
  if(storedRecipe !== null){
    title = storedRecipe.title;
    rating = storedRecipe.rating;
    serving = storedRecipe.serving;
    cooking_time = storedRecipe.cooking_time;
    content = storedRecipe.content;
  }

  /*<div className='row'>
        <button id='settingsButton' onClick={onClickSettingsButton()}>
          To Settings
        </button>
        <button id='signOutButton' onClick={onClickSignOutButton()}>
          Sign Out
        </button>
      </div>
  */ 

  return (
    <div className='RecipeDetail'>
      <Grid centered padded>
        <Grid.Row>
          <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' centered/>
        </Grid.Row>
        <Grid.Row>
          <Container textAlign='center'>
            <Header textAlign='center'>{title}</Header>
            <Rating id='ratingInput' icon='star' rating={1} maxRating={5} onRate={() => onChangeRatingInput} disabled={hasRated} />
            <p>Rating: {rating}</p>
            <p>Ingredients</p>
            <p></p>
            <p>Serving: {serving}, Cooking time: {cooking_time}</p>
            <p>{content}</p>
          </Container>
        </Grid.Row>
        <Grid.Row>
          <button id='myFridgeButton' align='center' onClick={() => onClickMyFridgeButton()}>
            My Fridge
          </button>
        </Grid.Row>
        <Grid.Row>
          <h2 textAlign='justified'> Reviews </h2>
        </Grid.Row>
      </Grid>
      <ReviewPart storedReviews={storedReviews}/>
      <Grid centered padded>
        <Grid.Row>
          <button id='writeButton' onClick={() => onClickWriteButton()}>
            Write Review
          </button>
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
        <Grid centered padded>
          <Grid.Row>
            <Grid.Column padded width={4}>
              <NavLink id='review-link' to={'/review/' + review.id}>
                {review.title}
              </NavLink>
            </Grid.Column>
            <Grid.Column padded width={3}>
            Author: {review.user_id} | likes: {review.likes} | dislikes: {review.dislikes} | reports: {review.reports}
            </Grid.Column>
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