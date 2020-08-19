import React, { Component } from 'react';

import axios from 'axios';

class CreateItem extends Component {
    mediaQuery = "(max-width: 450px)";

    state = { name: "", description: "" }

    constructor(props) {
        super(props)
        this.state = { matches: window.matchMedia(this.mediaQuery).matches };
    }
    
    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia(this.mediaQuery).addListener(handler);
    }

    createSubmit(e) {
        e.preventDefault();
        var bodyFormData = new FormData();
        bodyFormData.set('name',this.state.name);
        bodyFormData.set('description', this.state.description);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        axios({
            method: "post",
            url: "http://localhost:8000/api/thing/things/",
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                console.log(response);
                alert('Uspešno ste dodali novi artikal');
                this.props.history.push('/');
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }

    handleDescriptionChange(e) {
        this.setState({description: e.target.value});
    }

    render() {
        let output = <div className= {this.state.matches? "container w-100 mt-5" : "container w-50 mt-5" }>
            <form onSubmit={this.createSubmit.bind(this)}>
                <div className="form-group">
                    <input type="text" className="form-control" id="nameInput" onChange={this.handleNameChange.bind(this)} placeholder="Ime artikla"/>
                </div>
                <div className="form-group">
                    <textarea type="text" className="form-control" id="textInput" onChange={this.handleDescriptionChange.bind(this)} placeholder="Opis"/>
                </div>
                <div className="form-group">
                    <input className="form-control-file" type="file" name="itemImage" onChange={this.onImageChange} />
                </div>
                <button type="submit" className="btn btn-primary">Kreiraj</button>
            </form>
        </div>

        return output;
    }
}

export default CreateItem;