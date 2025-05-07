import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
<<<<<<< HEAD
import MyCalendar from './pages/Main/MyCalendar'
import { UserProvider } from "./contexts/UserContext";
import ScheduleForm from "./components/ScheduleForm/ScheduleForm"

=======
import MyCalendar from './pages/Main/MyCalendar';
import { UserProvider } from './contexts/UserContext';
import EditProfile from './pages/EditProfile/EditProfile';
>>>>>>> 51fe605e3d040a3edab423b0f8e340ea4b5383b3

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/MyCalendar/:userId" element={<MyCalendar />} />
<<<<<<< HEAD
          <Route path="/ScheduleForm" element={<ScheduleForm />} />
=======
          <Route path="/edit-profile" element={<EditProfile />} />
>>>>>>> 51fe605e3d040a3edab423b0f8e340ea4b5383b3
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
