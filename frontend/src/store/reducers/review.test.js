import reducer from './review';
import * as actionTypes from '../actions/actionTypes';

const stubReview = {
  'id': 1,
  'recipe_id': 1,
  'user_id': 1,
  'title': 'Kimchi review!!!',
  'content': 'Kimchi is good modify content',
  'likes': 5,
  'dislikes': 5,
  'reports': 3
};

const editStubReview = {
  'id': 1,
  'recipe_id': 1,
  'user_id': 1,
  'title': 'Kimchi!!!',
  'content': 'Kimchi is good modify',
  'likes': 5,
  'dislikes': 5,
  'reports': 3
};

describe('review reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual({reviews: [], selectedReview: null});
  });

  it('should get all reviews', () => {
    const stubReviews = [{
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    },
    {
      'id': 2,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Review 2',
      'content': 'Review 22',
      'likes': 3,
      'dislikes': 5,
      'reports': 0
    }];
    const newState = reducer(undefined, {
      type: actionTypes.GET_RECIPE_REVIEWS,
      reviews: stubReviews,
    });
    expect(newState).toEqual({reviews: stubReviews, selectedReview: null});
  });

  it('should get review', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GET_REVIEW,
      target: stubReview,
    });
    expect(newState).toEqual({reviews: [], selectedReview: stubReview});
  });

  it('should post review', () => {
    const newState = reducer(undefined, {
      type: actionTypes.ADD_REVIEW,
      review: stubReview,
    });
    expect(newState).toEqual({reviews: [stubReview], selectedReview: null});
  });

  it('should edit review', () => {
    const stubInitialState = {reviews: [{
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    },
    {
      'id': 2,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Review 2',
      'content': 'Review 22',
      'likes': 3,
      'dislikes': 5,
      'reports': 0
    }], selectedReview: null};
    const newState = reducer(stubInitialState, {
      type: actionTypes.EDIT_REVIEW,
      review: editStubReview,
    });
    expect(newState).toEqual({reviews: [editStubReview, {
      'id': 2,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Review 2',
      'content': 'Review 22',
      'likes': 3,
      'dislikes': 5,
      'reports': 0
    }], selectedReview: null});
  });

  it('should like the review', () => {
    const stubInitialState = {reviews: [{
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    },
    {
      'id': 2,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Review 2',
      'content': 'Review 22',
      'likes': 3,
      'dislikes': 5,
      'reports': 0
    }], selectedReview: 
    {
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    }};
    const newState = reducer(stubInitialState, {
      type: actionTypes.LIKE_REVIEW,
    });
    expect(newState).toEqual({reviews: [{
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    },
    {
      'id': 2,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Review 2',
      'content': 'Review 22',
      'likes': 3,
      'dislikes': 5,
      'reports': 0
    }], selectedReview: 
    {
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 6,
      'dislikes': 5,
      'reports': 3
    }});
  });
  it('should dislike the review', () => {
    const stubInitialState = {reviews: [{
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    },
    {
      'id': 2,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Review 2',
      'content': 'Review 22',
      'likes': 3,
      'dislikes': 5,
      'reports': 0
    }], selectedReview: 
    {
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    }};
    const newState = reducer(stubInitialState, {
      type: actionTypes.DISLIKE_REVIEW,
    });
    expect(newState).toEqual({reviews: [{
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    },
    {
      'id': 2,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Review 2',
      'content': 'Review 22',
      'likes': 3,
      'dislikes': 5,
      'reports': 0
    }], selectedReview: 
    {
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 6,
      'reports': 3
    }});
  });

  it('should report the review', () => {
    const stubInitialState = {reviews: [{
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    },
    {
      'id': 2,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Review 2',
      'content': 'Review 22',
      'likes': 3,
      'dislikes': 5,
      'reports': 0
    }], selectedReview: 
    {
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    }};
    const newState = reducer(stubInitialState, {
      type: actionTypes.REPORT_REVIEW,
    });
    expect(newState).toEqual({reviews: [{
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 3
    },
    {
      'id': 2,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Review 2',
      'content': 'Review 22',
      'likes': 3,
      'dislikes': 5,
      'reports': 0
    }], selectedReview: 
    {
      'id': 1,
      'recipe_id': 1,
      'user_id': 1,
      'title': 'Kimchi review!!!',
      'content': 'Kimchi is good modify content',
      'likes': 5,
      'dislikes': 5,
      'reports': 4
    }});
  });

  it('should delete a review', () => {
    const stubInitialState = {reviews: [stubReview], selectedReview: null};
    const newState = reducer(stubInitialState, {
      type: actionTypes.DELETE_REVIEW,
      targetId: 1,
    });
    expect(newState).toEqual({reviews: [], selectedReview: null});
  });
});
