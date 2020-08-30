import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { WithContext as ReactTags } from 'react-tag-input';

class ItemCard extends Component {

    constructor(props) {
        super(props)
    }
    
    componentDidMount() {
    }

    getItemDetails = (id) => {
        this.props.history.push('/details?id='+id);
    }

    tags = this.props.item.tags.map(obj => {
        return {
            id: obj.id.toString(),
            text: obj.name
        }
    });

    removeButton() {
        if (!this.props.mine) {
            return <div></div>
        }
        return  <button type="button" className="close float-right" aria-label="Close">
                <span aria-hidden="true">&times;</span>
        </button>
    }
    render() {
        return <div className="col-md-4">
            <div className="card mt-1 mb-1" onClick={ ()=> this.getItemDetails(this.props.item.id) }>
                <img src={this.props.item.image} alt="" className="card-img-top" />
                <div className="card-body">
                    {this.removeButton()}
                    <h5 className="card-title">{this.props.item.title}</h5>
                    <p className="card-text">{this.props.item.description}</p>
                    <div>
                        <ReactTags
                            inputFieldPosition="top"
                            readOnly={true}
                            tags={this.tags}
                            />
                    </div>
                </div>
            </div>
        </div>;
    }
};

export default withRouter(ItemCard);