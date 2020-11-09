import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actionCreators from '../store/actions/index';

/*<div className='row'>
<button id='settingsButton' onClick={onClickSettingsButton()}>
  To Settings
</button>
<button id='signOutButton' onClick={onClickSignOutButton()}>
  Sign Out
</button>
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

  const reviewId = props.match.params.reviewId;

  useEffect(() => {
    if(!storedReview){
      dispatch(actionCreators.getReview(reviewId));
    }
    dispatch(actionCreators.getCommentList(reviewId));
  });


  /*// move to 'Settings' page
  const onClickSettingsButton = () => {};

  // logout and go to index page
  const onClickSignOutButton = () => {};
  */
  // move to 'Review Editor' page
  const onClickEditReviewButton = () => {
    history.push('/');
  };

  // delete the review and go back to 'Recipe Details' page
  const onClickDeleteReviewButton = () => {
    this.props.onDeleteReview(reviewId);
    history.push('/recipe/' + storedReview.recipe.id);
  };

  // move to 'Recipe Details' page
  const onClickBackButton = () => {
    history.push('/recipe/' + storedReview.recipe.id);
  };

  // make new comment
  const onClickWriteButton = (comment) => {
    const newComment = {
      review: storedReview,
      user: storedUser,
      content: comment,
    };
    this.props.onPostComment(reviewId, newComment);
  };
  
  return(
    <div className='ReviewDetail'>
      <ReviewPart reviewId={reviewId} />
      <button id='editReviewButton' disabled={storedReview.user_id !== storedUser.id} 
        onClick={() => onClickEditReviewButton()}>
        Edit
      </button>
      <button id='deleteReviewButton' disabled={storedReview.user_id !== storedUser.id} 
        onClick={() => onClickDeleteReviewButton()}>
        Delete
      </button>
      <button id='backButton' onClick={() => onClickBackButton()}>
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
          onClick={() => onClickWriteButton(comment)}>
          Write
        </button>
      </div>
      <CommentList />
    </div>
  );
}

// returns information about the review.
// Image should be inserted in future implementation.
function ReviewPart(props) {

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
  const reviewId = props.reviewId;

  // increment likes count for the review
  const onClickLikeReviewButton = () => {
    const thisReview = storedReview;
    dispatch(actionCreators.likeReview(reviewId, thisReview));
  };

  // decrement likes count for the review
  const onClickDisikeReviewButton = () => {
    const thisReview = storedReview;
    dispatch(actionCreators.dislikeReview(reviewId, thisReview));
  };

  // increment reports count for the review
  const onClickReportReviewButton = () => {
    const thisReview = storedReview;
    dispatch(actionCreators.reportReview(reviewId, thisReview));
    //this.props.onReportReview(reviewId, thisReview);
  };

  return(
    <div className='ReviewPart'>
      <h1>{storedReview.title}</h1>
      <div className='row'>
        <p1>{storedReview.content}</p1>
        <button id='likeReviewButton' onClick={() => onClickLikeReviewButton()}>
          Like
        </button>
        {storedReview.likes}
        <button id='dislikeReviewButton' onClick={() => onClickDisikeReviewButton()}>
          Dislike
        </button>
        <button id='reportReviewButton' onClick={() => onClickReportReviewButton()}>
          Report
        </button>
        <p3>{storedReview.reports}</p3>
      </div>
    </div>
  );
}

// returns list of comments of this review w/ necessary information + buttons
function CommentList() {
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
  }];//useSelector(state => state.comment.comments);
  const storedUser = {
    'id': 1,
    'name': 'John',
    'isAuthorized': true
  };//*/useSelector(state => state.user);
  const dispatch = useDispatch();

  // edit the comment
  const onClickEditCommentButton = (commentId, comment) => {
    const [newComment, setNewComment] = useState('');

    // confirm edit
    const onClickEditCommentConfirmButton = (commentId, comment) => {
      dispatch(actionCreators.editComment(commentId, comment));
    };

    // cancel edit and exit the popup
    const onClickEditCommentCancelButton = () => {
      return;
    };

    return(
      <div className='CommentEditor'>
        <div className='row'>
          <input id='editCommentInput' rows='4' type='text' value={comment.value}
            onChange={(event) => setNewComment(event.target.value)}>
          </input>
        </div>
        <button id='editCommentConfirmButton' disabled={newComment === ''}
          onClick={() => onClickEditCommentConfirmButton(commentId, {...comment, content: newComment})}>
          Confirm
        </button>
        <button id='editCommentCancelButton' disabled={newComment === ''}
          onClick={() => onClickEditCommentCancelButton()}>
          Cancel
        </button>
      </div>
    );
  };

  // delete the comment
  const onClickDeleteCommentButton = (commentId) => {
    dispatch(actionCreators.deleteComment(commentId));
    //this.props.onDeleteComment(commentId);
  };

  // increment likes count for the comment
  const onClickLikeCommentButton = (commentId, comment) => {
    dispatch(actionCreators.likeComment(commentId, comment));
    //this.props.onLikeComment(commentId, comment);
  };

  // decrement likes count for the comment
  const onClickDislikeCommentButton = (commentId, comment) => {
    dispatch(actionCreators.dislikeComment(commentId, comment));
    //this.props.onDislikeComment(commentId, comment);
  };

  // increment reports count for the comment
  const onClickReportCommentButton = (commentId, comment) => {
    dispatch(actionCreators.reportComment(commentId, comment));
    //this.props.onReportComment(commentId, comment);
  };
  const commentList = storedComments.map((comment) => {
    if(comment.user_id === storedUser.id) {
      return (
        <div className='Comment'>
          <div className='row'>
            Author: {comment.user_id} Likes: {comment.likes} | Reports: {comment.reports}
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
            Author: {comment.user_id}
            <button id='likeCommentButton' onClick={onClickLikeCommentButton(comment.id, comment)}>
              Like
            </button>
            Likes: {comment.likes}
            <button id='dislikeCommentButton' onClick={onClickDislikeCommentButton(comment.id, comment)}>
              Dislike
            </button>
            <button id='reportCommentButton' onClick={onClickReportCommentButton(comment.id, comment)}>
              Report
            </button>
            Reports: {comment.reports}
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