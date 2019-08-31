import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<nav>
			<div className="nav-wrapper indigo accent-3">
				<Link to={'/'} className="brand-logo" style={{ marginLeft: 15}}><i className="material-icons">book</i>IS BookShop</Link>
				<ul id="nav-mobile" className="right hide-on-med-and-down">
					<li><Link to={'/shop'}><i className="material-icons left">shopping_cart</i>Shop</Link></li>
					<li><Link to={'/about'}><i className="material-icons left">info</i>About</Link></li>
				</ul>

			</div>
		</nav>
		)
};

export default Header;