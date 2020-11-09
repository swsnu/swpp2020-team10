import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import FoodCreate from './FoodCreate';
import FoodDetail from './FoodDetail';

export default function MyFridge() {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  const userId = params.user_id;
  useEffect(() => {
    actionCreators.getFridgeItemList(userId);
  });

  // redux store state
  const userName = useSelector(state => state.user.name);
  const fridgeItems = useSelector(state => state.fridgeItem.fridgeItems);
  
  const title = `${userName}'s Fridge`;
  
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [popup, setPopup] = useState(null);

  // callback function to come back from FoodCreate page
  const onFoodCreateEnd = () => {
    setIsCreate(false);
  };

  // callback function to come back from FoodDetail page
  const onFoodDetailEnd = () => {
    setIsEdit(false);
  };

  // go to RecipeSearch page
  const onClickSearchRecipeButton = () => {
    history.push(`/search`);
  };

  // open FoodCreate page
  const onClickAddFoodButton = () => {
    setPopup(<FoodCreate onEnd={onFoodCreateEnd}></FoodCreate>);
    setIsCreate(true);
  };

  // clear fridge items
  const onClickClearFridgeButton = () => {
    dispatch(actionCreators.clearFridgeItems(userId));
  };
  
  // open FoodDetail page
  const onClickFridgeItemButton = (fridgeItem) => {
    dispatch(actionCreators.getFridgeItem(fridgeItem.id))
      .then(() => {
        setPopup(<FoodDetail onEnd={onFoodDetailEnd}></FoodDetail>);
        setIsEdit(true);
      });
  };

  const fridgeItemButtons = fridgeItems.map((fridgeItem) => {
    return (
      <button key={fridgeItem.id} className='fridgeItem' onClick={() => onClickFridgeItemButton(fridgeItem)}>
        <img src='' alt='Fridge Item'></img>
      </button>
    );
  });
  
  if (isCreate || isEdit) {
    return popup;
  }
  else {
    return (
      <div className='MyFridge'>
        <h2>{title}</h2>
        <div className='Fridge' style={{height:'400px',overflow:'auto'}}>
          {fridgeItemButtons}
        </div>
        <div className='buttons'>
          <button id='searchRecipeButton' onClick={() => onClickSearchRecipeButton()}>
            Search Recipe
          </button>
          <button id='addFoodButton' onClick={() => onClickAddFoodButton()}>
            Add
          </button>
          <button id='clearFridgeButton' onClick={() => onClickClearFridgeButton()}>
            Clear
          </button>
        </div>
      </div>
    );
  }
}