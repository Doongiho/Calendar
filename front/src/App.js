import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import MyCalendar from './pages/Main/MyCalendar';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/MyCalendar/:userId" element={<MyCalendar />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;