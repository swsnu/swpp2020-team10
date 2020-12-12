import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Input, Form, Modal, Button, Segment } from 'semantic-ui-react';

import * as actionCreators from '../../store/actions/index';
import { getFormattedDate } from '../../misc';


export const FoodCreate = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const userId = useSelector(state => state.user.id);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState(getFormattedDate());

  const [isWaitingResponse, setIsWaitingResponse] = useState(true);

  const style = { width: '8em' };

  // add new fridge item and close food create modal
  const onClickAddButton = () => {
    const newFridgeItem = {
      name,
      ingredient_id: type,
      quantity,
      unit,
      expiry_date: expiryDate,
    };

    // disallow multiple clicks
    setIsWaitingResponse(false);
    dispatch(actionCreators.postFridgeItem(userId, newFridgeItem))
      .then(() => setOpen(false));
  };

  const form = (
    <Form>
      <Form.Field>
        <Input
          id='nameInput'
          value={name}
          onChange={e => setName(e.target.value)}
          label={{ basic: true, content: 'Name', style }}
          labelPosition='left'
        />
      </Form.Field>
      <Form.Field>
        <Input
          id='typeInput'
          value={type}
          onChange={e => setType(e.target.value)}
          label={{ basic: true, content: 'Type', style }}
          labelPosition='left'
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
      id='FoodCreate'
      open={open}
      dimmer='inverted'
      size='tiny'
    >
      <Modal.Header content='Add fridge item' />
      <Modal.Content>
        <Segment>
          {form}
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button
          id='addButton'
          onClick={onClickAddButton}
          content='Submit'
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