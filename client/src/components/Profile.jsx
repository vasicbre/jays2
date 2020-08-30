import React, { Component } from 'react';
import axios from 'axios';
import {toggleNavbarActivate} from '../helpers';
import ItemList from './ItemList';

class Profile extends Component {

    mediaQuery = "(max-width: 450px)";

    constructor(props) {
        super(props);
        this.state = {
            matches: window.matchMedia(this.mediaQuery).matches,
            name: "",
            email: "",
            bio: "", 
            date: "",
            phone: "",
            registration: false,
            profile: true
        };
    }

    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia(this.mediaQuery).addListener(handler);
        toggleNavbarActivate('profile');
        if (!this.state.registration) {
            this.fetchProfile();
        } else {
            this.setState({
                name: this.props.location.state.name,
                email: this.props.location.state.email
            });
        }
    }

    fetchProfile () {
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios({
            method: "get",
            url: "http://localhost:8000/api/user/profile",
            })
            .then(resp => {
                console.log(resp);
                this.setState({
                    email: resp.data.user.email,
                    name: resp.data.user.name,
                    bio: resp.data.bio,
                    date_of_birth: resp.data.date_of_birth,
                    phone: resp.data.phone
                });
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    putProfile() {
        var bodyFormData = new FormData();
        bodyFormData.set('bio',this.state.bio);
        bodyFormData.set('phone', this.state.phone);
        bodyFormData.set('date', this.state.date);
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios({
            method: "patch",
            url: "http://localhost:8000/api/user/profile/",
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                if (this.state.registration) {
                    this.props.history.push('/');
                } else {
                    this.setState({submitted: true});
                }
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo')
            });
    }

    registerSubmit(e) {
        e.preventDefault();
        if (this.state.bio === "" ||
            this.state.phone === "" ||
            this.state.date === "") {
            alert("Molimo Vas da popunite sva polja");
            return;
        }
        this.putProfile();
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

    registrationGreeting() {
        if (this.state.registration) {
            return <div className="alert alert-success" role="alert">
                Uspešno ste registrovali nalog.<br/>Molimo Vas da popunite detalje profila.
             </div>
        } else if (this.state.submitted) {
            return <div className="alert alert-success" role="alert">
                Uspešno ste sačuvali promene.
             </div>
        } else {
            return <div></div>
        }
    } 

    getToastMessage() {
        return <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <img src="..." className="rounded mr-2" alt="..."/>
                        <strong className="mr-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                        <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="toast-body">
                        Uspešno ste sačuvali promene.
                    </div>
                </div>;
    }

    navTabClicked(e) {
        let profile_elem = document.getElementById('profile-tab');
        let item_elem = document.getElementById('item-tab');
        if (e.target.id === 'profile-tab') {
            profile_elem.classList.add('active');
            item_elem.classList.remove('active');
            this.setState({profile: true});
        } else {
            profile_elem.classList.remove('active');
            item_elem.classList.add('active');
            this.setState({profile: false});
        }
    }

    navTabs() {
        if (this.state.registration) return <div></div>
        return <div>
            <ul className="nav nav-tabs" onClick={this.navTabClicked.bind(this)}>
                <li className="nav-item">
                    <a id="profile-tab" className="nav-link active text-secondary" href="#">Moj Profil</a>
                </li>
                <li className="nav-item">
                    <a id="item-tab" className="nav-link text-secondary" href="#">Moje objave</a>
                </li>
            </ul>
        </div>
    }

    profileForm() {
        if (!this.state.profile) return <div></div>;

        return <form onSubmit={this.registerSubmit.bind(this)}>
            <div className="form-group">
                <label htmlFor="nameInput">Ime</label>
                <input type="text" disabled className="form-control" id="nameInput" placeholder={this.state.name}/>
            </div>
            <div className="form-group">
                <label htmlFor="bioInput">Opis</label>
                <textarea type="text" className="form-control" id="bioInput" onChange={this.handleBioChange.bind(this)} placeholder="Opis" value={this.state.bio}/>
            </div>
            <div className="form-group">
                <label htmlFor="emailInput">Email adresa</label>
                <input type="email" disabled className="form-control" id="emailInput" aria-describedby="emailHelp" placeholder={this.state.email}/>
            </div>
            <div className="form-group">
                <label htmlFor="dateInput">Datum rođenja</label>
                <input type="date" className="form-control" id="dateInput" onChange={this.handleDateChange.bind(this)} value={this.state.date}/>
            </div>
            <div className="form-group">
                <label htmlFor="phoneInput">Telefon</label>
                <input type="text" className="form-control" id="phoneInput" onChange={this.handlePhoneChange.bind(this)} value={this.state.phone}/>
            </div>
            <button type="submit" className="btn btn-primary">Sačuvaj</button>
        </form>
    }

    myItems() {
        if (this.state.profile) return <div></div>;
        return <div>
                <ItemList mine={true}/>
            </div>
    }

    render() {
        return <div className= {this.state.matches? "container w-100 mt-2" : "container w-50 mt-2" }>
            {this.registrationGreeting()}
            {this.navTabs()}
            {this.profileForm()}
            {this.myItems()}
        </div>
    }
}

export default Profile;