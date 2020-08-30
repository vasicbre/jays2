import React, { Component } from 'react';
import ItemCard from './ItemCard';
import axios from 'axios';
import {toggleNavbarActivate} from '../helpers';
import { useState, useEffect } from 'react';

class ItemList extends Component {

    constructor(props) {
        super(props)
        this.state = { 
            items: []
        };
    }

    componentDidMount() {
        toggleNavbarActivate('home');
        this.fetchItems();
    }

    fetchItems = () => {
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios({
            method: "get",
            url: "http://localhost:8000/api/thing/things",
            })
            .then(resp => {
                console.log(resp.data);
                return resp.data;
            })
            .then(items => {
                this.setState({items});
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });

    }

    modal() {
        return <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    }

    longPressBackspaceCallback(e) {
        console.log(e);
    }

    render() {
        const itemList = this.state.items.map((item, index) => <ItemCard mine={this.props.mine} item={item} key={index}/>)
        return (
            <div className="row">
                {itemList}
            </div>
        );
    }
}

export default ItemList;