import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import NavBar from './components/header/NavBar';
import Main from './pages/index';
import LocalStorage from './utils/LocalStorage';

function App() {

  const loggedIn = useSelector((state) => state.loggedIn.value);

  return (
    <div className="App">
      { loggedIn && (
        <NavBar />
      ) }
      <Main />
    </div>
  );
}

export default App;
