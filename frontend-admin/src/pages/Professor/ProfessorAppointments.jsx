import React from 'react'
import { useContext, useEffect } from 'react'
import { ProfessorContext } from '../../context/ProfessorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const ProfessorAppointments = () => {

  // Get professor's appointments, functions to cancel or complete appointments, and the token to authenticate
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(ProfessorContext)
  // Get a function to format slot dates
  const { slotDateFormat } = useContext(AppContext)

  // Fetch appointments when the professor's token is available
  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5 '>

      {/* Heading of the page */}
      <p className='mb-3 text-lg font-medium'>All Meetings</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>

        {/* Header row for appointment list (hidden on small screens) */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-x-4 gap-2 py-3 px-6 border-b font-semibold'>
          <p>#</p>
          <p>Student</p>
          <p>Student ID</p> {/* <-- ADDED Student ID Header */}
          <p>Date & Time</p>
          <p>Action</p>
        </div>

         {/* Map through the appointments and display them */}
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] 
          gap-1 items-center text-gray-500 gap-x-4 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            
            {/* Display the appointment number (hidden on small screens) */}
            <p className='max-sm:hidden'>{index+1}</p>

            {/* Display student name and profile picture */}
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>

             {/* Display Student ID column */}
             <p className='max-sm:hidden'>{item.userData?.studentID || 'N/A'}</p> 

             {/* Display formatted date and time of the appointment */}
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

             {/* If the appointment is cancelled, a red "Cancelled" label is shown. 
              If the appointment is completed, a green "Completed" label is displayed. 
              If neither, the action buttons for canceling or completing the appointment are shown. 
              The cancel button triggers the cancelAppointment function when clicked, 
              while the complete button triggers the completeAppointment function when clicked. */}
            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium font-bold'>Cancelled</p>
              : item.isCompleted
                ? <p className='text-green-500 text-xs font-medium font-bold'>Completed</p>
                : <div className='flex w-20 gap-4'>
                  <img onClick={() => cancelAppointment(item._id)} className='w-7 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={() => completeAppointment(item._id)} className='w-7 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfessorAppointments