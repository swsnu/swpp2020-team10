import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';

import * as actionCreators from '../../store/actions/index';


export const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const onClickSigninConfirmButton = () => {
    dispatch(actionCreators.signin({ username, password }))
      .then(response => {
        if (response.status != 204) {
          window.alert('Authentication failed.');
        } else {
          history.goBack();
        }
      });
  };

  return (
    <Grid style={{ height: '100vh' }} verticalAlign='middle' centered>
      <Grid.Column style={{ maxWidth: 360 }}>
        <Header textAlign='center' as='h1' color='blue'>
          F.R.I.D.G.E
        </Header>
        <Header textAlign='center' as='h2'>
          Sign in
        </Header>
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
        <Button floated='right' primary
          type='button'
          id='signinConfirmButton'
          onClick={onClickSigninConfirmButton}
        >Confirm</Button>
        <Button floated='right'
          type='button'
          id='signupButton'
          onClick={() => { history.push('/signup'); }}
        >Sign Up</Button>
      </Grid.Column>
    </Grid>
  );
};