import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actionCreators from '../store/actions/index';

export default function ReviewEditor() {
  const dispatch = useDispatch();
  const history = useHistory();

  // redux store state
  const userId = useSelector(state => state.user.id);
  const selectedReview = useSelector(state => state.review.selectedReview);
  const selectedRecipe = useSelector(state => state.review.selectedRecipe);

  const [isWriteTab, setIsWriteTab] = useState(true);
  const [title, setTitle] = useState(selectedReview.title);
  //const [image, setImage] = useState(selectedReview.image);
  const [content, setContent] = useState(selectedReview.content);

  // switch to write tab
  const onClickWriteTabButton = () => {
    setIsWriteTab(true);
  };

  // switch to preview tab
  const onClickPreviewTabButton = () => {
    setIsWriteTab(false);
  };

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
  
  let tab_content;
  if (isWriteTab) {
    tab_content = (
      <WriteTab
        title={title}
        onChangeTitle={setTitle}
        //image={image}
        //onChangeImage={setImage}
        content={content}
        onChangeContent={setContent} ></WriteTab>
    );
  }
  else {
    tab_content = (
      <PreviewTab
        title={title}
        //image={image}
        content={content}
        selectedReview={selectedReview} ></PreviewTab>
    );
  }

  return (
    <div className='ReviewEditor'>
      <div>
        <h2> Review Editor </h2>
      </div>
      <div className='tabs'>
        <button id='writeTabButton' onClick={() => onClickWriteTabButton()}>
          Write
        </button>
        <button id='previewTabButton' onClick={() => onClickPreviewTabButton()}>
          Preview
        </button>
      </div>
      <div className='row'>
        {tab_content}
      </div>
      <div className='actions'>
        <button id='submitButton' onClick={() => onClickSubmitButton()}>
          Submit
        </button>
        <button id='cancelButton' onClick={() => onClickCancelButton()}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// returns write tab page with title, image, content inputs
function WriteTab(props) {
  return (
    <div className='WriteTab'>
      <div className='title'>
        <h2> Title </h2>
        <input id='titleInput' type='text' value={props.title}
          onChange={(event) => props.onChangeTitle(event.target.value)}></input>
      </div>
      <div className='image'>
        <h2> Image file </h2>
        <input id='imageInput' type='file' accept='image/*'// value={image}
          //onChange={(event) => setImage(event.target.value)}
        ></input>
      </div>
      <div className='content'>
        <h2> Content </h2>
        <input id='contentInput' rows='8' type='text' value={props.content}
          onChange={(event) => props.onChangeContent(event.target.value)}></input>
      </div>
    </div>
  );
}

// returns preview tab page of editing review
function PreviewTab(props) {
  return (
    <div className='PreviewTab'>
      <h1>{props.title}</h1>
      <image src='' alt='image preview'></image>
      <p1>{props.content}</p1>
      <div className='reactions'>
        <img className='likePicture' src='' alt='Like' /> {props.selectedReview.likes}
        <img className='dislikePicture' src='' alt='Disike' /> {props.selectedReview.dislikes}
        <img className='reportPicture' src='' alt='Report' /> {props.selectedReview.reports}
      </div>
    </div>
  );
}