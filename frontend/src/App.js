import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  useHistory,
  Link,
} from 'react-router-dom';

import { Container, Header, Icon, Menu } from 'semantic-ui-react';

import { FrontPage } from './components/FrontPage';
import { RecipeSearchPage } from './components/RecipeSearchPage';
import { SignInPage } from './components/user/SignInPage';
import { SignUpPage } from './components/user/SignUpPage';
import { MyFridge } from './components/myfridge/MyFridge';
import { RecipeDetail } from './components/RecipeDetail';
import { ReviewDetail } from './components/ReviewDetail';
import { ReviewCreator } from './components/ReviewCreator';
import { ReviewEditor } from './components/ReviewEditor';
import { Settings } from './components/Settings';

import * as actionCreators from './store/actions/index';


const MenuBefore = () => {
  const history = useHistory();

  return (
    <Menu borderless fixed='top'>
      <Container text>
        <Menu.Item>
          <Link to='/'>
            <Header color='blue'>
              <Icon name='snowflake' />FRIDGE
            </Header>
          </Link>
        </Menu.Item>
        <Menu.Item
          position='right'
          content='Sign up'
          onClick={() => history.push('/signup')}
        />
        <Menu.Item
          content='Sign in'
          onClick={() => history.push('/signin')}
        />
      </Container>
    </Menu>
  );
};


const MenuAfter = ({ isFridge }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [openSettings, setOpenSettings] = useState(false);

  return (
    <>
      <Menu borderless fixed='top'>
        <Container text>
          <Menu.Item>
            <Link to='/'>
              <Header color='blue'>
                <Icon name='snowflake' />FRIDGE
              </Header>
            </Link>
          </Menu.Item>
          <Menu.Item
            id='openSettingsButton'
            position='right'
            content='Settings'
            onClick={() => setOpenSettings(true)}
          />
          {
            openSettings &&
            <Settings open={openSettings} setOpen={setOpenSettings} />
          }
          <Menu.Item
            content='My Fridge'
            onClick={() => { if (!isFridge) history.push('/fridge'); }}
            active={isFridge}
          />
          <Menu.Item
            content='Sign Out'
            onClick={() => {
              dispatch(actionCreators.signout())
                .then(() => history.push('/'));
            }}
          />
        </Container>
      </Menu>
    </>
  );
};


function WrappedRoute({ menu: Menu, component: Component, isFridge, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps => (
        <>
          <Menu isFridge={isFridge} />
          <br /><br /><br /><br />
          <Component {...routeProps} />
        </>
      )}
    />
  );
}


function App() {
  const userIsAuthorized = useSelector(state => state.user.isAuthorized);

  if (userIsAuthorized === null) {
    return null;
  }

  if (userIsAuthorized === false) {
    return (
      <Router>
        <Switch>
          <Route exact path='/signin' component={SignInPage} />
          <Route exact path='/signup' component={SignUpPage} />
          <WrappedRoute menu={MenuBefore} exact path='/search/:q' component={RecipeSearchPage} />
          <WrappedRoute menu={MenuBefore} exact path='/recipe/:recipe_id' component={RecipeDetail} />
          <WrappedRoute menu={MenuBefore} exact path='/review/:review_id' component={ReviewDetail} />
          <WrappedRoute menu={MenuBefore} exact path='/' component={FrontPage} />
          <Redirect to='/' />
        </Switch>
      </Router>
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path='/signin' component={SignInPage} />
        <Route exact path='/signup' component={SignUpPage} />
        <WrappedRoute menu={MenuAfter} exact path='/search/:q' component={RecipeSearchPage} />
        <WrappedRoute menu={MenuAfter} exact path='/fridge' component={MyFridge} isFridge />
        <WrappedRoute menu={MenuAfter} exact path='/recipe/:recipe_id' component={RecipeDetail} />
        <WrappedRoute menu={MenuAfter} exact path='/recipe/:recipe_id/create-review' component={ReviewCreator} />
        <WrappedRoute menu={MenuAfter} exact path='/review/:review_id' component={ReviewDetail} />
        <WrappedRoute menu={MenuAfter} exact path='/review/:review_id/edit' component={ReviewEditor} />
        <WrappedRoute menu={MenuAfter} exact path='/' component={FrontPage} />
        <Redirect to='/' />
      </Switch>
    </Router>
  );
}

export default App;