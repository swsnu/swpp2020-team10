import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Rating } from 'semantic-ui-react';
import * as actionCreators from '../store/actions/index';

function RecipeDetail() {

  const history = useHistory();

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
    history.push('/review/editor');
  };

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
      <RecipePart />
      <div className='row'>
        <button id='myFridgeButton' onClick={onClickMyFridgeButton()}>
          My Fridge
        </button>
      </div>
      <div className='row'>
        <h2> Reviews </h2>
      </div>
      <ReviewPart />
      <div className='row'>
        <button id='writeButton' onClick={onClickWriteButton()}>
          Write Review
        </button>
      </div>
    </div>
  );
}

// return information about the recipe. Image should be inserted in future implementation.
// Rating should be inserted after confirming the use of external libraries.
function RecipePart() {
  const [hasRated, setRated] = useState(false);

  const onChangeRatingInput = (e, {rating}) => {
    e.preventDefault();
    const ratedRecipe = { ...this.props.storedRecipe, rating: rating };
    setRated(true);
    this.props.onRateRecipe(this.props.match.params.id, ratedRecipe);
  };

  return (
    <div className='RecipePart'>
      <h1>{this.props.storedRecipe.title}</h1>
      <div className='row'>
        <p2>Rating: {this.props.storedRecipe.rating}</p2>
        <Rating id='ratingInput' icon='star' rating={1} maxRating={5} onRate={onChangeRatingInput} disabled={hasRated}/>
        <p3>Ingredients: {this.props.storedRecipe.ingredient}</p3>
        <p4>Serving: {this.props.storedRecipe.serving}, Cooking time: {this.props.storedRecipe.cooking_time}</p4>
        <p5>{this.props.storedRecipe.content}</p5>
      </div>
    </div>
  );
}

// return list of reviews of this recipe w/ headerlines
function ReviewPart() {
  const reviewList = this.props.storedReviews.map((review) => {
    return (
      <div className='review' key={review.id}>
        <NavLink id='review-link' to={'/review/' + review.id}>
          {review.title}
        </NavLink>
        {review.user.username}
        {review.likes} | {review.reports}
      </div>
    );
  });
  return reviewList;
}

const mapStateToProps = (state) => {
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
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetail);