import React from 'react';
import {
  BrowserRouter as Router, 
  Route, 
  Redirect, 
  Switch
} from 'react-router-dom';
import { FrontPage } from './components/FrontPage';

import { RecipeSearchPage } from './components/RecipeSearchPage';
import { SignInPage } from './components/user/SignInPage';
import { SignUpPage } from './components/user/SignUpPage';
import RecipeDetail from './components/RecipeDetail';
import ReviewDetail from './components/ReviewDetail';


function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/signin' component={SignInPage} />
          <Route exact path='/signup' component={SignUpPage} />
          <Route exact path='/search/:q' component={RecipeSearchPage} />
          <Route exact path='/recipe/:recipe_id' component={RecipeDetail} />
          <Route exact path='/review/:review_id' component={ReviewDetail} />
          <Route exact path='/' component={FrontPage}/>
          <Redirect to='/' />
        </Switch>
      </div>
    </Router>
  );
}
  
export default App;
  