import React, { useState } from 'react';
//import { /*useDispatch,*/ /*useSelector*/ } from 'react-redux';
//import * as actionCreators from '../../store/actions/index';

import { Accordion, Button, Icon, Input, Label, Segment, Grid, Header } from 'semantic-ui-react';
import './FoodPopup.css';

export default function FoodCreate(props) {
  //const dispatch = useDispatch();

  // redux store state
  //const userId = useSelector(state => state.user.id);

  // local states
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [calorie, setCalorie] = useState('');
  const [sodium, setSodium] = useState('');
  const [protein, setProtein] = useState('');
  const [open, setOpen] = useState(false);

  // go back to MyFridge page
  const onClickBackButton = () => {
    props.onEnd();
  };

  // add new fridge item and go to MyFridge page
  const onClickAddButton = () => {
    /*const newFridgeItem = {
      name, type, quantity, unit, expiryDate,
      nutritionFacts: [calorie, sodium, protein],
      id: '100'
    };*/

    /*dispatch(actionCreators.postFridgeItem(userId, newFridgeItem))
      .then(() => {
        props.onEnd();
      });*/
    //dispatch(actionCreators.postFridgeItem_(newFridgeItem));
    props.onEnd();
  };

  return (
    <div id='base'>
      <Grid id='FoodCreate' verticalAlign='middle' centered>
        <Grid.Row>
          <Grid.Column>
            <Header as='h1'>Add New Food</Header>
            <Segment id='foodInfo'>
              <Input id='nameInput' type='text' value={name}
                onChange={(event) => setName(event.target.value)}>
                <Label basic>Name</Label>
                <input />
              </Input>
              <Input id='typeInput' type='text' value={type}
                onChange={(event) => setType(event.target.value)}>
                <Label basic>Type</Label>
                <input />
              </Input>
              <Input id='quantityInput' type='text' value={quantity}
                onChange={(event) => setQuantity(event.target.value)}>
                <Label basic>Quantity</Label>
                <input />
              </Input>
              <Input id='unitInput' type='text' value={unit}
                onChange={(event) => setUnit(event.target.value)}>
                <Label basic>Unit</Label>
                <input />
              </Input>
              <Input id='expiryDateInput' type='text' value={expiryDate}
                onChange={(event) => setExpiryDate(event.target.value)}>
                <Label basic>Expiry Date</Label>
                <input />
              </Input>
            </Segment>
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
          </Grid.Column>
        </Grid.Row>
        <Grid.Row id='buttons'>
          <Button id='addButton' onClick={() => onClickAddButton()}>
            Add
          </Button>
          <Button id='backButton' onClick={() => onClickBackButton()}>
            Back
          </Button>
        </Grid.Row>
      </Grid>
    </div>
  );
}