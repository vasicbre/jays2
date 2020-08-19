import React, { Component } from 'react';
import Login from './Login';

class Home extends Component {

    render() {
        const loggedIn = localStorage.getItem('token') != '';
        if (!loggedIn) {
            this.props.history.push('/login');
            return (<Login />);
        } else {
            return <div>
                <h1>Home</h1>
            </div>
        }
    }
}

export default Home;