// App.js

import React from 'react';
import ChatApp from './ChatApp'; 
import Auth from './Components/auth';
import { BrowserRouter, Routes , Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Auth}></Route>
          <Route path='/chat' Component={ChatApp}></Route> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
