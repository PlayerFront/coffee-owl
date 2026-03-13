import React, { useEffect, useState } from 'react';
import './App.css';
import Start from './pages/Start/Start';
import Login from './pages/Login/Login';
import RegisterStep1 from './pages/Register/RegisterStep1';
import PhoneCode from './pages/PhoneCode/PhoneCode';
import Catalog from './pages/Catalog/Catalog';
import { isUserAuthenticated, saveUserToStorage } from './utils/authStorage';
import { verifyCode, resendCode } from './api/authApi';
import Main from './pages/Main/Main';

function App() {
  const [currentPage, setCurrentPage] = useState('start');
  const [phoneForVerification, setPhoneForVerification] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isUserAuthenticated()) {
      setCurrentPage('main');
    }
  }, []);


  // TODO: функция нужна для выхода из профиля
  const handleLogout = () => {
    localStorage.removeItem('coffee-owl-user');
    setUser(null);
    setCurrentPage('start')
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('main');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'start':
        return <Start onNavigate={setCurrentPage} />;
      case 'login':
        return <Login
          onNavigate={setCurrentPage}
          onPhoneSubmit={(phone) => {
            setPhoneForVerification(phone);
            setCurrentPage('phone-code')
          }}
        />;
      case 'register':
        return <RegisterStep1
          onNavigate={setCurrentPage}
          onPhoneSubmit={(phone) => {
            console.log("Телефон для подтверждения:", phone); // отладка
            setPhoneForVerification(phone);
            setCurrentPage('phone-code')
          }}
        />;
      case 'phone-code':
        return <PhoneCode
          phone={phoneForVerification}
          onCodeSubmit={async (code) => {
            try {
              const result = await verifyCode(phoneForVerification, code);
              saveUserToStorage(result.user);
              setCurrentPage('main');
            } catch (error) {
              throw error;
            }
          }}
          onResendCode={() => resendCode(phoneForVerification)}
        />;
      case 'main':
        return <Main onLogout={handleLogout}/>
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
