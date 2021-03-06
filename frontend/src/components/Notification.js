import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Loader, Message } from 'semantic-ui-react';

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
    {
      item.left_days >= 0
        ? <span>Your <b>{item.name}</b> expires in <b>{item.left_days}</b> days.</span>
        : <span>Your <b>{item.name}</b> has expired</span>
    }
  </Message>
);


export const Notification = () => {
  const dispatch = useDispatch();

  const id = useSelector(state => state.user.id);
  const isAuthorized = useSelector(state => state.user.isAuthorized);
  const name = useSelector(state => state.user.name);
  const noti = useSelector(state => state.user.noti);

  const [hasNoti, setHasNoti] = useState(false);

  const defaultMessage = 'You have no new notifications.';

  // fetch notifications on mount
  useEffect(() => {
    if (isAuthorized) {
      dispatch(actionCreators.notification(id))
        .then(() => setHasNoti(true));
    } else {
      setHasNoti(true);
    }
  }, []);

  if (!hasNoti) {
    return (
      <Loader active inline='centered' />
    );
  }

  if (!noti) {
    return defaultMessage;
  }

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

  const notifications = itemNotifications.concat(commentNotifications);

  if (notifications.length) {
    return notifications;
  } else {
    return defaultMessage;
  }
};