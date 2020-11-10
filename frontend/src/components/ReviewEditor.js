import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actionCreators from '../store/actions/index';

import { Tab, Button, Header, Grid, Input, Label, Image, Message, Icon } from 'semantic-ui-react';
import './ReviewEditor.css';

export default function ReviewEditor() {
  const dispatch = useDispatch();
  const history = useHistory();

  // redux store state
  const userId = useSelector(state => state.user.id);
  const selectedReview = useSelector(state => state.review.selectedReview);
  const selectedRecipe = useSelector(state => state.review.selectedRecipe);

  const [title, setTitle] = useState(selectedReview.title);
  //const [image, setImage] = useState(selectedReview.image);
  const [content, setContent] = useState(selectedReview.content);

  // edit review and move to 'Review Detail' page
  const onClickSubmitButton = () => {
    let editedReview = {
      id: selectedReview.id,
      recipeId: selectedRecipe.id,
      userId: userId,
      title: title,
      content: content,
      likes: selectedReview.likes,
      dislikes: selectedReview.dislikes,
      reports: selectedReview.reports,
    };
    dispatch(actionCreators.editReview(editedReview.id, editedReview))
      .then(() => {
        history.goBack();
      });
  };

  // back to previous page
  const onClickCancelButton = () => {
    history.goBack();
  };

  const write_tab_content = (
    <Tab.Pane>
      <WriteTab
        title={title}
        onChangeTitle={(val) => setTitle(val)}
        //image={image}
        //onChangeImage={setImage}
        content={content}
        onChangeContent={(val) => setContent(val)} ></WriteTab>
    </Tab.Pane>
  );
  const preview_tab_content = (
    <Tab.Pane>
      <PreviewTab
        title={title}
        //image={image}
        content={content} ></PreviewTab>
    </Tab.Pane>
  );
  
  const panes = [
    { menuItem: 'WriteTab', render: () => write_tab_content },
    { menuItem: 'PreviewTab', render: () => preview_tab_content },
  ];

  return (
    <Grid id='ReviewEditor'>
      <Grid.Row centered>
        <Header as='h2'>Review Editor</Header>
      </Grid.Row>
      <Grid.Row>
        <Tab id='tab' panes={panes} />
      </Grid.Row>
      <Grid.Row id='buttons'>
        <Button id='submitButton' onClick={() => onClickSubmitButton()} floated='right'>
          Submit
        </Button>
        <Button id='cancelButton' onClick={() => onClickCancelButton()} floated='right'>
          Cancel
        </Button>
      </Grid.Row>
    </Grid>
  );
}

// returns write tab page with title, image, content inputs
function WriteTab(props) {
  return (
    <Grid className='WriteTab'>
      <Grid.Row className='title'>
        <Grid.Column stretched>
          <Input id='titleInput' labelPosition='left' type='text' value={props.title}
            onChange={(event) => props.onChangeTitle(event.target.value)}>
            <Label basic>Title</Label>
            <input />
          </Input>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className='image'>
        <Grid.Column stretched>
          <Input id='imageInput' labelPosition='left' type='file' accept='image/*'// value={props.image}
            //onChange={(event) => setImage(event.target.value)}
          >
            <Label basic>Image File</Label>
            <input />
          </Input>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className='content'>
        <Grid.Column stretched>
          <Input id='contentInput' labelPosition='left' type='textarea'>
            <Label basic>Content</Label>
            <textarea rows='8' value={props.content}
              onChange={(event) => props.onChangeContent(event.target.value)}/>
          </Input>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

// returns preview tab page of editing review
function PreviewTab(props) {
  return (
    <Grid id='PreviewTab'>
      <Grid.Row>
        <Header as='h1' id='title'>{props.title}</Header>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column padded>
          <Image src='https://source.unsplash.com/512x512/?soup' alt='image preview' rounded size='medium'></Image>
          <Grid padded>
            <Grid.Row columns={10} id='reactions'>
              <Grid.Column>
                <Icon name='thumbs up outline' /> 0
              </Grid.Column>
              <Grid.Column>
                <Icon name='thumbs down outline' /> 0
              </Grid.Column>
              <Grid.Column>
                <Icon name='bullhorn' /> 0
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Grid.Column stretched>
          <Message>
            <p1 id="contentPreview">{props.content}</p1>
          </Message>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}