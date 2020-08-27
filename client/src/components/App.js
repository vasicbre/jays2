import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Header from './Header.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import CreateItem from './CreateItem.jsx';
import Profile from './Profile';

import { BrowserRouter, Route } from 'react-router-dom';

const App = props => {
  const [state, setState] = useState('')
  return(
    <BrowserRouter>
      <div>
        <Header />
        <div className="container">
          <Route path="/" exact={true} component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/create" component={CreateItem} />
          <Route path="/profile" component={Profile} />
          </div>
      </div>
    </BrowserRouter>
  )
};
export default App;