import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

export default function FoodCreate(props) {
  const dispatch = useDispatch();

  // redux store state
  const userId = useSelector(state => state.user.id);

  // local states
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [calorie, setCalorie] = useState('');
  const [sodium, setSodium] = useState('');
  const [protein, setProtein] = useState('');

  // go back to MyFridge page
  const onClickBackButton = () => {
    props.onEnd();
  };

  // add new fridge item and go to MyFridge page
  const onClickAddButton = () => {
    const newFridgeItem = {
      name, type, quantity, unit, expiryDate,
      calorie, sodium, protein,
    };
    dispatch(actionCreators.postFridgeItem(userId, newFridgeItem))
      .then(() => {
        props.onEnd();
      });
  };

  return (
    <div className='FoodCreate'>
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
        <button id='addButton' onClick={() => onClickAddButton()}>
          Edit
        </button>
      </div>
    </div>
  );
}