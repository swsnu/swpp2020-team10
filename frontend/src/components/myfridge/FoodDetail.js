import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Form, Modal } from 'semantic-ui-react';

import * as actionCreators from '../../store/actions/index';


export const FoodDetail = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const selectedFridgeItem = useSelector(state => state.fridgeItem.selectedFridgeItem);

  const [name, setName] = useState(selectedFridgeItem.name);
  const type = selectedFridgeItem.ingredient_name || '';
  const [quantity, setQuantity] = useState(selectedFridgeItem.quantity);
  const [unit, setUnit] = useState(selectedFridgeItem.unit);
  const [expiryDate, setExpiryDate] = useState(selectedFridgeItem.expiry_date);

  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  // edit fridge item and close food detail modal
  const onClickConfirmEditButton = () => {
    const editedFridgeItem = {
      name,
      quantity,
      unit,
      expiry_date: expiryDate,
    };

    // disallow multiple clicks
    setIsWaitingResponse(true);
    dispatch(actionCreators.editFridgeItem(selectedFridgeItem.id, editedFridgeItem))
      .then(() => setOpen(false));
  };

  // delete fridge item and close food detail modal
  const onClickDeleteFoodButton = () => {
    // disallow multiple clicks
    setIsWaitingResponse(true);
    dispatch(actionCreators.deleteFridgeItem(selectedFridgeItem.id))
      .then(() => setOpen(false));
  };

  const form = (
    <Form>
      <Form.Input
        id='nameInput'
        label='Name'
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <Form.Input
        id='typeInput'
        label='Type'
        value={type}
        disabled
      />
      <Form.Input
        id='quantityInput'
        type='number'
        label='Quantity'
        value={quantity}
        min={0}
        onChange={e => setQuantity(e.target.value)}
        required
      />
      <Form.Input
        id='unitInput'
        label='Unit'
        value={unit}
        onChange={e => setUnit(e.target.value)}
      />
      <Form.Input
        id='expiryDateInput'
        type='date'
        label='Expiry Date'
        value={expiryDate}
        onChange={e => setExpiryDate(e.target.value)}
      />
    </Form>
  );

  return (
    <Modal
      id='FoodDetail'
      open={open}
      dimmer='inverted'
      size='mini'
    >
      <Modal.Header content='Edit fridge item' />
      <Modal.Content>
        {form}
      </Modal.Content>
      <Modal.Actions>
        <Button
          id='editButton'
          onClick={onClickConfirmEditButton}
          content='Submit'
          disabled={isWaitingResponse || !name || !quantity}
        />
        <Button
          id='deleteButton'
          onClick={onClickDeleteFoodButton}
          content='Delete'
          disabled={isWaitingResponse}
        />
        <Button
          id='backButton'
          onClick={() => setOpen(false)}
          content='Back'
          disabled={isWaitingResponse}
        />
      </Modal.Actions>
    </Modal>
  );
};

/*
            <Accordion>
              <Accordion.Title id='showNutritions' active={open} onClick={() => setOpen(open ? false : true)}>
                <Icon name='dropdown' /> Nutrition Facts
              </Accordion.Title>
              <Accordion.Content active={open}>
                <Segment id='nutritionFacts'>
                  <Input id='calorieInput' type='text' value={calorie}
                    onChange={(event) => setCalorie(event.target.value)}>
                    <Label basic>Calorie</Label>
                    <input />
                  </Input>
                  <Input id='sodiumInput' type='text' value={sodium}
                    onChange={(event) => setSodium(event.target.value)}>
                    <Label basic>Sodium</Label>
                    <input />
                  </Input>
                  <Input id='proteinInput' type='text' value={protein}
                    onChange={(event) => setProtein(event.target.value)}>
                    <Label basic>Protein</Label>
                    <input />
                  </Input>
                </Segment>
              </Accordion.Content>
            </Accordion>
*/