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
      .then(() => {
        history.push('/');
      })
      .catch(() => {
        window.alert('Authentication failed.');
      });
  };

  return (
    <Grid style={{ height: '100vh' }} verticalAlign='middle' centered>
      <Grid.Column style={{ maxWidth: 360 }}>
        <Header content='F.R.I.D.G.E' textAlign='center' as='h1' color='blue' />
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
        <Button floated='right' primary
          type='button'
          id='signinConfirmButton'
          onClick={onClickSigninConfirmButton}
          content='Confirm'
        />
        <Button floated='right'
          id='signupButton'
          onClick={() => { history.push('/signup'); }}
          content='Sign up'
        />
      </Grid.Column>
    </Grid>
  );
};