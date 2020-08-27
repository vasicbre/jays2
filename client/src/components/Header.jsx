import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

class Header extends Component {

    state = { expanded: false }

    constructor(props) {
        super(props);
        this.navbarRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick.bind(this), true);
    }

    handleDocumentClick(e) {
        const toggler = this.navbarRef.current.querySelector('#toggler');
        if (toggler.contains(e.target)) {
            if (this.state.expanded) {
                this.state.expanded = false;
            } else {
                this.state.expanded = true;
            }
        } else {
            //console.log('outside toggler', this.state.expanded);
            if (this.state.expanded &&
                !this.navbarRef.current.contains(e.target)) {
                this.navbarRef.current.querySelector('#toggler').click();
                e.preventDefault();
            }
        }
    }

    toggleActivateStyle() {
        this.navbarRef.current.querySelector('#home').classList.remove('active');
        this.navbarRef.current.querySelector('#profile').classList.remove('active');
        this.navbarRef.current.querySelector('#login').classList.remove('active');
    }

    handleNavClick(e) {
        this.toggleActivateStyle();

        if (e.target.id == 'home') {
            this.props.history.push('/');
        } else if (e.target.id == 'profile') {
            this.props.history.push('/profile');
        } else if (e.target.id == 'login') {
            if (localStorage.getItem('token') !== null) {
                localStorage.removeItem('token');
            }
            this.props.history.push('/login');
        }
        this.navbarRef.current.querySelector('#toggler').click();
    }

    render() {
        return (
            <nav ref={this.navbarRef} className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top mb-2">
                <a className="navbar-brand" href="">ETF</a>
                <button id="toggler" className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul onClick={this.handleNavClick.bind(this)} className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a id="home" className="nav-link" href="#">Početna</a>
                        </li>
                        <li className="nav-item">
                            <a id="profile" className="nav-link" href="#">Profil</a>
                        </li>
                        <li className="nav-item">
                            <a id="login" className="nav-link" href="#">{localStorage.getItem('token') !== null? 'Odjava' : 'Prijava'}</a>
                        </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="search" placeholder="Pretraga" aria-label="Search"/>
                    </form>
                </div>
        </nav>
        );
    }
}

export default withRouter(Header);