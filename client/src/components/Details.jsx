import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

import { WithContext as ReactTags } from 'react-tag-input';

class ItemDetails extends Component {
    state = { 
        item: {
            tags: []
        },
        email: "",
        name: "",
        bio: "",
        phone: "" }

    componentDidMount() {
        this.fetchDetails();
        this.fetchProfile();
        console.log('this.props', this.props);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.fetchDetails();
        }
    }

    fetchProfile () {
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios({
            method: "get",
            url: "http://ec2-54-93-229-96.eu-central-1.compute.amazonaws.com:8000/api/user/profile",
            })
            .then(resp => {
                this.setState({
                    email: resp.data.user.email,
                    name: resp.data.user.name,
                    bio: resp.data.bio,
                    phone: resp.data.phone
                });
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    fetchDetails = () => {
        let q = queryString.parse(this.props.location.search);

        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios({
            method: "get",
            url: "http://ec2-54-93-229-96.eu-central-1.compute.amazonaws.com:8000/api/thing/things/" + q.id,
            })
            .then(resp => {
                console.log(resp.data)
                this.setState({
                    item: resp.data
                });
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    render() {
        return <div className="col-md-4">
        <div className="card mt-1 mb-1">
        <img src={this.state.item.image} alt="" className="card-img-top" />
                <div className="card-body">
                    <h5 className="card-title">{this.state.item.title}</h5>
                    <p className="card-text">{this.state.item.description}</p>
                    <div>
                        <ReactTags
                            inputFieldPosition="top"
                            readOnly={true}
                            tags={this.state.item.tags.map(obj => {
                                return {
                                    id : obj.id.toString(),
                                    text: obj.name
                                }
                            })}
                            />
                    </div>
                </div>
        <ul className="list-group list-group-flush">
            <li className="list-group-item">
                <div>
                    <h6 className="card-text mb-2 text-muted">Objavio/la:</h6>
                    <h5 className="card-title">{this.state.name}</h5>
                    <p className="card-text">{this.state.phone}</p>
                </div>
            </li>
        </ul>
        </div>
    </div>;
    }
}

export default ItemDetails;