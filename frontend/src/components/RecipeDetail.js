import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Rating, Image, Item } from 'semantic-ui-react';
import * as actionCreators from '../store/actions/index';

function RecipeDetail(props) {

  const history = useHistory();
  const dispatch = useDispatch();

  const storedRecipe = /*{
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

  const recipeId = props.match.params.recipeId;


  useEffect(() => {
    if(!storedRecipe){
      dispatch(actionCreators.selectRecipeById(recipeId));
      return;
    }
    dispatch(actionCreators.getReviewList(recipeId));
  });

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
      <RecipePart recipeId={recipeId} />
      <div className='row'>
        <button id='myFridgeButton' onClick={() => onClickMyFridgeButton()}>
          My Fridge
        </button>
      </div>
      <div className='row'>
        <h2> Reviews </h2>
      </div>
      <ReviewPart storedReviews={storedReviews}/>
      <div className='row'>
        <button id='writeButton' onClick={() => onClickWriteButton()}>
          Write Review
        </button>
      </div>
    </div>
  );
}

// return information about the recipe. Image should be inserted in future implementation.
// Rating should be inserted after confirming the use of external libraries.
function RecipePart(props) {
  const [hasRated, setRated] = useState(false);
  const dispatch = useDispatch();
  const storedRecipe = /*{
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
  const recipeId = props.recipeId;

  useEffect(() => {
    if(!storedRecipe){
      dispatch(actionCreators.selectRecipeById(recipeId));
      return;
    }
  });

  const onChangeRatingInput = (e, {rating}) => {
    e.preventDefault();
    const ratedRecipe = { ...storedRecipe, rating: rating };
    setRated(true);
    dispatch(actionCreators.addRecipeRatingById(recipeId, ratedRecipe));
  };

  return (
    <div className='RecipePart'>
      <Item>
        <Image size='tiny' src='https://react.semantic-ui.com/images/wireframe/image.png' />
        <Item.Content>
          <Item.Header>{storedRecipe.title}</Item.Header>
          <Rating id='ratingInput' icon='star' rating={1} maxRating={5} onRate={() => onChangeRatingInput} disabled={hasRated} />
          <Item.Meta>Ingredients</Item.Meta>
          <Item.Description></Item.Description>
          <Item.Meta>Serving: {storedRecipe.serving}, Cooking time: {storedRecipe.cooking_time}</Item.Meta>
          <Item.Description>{storedRecipe.content}</Item.Description>
        </Item.Content>
      </Item>
    </div>
  );
}

// return list of reviews of this recipe w/ headerlines
function ReviewPart(props) {
  const reviewList = props.storedReviews.map((review) => {
    return (
      <div className='review' key={review.id}>
        <NavLink id='review-link' to={'/review/' + review.id}>
          {review.title}
        </NavLink>
         Author: {review.user_id} likes: {review.likes} | reports: {review.reports}
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