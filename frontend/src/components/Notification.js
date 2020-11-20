import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Message} from 'semantic-ui-react';
import * as actionCreators from '../store/actions/index';

/*const notiJSON = {
  'recent_comments': [
    {
      'comment_author': 'someRandomUser',
      'review_id': 3,
      'review_title': 'noti testing review 2',
      'review_recipe': 'Recipe 1'
    },
    {
      'comment_author': 'someMoreRandomUserWithVeryVeryLongUserName',
      'review_id': 4,
      'review_title': 'someReviewIwroteWithVeryVeryLongTitle',
      'review_recipe': 'Recipe 1'
    }
  ],
  'near_expired_items': [
    {
      'name' : 'some_food_name',
      'quantity' : 3,
      'left_days' : 2
    }
  ]
};*/
function commentNotification(cm) {
  let reviewTitleConcise = cm['review_title'];
  if (cm['review_title'].length > 20){
    reviewTitleConcise = cm['review_title'].substr(0, 17) + '...';
  }
  let commentAuthor = cm['comment_author'];
  if (cm['comment_author'].length > 12){
    commentAuthor = cm['comment_author'].substr(0, 9) + '...';
  }
  return (
    <Message color='blue'>
      <b>{commentAuthor}</b> has commented to your review
      <a href={`/review/${cm['review_id']}`}>
        <b>&#34;{reviewTitleConcise}&#34;</b>
      </a> on <b>{cm['review_recipe']}</b>
    </Message>
  );
}

function itemNotification(item) {
  return (
    <Message color='red'>
      Your <b>{item['quantity']} {item['name']}</b> expires in <b>{item['left_days']}</b>
    </Message>
  );
}

export const Notification = (userId) => {
  if(userId == null){
    return null;
  }
  const dispatch = useDispatch();
  const [hasnoti, sethasnoti] = useState(false);
  const notiJSON = useSelector(state => state.user.noti);
  if (!hasnoti)
  {
    console.log("dispatch noti");
    dispatch(actionCreators.notification(userId));
    console.log(`User noti : ${state.user.noti}`);
    sethasnoti(true);
  }
  console.log(notiJSON);
  let nearExpiredItems, recentComments;
  nearExpiredItems = notiJSON['near_expired_items'];
  recentComments = notiJSON['recent_comments'];
  console.log(nearExpiredItems, recentComments);
  let notiString = [];
  for (let item of nearExpiredItems) {
    notiString.push(itemNotification(item));
  }
  for (let comment of recentComments) {
    notiString.push(commentNotification(comment));
  }
  return notiString;
};