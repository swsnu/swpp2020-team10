import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Label, Header, Container, Grid, Segment, Card, Form } from 'semantic-ui-react';
import * as actionCreators from '../store/actions/index';


export const ReviewDetail = ({ match }) => {
  const reviewId = match.params.review_id;

  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector(state => state.user);
  const storedReview = useSelector(state => state.review.selectedReview);
  const storedComments = useSelector(state => state.comment.comments);

  const [hasReview, setHasReview] = useState(false);
  const [hasComments, setHasComments] = useState(false);

  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [reported, setReported] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editedComment, setEditedComment] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [reports, setReports] = useState(0);

  // fetch review and comments on initial mount
  useEffect(() => {
    dispatch(actionCreators.getReview(reviewId))
      .then(() => setHasReview(true));
    dispatch(actionCreators.getCommentList(reviewId))
      .then(() => setHasComments(true));
  }, []);

  if (!hasReview || !hasComments) {
    return null;
  }

  let userId = 0, recipeId = 0;
  userId = storedReview.user_id;
  recipeId = storedReview.recipe_id;

  const onClickDeleteReviewButton = () => {
    dispatch(actionCreators.deleteReview())
      .then(() => history.push(`/recipe/${recipeId}`));
  };

  const onClickWriteButton = () => {
    const newComment = {
      review_id: reviewId,
      user_id: userId,
      content: comment,
      likes: 0,
      dislikes: 0,
      reports: 0,
    };

    setHasComments(false);
    dispatch(actionCreators.postComment(reviewId, newComment))
      .then(() => dispatch(actionCreators.getCommentList(reviewId)))
      .then(() => setHasComments(true));
  };


  // confirm edit
  const onClickEditCommentConfirmButton = (commentId, comment) => {
    dispatch(actionCreators.editComment(commentId, comment));
    dispatch(actionCreators.getCommentList(reviewId));
    setEditedComment(0);
    setNewComment('');
  };

  // delete the comment
  const onClickDeleteCommentButton = (commentId) => {
    dispatch(actionCreators.deleteComment(commentId));
    dispatch(actionCreators.getCommentList(reviewId));
    //this.props.onDeleteComment(commentId);
  };

  const onClickLikeReviewButton = (likeCount) => {
    if (!liked) {
      setLikes(likeCount + 1);
      setLiked(true);
    } else {
      setLikes(likes + 1);
    }
    dispatch(actionCreators.likeReview(reviewId));
    dispatch(actionCreators.getReview(reviewId));
  };

  // increment dislikes count for the review
  const onClickDislikeReviewButton = (dislikeCount) => {
    if (!disliked) {
      setDislikes(dislikeCount + 1);
      setDisliked(true);
    } else {
      setDislikes(dislikes + 1);
    }
    dispatch(actionCreators.dislikeReview(reviewId));
    dispatch(actionCreators.getReview(reviewId));
  };

  // increment reports count for the review
  const onClickReportReviewButton = (reportCount) => {
    if (!reported) {
      setReports(reportCount + 1);
      setReported(true);
    } else {
      setReports(reports + 1);
    }
    dispatch(actionCreators.reportReview(reviewId));
    dispatch(actionCreators.getReview(reviewId));
    //this.props.onReportReview(reviewId, thisReview);
  };

  // increment likes count for the comment
  const onClickLikeCommentButton = (commentId) => {
    dispatch(actionCreators.likeComment(commentId));
    dispatch(actionCreators.getCommentList(reviewId));
    //this.props.onLikeComment(commentId, comment);
  };

  // decrement likes count for the comment
  const onClickDislikeCommentButton = (commentId) => {
    dispatch(actionCreators.dislikeComment(commentId));
    dispatch(actionCreators.getCommentList(reviewId));
    //this.props.onDislikeComment(commentId, comment);
  };

  // increment reports count for the comment
  const onClickReportCommentButton = (commentId) => {
    dispatch(actionCreators.reportComment(commentId));
    dispatch(actionCreators.getCommentList(reviewId));
    //this.props.onReportComment(commentId, comment);
  };

  const commentList = storedComments.map((comment, key) => {
    if (currentUser.id && comment.user_id === currentUser.id) {
      return (
        <div className='Comment' key={key}>
          <Grid centered padded>
            <Grid.Row>
              <Segment attached='top'>
                Author: {comment.author_name} Likes: {comment.likes} | Reports: {comment.reports}
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <Segment attached='bottom'>
                {comment.content}
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <Button id='editCommentButton' onClick={() => setEditedComment(comment.id)}>
                Edit
              </Button>
              <Button id='deleteCommentButton' onClick={() => onClickDeleteCommentButton(comment.id)}>
                Delete
              </Button>
            </Grid.Row>
            <Grid.Row>
              <input id='editCommentInput' rows='4' type='text' disabled={comment.id !== editedComment} value={newComment}
                onChange={(event) => setNewComment(event.target.value)}>
              </input>
            </Grid.Row>
            <Grid.Row>
              <Button id='editCommentConfirmButton'
                onClick={() => onClickEditCommentConfirmButton(editedComment, { ...comment, content: newComment })}>
                Confirm
              </Button>
              <Button id='editCommentCancelButton'
                onClick={() => setEditedComment(0)}>
                Cancel
              </Button>
            </Grid.Row>
          </Grid>
        </div>
      );
    } else {
      return (
        <div className='Comment' key={key}>
          <Grid centered>
            <Grid.Row stretched columns={2}>
              <Segment attached='top'>
                <Grid.Column>
                  Author: {comment.author_name}
                </Grid.Column>
                <Grid.Column width={5}>
                  <Button as='div' size='tiny' labelPosition='right'>
                    <Button id='likeCommentButton' color='blue' size='tiny' onClick={() => onClickLikeCommentButton(comment.id)}>
                      <Icon size='tiny' name='thumbs up' />
                        Like
                    </Button>
                    <Label id='likeLabel' basic color='blue' pointing='left'>
                      {comment.likes}
                    </Label>
                  </Button>
                  <Button as='div' size='tiny' labelPosition='right'>
                    <Button id='dislikeCommentButton' color='red' size='tiny' onClick={() => onClickDislikeCommentButton(comment.id)}>
                      <Icon size='tiny' name='thumbs down' />
                        Dislike
                    </Button>
                    <Label id='dislikeLabel' basic color='red' pointing='left'>
                      {comment.dislikes}
                    </Label>
                  </Button>
                  <Button as='div' size='tiny' labelPosition='right'>
                    <Button id='reportCommentButton' color='red' size='tiny' onClick={() => onClickReportCommentButton(comment.id)}>
                      <Icon size='tiny' name='exclamation circle' />
                        Report
                    </Button>
                    <Label id='likeLabel' basic color='red' pointing='left'>
                      {comment.reports}
                    </Label>
                  </Button>
                </Grid.Column>
              </Segment>
              <Segment attached='bottom'>
                <Container>
                  {comment.content}
                </Container>
              </Segment>
            </Grid.Row>
          </Grid>
        </div>
      );
    }
  });

  return (
    <div className='ReviewDetail'>
      <Container text>
        <Card.Group>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                {storedReview.title}
              </Card.Header>
              <Card.Meta>
                By {storedReview.author_name}&emsp;
                <a
                  id='editReviewButton'
                  onClick={() => history.push(`/review/${reviewId}/edit`)}
                >Edit</a>&ensp;
                <a
                  id='deleteReviewButton'
                  onClick={onClickDeleteReviewButton}
                >Delete</a>
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
        <Form>
          <Form.Field>
            
          </Form.Field>
        </Form>
      </Container>
      <Grid centered>
        <div className='row'>
          <Header textAlign='center'>Comments</Header>
        </div>
        <div className='row'>
          <input id='newCommentInput' rows='4' type='text' value={comment}
            onChange={(event) => setComment(event.target.value)}>
          </input>
        </div>
        <div className='row'>
          <Button id='writeCommentButton'
            onClick={onClickWriteButton}>
            Write
          </Button>
        </div>
      </Grid>
      {commentList}
    </div>
  );
};

