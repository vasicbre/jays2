import React, { Component } from 'react';

import axios from 'axios';

class Login extends Component {
    mediaQuery = "(max-width: 450px)";

    state = { email: "", password: "" }

    constructor(props) {
        super(props);
        this.state = { matches: window.matchMedia(this.mediaQuery).matches };
    }
    
    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia(this.mediaQuery).addListener(handler);
    }

    loginSubmit(e) {
        e.preventDefault();
        var bodyFormData = new FormData();
        bodyFormData.set('email',this.state.email);
        bodyFormData.set('password', this.state.password);
        axios({
            method: "post",
            url: "http://localhost:8000/api/user/token/",
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                this.props.history.push('/');
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    render() {
        let output = <div className= {this.state.matches? "container w-100 mt-5" : "container w-50 mt-5" }>
            <form onSubmit={this.loginSubmit.bind(this)}>
                <div className="form-group">
                    <input type="email" className="form-control" id="emailInput" aria-describedby="emailHelp" onChange={this.handleEmailChange.bind(this)} placeholder="E-mail"/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="passwordInput" onChange={this.handlePasswordChange.bind(this)} placeholder="Lozinka"/>
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Zapamti me</label>
                </div>
                <div className="form-group">
                    <a href="" onClick={()=>this.props.history.push('/register')}>Nemate nalog? Registrujte se</a>
                </div>
                <button type="submit" className="btn btn-primary">Napred</button>
            </form>
        </div>

        return output;
    }
}

export default Login;