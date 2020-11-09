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
//import ReviewCreator from './components/ReviewCreator';
//import ReviewEditor from './components/ReviewEditor';


function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/recipe/:recipeId' component={RecipeDetail} />
          <Route exact path='/review/:reviewId' component={ReviewDetail} />
          <Redirect from='/' to='/recipe/' />
        </Switch>
      </div>
    </Router>
  );
}
  
export default App;
  