import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class BookList extends Component {

	renderBook(book) {
		return	(	
			<div className="col s12 m7">
			    <h4 className="header">{book.title}</h4>
			    <div className="card horizontal hoverable">
			      <div className="card-image">
			        <img src={book.imageUrl} style={{ width: '160px'}} alt="Book"/>
			      </div>
			      <div className="card-stacked">
			        <div className="card-content" style={{ textAlign: 'left'}}>
			          <p><label>Description: </label>{book.description}</p>
			          <p><label>Rating: </label>{book.rating}/10</p>
			          <p><label>Price: </label><a>{book.price}</a></p>
			        </div>
			        <div className="card-action">
			          <a class="waves-effect waves-light btn-small teal" href={book.link} target="_blank" rel="noopener noreferrer">GET NOW</a>
			        </div>
			      </div>
			    </div>
	  		</div>
		);
    }

	renderBooks(books) {
        if (books) {
			return books.map((book, i) => {
			        return <div>{this.renderBook(book)}</div>
				}
			)
        } else {
            return null;
        }
    }

	render() {
		return (
			<div style={{ width: '600px'}}>{this.renderBooks(this.props.books)}</div>
		);
    }
}

export default withRouter(BookList);