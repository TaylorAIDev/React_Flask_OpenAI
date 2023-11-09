import React, { useEffect, useState } from 'react';
import NavigationPanel from './NavigationPanel';
import Modal from './Modal';
import '../App.css';

const Auth = (props) => {
	const [mounted, setMounted] = useState(false);
	const handleSubmit = (e) => {
		setMounted(false);
		e.preventDefault();
	}

	useEffect(() => {
		setMounted(true);
	}, [])

	let child;

	if (mounted) {
		child = (
			<div className="App_test">
				<NavigationPanel></NavigationPanel>
				<Modal onSubmit={handleSubmit} />
			</div>
		);
	}

	return (
		<div className="App">
				{child}
		</div>
	);
}

export default Auth;
