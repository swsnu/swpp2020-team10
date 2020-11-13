import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Label, Header, Container, Grid, Segment } from 'semantic-ui-react';
import * as actionCreators from '../store/actions/index';

/*<div className='row'>
<Button id='settingsButton' onClick={onClickSettingsButton()}>
  To Settings
</Button>
<Button id='signOutButton' onClick={onClickSignOutButton()}>
  Sign Out
</Button>
</div>*/
function ReviewDetail(props) {
  const [comment, setComment] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const storedReview = /*{
    'id': 1,
    'recipe_id': 1,
    'user_id': 1,
    'title': 'Kimchi review!!!',
    'content': 'Kimchi is good modify content',
    'likes': 5,
    'reports': 3
  };//*/useSelector(state => state.review.selectedReview);
  const storedUser = /*{
    'id': 1,
    'name': 'John',
    'isAuthorized': true
  };//*/useSelector(state => state.user);

  const reviewId = props.match.params.review_id;

  useEffect(() => {
    if(storedReview === null){
      dispatch(actionCreators.getReview(reviewId));
    }
    dispatch(actionCreators.getCommentList(reviewId));
  });

  let userId, recipeId;
  if(storedReview !== null) {
    userId = storedReview.user_id;
    recipeId = storedReview.recipe_id;
  }

  let thisUserId;
  if(storedUser != null){
    thisUserId = storedUser.id;
  }

  /*// move to 'Settings' page
  const onClickSettingsButton = () => {};

  // logout and go to index page
  const onClickSignOutButton = () => {};
  */
  // move to 'Review Editor' page
  const onClickEditReviewButton = () => {
    history.push('/review/' + reviewId + '/edit');
  };

  // delete the review and go back to 'Recipe Details' page
  const onClickDeleteReviewButton = () => {
    dispatch(actionCreators.deleteReview(reviewId));
    history.push('/recipe/' + recipeId);
  };

  // move to 'Recipe Details' page
  const onClickBackButton = (id) => {
    history.push('/recipe/' + id);
  };

  // make new comment
  const onClickWriteButton = (comment) => {
    const newComment = {
      review: storedReview,
      user: storedUser,
      content: comment,
    };
    dispatch(actionCreators.postComment(reviewId, newComment));
  };

  
  return(
    <div className='ReviewDetail'>
      <ReviewPart reviewId={reviewId} />
      <Grid centered>
        <Grid.Row>
          <Button id='editReviewButton' disabled={userId !== thisUserId} 
            onClick={() => onClickEditReviewButton()}>
            Edit
          </Button>
          <Button id='deleteReviewButton' disabled={userId !== thisUserId} 
            onClick={() => onClickDeleteReviewButton()}>
            Delete
          </Button>
        </Grid.Row>
        <Button id='backButton' onClick={() => onClickBackButton(recipeId)}>
          Back
        </Button>
        <div className='row'>
          <Header textAlign='center'>Comments</Header>
        </div>
        <div className='row'>
          <input id='newCommentInput' rows='4' type='text' value={comment}
            onChange={(event) => setComment(event.target.value)}>
          </input>
        </div>
        <div className='row'>
          <Button className='writeCommentButton' 
            onClick={() => onClickWriteButton(comment)}>
            Write
          </Button>
        </div>
      </Grid>
      <CommentList />
    </div>
  );
}

// returns information about the review.
// Image should be inserted in future implementation.
function ReviewPart(props) {

  const [hasReview, setHasReview] = useState(false);
  const dispatch = useDispatch();
  const reviewId = props.reviewId;
  if(!hasReview) {
    dispatch(actionCreators.getReview(reviewId));
    setHasReview(true);
  }
  const storedReview = /*{
    'id': 1,
    'recipe_id': 1,
    'user_id': 1,
    'title': 'Kimchi review!!!',
    'content': 'Kimchi is good modify content',
    'likes': 5,
    'reports': 3
  };//*/useSelector(state => state.review.selectedReview);


  // increment likes count for the review
  const onClickLikeReviewButton = () => {
    dispatch(actionCreators.likeReview(reviewId));
  };

  // increment dislikes count for the review
  const onClickDislikeReviewButton = () => {
    dispatch(actionCreators.dislikeReview(reviewId));
  };

  // increment reports count for the review
  const onClickReportReviewButton = () => {
    dispatch(actionCreators.reportReview(reviewId));
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
      <Grid centered padded>
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
}

// returns list of comments of this review w/ necessary information + Buttons
function CommentList() {

  const [newComment, setNewComment] = useState('');
  const [editedComment, setEditedComment] = useState(0);

  const storedComments = /*[{
    'id': 1,
    'review_id': 1,
    'user_id': 1,
    'content': 'some bad comment',
    'likes': 0,
    'reports': 0
  },
  {
    'id': 2,
    'review_id': 1,
    'user_id': 2,
    'content': 'review test 1',
    'likes': 0,
    'reports': 0
  }];//*/useSelector(state => state.comment.comments);
  const storedUser = /*{
    'id': 1,
    'name': 'John',
    'isAuthorized': true
  };//*/useSelector(state => state.user);

  let thisUserId;
  if(storedUser !== null) {
    thisUserId = storedUser.id;
  }
  const dispatch = useDispatch();

  // confirm edit
  const onClickEditCommentConfirmButton = (commentId, comment) => {
    dispatch(actionCreators.editComment(commentId, comment));
    setEditedComment(0);
  };

  // delete the comment
  const onClickDeleteCommentButton = (commentId) => {
    dispatch(actionCreators.deleteComment(commentId));
    //this.props.onDeleteComment(commentId);
  };

  // increment likes count for the comment
  const onClickLikeCommentButton = (commentId) => {
    dispatch(actionCreators.likeComment(commentId));
    //this.props.onLikeComment(commentId, comment);
  };

  // decrement likes count for the comment
  const onClickDislikeCommentButton = (commentId) => {
    dispatch(actionCreators.dislikeComment(commentId));
    //this.props.onDislikeComment(commentId, comment);
  };

  // increment reports count for the comment
  const onClickReportCommentButton = (commentId) => {
    dispatch(actionCreators.reportComment(commentId));
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
                onClick={() => onClickEditCommentConfirmButton(comment.id, {...comment, content: newComment})}>
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
                  <Button size='tiny'  id='likeCommentButton' labelPosition='right'>
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
}

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