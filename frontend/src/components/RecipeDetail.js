import React, { Component } from "react";
import * as actionCreators from "../store/actions/index";

function RecipeDetail(props) {
  return (
    <div className='RecipeDetail'>
      <div className='row'>
        <button id='settingsButton' onClick={() => {this.onClickSettingsButton();}}>
          To Settings
        </button>
        <button id='signOutButton' onClick={() => {this.onClickSignOutButton();}}>
          Sign Out
        </button>
      </div>
      <div className='row'></div>
    </div>);
}