import React, { Component, useEffect, useState } from 'react';
import { Navigate, useNavigate  } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import Input from './Input';
import SubmitButton from './SubmitButton';
import axios from 'axios';

const redirectChat = () => {
	  return <Navigate to="/chat" replace />;
  };

function SignExpanded(props){
	const [state, setState] = useState({
		flexState: false, 
		animIsFinished: false,
		first_name: '',
		last_name: '',
		email: '',
		password: '',
	});

	const navigate = useNavigate();

	useEffect(() => {
		setState({ 
			...state,
			flexState: !state.flexState 
		});

		return () => {

		}
	}, [])

	const isFinished = () => {
		setState({ 
			...state,
			animIsFinished: true
		 });
	}
	const onChange = (e) => {
		console.log('e.target.name', e.target.name)
		setState({
			...state,
			[e.target.name]: e.target.value
		})
		console.log("onchange state", state);
	}
	const handleSignin = (e) => {
		e.preventDefault();
		const {email, password} = state;
		console.log("data", state);
		const data = {email, password}
		console.log(data)
		axios.post(`http://localhost:5000/api/login`, data)
			.then(res => {
				console.log(res.data)
				if (typeof window !== 'undefined') {
					localStorage.setItem('userData', JSON.stringify(res.data));
				}
				navigate(`/chat`, { replace: true });
				//window.location.href = "/chat"
				//<Navigate to='/chat' replace />
				//redirectChat();
			})
			.catch()
	}
	const handleSignup = (e) => {
		e.preventDefault();
		const {first_name, last_name, email, password} = state;
		const data = {first_name, last_name, email, password}
		console.log(data)
		axios.post(`http://localhost:5000/api/register`, data)
			.then(res =>{
				console.log(res)
			})
			.catch(err => {
				console.log(err);
			})
	}


	return (
		<Motion style={{
			flexVal: spring(state.flexState ? 8 : 1)
		}} onRest={isFinished}>
			{({ flexVal }) =>
				<div className={props.type === 'signIn' ? 'signInExpanded' : 'signUpExpanded'} style={{
					flexGrow: `${flexVal}`
				}}>
					<Motion style={{
						opacity: spring(state.flexState ? 1 : 0, { stiffness: 300, damping: 17 }),
						y: spring(state.flexState ? 0 : 50, { stiffness: 100, damping: 17 })
					}} >
						{({ opacity, y }) =>
							<form className='logForm' onSubmit={props.type==='signIn' ? handleSignin : handleSignup }>
								<h2>{props.type === 'signIn' ? 'SIGN IN' : 'SIGN UP'}</h2>
								{props.type !== "signIn" && <Input
									name="first_name"
									id="firstname"
									type="text"
									onChange={onChange}
									placeholder="First Name" />}
								{props.type !== "signIn" && <Input
									name="last_name"
									id="lastname"
									type="text"
									onChange={onChange}
									placeholder="Last Name" />}
								<Input
									name="email"
									id="email"
									type="text"
									onChange={onChange}
									placeholder="Email" />
								<Input
									name="password"
									id="password"
									type="password"
									onChange={onChange}
									placeholder="PASSWORD" />
								<SubmitButton type={props.type}></SubmitButton>
								{/* <a href="url" className='forgotPass'>{props.type == 'signIn' ? 'Forgot password?' : ''}</a> */}
							</form>
						}
					</Motion>
				</div>
			}
		</Motion>
	);
}

export default SignExpanded;