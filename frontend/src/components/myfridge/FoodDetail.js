import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

export default function FoodDetail(props) {
  const dispatch = useDispatch();

  // redux store state
  const selectedFridgeItem = useSelector(state => state.fridgeItem.selectedFridgeItem);

  // local states
  const [name, setName] = useState(selectedFridgeItem.name);
  const [type, setType] = useState(selectedFridgeItem.type);
  const [quantity, setQuantity] = useState(selectedFridgeItem.quantity);
  const [unit, setUnit] = useState(selectedFridgeItem.unit);
  const [expiryDate, setExpiryDate] = useState(selectedFridgeItem.expiryDate);
  const [calorie, setCalorie] = useState(selectedFridgeItem.nutritionFacts[0]);
  const [sodium, setSodium] = useState(selectedFridgeItem.nutritionFacts[1]);
  const [protein, setProtein] = useState(selectedFridgeItem.nutritionFacts[2]);
  
  // go back to MyFridge page
  const onClickBackButton = () => {
    props.onEnd();
  };

  // edit food detail and go to MyFridge page
  const onClickConfirmEditButton = () => {
    dispatch(actionCreators.editFridgeItem(selectedFridgeItem.id, selectedFridgeItem))
      .then(() => {
        props.onEnd();
      });
  };

  // delete fridge instance and go to MyFridge page
  const onClickDeleteFoodButton = () => {
    dispatch(actionCreators.deleteFridgeItem(selectedFridgeItem.id))
      .then(() => {
        props.onEnd();
      });
  };
  

  return (
    <div className='FoodDetail'>
      <div className='foodInfo'>
        <input id='nameInput' type='text' value={name}
          onChange={(event) => setName(event.target.value)}></input>
        <input id='typeInput' type='text' value={type}
          onChange={(event) => setType(event.target.value)}></input>
        <input id='quantityInput' type='text' value={quantity}
          onChange={(event) => setQuantity(event.target.value)}></input>
        <input id='unitInput' type='text' value={unit}
          onChange={(event) => setUnit(event.target.value)}></input>
        <input id='expiryDateInput' type='text' value={expiryDate}
          onChange={(event) => setExpiryDate(event.target.value)}></input>
      </div>
      <div className='nutritionFacts'>
        <input id='calorieInput' type='text' value={calorie}
          onChange={(event) => setCalorie(event.target.value)}></input>
        <input id='sodiumInput' type='text' value={sodium}
          onChange={(event) => setSodium(event.target.value)}></input>
        <input id='proteinInput' type='text' value={protein}
          onChange={(event) => setProtein(event.target.value)}></input>
      </div>
      <div className='buttons'>
        <button id='backButton' onClick={() => onClickBackButton()}>
          Back
        </button>
        <button id='editButton' onClick={() => onClickConfirmEditButton()}>
          Edit
        </button>
        <button id='deleteButton' onClick={() => onClickDeleteFoodButton()}>
          Delete
        </button>
      </div>
    </div>
  );
}