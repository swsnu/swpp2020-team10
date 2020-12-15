import axios from 'axios';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';


export const SignUpPage = () => {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [enableUsernameError, setEnableUsernameError] = useState(false);
  const [enablePasswordError, setEnablePasswordError] = useState(false);
  const [enableConfirmPasswordError, setEnableConfirmPasswordError] = useState(false);

  const [wait, setWait] = useState(false);

  const onClickSignupConfirmButton = () => {
    setWait(true);
    axios.post('/api/user/signup/', { username, password })
      .then(() => {
        window.alert('Succesfully created an account. Please sign in.');
        history.replace('/signin');
      })
      .catch(error => {
        if (error.response.status === 409) {
          window.alert('Username already exists.');
        } else {
          window.alert('Something went wrong. Please try again later.');
        }
        setWait(false);
      });
  };

  const checkUsernameError = () => !username;
  const checkPasswordError = () => password.length < 8;
  const checkConfirmPasswordError = () => confirmPassword.length == 0 || password !== confirmPassword;

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
        <Header content='Sign up' textAlign='center' as='h2' />
        <Segment raised>
          <Form>
            <Form.Input
              id='usernameInput'
              label='Username'
              value={username}
              onChange={e => {
                if (!enableUsernameError) setEnableUsernameError(true);
                setUsername(e.target.value);
              }}
              error={
                enableUsernameError &&
                checkUsernameError() &&
                'Username must not be empty.'
              }
            />
            <Form.Input
              id='passwordInput'
              type='password'
              label='Password'
              value={password}
              onChange={e => {
                if (!enablePasswordError) setEnablePasswordError(true);
                setPassword(e.target.value);
              }}
              error={
                enablePasswordError &&
                checkPasswordError() &&
                'Password length must not be less than 8.'
              }
            />
            <Form.Input
              id='confirmPasswordInput'
              type='password'
              label='Confirm password'
              value={confirmPassword}
              onChange={e => {
                if (!enableConfirmPasswordError) setEnableConfirmPasswordError(true);
                setConfirmPassword(e.target.value);
              }}
              error={
                enableConfirmPasswordError &&
                checkConfirmPasswordError() &&
                'Password does not match.'
              }
            />
          </Form>
        </Segment>
        <Button
          id='signupConfirmButton'
          onClick={onClickSignupConfirmButton}
          content='Confirm'
          disabled={
            checkUsernameError() ||
            checkPasswordError() ||
            checkConfirmPasswordError() ||
            wait
          }
          floated='right'
          primary
        />
        <Button
          id='signinButton'
          onClick={() => { history.replace('/signin'); }}
          content='Sign in'
          disabled={wait}
          floated='right'
        />
      </Grid.Column>
    </Grid>
  );
};