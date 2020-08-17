import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Header from './Header.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';

import { BrowserRouter, Route } from 'react-router-dom';

const App = props => {
    useEffect(() => {
      axios.get('/api/thing/hello/')
        .then(res => setState(res.data))
    }, [])
const [state, setState] = useState('')
return(
    <BrowserRouter>
      <div>
        <Header />
        <div className="container">
          <Route path="/" exact={true} component={Home} />
          <Route path="/login" component={Login} />
          </div>
      </div>
    </BrowserRouter>
 )
};
export default App;