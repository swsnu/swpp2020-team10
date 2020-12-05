import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../test-utils/mocks';

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
  let reviewDetail, /*spyGetCommentList, spyGetReview,*/ spyPostComment, spyLikeReview,
    spyDislikeReview, spyReportReview, spyEditComment, spyDeleteComment,
    spyDeleteReview, spyLikeComment, spyDislikeComment, spyReportComment;
  const history = createBrowserHistory();
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
    
    /*spyGetCommentList = jest.spyOn(commentActionCreators, 'getCommentList')
      .mockImplementation(() => {return () => {};});
    spyGetReview = jest.spyOn(reviewActionCreators, 'getReview')
      .mockImplementation(() => {return () => {};});  */
    spyPostComment = jest.spyOn(commentActionCreators, 'postComment')
      .mockImplementation(() => {return () => {};});
    spyLikeReview = jest.spyOn(reviewActionCreators, 'likeReview')
      .mockImplementation(() => {return () => {};});
    spyDislikeReview = jest.spyOn(reviewActionCreators, 'dislikeReview')
      .mockImplementation(() => {return () => {};});
    spyReportReview = jest.spyOn(reviewActionCreators, 'reportReview')
      .mockImplementation(() => {return () => {};});
    spyEditComment = jest.spyOn(commentActionCreators, 'editComment')
      .mockImplementation(() => {return () => {};});
    spyDeleteComment = jest.spyOn(commentActionCreators, 'deleteComment')
      .mockImplementation(() => {return () => {};});
    spyLikeComment = jest.spyOn(commentActionCreators, 'likeComment')
      .mockImplementation(() => {return () => {};});
    spyDislikeComment = jest.spyOn(commentActionCreators, 'dislikeComment')
      .mockImplementation(() => {return () => {};});
    spyReportComment = jest.spyOn(commentActionCreators, 'reportComment')
      .mockImplementation(() => {return () => {};});
    spyDeleteReview = jest.spyOn(reviewActionCreators, 'deleteReview')
      .mockImplementation(() => {return () => {};});        
  });

  it('should render ReviewDetail', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('.ReviewDetail');
    expect(wrapper.length).toBe(1);
  });

  it('should press edit button', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#editReviewButton').at(0);
    wrapper.simulate('click');
    expect(spyPush).toBeCalledTimes(1);
  });

  it('should press delete button', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#deleteReviewButton').at(0);
    wrapper.simulate('click');
    expect(spyDeleteReview).toBeCalledTimes(1);
  });

  it('should press back button', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#backButton').at(0);
    wrapper.simulate('click');
    expect(spyPush).toBeCalledTimes(1);
  });

  it('should upload comment', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#newCommentInput');
    wrapper.simulate('change', {target: {value: 'testing'}});
    expect(wrapper.length).toBe(1);
  });

  it('should commit change', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#writeCommentButton').at(0);
    wrapper.simulate('click');
    expect(spyPostComment).toBeCalledTimes(1);
  });

  it('should like review', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#likeReviewButton').at(0);
    wrapper.simulate('click');
    wrapper.simulate('click');
    expect(spyLikeReview).toBeCalledTimes(2);
  });

  it('should dislike review', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#dislikeReviewButton').at(0);
    wrapper.simulate('click');
    wrapper.simulate('click');
    expect(spyDislikeReview).toBeCalledTimes(2);
  });

  it('should report review', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#reportReviewButton').at(0);
    wrapper.simulate('click');
    wrapper.simulate('click');
    expect(spyReportReview).toBeCalledTimes(2);
  });

  it('should like comment', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('div #likeCommentButton').at(0);
    wrapper.simulate('click');
    expect(spyLikeComment).toBeCalledTimes(1);
  });

  it('should dislike comment', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#dislikeCommentButton').at(1);
    wrapper.simulate('click');
    expect(spyDislikeComment).toBeCalledTimes(1);
  });

  it('should report comment', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#reportCommentButton').at(1);
    wrapper.simulate('click');
    expect(spyReportComment).toBeCalledTimes(1);
  });

  it('should press edit button', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#editCommentButton').at(0);
    wrapper.simulate('click');
    expect(wrapper.length).toBe(1);
  });

  it('should press delete button', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#deleteCommentButton').at(0);
    wrapper.simulate('click');
    expect(spyDeleteComment).toBeCalledTimes(1);
  });

  it('should have comment', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('.Comment').at(0);
    expect(wrapper.length).toBe(1);
  });

  it('should edit comment', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#editCommentInput');
    wrapper.simulate('change', {target: {value: 'testing'}});
    expect(wrapper.length).toBe(1);
  });

  it('should press edit confirm button', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#editCommentConfirmButton').at(0);
    wrapper.simulate('click');
    expect(spyEditComment).toBeCalledTimes(1);
  });

  it('should press edit confirm button', () => {
    const component = mount(reviewDetail);
    const wrapper = component.find('#editCommentCancelButton').at(0);
    wrapper.simulate('click');
    expect(wrapper.length).toBe(1);
  });

});