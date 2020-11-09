import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

export const FrontPage = () => {
  const [searchInput, setSearchInput] = useState('');

  const history = useHistory();

  const userId = useSelector(state => state.user.id);

  return (
    <div>
      <div>
        <input
          type='search'
          id='searchInput'
          placeholder='Search recipes...'
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <button onClick={() => history.push(`/search/${searchInput}`)}>Search</button>
      </div>
      <div><Link to={`/fridge/${userId}`}>My Fridge</Link></div>
    </div>
  );
};