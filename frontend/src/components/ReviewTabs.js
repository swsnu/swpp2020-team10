import React from 'react';
import { useSelector } from 'react-redux';

import { Card, Form, Icon, Image, Input } from 'semantic-ui-react';

import { getFormattedDate } from '../misc';


export const WriteTab = ({
  title,
  imageUrl,
  content,
  onChangeTitle,
  onChangeImageUrl,
  onChangeContent
}) => {
  return (
    <Form>
      <Form.Field>
        <Input
          id='titleInput'
          value={title}
          onChange={onChangeTitle}
          label={{ basic: true, content: 'Title', style: {width: '6em'} }}
          labelPosition='left'
        />
      </Form.Field>
      <Form.Field>
        <Input
          id='imageInput'
          value={imageUrl}
          onChange={onChangeImageUrl}
          placeholder='https://'
          label={{ basic: true, content: 'Image url', style: {width: '6em'} }}
          labelPosition='left'
        />
      </Form.Field>
      <Form.Field>
        <textarea
          id='contentInput'
          value={content}
          onChange={onChangeContent}
          placeholder='Content'
          rows={16}
          style={{ resize: 'none' }}
        />
      </Form.Field>
    </Form>
  );
};


export const PreviewTab = ({ title, imageUrl, content, oldReview }) => {
  const userName = useSelector(state => state.user.name);

  return (
    <Card.Group>
      <Card fluid>
        {
          imageUrl &&
          <Image src={imageUrl} />
        }
        <Card.Content>
          <Card.Header>
            {title}
          </Card.Header>
          <Card.Meta>
            {userName}&emsp;
            {oldReview ? oldReview.time_posted : getFormattedDate()}&emsp;
            <span>
              <a>Edit</a>&ensp;
              <a>Delete</a>
            </span>
          </Card.Meta>
          <Card.Description>
            {content}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Icon
            id='likeReviewButton'
            name='thumbs up'
            link
            color='blue'
          />
          {oldReview ? oldReview.likes : 0}&emsp;
          <Icon
            id='dislikeReviewButton'
            name='thumbs down'
            link
            color='red'
          />
          {oldReview ? oldReview.dislikes : 0}&emsp;
          <Icon
            id='reportReviewButton'
            name='warning circle'
            link
            color='red'
          />
          {oldReview ? oldReview.reports : 0}
        </Card.Content>
      </Card>
    </Card.Group>
  );
};