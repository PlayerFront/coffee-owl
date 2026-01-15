import React, { useState } from 'react';
import './App.css';
import Start from './pages/Start/Start';
import Login from './pages/Login/Login';
import RegisterStep1 from './pages/Register/RegisterStep1';

function App() {
  const [currentPage, setCurrentPage] = useState('start');

  const renderPage = () => {
    switch(currentPage) {
      case 'start':
        return <Start onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterStep1 onNavigate={setCurrentPage} />;
      default: 
        return <Start onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
