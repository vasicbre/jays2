import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';


class Tags extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            {/* <ReactTags
                inputFieldPosition="top"
                readOnly={true}
                tags={this.state.suggestions}
                /> */}
        </div>
    }
}

export default Tags;