import React, { useContext } from 'react'
import { assets } from '../assets/assets' // Import icons/images
import { NavLink } from 'react-router-dom' // Import NavLink for navigation with active link styling
import { ProfessorContext } from '../context/ProfessorContext' // import Professor context for token management
import { AdminContext } from '../context/AdminContext' // import Admin context for token management

const Sidebar = () => {

  // Get the professor and admin token from context to check if professor or admin are logged in
  const { dToken } = useContext(ProfessorContext)
  const { aToken } = useContext(AdminContext)

  return (
    // Sidebar container with a white background and right border
    <div className='h-[150vh] bg-[#262626] border-r'>
      
      {/* Render Admin Sidebar menu if admin is logged in (aToken exists) */}
      {aToken && <ul className='text-white mt-5'>
        
        {/* Admin Dashboard link */}
        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72
         cursor-pointer ${isActive ? 'bg-primary border-r-4 border-primary' : 'hover:bg-[#151515]'}`}>
          <img className='min-w-5 invert' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>

        {/* Admin - View All Booked Meetings */}
        <NavLink to={'/all-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 
        cursor-pointer ${isActive ? 'bg-primary border-r-4 border-primary' : 'hover:bg-[#151515] '}`}>
          <img className='min-w-5 invert' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Booked Meetings</p>
        </NavLink>

        {/* Admin - Add a New Professor */}
        <NavLink to={'/add-professor'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 
        cursor-pointer ${isActive ? 'bg-primary border-r-4 border-primary' : 'hover:bg-[#151515]'}`}>
          <img className='min-w-5 invert' src={assets.add_icon} alt='' />
          <p className='hidden md:block'>Add Professor</p>
        </NavLink>

        {/* Admin - View Professor List */}
        <NavLink to={'/professor-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 
        cursor-pointer ${isActive ? 'bg-primary border-r-4 border-primary' : 'hover:bg-[#151515] '}`}>
          <img className='min-w-5 invert' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Professor List</p>
        </NavLink>
      </ul>}

      {/* Render Professor Sidebar menu if professor is logged in (dToken exists) */}
      {dToken && <ul className='text-white mt-5'>

        {/* Professor Dashboard link */}
        <NavLink to={'/professor-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 
        cursor-pointer ${isActive ? 'bg-primary border-r-4 border-primary' : 'hover:bg-[#151515] '}`}>
          <img className='min-w-5 invert' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>

        {/* Professor - View Booked Meetings */}
        <NavLink to={'/professor-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 
        cursor-pointer ${isActive ? 'bg-primary border-r-4 border-primary' : 'hover:bg-[#151515] '}`}>
          <img className='min-w-5 invert' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Booked Meetings</p>
        </NavLink>

        {/* Professor - Profile link */}
        <NavLink to={'/professor-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 
        cursor-pointer ${isActive ? 'bg-primary border-r-4 border-primary' : 'hover:bg-[#151515] '}`}>
          <img className='min-w-5 invert' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Profile</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar