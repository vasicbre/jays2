import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Header from './Header.jsx';
import Home from './Home.jsx';

const App = props => {
    useEffect(() => {
      axios.get('/api/thing/hello/')
        .then(res => setState(res.data))
    }, [])
const [state, setState] = useState('')
return(
    <div>
      <Header />
      <Home />
    </div>
 )
};
export default App;