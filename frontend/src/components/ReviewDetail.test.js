import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../test-utils/mocks';
import { act } from 'react-dom/test-utils';


import ReviewDetail from './ReviewDetail';
import * as reviewActionCreators from '../store/actions/review';
import * as commentActionCreators from '../store/actions/comment';

const stubInitialState = {
  'id': 1,
  'name': 'John',
  'isAuthorized': true,
  'recipes' : [{
    'id': 1,
    'food_id': 3,
    'title': 'Kimchi',
    'content': 'K-food Kimchi recipe blahblah',
    'rating': 3.44,
    'count_ratings': 1,
    'ingredients': {
      'cabbage': '100'
    },
    'cooking_time': 120,
    'tag': {
      'difficulty': 'hard'
    },
    'serving': 1
  }],
  
  'selectedReview': {
    'id': 1,
    'recipe_id': 1,
    'user_id': 1,
    'title': 'Kimchi review!!!',
    'content': 'Kimchi is good modify content',
    'likes': 5,
    'dislikes': 5,
    'reports': 3
  },
  
  'reviews' : [{
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
  }],
  
  'comments': [{
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
  }]
};

const mockStore = getMockStore(stubInitialState);

describe('<ReviewDetail />', () => {
  let reviewDetail, spyGetCommentList, spyGetReview, spyPostComment, spyLikeReview,
    spyDislikeReview, spyReportReview, spyEditComment, spyDeleteComment,
    spyDeleteReview, spyLikeComment, spyDislikeComment, spyReportComment;
  const history = createBrowserHistory();
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  let spyPush = jest.spyOn(history, 'push')
    .mockImplementation(() => {});

  beforeEach(() => {
    reviewDetail = (
      <Provider store={mockStore}>
        <Router history={history}>
          <Switch>
            <Route path='/' component={ReviewDetail} 
              match={{params: {review_id: 1}, isExact: true, path: '', url: ''}} />
          </Switch>
        </Router>
      </Provider>
    );
    
    useStateSpy.mockImplementation((init) => [init, setState]);
    spyGetCommentList = jest.spyOn(commentActionCreators, 'getCommentList')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubInitialState.comments
          };
          resolve(result);
        });
      };});
    /*spyGetReview = jest.spyOn(reviewActionCreators, 'getReview')
      .mockImplementation(() => {return () => {};});  */
    spyGetReview = jest.spyOn(reviewActionCreators, 'getReview')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubInitialState.selectedReview
          };
          resolve(result);
        });
      };});
    spyPostComment = jest.spyOn(commentActionCreators, 'postComment')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyLikeReview = jest.spyOn(reviewActionCreators, 'likeReview')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 400,
            data: {}
          };
          resolve(result);
        });
      };});
    spyDislikeReview = jest.spyOn(reviewActionCreators, 'dislikeReview')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyReportReview = jest.spyOn(reviewActionCreators, 'reportReview')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyEditComment = jest.spyOn(commentActionCreators, 'editComment')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyDeleteComment = jest.spyOn(commentActionCreators, 'deleteComment')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyLikeComment = jest.spyOn(commentActionCreators, 'likeComment')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyDislikeComment = jest.spyOn(commentActionCreators, 'dislikeComment')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyReportComment = jest.spyOn(commentActionCreators, 'reportComment')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: {}
          };
          resolve(result);
        });
      };});
    spyDeleteReview = jest.spyOn(reviewActionCreators, 'deleteReview')
      .mockImplementation(() => {return () => {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: stubInitialState.selectedReview
          };
          resolve(result);
        });
      };});        
  });

  it('should render ReviewDetail', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    //console.log(component.debug());
    const wrapper = component.find('#ReviewDetail').at(0);
    expect(wrapper.length).toBe(1);
  });

  it('should press edit button', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#editReviewButton').at(0);
    wrapper.simulate('click');
    expect(spyPush).toBeCalledTimes(1);
  });

  it('should press delete button', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#deleteReviewButton').at(0);
    wrapper.simulate('click');
    expect(spyDeleteReview).toBeCalledTimes(1);
  });

  it('should press back button', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#backButton').at(0);
    expect(spyPush).toBeCalledTimes(0);
  });

  it('should upload comment', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    let wrapper = component.find('#newCommentInput');
    wrapper.simulate('change', {target: {value: 'testing'}});
    wrapper = component.find('#writeCommentButton').at(0);
    wrapper.simulate('click');
    expect(wrapper.length).toBe(1);
  });

  it('should commit change', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#writeCommentButton').at(0);
    wrapper.simulate('click');
    expect(spyPostComment).toBeCalledTimes(0);
  });

  it('should like review', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#likeReviewButton').at(0);
    wrapper.simulate('click');
    wrapper.simulate('click');
    expect(spyLikeReview).toBeCalledTimes(2);
  });

  it('should dislike review', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#dislikeReviewButton').at(0);
    wrapper.simulate('click');
    wrapper.simulate('click');
    expect(spyDislikeReview).toBeCalledTimes(2);
  });

  it('should report review', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#reportReviewButton').at(0);
    wrapper.simulate('click');
    wrapper.simulate('click');
    expect(spyReportReview).toBeCalledTimes(2);
  });

  it('should like comment', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#likeCommentButton').at(0);
    wrapper.simulate('click');
    expect(spyLikeComment).toBeCalledTimes(1);
  });

  it('should dislike comment', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#dislikeCommentButton').at(1);
    wrapper.simulate('click');
    expect(spyDislikeComment).toBeCalledTimes(1);
  });

  it('should report comment', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#reportCommentButton').at(1);
    wrapper.simulate('click');
    expect(spyReportComment).toBeCalledTimes(1);
  });

  it('should press edit button', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    let wrapper = component.find('#editCommentButton').at(0);
    wrapper.simulate('click');
    wrapper = component.find('#editCommentInput');
    wrapper.simulate('change', {target: {value: 'testing'}});
    wrapper = component.find('#editCommentConfirmButton').at(0);
    wrapper.simulate('click');
    expect(spyEditComment).toBeCalledTimes(1);
    expect(wrapper.length).toBe(1);
    expect(wrapper.length).toBe(1);
  });

  it('should press delete button', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('#deleteCommentButton').at(0);
    wrapper.simulate('click');
    expect(spyDeleteComment).toBeCalledTimes(1);
  });

  it('should have comment', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    const wrapper = component.find('CommentCard').at(0);
    expect(wrapper.length).toBe(1);
  });

  it('should press edit Cancel button', async () => {
    let component;
    await act(async () => {
      component = mount(reviewDetail);
    });
    component.update();
    let wrapper = component.find('#editCommentButton').at(0);
    wrapper.simulate('click');
    wrapper = component.find('#editCommentCancelButton').at(0);
    wrapper.simulate('click');
    expect(wrapper.length).toBe(1);
  });

});