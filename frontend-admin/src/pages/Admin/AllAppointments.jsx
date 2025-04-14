import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  // Pulling necessary states and functions from context
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  /**
   * useEffect to fetch all appointments when the component mounts
   * or when the admin token (aToken) becomes available
   */
  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5 '>
      <p className='mb-3 text-lg font-medium'>All Meetings</p>
      
      {/* Container for the appointments table */}
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        {/* Table Header - visible on larger screens */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col gap-x-4 py-3 px-6 border-b font-semibold'>
          <p>#</p>
          <p>Student</p>
          <p>Student ID</p>
          <p>Date & Time</p>
          <p>Professor</p>
          <p>Action</p>
        </div>

        {/* Map through appointments and render each */}
        {appointments.map((item, index) => (

          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] 
          items-center text-gray-500 py-3 gap-x-4 px-6 border-b hover:bg-gray-50' key={index}>
            
             {/* Serial Number - hidden on small screens */}
            <p className='max-sm:hidden'>{index+1}</p>

             {/* Student Info */}
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>

             {/* Display Student ID column */}
             <p className='max-sm:hidden'>{item.userData?.studentID || 'N/A'}</p> 

            {/* Date and Time of Appointment */}
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

            {/* Professor Info */}
            <div className='flex items-center gap-2'>
              <img src={item.profData.image} className='w-8 rounded-full bg-gray-200' alt="" /> <p>{item.profData.name}</p>
            </div>

            {/* Appointment Status or Action */}

            {/* if the appointment is cancelled (item.cancelled), it displays the text "Cancelled" in red; 
            if the appointment is completed (item.isCompleted), it displays "Completed" in green. 
            If neither of these conditions is met, it renders a cancel icon that the user can click to cancel the appointment. 
            The cancelAppointment function is triggered when the icon is clicked, and it passes the current 
            appointment's ID (item._id) to identify which appointment to cancel. */}

            {item.cancelled ? <p className='text-red-400 text-xs font-medium font-bold'>Cancelled</p> : item.isCompleted ? 
            <p className='text-green-500 text-xs font-medium font-bold'>Completed</p> : <img onClick={() => cancelAppointment(item._id)} 
            className='w-7 cursor-pointer' src={assets.cancel_icon} alt="" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments