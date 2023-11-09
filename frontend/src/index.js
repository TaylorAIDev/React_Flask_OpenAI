import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import './index.css';

// const container = document.getElementById('root');
// const root = createRoot(container); 
// root.render(<App />);

// ReactDOM.createRoot(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// ReactDOM.createRoot(
//   document.getElementById("root"),
// )
// .render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />

);