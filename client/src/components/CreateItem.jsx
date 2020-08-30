import React, { Component } from 'react';

import { WithContext as ReactTags } from 'react-tag-input';

import axios from 'axios';

const KeyCodes = {
    comma: 188,
    enter: 13,
  };
   
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

class CreateItem extends Component {
    mediaQuery = "(max-width: 450px)";

    state = { name: "", description: "", image: null }

    constructor(props) {
        super(props);

        this.state = {
            matches: window.matchMedia(this.mediaQuery).matches,
            tags: [],
            suggestions: []
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.fetchTags();
    }
    
    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia(this.mediaQuery).addListener(handler);
    }

    fetchTags() {
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios({
            method: "get",
            url: "http://localhost:8000/api/thing/tags",
            })
            .then(resp => {
                const adjustedData = resp.data.map(obj => {
                        return {
                            id: obj.id.toString(),
                            text: obj.name
                        }
                    });
                this.setState({suggestions: adjustedData});
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }
 
    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }
 
    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
 
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
 
        // re-render
        this.setState({ tags: newTags });
    }
 

    validateForm() {
        if (!this.state.name) {
            return false;
        }
        if (!this.state.description) {
            return false;
        }
        if (!this.state.image) {
            return false;
        }
        return true;
    }

    createSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) {
            alert("Molimo Vas da popunite sva polja");
            return;
        }
        var bodyFormData = new FormData();
        bodyFormData.set('title',this.state.name);
        bodyFormData.set('description', this.state.description);
        bodyFormData.set('image', this.state.image);
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios({
            method: "post",
            url: "http://localhost:8000/api/thing/things/",
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                console.log(response);
                alert('Uspešno ste dodali novi artikal');
                this.props.history.push('/');
            })
            .catch(err => {
                alert('Neuspešna akcija, pokušajte ponovo');
                console.log(err);
            });
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }

    handleDescriptionChange(e) {
        this.setState({description: e.target.value});
    }

    handleImageChange(e) {
        console.log(e.target.files);
        this.setState({image: e.target.files[0]});
    }

    render() {
        const { tags, suggestions } = this.state;
        let output = <div className= {this.state.matches? "container w-100 mt-5" : "container w-50 mt-5" }>
            <form onSubmit={this.createSubmit.bind(this)}>
                <div className="form-group">
                    <input type="text" className="form-control" id="nameInput" onChange={this.handleNameChange.bind(this)} placeholder="Ime artikla"/>
                </div>
                <div className="form-group">
                    <textarea type="text" className="form-control" id="textInput" onChange={this.handleDescriptionChange.bind(this)} placeholder="Opis"/>
                </div>
                <div className="form-group">
                    <ReactTags
                        inputFieldPosition="top"
                        tags={tags}
                        suggestions={suggestions}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}
                        delimiters={delimiters}
                        placeholder = "Dodajte tag" />
                </div>
                <div className="form-group">
                    <input className="form-control-file" type="file" name="itemImage" onChange={this.handleImageChange.bind(this)} />
                </div>
                <button type="submit" className="btn btn-primary">Kreiraj</button>
            </form>
        </div>

        return output;
    }
}

export default CreateItem;