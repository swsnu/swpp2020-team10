import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

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
    <div>
      <div>
        F.R.I.D.G.E.
      </div>
      <div>
        Sign In
      </div>
      <div>
        <div>
          <label htmlFor='usernameInput'>Username</label>
          <input
            type='username'
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
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button
          type='button'
          id='signupButton'
          onClick={() => { history.push('/signup'); }}
        >
          Sign Up
        </button>
        <button
          type='button'
          id='signinConfirmButton'
          onClick={onClickSigninConfirmButton}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};