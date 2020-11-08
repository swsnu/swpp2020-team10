import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';

// move to 'Settings' page
const onClickSettingsButton = () => {};

// logout and go to index page
const onClickSignOutButton = () => {};

// move to 'Review Editor' page
const onClickEditReviewButton = () => {};

// delete the review and go back to 'Recipe Details' page
const onClickDeleteReviewButton = () => {
  this.props.onDeleteReview(this.props.match.params.id);
};

// move to 'Recipe Details' page
const onClickBackButton = () => {};

// make new comment
const onClickWriteButton = (comment) => {
  const newComment = {
    review: this.props.storedReview,
    user: this.props.user,
    content: comment,
  };
  this.props.onPostComment(this.props.match.params.id, newComment);
};

// increment likes count for the review
const onClickLikeReviewButton = () => {
  const thisReview = this.props.storedReview;
  this.props.onLikeReview(this.props.match.params.id, thisReview);
};

// decrement likes count for the review
const onClickDisikeReviewButton = () => {
  const thisReview = this.props.storedReview;
  this.props.onDisikeReview(this.props.match.params.id, thisReview);
};

// increment reports count for the review
const onClickReportReviewButton = () => {
  const thisReview = this.props.storedReview;
  this.props.onReportReview(this.props.match.params.id, thisReview);
};

// edit the comment
const onClickEditCommentButton = (commentId, comment) => {
  const [newComment, setNewComment] = useState('');

  // confirm edit
  const onClickEditCommentConfirmButton = (commentId, comment) => {
    this.props.onEditComment(commentId, comment);
  };

  // cancel edit and exit the popup
  const onClickEditCommentCancelButton = () => {};

  return(
    <div className='CommentEditor'>
      <div className='row'>
        <input id='editCommentInput' rows='4' type='text' value={comment.value}
          onChange={(event) => setNewComment(event.target.value)}>
        </input>
      </div>
      <button id='editCommentConfirmButton' disabled={newComment === ''}
        onClick={onClickEditCommentConfirmButton(commentId, {...comment, content: newComment})}>
        Confirm
      </button>
      <button id='editCommentCancelButton' disabled={newComment === ''}
        onClick={onClickEditCommentCancelButton()}>
        Cancel
      </button>
    </div>
  );
};

// delete the comment
const onClickDeleteCommentButton = (commentId) => {
  this.props.onDeleteComment(commentId);
};

// increment likes count for the comment
const onClickLikeCommentButton = (commentId, comment) => {
  this.props.onLikeComment(commentId, comment);
};

// decrement likes count for the comment
const onClickDislikeCommentButton = (commentId, comment) => {
  this.props.onDislikeComment(commentId, comment);
};

// increment reports count for the comment
const onClickReportCommentButton = (commentId, comment) => {
  this.props.onReportComment(commentId, comment);
};


function ReviewDetail() {
  const [comment, setComment] = useState('');
  return(
    <div className='ReviewDetail'>
      <div className='row'>
        <button id='settingsButton' onClick={onClickSettingsButton()}>
          To Settings
        </button>
        <button id='signOutButton' onClick={onClickSignOutButton()}>
          Sign Out
        </button>
      </div>
      <ReviewPart />
      <button id='editReviewButton' disabled={this.props.storedReview.user !== this.props.user} 
        onClick={onClickEditReviewButton()}>
        Edit
      </button>
      <button id='deleteReviewButton' disabled={this.props.storedReview.user !== this.props.user} 
        onClick={onClickDeleteReviewButton()}>
        Delete
      </button>
      <button id='backButton' onClick={onClickBackButton()}>
        Back
      </button>
      <div className='row'>
        <h1>Comments</h1>
      </div>
      <div className='row'>
        <input id='newCommentInput' rows='4' type='text' value={comment}
          onChange={(event) => setComment(event.target.value)}>
        </input>
      </div>
      <div className='row'>
        <button className='writeCommentButton' disabled={comment === ''} 
          onClick={onClickWriteButton(comment)}>
          Write
        </button>
      </div>
      <CommentList />
    </div>
  );
}

// returns information about the review.
// Image should be inserted in future implementation.
function ReviewPart() {
  return(
    <div className='ReviewPart'>
      <h1>{this.props.storedReview.title}</h1>
      <div className='row'>
        <p1>{this.props.storedReview.content}</p1>
        <button id='likeReviewButton' onClick={onClickLikeReviewButton()}>
          Like
        </button>
        {this.props.storedReview.likes}
        <button id='dislikeReviewButton' onClick={onClickDisikeReviewButton()}>
          Dislike
        </button>
        <button id='reportReviewButton' onClick={onClickReportReviewButton()}>
          Report
        </button>
        <p3>{this.props.storedReview.reports}</p3>
      </div>
    </div>
  );
}

// returns list of comments of this review w/ necessary information + buttons
function CommentList() {
  const commentList = this.props.storedComments.map((comment) => {
    if(comment.id === this.props.user.id) {
      return (
        <div className='Comment'>
          <div className='row'>
            {comment.user.username}
            {comment.likes}
            {comment.reports}
          </div>
          <div className='row'>
            {comment.content}
          </div>
          <div className='row'>
            <button id='editCommentButton' onClick={onClickEditCommentButton(comment.id, comment)}>
              Edit
            </button>
            <button id='deleteCommentButton' onClick={onClickDeleteCommentButton(comment.id)}>
              Delete
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className='Comment'>
          <div className='row'>
            {comment.user.username}
            <button id='likeCommentButton' onClick={onClickLikeCommentButton(comment.id, comment)}>
              Like
            </button>
            {comment.likes}
            <button id='dislikeCommentButton' onClick={onClickDislikeCommentButton(comment.id, comment)}>
              Dislike
            </button>
            <button id='reportCommentButton' onClick={onClickReportCommentButton(comment.id, comment)}>
              Report
            </button>
            {comment.reports}
          </div>
          <div className='row'>
            {comment.content}
          </div>
        </div>
      );
    }
  });
  return commentList;
}

const mapStateToProps = (state) => {
  return {
    storedReview: state.reviews.selectedReview,
    storedComments: state.comments.comments,
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

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetail);