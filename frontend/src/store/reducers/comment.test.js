import reducer from './comment';
import * as actionTypes from '../actions/actionTypes';

const stubComment = {
  'id': 1,
  'review_id': 1,
  'user_id': 1,
  'content': 'some bad comment',
  'likes': 0,
  'dislikes': 0,
  'reports': 0
};

const stubEditComment = {
  'id': 1,
  'review_id': 1,
  'user_id': 1,
  'content': 'some good comment',
  'likes': 0,
  'dislikes': 0,
  'reports': 0
};

describe('comment reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual({comments: [], selectedComment: null});
  });

  it('should get comments', () => {
    const stubComments = [{
      'id': 1,
      'review_id': 1,
      'user_id': 1,
      'content': 'some bad comment',
      'likes': 0,
      'dislikes': 0,
      'reports': 0
    },
    {
      'id': 2,
      'review_id': 1,
      'user_id': 1,
      'content': 'review test 1',
      'likes': 0,
      'reports': 0
    }];
    const newState = reducer(undefined, {
      type: actionTypes.GET_REVIEW_COMMENTS, 
      comments: stubComments,
    });
    expect(newState).toEqual({comments: stubComments, selectedComment: null});
  });
  it('should get comment', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GET_COMMENT,
      target: stubComment,
    });
    expect(newState).toEqual({comments: [], selectedComment: stubComment});
  });
  it('should add comment', () => {
    const newState = reducer(undefined, {
      type: actionTypes.ADD_COMMENT,
      comment:{
        id: 1,
        review_id: 1,
        user_id: 1,
        content: 'some bad comment',
        likes: 0,
        dislikes: 0,
        reports: 0
      },
    });
    expect(newState).toEqual({comments:[stubComment], selectedComment: null});
  });
  it('should update comment', () => {
    const stubInitialState = {
      comments: [{
        'id': 1,
        'review_id': 1,
        'user_id': 1,
        'content': 'some bad comment',
        'likes': 0,
        'dislikes': 0,
        'reports': 0
      },
      {
        'id': 2,
        'review_id': 1,
        'user_id': 1,
        'content': 'review test 1',
        'likes': 0,
        'dislikes': 0,
        'reports': 0
      }], selectedComment: null
    };
    const newState = reducer(stubInitialState, {
      type: actionTypes.EDIT_COMMENT,
      targetId: 1,
      content: 'some good comment',
    });
    expect(newState).toEqual({comments: [stubEditComment, {
      'id': 2,
      'review_id': 1,
      'user_id': 1,
      'content': 'review test 1',
      'likes': 0,
      'dislikes': 0,
      'reports': 0
    }], selectedComment: null});
  });
  it('should like comment', () => {
    const stubInitialState = {
      comments: [{
        'id': 1,
        'review_id': 1,
        'user_id': 1,
        'content': 'some bad comment',
        'likes': 0,
        'dislikes': 0,
        'reports': 0
      },
      {
        'id': 2,
        'review_id': 1,
        'user_id': 1,
        'content': 'review test 1',
        'likes': 0,
        'dislikes': 0,
        'reports': 0
      }], selectedComment: null
    };
    const newState = reducer(stubInitialState, {
      type: actionTypes.LIKE_COMMENT,
      targetId: 1,
      likes: 0,
      dislikes: 0,
      reports: 0
    });
    expect(newState).toEqual({comments: [{
      'id': 1,
      'review_id': 1,
      'user_id': 1,
      'content': 'some bad comment',
      'likes': 0,
      'dislikes': 0,
      'reports': 0
    },
    {
      'id': 2,
      'review_id': 1,
      'user_id': 1,
      'content': 'review test 1',
      'likes': 0,
      'dislikes': 0,
      'reports': 0
    }], selectedComment: null});
  });
  it('should dislike comment', () => {
    const stubInitialState = {
      comments: [{
        'id': 1,
        'review_id': 1,
        'user_id': 1,
        'content': 'some bad comment',
        'likes': 0,
        'dislikes': 0,
        'reports': 0
      },
      {
        'id': 2,
        'review_id': 1,
        'user_id': 1,
        'content': 'review test 1',
        'likes': 0,
        'dislikes': 0,
        'reports': 0
      }], selectedComment: null
    };
    const newState = reducer(stubInitialState, {
      type: actionTypes.DISLIKE_COMMENT,
      targetId: 1,
      likes: 0,
      dislikes: 0,
      reports: 0
    });
    expect(newState).toEqual({comments: [{
      'id': 1,
      'review_id': 1,
      'user_id': 1,
      'content': 'some bad comment',
      'likes': 0,
      'dislikes': 0,
      'reports': 0
    },
    {
      'id': 2,
      'review_id': 1,
      'user_id': 1,
      'content': 'review test 1',
      'likes': 0,
      'dislikes': 0,
      'reports': 0
    }], selectedComment: null});
  });
  it('should report comment', () => {
    const stubInitialState = {
      comments: [{
        'id': 1,
        'review_id': 1,
        'user_id': 1,
        'content': 'some bad comment',
        'likes': 0,
        'dislikes': 0,
        'reports': 0
      },
      {
        'id': 2,
        'review_id': 1,
        'user_id': 1,
        'content': 'review test 1',
        'likes': 0,
        'dislikes': 0,
        'reports': 0
      }], selectedComment: null
    };
    const newState = reducer(stubInitialState, {
      type: actionTypes.REPORT_COMMENT,
      targetId: 1,
      likes: 0,
      dislikes: 0,
      reports: 0
    });
    expect(newState).toEqual({comments: [{
      'id': 1,
      'review_id': 1,
      'user_id': 1,
      'content': 'some bad comment',
      'likes': 0,
      'dislikes': 0,
      'reports': 0
    },
    {
      'id': 2,
      'review_id': 1,
      'user_id': 1,
      'content': 'review test 1',
      'likes': 0,
      'dislikes': 0,
      'reports': 0
    }], selectedComment: null});
  });
  it('should delete comment', () => {
    const stubInitialState = {comments: [stubComment], selectedComment: null};
    const newState = reducer(stubInitialState, {
      type: actionTypes.DELETE_COMMENT, 
      targetId: 1
    });
    expect(newState).toEqual({comments: [], selectedComment: null});
  });
});
