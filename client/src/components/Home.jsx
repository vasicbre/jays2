import React, { Component } from 'react';
import Login from './Login';

class Home extends Component {
    state = { loggedIn: false }

    render() {
        let { loggedIn } = this.state;
        if (!loggedIn) {
            return (<Login />);
        }
    }
}

export default Home;