import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/header/NavBar';
import Main from './pages/index';
import LocalStorage from './utils/LocalStorage';

function App() {

  const [ loggedIn, setLoggedIn ] = useState(false);

  useEffect(() => {
    if (LocalStorage.read("token")) {
      setLoggedIn(true);
    }
  }, []);

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
