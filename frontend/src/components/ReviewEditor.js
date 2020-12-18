import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Tab, Button, Header, Container } from 'semantic-ui-react';

import * as actionCreators from '../store/actions/index';
import { validateImageUrl } from '../misc';
import { WriteTab, PreviewTab } from './ReviewTabs';


export const ReviewEditor = ({ match }) => {
  const reviewId = match.params.review_id;

  const dispatch = useDispatch();
  const history = useHistory();

  const selectedReview = useSelector(state => state.review.selectedReview);

  const [hasReview, setHasReview] = useState(false);

  const [titleInput, setTitleInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [contentInput, setContentInput] = useState('');

  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  // fetch review on initial mount
  useEffect(() => {
    dispatch(actionCreators.getReview(reviewId))
      .then(() => setHasReview(true));
  }, []);

  // initialize inputs
  useEffect(() => {
    if (hasReview) {
      setTitleInput(selectedReview.title);
      setImageUrlInput(selectedReview.image_url);
      setContentInput(selectedReview.content);
    }
  }, [hasReview]);

  if (!hasReview) {
    return null;
  }

  // check validity of image url before sending request
  // if valid, send edit review request,
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
      .then(() => dispatch(actionCreators.editReview(reviewId, editedReview)))
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
        oldReview={selectedReview}
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
        content='Edit review'
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


export default ReviewEditor;