import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

class AddIcon extends Component {

    constructor(props) {
        super(props);
    }

    clickHandler(e) {
        console.log(this);
        this.props.history.push('/create');
    }

    render() {
        return <div>
            <button type="submit" onClick={this.clickHandler.bind(this)} className="btn btn-primary float-right rounded-circle btn-lg mb-4 mr-4 sticky-bottom-right">
                <span>+</span>
            </button>
        </div>
    }
}

export default withRouter(AddIcon);