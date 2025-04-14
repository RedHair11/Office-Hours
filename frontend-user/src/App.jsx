import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Professors from './pages/Professors'
import Login from './pages/Login'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>

      {/* ToastContainer is used to display notifications throughout the app */}
      <ToastContainer />

      {/* Navbar is displayed on all pages */}
      <Navbar />

      {/* Define routes for different pages */}
      <Routes>
        {/* Home page route */}
        <Route path='/' element={<Home />} />
        {/* Professors listing page (all departments) */}
        <Route path='/professors' element={<Professors />} />
        {/* Professors listing page filtered by department */}
        <Route path='/professors/:department' element={<Professors />} />
        {/* Login page */}
        <Route path='/login' element={<Login />} />
        {/* Appointment booking page for a specific professor */}
        <Route path='/appointment/:profId' element={<Appointment />} />
        {/* Page displaying user's booked appointments */}
        <Route path='/my-appointments' element={<MyAppointments />} />
        {/* User profile page */}
        <Route path='/my-profile' element={<MyProfile />} />
      </Routes>
    </div>
  )
}

export default App