// returns information about the review.
// Image should be inserted in future implementation.
/*function ReviewPart(props) {

  const [hasReview, setHasReview] = useState(false);
  const dispatch = useDispatch();
  const reviewId = props.reviewId;
  if(!hasReview) {
        dispatch(actionCreators.getReview(reviewId));
    setHasReview(true);
  }
  const storedReview = useSelector(state => state.review.selectedReview);


  // increment likes count for the review
  const onClickLikeReviewButton = () => {
        dispatch(actionCreators.likeReview(reviewId));
    dispatch(actionCreators.getReview(reviewId));
  };

  // increment dislikes count for the review
  const onClickDislikeReviewButton = () => {
        dispatch(actionCreators.dislikeReview(reviewId));
    dispatch(actionCreators.getReview(reviewId));
  };

  // increment reports count for the review
  const onClickReportReviewButton = () => {
        dispatch(actionCreators.reportReview(reviewId));
    dispatch(actionCreators.getReview(reviewId));
    //this.props.onReportReview(reviewId, thisReview);
  };

  let title, content, likes, dislikes, reports;
  if(storedReview !== null) {
        title = storedReview.title;
    content = storedReview.content;
    likes = storedReview.likes;
    dislikes = storedReview.dislikes;
    reports = storedReview.reports;
  }

  return(
      <div className='ReviewPart'>
        <Grid centered>
          <Grid.Row>
            <Segment attached='top'>
              <Header textAlign='center'>{title}</Header>
            </Segment>
            <Segment attached='bottom'>
              <Container textAlign='center'>
                <p>
                  {content}
                </p>
              </Container>
            </Segment>
          </Grid.Row>
          <Grid.Row>
            <Button id='likeReviewButton' labelPosition='right'>
              <Button color='blue' onClick={() => onClickLikeReviewButton()}>
                <Icon name='thumbs up' />
                Like
            </Button>
              <Label id='likeLabel' basic color='blue' pointing='left'>
                {likes}
              </Label>
            </Button>
            <Button id='likeReviewButton' labelPosition='right'>
              <Button color='red' onClick={() => onClickDislikeReviewButton()}>
                <Icon name='thumbs down' />
                Disike
            </Button>
              <Label id='likeLabel' basic color='red' pointing='left'>
                {dislikes}
              </Label>
            </Button>
            <Button id='reportReviewButton' labelPosition='right'>
              <Button color='red' onClick={() => onClickReportReviewButton()}>
                <Icon name='exclamation circle' />
                Report
            </Button>
              <Label id='likeLabel' basic color='red' pointing='left'>
                {reports}
              </Label>
            </Button>
          </Grid.Row>
        </Grid>
      </div>
  );
}*/

