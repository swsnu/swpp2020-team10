import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Message } from 'semantic-ui-react';

import * as actionCreators from '../store/actions/index';


const commentNotification = (comment, key) => (
  <Link to={`/review/${comment.review_id}`} key={key}>
    <Message color='blue'>
      <b>{comment.comment_author}</b> has commented to your review&nbsp;
      <b>&ldquo;{comment.review_title}&rdquo;</b> on <b>{comment.review_recipe}</b>.
    </Message>
  </Link>
);


const itemNotification = (item, key) => (
  <Message color='red' key={key}>
    Your <b>{item.name}</b> expires in <b>{item.left_days}</b> days.
  </Message>
);


export const Notification = ({ userId }) => {
  const dispatch = useDispatch();

  const isAuthorized = useSelector(state => state.user.isAuthorized);
  const name = useSelector(state => state.user.name);
  const noti = useSelector(state => state.user.noti);

  // fetch notifications on mount
  useEffect(() => {
    if (isAuthorized) {
      dispatch(actionCreators.notification(userId));
    }
  }, []);

  if (noti !== null) {
    const itemNotifications =
      noti.near_expired_items.map((item, key) =>
        itemNotification(item, key)
      );

    const commentNotifications =
      noti.recent_comments
        .filter(comment => comment.comment_author !== name)
        .map((comment, key) =>
          commentNotification(comment, key + itemNotification.length)
        );

    return itemNotifications.concat(commentNotifications);
  }

  return null;
};