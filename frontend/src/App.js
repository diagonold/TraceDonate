import React from 'react';
import './App.css';
import NavBar from './components/header/NavBar';
import Main from './pages/index';
import { useSelector } from 'react-redux';

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
