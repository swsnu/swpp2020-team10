import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { Button, Container, Dimmer, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react';

import { Recommendation } from './Recommendation';
import { Notification } from './Notification';
import * as actionCreators from '../store/actions/index';


export const FrontPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector(state => state.user);
  const fridgeItems = useSelector(state => state.fridgeItem.fridgeItems);

  const [searchInput, setSearchInput] = useState('');

  // fetch fridge items on initial mount
  useEffect(() => {
    if (user.isAuthorized) {
      dispatch(actionCreators.getFridgeItemList(user.id));
    }
  }, []);

  const fridgeItemList = fridgeItems.map((item, key) =>
    <div key={key}>
      {`${item.name} ${item.quantity} ${item.unit}`}
    </div>
  );

  const dimmer = (
    <Dimmer
      active={user.isAuthorized !== true}
      content='Please sign in to use this feature'
    />
  );

  return (
    <Container text>
      <Segment color='blue' inverted tertiary>
        <Grid>
          <Grid.Column verticalAlign='middle'>
            <label htmlFor='searchInput'>
              <Icon name='search' size='big' />
            </label>
          </Grid.Column>
          <Grid.Column width={15}>
            <Form>
              <Form.Field>
                <input
                  type='search'
                  id='searchInput'
                  placeholder='Search recipes...'
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') history.push(`/search/${searchInput}`); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
      <Grid columns={2}>
        <Grid.Column>
          <Segment>
            <Header content='Recommendation' />
            <Recommendation />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1487560227971-981afbe1c020?ixlib)',
            backgroundSize: 'cover',
          }}>
            <Header content='My Fridge' />
            <Segment style={{ minHeight: 100 }}>
              {fridgeItemList.length ? fridgeItemList : 'Your fridge is empty.'}
            </Segment>
            <Button primary
              as={Link}
              to={'/fridge/'}
              content='Go to My Fridge'
            />
            {dimmer}
          </Segment>
          <Segment>
            <Header content='Notifications' />
            <Notification />
            {dimmer}
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};