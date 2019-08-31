import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';
import Homepage from './pages/Homepage';
import About from './pages/About';
import BookShop from './shop/BookShop';
import Chatbot from './chatbot/Chatbot';

const App = () => (
	<BrowserRouter>
		<div className="container">
			<Header/>
			<Route exact path="/" component={Homepage} />
			<Route exact path="/about" component={About} />
			<Route exact path="/shop" component={BookShop} />
			<Chatbot />
		</div>
	</BrowserRouter>
)

export default App;