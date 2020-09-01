import React, { Component } from 'react';
import Login from './Login';
import Tags from './Tags';

import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import axios from 'axios';

class SearchPage extends Component {

    state = {
        options: []
    }

    constructor(props) {
        super(props);
        this.fetchTags();
    }

    fetchTags() {
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios({
            method: "get",
            url: "http://localhost:8000/api/thing/tags",
            })
            .then(resp => {
                const adjustedData = resp.data.map(obj => {
                        return obj.name
                    });
                this.setState({options: adjustedData});
                console.log('tags fetched');
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    render() {
        const loggedIn = localStorage.getItem('token') !== null;
        if (!loggedIn) {
            this.props.history.push('/login');
            return (<Login />);
        } else {
            return <div>
                <div id='tags-block'>
                    <Typeahead
                            clearButton
                            defaultSelected={this.state.options.slice(0, 5)}
                            id="selections-example"
                            labelKey="name"
                            multiple
                            options={this.state.options}
                            placeholder="Choose a state..."
                        />
                    <Tags />
                </div>
                {/* <ItemList /> */}
            </div>
        }
    }
}

export default SearchPage;