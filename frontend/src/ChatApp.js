import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import Sidebar from './Components/Sidebar'; 
import NewChat from './NewChat';
import { redirect, Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  if (localStorage.getItem('userData')) {
    return JSON.parse(localStorage.getItem('userData'));
  } else {
    return false;
  }
};


const loader = () => {
  const user = isAuthenticated();
  if (!user) {
    console.log('not user login')
    return <Navigate to="/" replace />;
  }
  return null;
};

const ChatApp = (props) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };
  
  const handleDropdownChange = (event) => {
    setSelectedMenuItem(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetchResponse(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', content: userInput },
      { type: 'bot', content: response },
    ]);
    setUserInput('');
  };

  const fetchResponse = async (query) => {
    // Perform API call here using Axios
    const apiUrl = 'your_api_endpoint_here';
    try {
      const response = await axios.post(apiUrl, { question: query });
      return response.data.answer;
    } catch (error) {
      console.error('Error fetching response:', error);
      return 'Sorry, there was an error. Please try again.';
    }
  };

  useEffect(() => {

    return () => {

		}
	}, [])

  return (
    
    // <Router>
      <div className="app-container">
        {loader()}
        {console.log('authentication', isAuthenticated())}
        <Sidebar />
        <div className="chat-section">
          <h2>MediPal Bot</h2>
          <div className="chat-container">
                <div className="top-part">
                <p style={{ paddingRight: '10px' }}>I want to know more about</p>
                  <select value={selectedMenuItem} onChange={handleDropdownChange} style={{ paddingLeft: '10px', borderRadius: '10px' }}>
                    <option value="">Select an item</option>
                    <option value="item1">Item 1</option>
                    <option value="item2">Item 2</option>
                    <option value="item3">Item 3</option>
                    <option value="item4">Item 4</option>
                  </select>
                </div>
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    {message.content}
                  </div>
                ))}
                <form onSubmit={handleSubmit} className="question-form">
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleChange}
                  />
                  <button type="submit">Send</button>
                </form>
                <div className="learn-more-section">
                  <p>Learn More</p>
                  <div className="buttons-container">
                    <div className="buttons">
                      <button>Palitexcel</button>
                      <button>Dietary</button>
                      <button>Nutrition</button>
                      <button>Symptoms</button>
                      <button>..more</button>
                    </div>
                  </div>
                </div>
              </div>
          {/* <Routes> */}
            {/* <Route path="/" element={
              
            } /> */}
            {/* <Route path="/new-chat" element={<NewChat />} /> */}
          {/* </Routes> */}
        </div>
      </div>
    // </Router>
  );
};

export default ChatApp;