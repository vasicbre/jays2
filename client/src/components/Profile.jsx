import React, { Component } from 'react';
import axios from 'axios';
import {toggleNavbarActivate} from '../helpers';


class Profile extends Component {

    mediaQuery = "(max-width: 450px)";

    state = { name: "", email: "", bio: "", date: "", phone: ""}

    constructor(props) {
        super(props);
        this.state = { matches: window.matchMedia(this.mediaQuery).matches };
    }

    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia(this.mediaQuery).addListener(handler);
        toggleNavbarActivate('profile');
        this.fetchProfile();
    }

    fetchProfile () {
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios({
            method: "get",
            url: "http://localhost:8000/api/user/me",
            })
            .then(resp => {
                console.log(resp);
                return resp.data;
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    registerSubmit(e) {
        e.preventDefault();
        console.log('submitted');
    }

    handleBioChange(e) {
        this.setState({bio: e.target.value});
    }

    handleDateChange(e) {
        this.setState({date: e.target.value});
    }

    handlePhoneChange(e) {
        this.setState({phone: e.target.value});
    }

    render() {
        return <div className= {this.state.matches? "container w-100 mt-2" : "container w-50 mt-2" }>
            <div className="alert alert-success" role="alert">
                Uspešno ste registrovali nalog.<br/>Molimo Vas da popunite detalje profila.
            </div>
            <form onSubmit={this.registerSubmit.bind(this)}>
                <div className="form-group">
                    <label htmlFor="nameInput">Ime</label>
                    <input type="text" disabled className="form-control" id="nameInput" placeholder={this.props.location.state.name}/>
                </div>
                <div className="form-group">
                    <label htmlFor="bioInput">Opis</label>
                    <textarea type="text" className="form-control" id="bioInput" onChange={this.handleBioChange.bind(this)} placeholder="Opis"/>
                </div>
                <div className="form-group">
                    <label htmlFor="emailInput">Email adresa</label>
                    <input type="email" disabled className="form-control" id="emailInput" aria-describedby="emailHelp" placeholder={this.props.location.state.email}/>
                </div>
                <div className="form-group">
                    <label htmlFor="dateInput">Datum rođenja</label>
                    <input type="date" className="form-control" id="dateInput" onChange={this.handleDateChange.bind(this)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="phoneInput">Telefon</label>
                    <input type="text" className="form-control" id="phoneInput" onChange={this.handlePhoneChange.bind(this)} placeholder="Telefon"/>
                </div>
                <button type="submit" className="btn btn-primary">Sačuvaj</button>
            </form>
        </div>
    }
}

export default Profile;