import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = { matches: window.matchMedia(this.mediaQuery).matches };
    }

    mediaQuery = "(max-width: 450px)";

    state = { name: "", email: "", password1: "", password2: ""}

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }

    handlePassword1Change(e) {
        this.setState({password1: e.target.value});
    }

    handlePassword2Change(e) {
        this.setState({password2: e.target.value});
    }

    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia(this.mediaQuery).addListener(handler);
    }

    registerSubmit(e) {
        e.preventDefault();
        let lastAtPos = this.state.email.lastIndexOf('@');
        let lastDotPos = this.state.email.lastIndexOf('.');
        let formIsValid = true;
        if (!this.state.name) {
            formIsValid = false;
            alert("Ime ne može biti prazno");
        } else if (!(lastAtPos < lastDotPos
                && lastAtPos > 0
                && this.state.email.indexOf('@@') == -1
                && lastDotPos > 2
                && (this.state.email.length - lastDotPos) > 2)) {
            formIsValid = false;
            alert("Nevalidna e-mail adresa");
        } else if (!this.state.password1 || this.state.password1.length < 6) {
            formIsValid = false;
            alert("Lozinka ne može biti kraća od 6 karaktera");
        } else if (this.state.password1 !== this.state.password2) {
            formIsValid = false;
            alert("Lozinke se ne poklapaju");
        }

        if (formIsValid) {
            var bodyFormData = new FormData();
            bodyFormData.set('email',this.state.email);
            bodyFormData.set('name', this.state.name);
            bodyFormData.set('password', this.state.password1);
            axios({
                method: "post",
                url: "http://ec2-54-93-229-96.eu-central-1.compute.amazonaws.com:8000/api/user/create/",
                data: bodyFormData,
                headers: {'Content-Type': 'multipart/form-data' }
                })
                .then(response => {
                    alert('Uspešna registracija, možete se ulogovati')
                    this.props.history.push('/login');
                })
                .catch(err => {
                    alert('Neuspešna akcija, pokušajte ponovo')
                });
        }
    }

    render() {
        let output = <div className= {this.state.matches? "container w-100 mt-5" : "container w-50 mt-5" }>
            <form onSubmit={this.registerSubmit.bind(this)}>
                <div className="form-group">
                    <input type="text" className="form-control" id="nameInput" onChange={this.handleNameChange.bind(this)} placeholder="Ime"/>
                </div>
                <div className="form-group">
                    <input type="email" className="form-control" id="emailInput" aria-describedby="emailHelp" onChange={this.handleEmailChange.bind(this)} placeholder="E-mail"/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="passInput1" onChange={this.handlePassword1Change.bind(this)} placeholder="Lozinka"/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="passInput2" onChange={this.handlePassword2Change.bind(this)} placeholder="Potvrdi lozinku"/>
                </div>
                <div className="form-group">
                    <a href="" onClick={()=>this.props.history.push('/login')}>Imate nalog? Ulogujte se</a>
                </div>
                <button type="submit" className="btn btn-primary">Registruj se</button>
            </form>
        </div>

        return output;
    }
}

export default Register;