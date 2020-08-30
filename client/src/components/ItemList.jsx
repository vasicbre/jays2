import React, { Component } from 'react';
import ItemCard from './ItemCard';
import axios from 'axios';
import {toggleNavbarActivate} from '../helpers';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

class ItemList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            open: false,
            id : "",
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

    handleClickOpen(e, id) {
        this.state.id = id;
        this.setState({
            open: true
        });
    }

    handleClose(e) {
        this.setState({open: false});
    }

    async handleDelete(e) {
        let res = await axios.delete(
            "http://localhost:8000/api/thing/things/"+this.state.id, 
            {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}` 
                }
            });
            this.setState({
                open: false,
                items: this.state.items.filter(obj => {
                    return obj.id !== this.state.id;
                })
            });
    }

    dialog() {
        if (!this.state.open) return <div></div>;
        const Transition = React.forwardRef(function Transition(props, ref) {
            return <Slide direction="up" ref={ref} {...props} />;
          });

        return <div>
            <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose.bind(this)}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            >
            <DialogTitle id="alert-dialog-slide-title">{""}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                Da li ste sigurni da želite da obrišete ovu objavu?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose.bind(this)} color="primary">
                Odustani
                </Button>
                <Button onClick={this.handleDelete.bind(this)} color="primary">
                Obriši
                </Button>
            </DialogActions>
            </Dialog>
        </div>
    }
    render() {
        const itemList = this.state.items.map((item, index) => <ItemCard mine={this.props.mine} item={item} key={index} rm_callback={this.handleClickOpen.bind(this)}/>)
        return (
            <div>
            <div className="row">
                {itemList}
            </div>
            <div>
                {this.dialog()}
            </div>
            </div>
        );
    }
}

export default ItemList;