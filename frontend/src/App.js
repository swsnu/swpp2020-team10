import React from 'react';
import {
  BrowserRouter as Router, 
  Route, 
  Redirect, 
  Switch
} from 'react-router-dom';
//import { FrontPage } from './components/FrontPage';

//import { RecipeSearchPage } from './components/RecipeSearchPage';
//import { SignInPage } from './components/user/SignInPage';
//import { SignUpPage } from './components/user/SignUpPage';
import RecipeDetail from './components/RecipeDetail';
import ReviewDetail from './components/ReviewDetail';


function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/recipe/:recipe_id' component={RecipeDetail} />
          <Route exact path='/review/:review_id' component={ReviewDetail} />
          <Redirect from='/' to='/recipe/1' />
        </Switch>
      </div>
    </Router>
  );
}
  
export default App;
  