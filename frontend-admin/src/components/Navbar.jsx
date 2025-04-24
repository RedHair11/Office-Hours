import React, { useContext } from 'react'
import { assets } from '../assets/assets' // Import assets like images
import { ProfessorContext } from '../context/ProfessorContext' // Import Professor context for token management
import { AdminContext } from '../context/AdminContext' // Import Admin context for token management
import { NavLink, useNavigate } from 'react-router-dom'  // Import useNavigate to handle page navigation


const Navbar = () => {

  // Use ProfessorContext to get and set professor's token
  // Use AdminContext to get and set admin's token
  const { dToken, setDToken } = useContext(ProfessorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  // Initialize navigate function to redirect users
  const navigate = useNavigate()

  // Function to handle logout for both Professor and Admin
  const logout = () => {

    navigate('/') // Redirect user to the home page ("/")
    // If professor token exists, clear it and remove from local storage
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    // If admin token exists, clear it and remove from local storage
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    // Navbar container with styles for height, background color, padding, and border
    <div className='h-[100px] bg-primary flex justify-between items-center px-4 sm:px-10 py-3 border-b border-black '>
      {/* Left side of the Navbar */}
      <div className='flex items-center gap-2 text-xs'>
         {/* TAMIU logo - navigates to the home page when clicked */}
         <NavLink to='/'>
        <img className='w-36 sm:w-40 scale-[.50]' src={assets.TAMIU_logo} alt="" />
        </NavLink>
        {/* Display whether the user is Admin or Professor based on the token */}
        <p className='bg-secondary border px-2.5 py-0.5 rounded-full border-gray-500 text-white'>{aToken ? 'Admin' : 'Professor'}</p>
      </div>
      {/* Logout button - triggers logout function when clicked */}
      <button onClick={() => logout()} className='bg-secondary text-white text-lg px-10 py-2 rounded-md hover:bg-[#9e8a56]'>Logout</button>
    </div>
  )
}

export default Navbar