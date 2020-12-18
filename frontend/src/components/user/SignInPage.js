import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';

import * as actionCreators from '../../store/actions/index';


export const SignInPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const isAuthorized = useSelector(state => state.user.isAuthorized);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [wait, setWait] = useState(false);

  const onClickSigninConfirmButton = () => {
    setWait(true);
    dispatch(actionCreators.signin({ username, password }))
      .then(() => history.goBack())
      .catch(() => {
        window.alert('Authentication failed.');
        setWait(false);
      });
  };

  if (isAuthorized) {
    return null;
  }

  return (
    <Grid style={{ height: '100vh' }} verticalAlign='middle' centered>
      <Grid.Column style={{ maxWidth: 360 }}>
        <Header textAlign='center' as='h1' color='blue'>
          <Link to='/'>
            <Header color='blue'>
              FRIDGE
            </Header>
          </Link>
        </Header>
        <Header content='Sign in' textAlign='center' as='h2' />
        <Segment raised>
          <Form>
            <Form.Field>
              <label htmlFor='usernameInput'>Username</label>
              <input
                type='text'
                id='usernameInput'
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor='passwordInput'>Password</label>
              <input
                type='password'
                id='passwordInput'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Segment>
        <Button
          type='button'
          id='signinConfirmButton'
          onClick={onClickSigninConfirmButton}
          content='Confirm'
          disabled={!username || !password || wait}
          floated='right'
          primary
        />
        <Button
          id='signupButton'
          onClick={() => { history.replace('/signup'); }}
          content='Sign up'
          disabled={wait}
          floated='right'
        />
      </Grid.Column>
    </Grid>
  );
};