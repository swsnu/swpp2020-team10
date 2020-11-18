import React, { useState } from 'react';
import { /*useDispatch,*/ useSelector } from 'react-redux';
//import * as actionCreators from '../../store/actions/index';

import { Accordion, Button, Grid, Icon, Input, Label, Segment, Header } from 'semantic-ui-react';
import './FoodPopup.css';

export default function FoodDetail(props) {
  //const dispatch = useDispatch();

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
  const [open, setOpen] = useState(false);
  
  // go back to MyFridge page
  const onClickBackButton = () => {
    props.onEnd();
  };

  // edit food detail and go to MyFridge page
  const onClickConfirmEditButton = () => {
    /*const editedFridgeItem = {
      id: selectedFridgeItem.id,
      name, type, quantity, unit, expiryDate,
      nutritionFacts: [calorie, sodium, protein],
    };*/

    /*dispatch(actionCreators.editFridgeItem(selectedFridgeItem.id, selectedFridgeItem))
      .then(() => {
        props.onEnd();
      });*/
    
    //dispatch(actionCreators.editFridgeItem_(editedFridgeItem));
    props.onEnd();
  };

  // delete fridge instance and go to MyFridge page
  const onClickDeleteFoodButton = () => {
    /*dispatch(actionCreators.deleteFridgeItem(selectedFridgeItem.id))
      .then(() => {
        props.onEnd();
      });*/
    
    //dispatch(actionCreators.deleteFridgeItem_(selectedFridgeItem.id));
    props.onEnd();
  };

  return (
    <div id='base'>
      <Grid id='FoodDetail' verticalAlign='middle' centered>
        <Grid.Row>
          <Grid.Column>
            <Header as='h1'>Food Details</Header>
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
          <Button id='editButton' onClick={() => onClickConfirmEditButton()}>
            Edit
          </Button>
          <Button id='deleteButton' onClick={() => onClickDeleteFoodButton()}>
            Delete
          </Button>
          <Button id='backButton' onClick={() => onClickBackButton()}>
            Back
          </Button>
        </Grid.Row>
      </Grid>
    </div>
  );
}