import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  useHistory,
} from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';

import { FrontPage } from './components/FrontPage';
import { RecipeSearchPage } from './components/RecipeSearchPage';
import { SignInPage } from './components/user/SignInPage';
import { SignUpPage } from './components/user/SignUpPage';
import MyFridge from './components/myfridge/MyFridge';
import RecipeDetail from './components/RecipeDetail';
import ReviewDetail from './components/ReviewDetail';
import ReviewCreator from './components/ReviewCreator';
import ReviewEditor from './components/ReviewEditor';

import * as actionCreators from './store/actions/index';


const MenuBeforeSignIn = () => {
  const history = useHistory();

  return (
    <Menu borderless>
      <Container text>
        <Menu.Menu position='right'>
          <Menu.Item
            content='Sign up'
            onClick={() => history.push('/signup')}
          />
          <Menu.Item
            content='Sign in'
            onClick={() => history.push('/signin')}
          />
        </Menu.Menu>
      </Container>
    </Menu>
  );
};


function WrappedRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps => (
        <>
          <MenuBeforeSignIn />
          <Component {...routeProps} />
        </>
      )}
    />
  );
}


function App() {
  const dispatch = useDispatch();

  const userIsAuthorized = useSelector(state => state.user.isAuthorized);

  if (!userIsAuthorized) {
    return (
      <Router>
        <Switch>
          <Route exact path='/signin' component={SignInPage} />
          <Route exact path='/signup' component={SignUpPage} />
          <WrappedRoute exact path='/search/:q' component={RecipeSearchPage} />
          <WrappedRoute exact path='/recipe/:recipe_id' component={RecipeDetail} />
          <WrappedRoute exact path='/review/:review_id' component={ReviewDetail} />
          <WrappedRoute exact path='/review/:recipe_id/create' component={ReviewCreator} />
          <WrappedRoute exact path='/review/:review_id/edit' component={ReviewEditor} />
          <WrappedRoute exact path='/' component={FrontPage} />
          <Redirect to='/' />
        </Switch>
      </Router>
    );
  }

  return (
    <Router>
      <Menu borderless>
        <Container text>
          <Menu.Menu position='right'>
            <Menu.Item
              content='Settings'
            />
            <Menu.Item
              content='Sign out'
              onClick={() => dispatch(actionCreators.signout())}
            />
          </Menu.Menu>
        </Container>
      </Menu>
      <Switch>
        <Route exact path='/search/:q' component={RecipeSearchPage} />
        <Route exact path='/fridge/:user_id' component={MyFridge} />
        <Route exact path='/recipe/:recipe_id' component={RecipeDetail} />
        <Route exact path='/review/:review_id' component={ReviewDetail} />
        <Route exact path='/review/:recipe_id/create' component={ReviewCreator} />
        <Route exact path='/review/:review_id/editor' component={ReviewEditor} />
        <Route exact path='/' component={FrontPage} />
        <Redirect to='/' />
      </Switch>
    </Router>
  );
}

export default App;