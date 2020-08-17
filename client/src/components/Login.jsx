import React, { Component } from 'react';

class Login extends Component {
    mediaQuery = "(max-width: 450px)";

    constructor(props) {
        super(props)
        this.state = { matches: window.matchMedia(this.mediaQuery).matches };
      }
    
      componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia(this.mediaQuery).addListener(handler);
      }

    render() {
        let output = <div className= {this.state.matches? "container w-100 mt-5" : "container w-50 mt-5" }>
            <form>
                <div className="form-group">
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="e-mail"/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Zapamti me</label>
                </div>
                <button type="submit" className="btn btn-primary">Napred</button>
            </form>
        </div>

        return output;
    }
}

export default Login;