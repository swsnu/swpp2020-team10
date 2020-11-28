import React, { useState, useEffect } from 'react';
import { /*useDispatch,*/ useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import FoodCreate from './FoodCreate';
import FoodDetail from './FoodDetail';

import { Button, Card, Grid, Image, List, Reveal } from 'semantic-ui-react';
import './MyFridge.css';

export default function MyFridge() {
  //const dispatch = useDispatch();
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
    //dispatch(actionCreators.clearFridgeItems(userId));
    ////dispatch(actionCreators.clearFridgeItems_());
  };
  
  // open FoodDetail page
  const onClickFridgeItemButton = (/*fridgeItem*/) => {
    /*dispatch(actionCreators.getFridgeItem(fridgeItem.id))
      .then(() => {
        setPopup(<FoodDetail onEnd={onFoodDetailEnd}></FoodDetail>);
        setIsEdit(true);
      });*/
    //
    //dispatch(actionCreators.getFridgeItem_(fridgeItem));
    setPopup(<FoodDetail onEnd={onFoodDetailEnd}></FoodDetail>);
    setIsEdit(true);
  };

  const fridgeItemButtons = fridgeItems.map((fridgeItem) => {
    return (
      <Grid.Column key={fridgeItem.id}>
        <Card onClick={() => onClickFridgeItemButton()}>
          <Reveal animated='move up'>
            <Reveal.Content visible>
              <Image src='https://source.unsplash.com/512x512/?soup' alt='Fridge Item' rounded></Image>
            </Reveal.Content>
            <Reveal.Content hidden>
              <List verticalAlign='middle' size='huge'>
                <List.Item>{fridgeItem.name}</List.Item>
                <List.Item>{fridgeItem.quantity + fridgeItem.unit}</List.Item>
                <List.Item>{fridgeItem.expiryDate}</List.Item>
              </List>
            </Reveal.Content>
          </Reveal>
        </Card>
      </Grid.Column>
    );
  });
  
  if (isCreate || isEdit) {
    return popup;
  }
  else {
    return (
      <Grid id='MyFridge' divided='vertically'>
        <Grid.Row>
          <Grid.Column>
            <h1>{title}</h1>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row id='fridge' columns={4}>
          {fridgeItemButtons}
        </Grid.Row>
        <Grid.Row id='buttons'>
          <Button id='searchRecipeButton' onClick={() => onClickSearchRecipeButton()}>
            Search Recipe
          </Button>
          <Button id='addFoodButton' onClick={() => onClickAddFoodButton()}>
            Add
          </Button>
          <Button id='clearFridgeButton' onClick={() => onClickClearFridgeButton()}>
            Clear
          </Button>
        </Grid.Row>
      </Grid>
    );
  }
}