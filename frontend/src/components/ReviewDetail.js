import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actionCreators from '../store/actions/index';

import { Button, Icon, Container, Card, Form } from 'semantic-ui-react';


const getFormattedDate = () => {
  const dateObject = new Date();
  const year = dateObject.getFullYear();
  const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
  const date = ('0' + dateObject.getDate()).slice(-2);

  return `${year}-${month}-${date}`;
};


const CommentCard = ({ comment }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.user);

  const [editMode, setEditMode] = useState(false);
  const [editCommentInput, setEditCommentInput] = useState('');
  const [enableEditConfirmButton, setEnableEditConfirmButton] = useState(true);

  const onClickEditCommentButton = () => {
    setEditCommentInput(comment.content);
    setEditMode(true);
  };

  const onClickEditCommentConfirmButton = () => {
    setEnableEditConfirmButton(false);
    dispatch(actionCreators.editComment(comment.id, editCommentInput))
      .then(() => {
        setEditMode(false);
        setEnableEditConfirmButton(true);
      });
  };

  const onClickEditCommentCancelButton = () => {
    setEditMode(false);
  };

  const onClickDeleteCommentButton = () => {
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

  if (editMode) {
    return (
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
                  disabled={!enableEditConfirmButton}
                  style={{ height: 100, minHeight: 100 }}
                />
              </Form.Field>
            </Form>
          </Card.Content>
          <Card.Content extra>
            <Button
              id='editCommentConfirmButton'
              onClick={onClickEditCommentConfirmButton}
              content='Submit'
              disabled={!enableEditConfirmButton || !editCommentInput}
              basic
              primary
            />&ensp;
            <Button
              id='editCommentCancelButton'
              onClick={onClickEditCommentCancelButton}
              content='Cancel'
              disabled={!enableEditConfirmButton}
              basic
              primary
            />
          </Card.Content>
        </Card>
      </Card.Group>
    );
  } else {
    return (
      <Card.Group>
        <Card fluid>
          <Card.Content>
            <Card.Meta>
              {comment.author_name}&emsp;
              {comment.time_posted}&emsp;
              {
                currentUser.id === comment.user_id &&
                <span>
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
      </Card.Group>
    );
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
  const [enableWriteCommentButton, setEnableWriteCommentButton] = useState(true);

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

  const onClickWriteCommentButton = () => {
    setEnableWriteCommentButton(false);
    dispatch(actionCreators.postComment(reviewId, newCommentInput))
      .then(() => {
        setNewCommentInput('');
        setEnableWriteCommentButton(true);
      });
  };

  const commentList = storedComments.map(comment => {
    return <CommentCard comment={comment} key={comment.id} />;
  });

  return (
    <Container text>
      {/* review */}
      <Card.Group>
        <Card fluid>
          <Card.Content>
            <Card.Header>
              {storedReview.title}
            </Card.Header>
            <Card.Meta>
              {storedReview.author_name}&emsp;
              {storedReview.time_posted}&emsp;
              {
                currentUser.id === storedReview.user_id &&
                <span>
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
      {
        currentUser.isAuthorized &&
        /* write comment */
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
                    disabled={!enableWriteCommentButton}
                    style={{ height: 100, minHeight: 100 }}
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
                disabled={!enableWriteCommentButton || !newCommentInput}
                basic
                primary
              />
            </Card.Content>
          </Card>
        </Card.Group>
      }
      {
        hasComments &&
        commentList
      }
    </Container>
  );
};


export default ReviewDetail;