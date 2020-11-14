import axios from 'axios';

import * as actionCreators from './comment';
import store from '../store';

const stubComment = {
  'id': 1,
  'recipe_id': 1,
  'user_id': 1,
  'title': 'Kimchi review!!!',
  'content': 'Kimchi is good modify content',
  'likes': 5,
  'dislikes': 5,
  'reports': 3
};

describe('comment actionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch comments correctly', () => {
    const stubComments = [stubComment];
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubComments
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getCommentList(1)).then(() => {
      const newState = store.getState();
      expect(newState.comment.comments).toBe(stubComments);
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should get comment correctly', () => {
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubComment
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getComment()).then(() => {
      const newState = store.getState();
      expect(newState.comment.selectedComment).toBe(stubComment);
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should post comment correctly', () => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubComment
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.postComment(1, stubComment)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should edit comment', () => {
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
    store.dispatch(actionCreators.editComment(1, stubComment)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should like comment', () => {
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
    store.dispatch(actionCreators.likeComment()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should dislike comment', () => {
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
    store.dispatch(actionCreators.dislikeComment()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should report comment', () => {
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
    store.dispatch(actionCreators.reportComment()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

  it('should delete comment', () => {
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
    store.dispatch(actionCreators.deleteComment()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      //done();
    });
  });

});