// returns list of comments of this review w/ necessary information + Buttons
/*function CommentList() {

  const [newComment, setNewComment] = useState('');
  const [editedComment, setEditedComment] = useState(0);

  const storedComments = useSelector(state => state.comment.comments);
  const storedUser = useSelector(state => state.user);

  let thisUserId;
  if(storedUser !== null) {
        thisUserId = storedUser.id;
  }
  const dispatch = useDispatch();

  // confirm edit
  const onClickEditCommentConfirmButton = (commentId, comment) => {
        dispatch(actionCreators.editComment(commentId, comment));
    dispatch(actionCreators.getCommentList(reviewId));
    setEditedComment(0);
  };

  // delete the comment
  const onClickDeleteCommentButton = (commentId) => {
        dispatch(actionCreators.deleteComment(commentId));
    dispatch(actionCreators.getCommentList(reviewId));
    //this.props.onDeleteComment(commentId);
  };

  // increment likes count for the comment
  const onClickLikeCommentButton = (commentId) => {
        dispatch(actionCreators.likeComment(commentId));
    dispatch(actionCreators.getCommentList(reviewId));
    //this.props.onLikeComment(commentId, comment);
  };

  // decrement likes count for the comment
  const onClickDislikeCommentButton = (commentId) => {
        dispatch(actionCreators.dislikeComment(commentId));
    dispatch(actionCreators.getCommentList(reviewId));
    //this.props.onDislikeComment(commentId, comment);
  };

  // increment reports count for the comment
  const onClickReportCommentButton = (commentId) => {
        dispatch(actionCreators.reportComment(commentId));
    dispatch(actionCreators.getCommentList(reviewId));
    //this.props.onReportComment(commentId, comment);
  };
  const commentList = storedComments.map((comment) => {
    if(comment.user_id === thisUserId) {
      return (
      <div className='Comment' key={comment.id}>
        <Grid centered padded>
          <Grid.Row>
            <Segment attached='top'>
              Author: {comment.author_name} Likes: {comment.likes} | Reports: {comment.reports}
            </Segment>
          </Grid.Row>
          <Grid.Row>
            <Segment attached='bottom'>
              {comment.content}
            </Segment>
          </Grid.Row>
          <Grid.Row>
            <Button id='editCommentButton' onClick={() => setEditedComment(commentId)}>
              Edit
              </Button>
            <Button id='deleteCommentButton' onClick={() => onClickDeleteCommentButton(comment.id)}>
              Delete
              </Button>
          </Grid.Row>
          <Grid.Row>
            <input id='editCommentInput' rows='4' type='text' disabled={comment.id !== editedComment} value={comment.value}
              onChange={(event) => setNewComment(event.target.value)}>
            </input>
          </Grid.Row>
          <Grid.Row>
            <Button id='editCommentConfirmButton' disabled={(newComment === '') || (comment.id === editedComment)}
              onClick={() => onClickEditCommentConfirmButton(comment.id, { ...comment, content: newComment })}>
              Confirm
              </Button>
            <Button id='editCommentCancelButton' disabled={(newComment === '') || (comment.id === editedComment)}
              onClick={() => setEditedComment(0)}>
              Cancel
              </Button>
          </Grid.Row>
        </Grid>
      </div>
      );
    } else {
      return (
      <div className='Comment' key={comment.id}>
        <Grid centered padded>
          <Grid.Row stretched columns={2} divided>
            <Segment attached='top'>
              <Grid.Column padded>
                Author: {comment.author_name}
              </Grid.Column>
              <Grid.Column width={5}>
                <Button size='tiny' id='likeCommentButton' labelPosition='right'>
                  <Button color='blue' size='tiny' onClick={() => onClickLikeCommentButton(comment.id)}>
                    <Icon size='tiny' name='thumbs up' />
                        Like
                    </Button>
                  <Label id='likeLabel' basic color='blue' pointing='left'>
                    {comment.likes}
                  </Label>
                </Button>
                <Button id='dislikeCommentButton' size='tiny' labelPosition='right'>
                  <Button color='red' size='tiny' onClick={() => onClickDislikeCommentButton(comment.id)}>
                    <Icon size='tiny' name='thumbs down' />
                        Dislike
                    </Button>
                  <Label id='dislikeLabel' basic color='red' pointing='left'>
                    {comment.dislikes}
                  </Label>
                </Button>
                <Button id='reportCommentButton' size='tiny' labelPosition='right'>
                  <Button color='red' size='tiny' onClick={() => onClickReportCommentButton(comment.id)}>
                    <Icon size='tiny' name='exclamation circle' />
                        Report
                    </Button>
                  <Label id='likeLabel' basic color='red' pointing='left'>
                    {comment.reports}
                  </Label>
                </Button>
              </Grid.Column>
            </Segment>
            <Segment attached='bottom'>
              <Container>
                {comment.content}
              </Container>
            </Segment>
          </Grid.Row>
        </Grid>
      </div>
      );
    }
  });
  return commentList;
}*/

