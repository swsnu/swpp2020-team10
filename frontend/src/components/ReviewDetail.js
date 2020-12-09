import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, Icon, Image, Container, Card, Form } from 'semantic-ui-react';

import * as actionCreators from '../store/actions/index';
import { getFormattedDate } from '../misc';


const CommentCard = ({ comment }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editCommentInput, setEditCommentInput] = useState('');
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const onClickEditCommentButton = () => {
    setEditCommentInput(comment.content);
    setIsEditing(true);
  };

  // set waiting flag to disallow multiple submits before response arrives
  // leave editing mode on success
  const onClickEditCommentConfirmButton = () => {
    setIsWaitingResponse(true);
    dispatch(actionCreators.editComment(comment.id, editCommentInput))
      .then(() => {
        setIsEditing(false);
        setIsWaitingResponse(false);
      });
  };

  const onClickEditCommentCancelButton = () => {
    setIsEditing(false);
  };

  const onClickDeleteCommentButton = () => {
    setIsWaitingResponse(true);
    dispatch(actionCreators.deleteComment(comment.id));
  };

  const onClickLikeCommentButton = () => {
    dispatch(actionCreators.likeComment(comment.id))
      .catch(error => error);
  };

  const onClickDislikeCommentButton = () => {
    dispatch(actionCreators.dislikeComment(comment.id))
      .catch(error => error);
  };

  const onClickReportCommentButton = () => {
    dispatch(actionCreators.reportComment(comment.id))
      .catch(error => error);
  };

  const editCommentCard = (
    <Card.Group>
      <Card fluid>
        <Card.Content>
          <Card.Meta>
            {comment.author_name}&emsp;
            {comment.time_posted}
          </Card.Meta>
          <Form>
            <Form.Field>
              <textarea
                id='editCommentInput'
                value={editCommentInput}
                onChange={e => setEditCommentInput(e.target.value)}
                disabled={isWaitingResponse}
                rows={5}
                style={{ resize: 'none' }}
              />
            </Form.Field>
          </Form>
        </Card.Content>
        <Card.Content extra>
          <Button
            id='editCommentConfirmButton'
            onClick={onClickEditCommentConfirmButton}
            content='Submit'
            disabled={isWaitingResponse || !editCommentInput}
            basic
            primary
          />&ensp;
          <Button
            id='editCommentCancelButton'
            onClick={onClickEditCommentCancelButton}
            content='Cancel'
            disabled={isWaitingResponse}
            basic
          />
        </Card.Content>
      </Card>
    </Card.Group>
  );

  const viewCommentCard = (
    <Card.Group>
      <Card fluid>
        <Card.Content>
          <Card.Meta>
            {comment.author_name}&emsp;
            {comment.time_posted}&emsp;
            {
              currentUser.id === comment.user_id &&
              <span style={isWaitingResponse ? { pointerEvents: 'none' } : {}}>
                <a id='editCommentButton' onClick={onClickEditCommentButton}>Edit</a>&ensp;
                <a id='deleteCommentButton' onClick={onClickDeleteCommentButton}>Delete</a>
              </span>
            }
          </Card.Meta>
          <Card.Description>
            {comment.content}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Icon
            id='likeCommentButton'
            onClick={onClickLikeCommentButton}
            name='thumbs up'
            link
            color='blue'
          />
          {comment.likes}&emsp;
          <Icon
            id='dislikeCommentButton'
            onClick={onClickDislikeCommentButton}
            name='thumbs down'
            link
            color='red'
          />
          {comment.dislikes}&emsp;
          <Icon
            id='reportCommentButton'
            onClick={onClickReportCommentButton}
            name='warning circle'
            link
            color='red'
          />
          {comment.reports}
        </Card.Content>
      </Card>
    </Card.Group >
  );

  if (isEditing) {
    return editCommentCard;
  } else {
    return viewCommentCard;
  }
};


