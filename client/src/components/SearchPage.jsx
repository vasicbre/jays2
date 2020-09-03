import React, { Component } from 'react';
import Login from './Login';
import Tags from './Tags';
import ItemList from './ItemList';

import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import axios from 'axios';

class SearchPage extends Component {

    state = {
        options: [],
        applied_tags: []
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
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    onInputChange(selected) {
        this.setState({applied_tags: selected});
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
                            placeholder="Pretraga..."
                            onChange={this.onInputChange.bind(this)}
                        />
                </div>
                <ItemList tags = {this.state.applied_tags}/>
            </div>
        }
    }
}

export default SearchPage;