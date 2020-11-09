import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';


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
          history.goBack();
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
    <div>
      <div>
        F.R.I.D.G.E.
      </div>
      <div>
        Sign Up
      </div>
      <div>
        <div>
          <label htmlFor='usernameInput'>Username</label>
          <input
            type='text'
            id='usernameInput'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='passwordInput'>Password</label>
          <input
            type='password'
            id='passwordInput'
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='emailInput'>Email</label>
          <input
            type='email'
            id='emailInput'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button
          type='button'
          id='signupConfirmButton'
          onClick={onClickSignupConfirmButton}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};