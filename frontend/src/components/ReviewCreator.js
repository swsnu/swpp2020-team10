import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Tab, Button, Header, Container } from 'semantic-ui-react';

import * as actionCreators from '../store/actions/index';
import { validateImageUrl } from '../misc';
import { WriteTab, PreviewTab } from './ReviewTabs';


export const ReviewCreator = ({ match }) => {
  const recipeId = match.params.recipe_id;

  const dispatch = useDispatch();
  const history = useHistory();

  const [titleInput, setTitleInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [contentInput, setContentInput] = useState('');

  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  // check validity of image url before sending request
  // if valid, send create review request,
  // and go to the review detail page upon receiving successful response
  const onClickSubmitButton = () => {
    const editedReview = {
      title: titleInput,
      image_url: imageUrlInput,
      content: contentInput,
    };

    // set waiting flag to disallow multiple submits before response arrives
    setIsWaitingResponse(true);

    validateImageUrl(imageUrlInput)
      // valid url
      .then(() => dispatch(actionCreators.postReview(recipeId, editedReview)))
      .then(response => history.push(`/review/${response.data.id}`))
      // invalid url
      .catch(() => {
        window.alert('Invalid image url.');
        setIsWaitingResponse(false);
      });
  };

  const onClickCancelButton = () => {
    history.goBack();
  };

  const writeTabPane = (
    <Tab.Pane active>
      <WriteTab
        title={titleInput}
        imageUrl={imageUrlInput}
        content={contentInput}
        onChangeTitle={e => setTitleInput(e.target.value)}
        onChangeImageUrl={e => setImageUrlInput(e.target.value)}
        onChangeContent={e => setContentInput(e.target.value)}
      />
    </Tab.Pane>
  );

  const previewTabPane = (
    <Tab.Pane>
      <PreviewTab
        title={titleInput}
        imageUrl={imageUrlInput}
        content={contentInput}
      />
    </Tab.Pane>
  );

  const panes = [
    {
      menuItem: 'Write',
      render: () => writeTabPane
    },
    {
      menuItem: 'Preview',
      render: () => previewTabPane
    },
  ];

  return (
    <Container text>
      <Header
        as='h1'
        content='Create review'
        textAlign='center'
      />
      {
        // renderActiveOnly must be true here to prevent the preview tab from accessing
        // all intermediate invalid image urls while we are typing in the write tab
      }
      <Tab panes={panes} renderActiveOnly={true} />
      <br />
      <Button
        id='submitButton'
        onClick={onClickSubmitButton}
        disabled={isWaitingResponse || !titleInput || !contentInput}
        content='Submit'
        floated='right'
        primary
      />
      <Button
        id='cancelButton'
        onClick={onClickCancelButton}
        disabled={isWaitingResponse}
        content='Cancel'
        floated='right'
        basic
      />
    </Container>
  );
};


export default ReviewCreator;