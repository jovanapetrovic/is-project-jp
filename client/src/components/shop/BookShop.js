import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios/index';

import BookList from './BookList';

class BookShop extends Component {

	constructor(props) {
		super(props);

		this.state = {
			books: [],
		}
	}

	async getBooks() {
		const res = await axios.get('https://my-json-server.typicode.com/jovanapetrovic/is-fake-json-server/books');

		for (let book of res.data) {
			this.setState({ books: [...this.state.books, book]});
		}
	}

	async componentDidMount() {
		this.getBooks();
	}

	render() {
		return (
			<div>
				<h3 className="teal-text" style={{ textAlign: 'center'}}>Shop online</h3>
				<BookList books={this.state.books}/>
			</div>
		);
    }
}

export default withRouter(BookShop);
