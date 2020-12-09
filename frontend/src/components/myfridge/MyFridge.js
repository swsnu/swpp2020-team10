import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Card, Container, Grid, Header, Image, Segment } from 'semantic-ui-react';

import * as actionCreators from '../../store/actions/index';
import { FoodCreate } from './FoodCreate';
import { FoodDetail } from './FoodDetail';


export const MyFridge = () => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const fridgeItems = useSelector(state => state.fridgeItem.fridgeItems);

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // number of columns per row
  const nColPerRow = 3;

  // fetch fridge items on initial mount
  useEffect(() => {
    dispatch(actionCreators.getFridgeItemList(user.id));
  }, []);

  // clear fridge items
  const onClickClearFridgeButton = () => {
    dispatch(actionCreators.clearFridgeItems(user.id));
  };

  // open food detail modal
  const onClickFridgeItemButton = (itemId) => () => {
    dispatch(actionCreators.getFridgeItem(itemId))
      .then(() => setIsEdit(true));
  };

  const fridgeItemColumns = fridgeItems.map(item => (
    <Grid.Column
      key={item.id}
      verticalAlign='bottom'
    >
      <Card
        onClick={onClickFridgeItemButton(item.id)}
        raised
      >
        <Image
          src={`https://source.unsplash.com/512x512/?soup${item.id}`}
          rounded
        />
        <Card.Content>
          <Card.Header content={item.name} />
          <Card.Meta content={item.quantity + ' ' + item.unit} />
          <Card.Meta content={`Until ${item.expiry_date}`} />
        </Card.Content>
      </Card>
    </Grid.Column>
  ));

  const fridgeItemRows = [];

  for (let i = 0; i < Math.floor((fridgeItemColumns.length + nColPerRow - 1) / nColPerRow); i++) {
    fridgeItemRows.push(
      <Grid.Row key={i} columns={nColPerRow}>
        {fridgeItemColumns.slice(i * nColPerRow, (i + 1) * nColPerRow)}
      </Grid.Row>
    );
  }

  return (
    <Container text>
      <Segment.Group raised>
        <Segment color='blue' inverted tertiary>
          <Header
            as='h1'
            content={`${user.name}'s Fridge`}
            textAlign='center'
          />
        </Segment>
        <Segment>
          <Grid padded verticalAlign='bottom'>
            {fridgeItemRows}
          </Grid>
        </Segment>
        <Segment textAlign='right' color='blue' inverted tertiary>
          <Button
            id='addFoodButton'
            onClick={() => setIsCreate(true)}
            content='Add'
            primary
          />
          <Button
            id='clearFridgeButton'
            onClick={onClickClearFridgeButton}
            content='Clear'
            secondary
          />
        </Segment>
      </Segment.Group>
      <br />
      {
        isCreate && // unmount on close
        <FoodCreate open={isCreate} setOpen={setIsCreate} />
      }
      {
        isEdit && // unmount on close
        <FoodDetail open={isEdit} setOpen={setIsEdit} />
      }
    </Container >
  );
};


export default MyFridge;