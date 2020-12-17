import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Icon, Placeholder, Rating } from 'semantic-ui-react';

import { ImageWrapper } from '../misc';
import * as actionCreators from '../store/actions/index';


const sendReaction = (recipe_id, reaction) => {
  return axios.post('/api/recommendation/reaction/', { recipe_id, reaction });
};


export const Recommendation = () => {
  const dispatch = useDispatch();

  const isAuthorized = useSelector(state => state.user.isAuthorized);
  const recipe = useSelector(state => state.user.recommendation);

  const [hasRecommendation, setHasRecommendation] = useState(false);
  const [enableReaction, setEnableReaction] = useState(true);
  const [thumbsUpColor, setThumbsUpColor] = useState('grey');

  // fetch recommendation on mount
  useEffect(() => {
    dispatch(actionCreators.getRecommendation())
      .then(() => setHasRecommendation(true));
  }, []);

  const onClickLike = () => {
    setThumbsUpColor('blue');
    setEnableReaction(false);
    sendReaction(recipe.id, 1);
  };

  const onClickDislike = () => {
    setEnableReaction(false);
    sendReaction(recipe.id, -1);
    dispatch(actionCreators.getRecommendation())
      .then(() => setEnableReaction(true));
  };

  if (!hasRecommendation) {
    return (
      <Card fluid>
        <Placeholder>
          <Placeholder.Image rectangular style={{ width: 300, height: 300 }} />
        </Placeholder>
        <Card.Content>
          <Card.Description>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='short' />
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='medium' />
              </Placeholder.Paragraph>
              <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Paragraph>
            </Placeholder>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }

  const recipeSteps = recipe.content.join(' ');

  return (
    <Card key={recipe.id} fluid>
      <ImageWrapper src={recipe.image} length={300} />
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
          {recipe.calories.toFixed(0)}&ensp;calories / serving
        </Card.Meta>
        <Card.Description>
          {recipeSteps.substr(0, 100)}
          {recipeSteps.length > 100 ? '...' : ''}
        </Card.Description>
      </Card.Content>
      {
        isAuthorized &&
        <Card.Content extra>
          <Icon
            id='thumbsUpButton'
            name='thumbs up'
            link={enableReaction}
            onClick={onClickLike}
            color={thumbsUpColor}
            disabled={!enableReaction}
          />&ensp;
          <Icon
            id='thumbsDownButton'
            name='thumbs down'
            link={enableReaction}
            onClick={onClickDislike}
            color='grey'
            disabled={!enableReaction}
          />
        </Card.Content>
      }
    </Card>
  );
};