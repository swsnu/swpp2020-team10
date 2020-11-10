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
import MyFridge from './components/myfridge/MyFridge';
import RecipeDetail from './components/RecipeDetail';
import ReviewDetail from './components/ReviewDetail';
import ReviewCreator from './components/ReviewCreator';
import ReviewEditor from './components/ReviewEditor';


function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/signin' component={SignInPage} />
          <Route exact path='/signup' component={SignUpPage} />
          <Route exact path='/search/:q' component={RecipeSearchPage} />
          <Route exact path='/fridge/:user_id' component={MyFridge} />
          <Route exact path='/recipe/:recipe_id' component={RecipeDetail} />
          <Route exact path='/review/:review_id' component={ReviewDetail} />
          <Route exact path='/review/:recipe_id/create' component={ReviewCreator} />
          <Route exact path='/review/:review_id/edit' component={ReviewEditor} />
          <Route exact path='/' component={FrontPage}/>
          <Redirect to='/' />
        </Switch>
      </div>
    </Router>
  );
}
  
export default App;
  