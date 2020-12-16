import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Modal, Button } from 'semantic-ui-react';

import * as actionCreators from '../../store/actions/index';
import { getFormattedDate } from '../../misc';


export const FoodCreate = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const userId = useSelector(state => state.user.id);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState(getFormattedDate(7));

  const [typeOptions, setTypeOptions] = useState([]);
  const [hasTypeOptions, setHasTypeOptions] = useState(false);

  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  // query ingredient type to backend
  const onBlurName = () => {
    if (!name) {
      return;
    }
    
    axios.get(`/api/ingredient/?q=${name}`)
      .then(response => {
        setTypeOptions(response.data.map(item => {
          return {
            key: item.id,
            text: item.name,
            value: item.id,
          };
        }));
        setHasTypeOptions(true);
      });
  };

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
    setIsWaitingResponse(true);
    dispatch(actionCreators.postFridgeItem(userId, newFridgeItem))
      .then(() => setOpen(false));
  };

  const form = (
    <Form>
      <Form.Input
        id='nameInput'
        label='Name'
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={onBlurName}
        required
      />
      <Form.Select
        id='typeInput'
        label='Type'
        options={typeOptions}
        value={type}
        onChange={(e, { value }) => setType(value)}
        placeholder={hasTypeOptions ? '' : 'Please fill in the name first.'}
        required
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
      id='FoodCreate'
      open={open}
      dimmer='inverted'
      size='mini'
    >
      <Modal.Header content='Add fridge item' />
      <Modal.Content>
        {form}
      </Modal.Content>
      <Modal.Actions>
        <Button
          id='addButton'
          onClick={onClickAddButton}
          content='Submit'
          disabled={isWaitingResponse || !name || !type || !quantity}
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