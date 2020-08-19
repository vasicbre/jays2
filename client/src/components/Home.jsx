import React, { Component } from 'react';
import Login from './Login';
import AddIcon from './AddIcon';

class Home extends Component {

    render() {
        const loggedIn = localStorage.getItem('token') != '';
        if (!loggedIn) {
            this.props.history.push('/login');
            return (<Login />);
        } else {
            return <div className="container">
                <h1>Home</h1>
                <AddIcon />
            </div>
        }
    }
}

export default Home;