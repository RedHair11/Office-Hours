import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  // Hook for navigation between routes
  const navigate = useNavigate()

  // State to control the visibility of the mobile menu
  const [showMenu, setShowMenu] = useState(false)
  // Destructuring token, setToken, and userData from the app context
  const { token, setToken, userData } = useContext(AppContext)


  // Logout function to clear token, update context, and redirect to login
  const logout = () => {
    localStorage.removeItem('token')  // Remove token from local storage
    setToken(false)                   // Update context to remove token
    navigate('/login')                // Redirect to login page
  }

  return (

    // Navbar container with background color, spacing, and alignment
    <div className='h-[100px] bg-primary flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>

      {/* TAMIU Logo*/}
      <NavLink to='/'>
       <img className='scale-[.50] w-44' src={assets.TAMIU_logo} alt="" />
      </NavLink>
      {/* Navigation links - visible on medium screens and above */}
      <ul className='md:flex items-start gap-10 font-medium hidden'>

        {/* Home navigation link */}
        <NavLink to='/' >
          <li className='py-6 text-white text-lg bg-primary hover:bg-[#4e1224] transition-colors duration-300 px-10 
          rounded-md cursor-pointer'>HOME</li>
          <hr className='border-none outline-none h-2 bg-primary w-3/5 m-auto hidden' />
        </NavLink>

        {/* All Professors navigation link */}
        <NavLink to='/professors' >
          <li className='py-6 text-white text-lg bg-primary hover:bg-[#4e1224] transition-colors duration-300 px-10 
          rounded-md cursor-pointer'>PROFESSORS</li>
          <hr className='border-none outline-none h-2 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>


      {/* Right-side actions including user profile or login button */}
      <div className='flex items-center gap-4 '>
        {
          token && userData

            // If user is logged in, display profile image with dropdown menu
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              {/* User profile image */}
              <img className='w-12 rounded-full mr-4' src={userData.image} alt="" />
              {/* Dropdown icon */}
              <img className='w-2.5' src="" alt="" />

              {/* 
                Dropdown menu for user profile actions 
                - Initially hidden and only becomes visible when the user hovers over it
                - Contains three options:
                    1. "My Profile" - Navigates the user to their profile page when clicked
                    2. "Booked Meetings" - Redirects to the user's booked appointments page
                    3. "Logout" - Calls the logout function to clear session data and redirect to the login page
                    [#363636]
              */}
                  <div className='absolute top-0 right-0 pt-14 text-base font-small text-gray-600 z-20 hidden group-hover:block mr-4'>
                    <div className='min-w-48 bg-white rounded flex flex-col gap-4 p-4 text-black border-2 border-gray-400'>
                      <p onClick={() => navigate('/my-profile')} className='py-2 px-2 hover:bg-[#a9c2eb] cursor-pointer'>My Profile</p>
                      <p onClick={() => navigate('/my-appointments')} className='py-2 px-2 hover:bg-[#a9c2eb] cursor-pointer'>Booked Meetings</p>
                      <p onClick={logout} className='py-2 px-2 hover:bg-[#a9c2eb] cursor-pointer'>Logout</p>
                    </div>
                  </div>
              </div>

            // If user is not logged in, show "Create account" button
            : <button onClick={() => navigate('/login')} className='bg-secondary text-[15px] text-white px-8 py-3 rounded-md 
              font-light hidden md:block mr-4 hover:bg-[#968755]'>Create account</button>
        }

         {/* Menu icon for mobile view */}
        <img onClick={() => setShowMenu(true)} className='w-10 md:hidden' src={assets.menu_icon} alt="" />
      </div>
    </div>
  )
}

export default Navbar