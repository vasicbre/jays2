import React from 'react';
import {withRouter} from 'react-router-dom';

const ItemCard = ({item, history}) => {

    const getItemDetails = (id) => {
        history.push('/details?id='+id);
    }

    return <div className="col-md-4">
        <div className="card mt-1 mb-1" onClick={ ()=> getItemDetails(item.id) }>
            <img src={item.image} alt="" className="card-img-top" />
            <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
            </div>
        </div>
    </div>;
};

export default withRouter(ItemCard);