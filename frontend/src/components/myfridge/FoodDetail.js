import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Input, Form, Modal } from 'semantic-ui-react';

import * as actionCreators from '../../store/actions/index';


export const FoodDetail = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const selectedFridgeItem = useSelector(state => state.fridgeItem.selectedFridgeItem);

  const name = selectedFridgeItem.name;
  const type = selectedFridgeItem.ingredient_id || '';
  const [quantity, setQuantity] = useState(selectedFridgeItem.quantity);
  const [unit, setUnit] = useState(selectedFridgeItem.unit);
  const [expiryDate, setExpiryDate] = useState(selectedFridgeItem.expiry_date);

  const [isWaitingResponse, setIsWaitingResponse] = useState(true);

  const style = { width: '8em' };

  // edit fridge item and close food detail modal
  const onClickConfirmEditButton = () => {
    const editedFridgeItem = {
      name,
      quantity,
      unit,
      expiry_date: expiryDate,
    };

    // disallow multiple clicks
    setIsWaitingResponse(false);
    dispatch(actionCreators.editFridgeItem(selectedFridgeItem.id, editedFridgeItem))
      .then(() => setOpen(false));
  };

  // delete fridge item and close food detail modal
  const onClickDeleteFoodButton = () => {
    // disallow multiple clicks
    setIsWaitingResponse(false);
    dispatch(actionCreators.deleteFridgeItem(selectedFridgeItem.id))
      .then(() => setOpen(false));
  };

  const form = (
    <Form>
      <Form.Field>
        <Input
          id='nameInput'
          value={name}
          label={{ basic: true, content: 'Name', style }}
          labelPosition='left'
          disabled
        />
      </Form.Field>
      <Form.Field>
        <Input
          id='typeInput'
          value={type}
          label={{ basic: true, content: 'Type', style }}
          labelPosition='left'
          disabled
        />
      </Form.Field>
      <Form.Field>
        <Input
          id='quantityInput'
          type='number'
          value={quantity}
          min={1}
          onChange={e => setQuantity(e.target.value)}
          label={{ basic: true, content: 'Quantity', style }}
          labelPosition='left'
        />
      </Form.Field>
      <Form.Field>
        <Input
          id='unitInput'
          value={unit}
          onChange={e => setUnit(e.target.value)}
          label={{ basic: true, content: 'Unit', style }}
          labelPosition='left'
        />
      </Form.Field>
      <Form.Field>
        <Input
          id='expiryDateInput'
          type='date'
          value={expiryDate}
          onChange={e => setExpiryDate(e.target.value)}
          label={{ basic: true, content: 'Expiry Date', style }}
          labelPosition='left'
        />
      </Form.Field>
    </Form>
  );

  return (
    <Modal
      id='FoodDetail'
      open={open}
      dimmer='inverted'
      size='tiny'
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
          disabled={!isWaitingResponse}
        />
        <Button
          id='deleteButton'
          onClick={onClickDeleteFoodButton}
          content='Delete'
          disabled={!isWaitingResponse}
        />
        <Button
          id='backButton'
          onClick={() => setOpen(false)}
          content='Back'
          disabled={!isWaitingResponse}
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