/*const mapStateToProps = (state) => {
  return {
        storedReview: state.review.selectedReview,
    storedComments: state.comment.comments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
        onGetReview: (reviewId) => 
      dispatch(actionCreators.getReview(reviewId)),
    onGetComments: (reviewId) => 
      dispatch(actionCreators.getCommentList(reviewId)),
    onPostComment: (commentId, comment) => 
      dispatch(actionCreators.postComment(commentId, comment)),
    onLikeReview: (reviewId, review) => 
      dispatch(actionCreators.likeReview(reviewId, review)),
    onDislikeReview: (reviewId, review) => 
      dispatch(actionCreators.dislikeReview(reviewId, review)),
    onReportReview: (reviewId, review) => 
      dispatch(actionCreators.reportReview(reviewId, review)),
    onLikeComment: (commentId, comment) =>
      dispatch(actionCreators.likeComment(commentId, comment)),
    onDislikeComment: (commentId, comment) =>
      dispatch(actionCreators.dislikeComment(commentId, comment)),
    onReportComment: (commentId, comment) => 
      dispatch(actionCreators.reportComment(commentId, comment)),
    onDeleteReview: (reviewId) =>
      dispatch(actionCreators.deleteReview(reviewId)),
    onDeleteComment: (commentId) =>
      dispatch(actionCreators.deleteComment(commentId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetail);*/
export default ReviewDetail;