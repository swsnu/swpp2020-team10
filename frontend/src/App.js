import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {BrowserRouter, Route, Redirect, Switch} from "react-redux-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Switch>
                    <Route path="/recipe/:recipe_id" exact component={RecipeDetail} />
                    <Route path="/review/:review_id" exact component={ReviewDetail} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
