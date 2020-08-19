import React, { Component } from 'react';
import Login from './Login';
import AddIcon from './AddIcon';
import ItemList from './ItemList';

class Home extends Component {

    render() {
        const loggedIn = localStorage.getItem('token') != '';
        if (!loggedIn) {
            this.props.history.push('/login');
            return (<Login />);
        } else {
            return <div>
                <ItemList />
                <AddIcon />
            </div>
        }
    }
}

export default Home;