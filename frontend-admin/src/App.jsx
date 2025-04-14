import React, { useContext } from 'react'
import { ProfessorContext } from './context/ProfessorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddProfessor from './pages/Admin/AddProfessor';
import ProfessorsList from './pages/Admin/ProfessorsList';
import Login from './pages/Login';
import ProfessorAppointments from './pages/Professor/ProfessorAppointments';
import ProfessorDashboard from './pages/Professor/ProfessorDashboard';
import ProfessorProfile from './pages/Professor/ProfessorProfile';

const App = () => {

  // Context hooks to get the professor and admin authentication tokens
  const { dToken } = useContext(ProfessorContext)
  const { aToken } = useContext(AdminContext)

  // If either a professor or admin is logged in
  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>

      {/* Toast notifications container */}
      <ToastContainer />
        
      {/* Navbar visible to logged-in users */}
      <Navbar />
      <div className='flex items-start'>

        {/* Sidebar for navigation between different sections */}
        <Sidebar />

        {/* Define routes for different pages in the application */}
        <Routes>
          <Route path='/' element={<></>} />

          {/* Admin routes */}
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-professor' element={<AddProfessor />} />
          <Route path='/professor-list' element={<ProfessorsList />} />

           {/* Professor routes */}
          <Route path='/professor-dashboard' element={<ProfessorDashboard />} />
          <Route path='/professor-appointments' element={<ProfessorAppointments />} />
          <Route path='/professor-profile' element={<ProfessorProfile />} />
        </Routes>
      </div>
    </div>
  ) : ( // If no valid token exists, show the login page
    <>
      {/* Toast notifications container */}
      <ToastContainer />

      {/* Display the Login page if no token is present */}
      <Login />
    </>
  )
}

export default App