export const ReviewDetail = ({ match }) => {
  const reviewId = match.params.review_id;

  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector(state => state.user);
  const storedReview = useSelector(state => state.review.selectedReview);
  const storedComments = useSelector(state => state.comment.comments);

  const [hasReview, setHasReview] = useState(false);
  const [hasComments, setHasComments] = useState(false);

  const [newCommentInput, setNewCommentInput] = useState('');
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  // fetch review and comments on initial mount
  useEffect(() => {
    dispatch(actionCreators.getReview(reviewId))
      .then(() => setHasReview(true));
    dispatch(actionCreators.getCommentList(reviewId))
      .then(() => setHasComments(true));
  }, []);

  if (!hasReview) {
    return null;
  }

  const onClickEditReviewButton = () => {
    history.push(`/review/${reviewId}/edit`);
  };

  const onClickDeleteReviewButton = () => {
    setIsWaitingResponse(true);
    dispatch(actionCreators.deleteReview(reviewId))
      .then(() => history.push(`/recipe/${storedReview.recipe_id}`));
  };

  const onClickLikeReviewButton = () => {
    dispatch(actionCreators.likeReview(reviewId))
      .catch(error => error);
  };

  const onClickDislikeReviewButton = () => {
    dispatch(actionCreators.dislikeReview(reviewId))
      .catch(error => error);
  };

  const onClickReportReviewButton = () => {
    dispatch(actionCreators.reportReview(reviewId))
      .catch(error => error);
  };

  // set waiting flag to disallow multiple submits before response arrives
  // clear comment input on success
  const onClickWriteCommentButton = () => {
    setIsWaitingResponse(true);
    dispatch(actionCreators.postComment(reviewId, newCommentInput))
      .then(() => {
        setNewCommentInput('');
        setIsWaitingResponse(false);
      });
  };

  const commentList = storedComments.map(comment => {
    return <CommentCard comment={comment} key={comment.id} />;
  });

  const reviewCard = (
    <Card.Group>
      <Card fluid>
        {
          storedReview.image_url &&
          <Image src={storedReview.image_url} />
        }
        <Card.Content>
          <Card.Header>
            {storedReview.title}
          </Card.Header>
          <Card.Meta>
            {storedReview.author_name}&emsp;
            {storedReview.time_posted}&emsp;
            {
              currentUser.id === storedReview.user_id &&
              <span style={isWaitingResponse ? { pointerEvents: 'none' } : {}}>
                <a id='editReviewButton' onClick={onClickEditReviewButton}>Edit</a>&ensp;
                <a id='deleteReviewButton' onClick={onClickDeleteReviewButton}>Delete</a>
              </span>
            }
          </Card.Meta>
          <Card.Description>
            {storedReview.content}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Icon
            id='likeReviewButton'
            onClick={onClickLikeReviewButton}
            name='thumbs up'
            link
            color='blue'
          />
          {storedReview.likes}&emsp;
          <Icon
            id='dislikeReviewButton'
            onClick={onClickDislikeReviewButton}
            name='thumbs down'
            link
            color='red'
          />
          {storedReview.dislikes}&emsp;
          <Icon
            id='reportReviewButton'
            onClick={onClickReportReviewButton}
            name='warning circle'
            link
            color='red'
          />
          {storedReview.reports}
        </Card.Content>
      </Card>
    </Card.Group>
  );

  const writeCommentCard = (
    <Card.Group>
      <Card fluid>
        <Card.Content>
          <Card.Meta>
            {currentUser.name}&emsp;
            {getFormattedDate()}
          </Card.Meta>
          <Form>
            <Form.Field>
              <textarea
                id='newCommentInput'
                value={newCommentInput}
                onChange={e => setNewCommentInput(e.target.value)}
                disabled={isWaitingResponse}
                rows={5}
                style={{ resize: 'none' }}
                placeholder='Comment'
              />
            </Form.Field>
          </Form>
        </Card.Content>
        <Card.Content extra>
          <Button
            id='writeCommentButton'
            onClick={onClickWriteCommentButton}
            content='Submit'
            disabled={isWaitingResponse || !newCommentInput}
            basic
            primary
          />
        </Card.Content>
      </Card>
    </Card.Group>
  );

  return (
    <Container text>
      {reviewCard}
      {
        currentUser.isAuthorized &&
        writeCommentCard
      }
      {
        hasComments &&
        commentList
      }
    </Container>
  );
};


export default ReviewDetail;