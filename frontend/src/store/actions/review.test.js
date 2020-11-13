import axios from 'axios';

import * as actionCreators from './review';
import store from '../store';

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

describe('review actionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch reviews correctly', () => {
    const stubReviews = [stubReview];
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubReviews
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getReviewList(1)).then(() => {
      const newState = store.getState();
      expect(newState.review.reviews).toBe(stubReviews);
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should get review correctly', () => {
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubReview
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getReview()).then(() => {
      const newState = store.getState();
      expect(newState.review.selectedReview).toBe(stubReview);
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should post review correctly', () => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubReview
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.postReview(1, stubReview)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should edit review', () => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.editReview()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should like review', () => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.likeReview()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should dislike review', () => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.dislikeReview()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should report review', () => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.reportReview()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should delete review', () => {
    const spy = jest.spyOn(axios, 'delete')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: null
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.deleteReview()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

});