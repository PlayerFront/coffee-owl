import React, { useEffect, useState } from 'react';
import './App.css';
import Start from './pages/Start/Start';
import Login from './pages/Login/Login';
import RegisterStep1 from './pages/Register/RegisterStep1';
// import testApi from './api/testApi';

function App() {
  // useEffect(() => {
  //   testApi();
  // }, []);

  const [currentPage, setCurrentPage] = useState('start');

  const renderPage = () => {
    switch(currentPage) {
      case 'start':
        return <Start onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterStep1 
          onNavigate={setCurrentPage} 
          onPhoneSubmit={(phone) => {
            console.log("Телефон для подтверждения:", phone);
            // TODO: создать страницу PhoneCode для подтверждения кода телефона setCurrentPage('phone-code')
            alert(`Код отправлке на ${phone}. Нужна страница ввода кода`)
          }} 
          />;
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
