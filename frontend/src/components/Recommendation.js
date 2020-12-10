import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Icon, Image, Rating } from 'semantic-ui-react';

import * as actionCreators from '../store/actions/index';


const sendReaction = (recipe_id, reaction) => {
  return axios.post('/api/recommendation/reaction/', { recipe_id, reaction });
};


export const Recommendation = () => {
  const dispatch = useDispatch();

  const isAuthorized = useSelector(state => state.user.isAuthorized);
  const recipe = useSelector(state => state.user.recommendation);

  const [enableReaction, setEnableReaction] = useState(true);

  // fetch recommendation on mount
  useEffect(() => {
    dispatch(actionCreators.getRecommendation());
  }, []);

  const onClickLike = () => {
    setEnableReaction(false);
    sendReaction(recipe.id, 1);
  };

  const onClickDislike = () => {
    setEnableReaction(false);
    sendReaction(recipe.id, -1);
    dispatch(actionCreators.getRecommendation())
      .then(() => setEnableReaction(true));
  };

  if (!recipe) {
    return null;
  }

  return (
    <Card key={recipe.id} fluid>
      {
        recipe.image
          ? <Image src={recipe.image} />
          : <Image src={`https://source.unsplash.com/512x512/?food,${recipe.id}`} />
      }
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
      {
        isAuthorized &&
        <Card.Content extra>
          <Icon
            name='thumbs up'
            link
            onClick={onClickLike}
            disabled={!enableReaction}
          />&ensp;
          <Icon
            name='thumbs down'
            link
            onClick={onClickDislike}
            disabled={!enableReaction}
          />
        </Card.Content>
      }
    </Card>
  );
};