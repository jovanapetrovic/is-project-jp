import React from 'react';

const Homepage = () => (
	<div style={{ textAlign: 'center'}}>
		<h2 className="teal-text">Welcome to online IS BookShop!</h2>
		<p>Feel free to ask our <b>ChatBot</b> for help or even book recommendations <b>:)</b></p>
		<img className="responsive-img" src="images/books-coffee.jpg" alt="books-coffee"/>
		<div style={{ border: '1px solid teal', marginBottom: '20px'}}>
			<ul>
				<li>Tell the ChatBot what you would like to read and get the link to your book</li>
				<li>Ask for some book recommendations</li>
				<li>Let ChatBot help you subscribe to our newsletter</li>
				<li>Our ChatBot can even inform you about our bookclub and show you some book reviews</li>
				<li>Or you can just have a small chat with our ChatBot :)</li>
			</ul>
		</div>
	</div>
)

export default Homepage;