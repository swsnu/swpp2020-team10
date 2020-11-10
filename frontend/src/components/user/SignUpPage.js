import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';


export const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const history = useHistory();

  const onClickSignupConfirmButton = () => {
    let re_username = /^\w+$/;
    let re_password = /^\w+$/;

    if (!re_username.test(username)) {
      window.alert('Invalid username.');
    } else if (!re_password.test(password)) {
      window.alert('Invalid password.');
    } else {
      axios.post('/api/user/signup/', { username, password, email })
        .then(() => {
          window.alert('Succesfully created an account. Please sign in.');
          history.push('/');
        })
        .catch(error => {
          if (error.response.status === 409) {
            window.alert('Username already exists.');
          } else {
            window.alert('Something went wrong. Please try again later.');
          }
        });
    }
  };

  return (
    <Grid style={{ height: '100vh' }} verticalAlign='middle' centered>
      <Grid.Column style={{ maxWidth: 360 }}>
        <Header content='F.R.I.D.G.E' textAlign='center' as='h1' color='blue' />
        <Header content='Sign up' textAlign='center' as='h2' />
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
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor='emailInput'>Email</label>
              <input
                type='email'
                id='emailInput'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Segment>
        <Button floated='right' primary
          id='signupConfirmButton'
          onClick={onClickSignupConfirmButton}
          content='Confirm'
        />
      </Grid.Column>
    </Grid>
  );
};