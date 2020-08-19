import React, { Component } from 'react';

class AddIcon extends Component {

    render() {
        const plusStyle = {
            'font-size': '100%'
          };
        return <div>
            <button type="submit" className="btn btn-primary float-right rounded-circle btn-lg mb-4 mr-4 sticky-bottom-right">
                <span style={plusStyle}>+</span>
            </button>
        </div>
    }
}

export default AddIcon;