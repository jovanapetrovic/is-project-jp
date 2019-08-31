import React from 'react';

const About = () => (
	<div style={{ textAlign: 'center'}}>
		<h3 className="teal-text">Contact us</h3>
		<p>IS online bookshop is the best place to find and shop different books!</p>
		<div className="row">
		    <div className="col s12 m6">
		      <div className="card teal lighten-1">
		        <div className="card-content white-text">
		          <span className="card-title">IS BookShop Nis</span>
		          <p><i className="material-icons">location_city</i> Nis address 12</p>
			      <p><i className="material-icons">phone</i> +381 18 123 456</p>
			      <p><i className="material-icons">email</i> nisoffice@isbookshop.rs</p>
		        </div>
		      </div>
		    </div>
		    <div className="col s12 m6">
		      <div className="card teal">
		        <div className="card-content white-text">
		          <span className="card-title">IS BookShop Belgrade</span>
		          <p><i className="material-icons">location_city</i> Belgrade address 34</p>
			      <p><i className="material-icons">phone</i> +381 18 987 654</p>
			      <p><i className="material-icons">email</i> belgradeoffice@isbookshop.rs</p>
		        </div>
		      </div>
		    </div>
		 </div>
		 <div style={{ border: '1px solid teal'}}>
		 	<h3 className="teal-text">About IS BookShop</h3>
			 	<ul>
					<li>Online IS BookShop is a result of a project done for Intelligent Systems subject.</li>
					<li>It is supposed to represent the usage of DialogFlow through a functional ChatBot.</li>
					<li>DialogFlow is a user friendly NLP tool based on natural language conversation.</li>
			 	</ul>
		 		<p><label>Subject: </label>Intelligent Systems</p>
		 		<p><label>Student: </label>Jovana Petrovic 696</p>
		 </div>
	</div>
)

export default About;