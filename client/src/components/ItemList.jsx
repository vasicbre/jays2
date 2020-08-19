import React, { Component } from 'react';
import ItemCard from './ItemCard';
import axios from 'axios';


class ItemList extends Component {
    state = { items: [] }

    componentDidMount() {
        this.fetchItems();
    }

    componentDidUpdate(prevProps) {
        if(this.props.location !== prevProps.location) {
            this.fetchItems();
        }
    }

    fetchItems = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        axios({
            method: "get",
            url: "http://localhost:8000/api/thing/things",
            })
            .then(resp => {
                return resp.data;
            })
            .then(items => this.setState({items}))
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo')
            });

    }
    render() {
        const itemList = this.state.items.map((item, index) => <ItemCard item={item} key={index} />)
        return (
            <div className="row">
                {itemList}
            </div>
        );
    }
}

export default ItemList;