import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './Components/Navigation/Navigation.js';
import Register from './Components/Register/Register.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import Signin from './Components/Signin/Signin.js';
import Logo from './Components/Logo/Logo.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import Rank from './Components/Rank/Rank.js';

import './App.css';

const particlesOptions = {
	particles: {
		number: {
			value: 80,
			density: {
				enable: true,
				value_area: 800
			}
		}
	}
}

const initialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	userUpdate = ( data ) => {
		this.setState({ user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
			}
		})
	}

	onRouteChange = ( route ) => {
		if (route === 'home') {
			this.setState({isSignedIn: true});
		}
		else {
			this.setState(initialState);
		}
		this.setState({route: route});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return{
			x1 : clarifaiFace.left_col*width,
			y1 : clarifaiFace.top_row*height,
			x2 : width - clarifaiFace.right_col*width,
			y2 : height - clarifaiFace.bottom_row*height
		}
	}

	displayFaceBox = (box) => {
		this.setState({box : box});
	}

	onButtonSubmit = () => {
		console.log('click');
		this.setState({imageUrl: this.state.input});
			fetch('https://quiet-fortress-05554.herokuapp.com/imageurl', {
	        	method:'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					input: this.state.input
				})
	        })
	        .then(response => response.json())
	        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
	        .catch(err => console.log(err))
	        .then(fetch('https://quiet-fortress-05554.herokuapp.com/image', {
	        	method:'put',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					id: this.state.user.id
				})
	        })
	        	.then(response => response.json())
	        	.then(data => this.userUpdate(data))
	    )
	}
	render() {
	  return (
	    <div className="App">
			<Particles className='particles'
		   	params={particlesOptions} 
		   	/>
		   	<Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
		   	{ this.state.route === 'home'
			 	? <div>
					<Logo />
					<Rank name={this.state.user.name} entries = {this.state.user.entries}/>
					<ImageLinkForm 
						onInputChange={this.onInputChange} 
						onButtonSubmit={this.onButtonSubmit}
					/>
					<FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
				 </div>
			 	: (
					this.state.route === 'signin'
					? <Signin userUpdate = {this.userUpdate} onRouteChange = {this.onRouteChange} />
					: <Register userUpdate = {this.userUpdate} onRouteChange = {this.onRouteChange} />
				)
			}
	    </div>
	  );
	}
}

export default App;
