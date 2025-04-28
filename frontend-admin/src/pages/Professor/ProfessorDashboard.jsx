import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { ProfessorContext } from '../../context/ProfessorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const ProfessorDashboard = () => {
  
  // Destructuring required values and functions from the context
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(ProfessorContext)
  const { slotDateFormat, formatTimeTo12Hour } = useContext(AppContext)

  // Fetch dashboard data if professor token is present
  useEffect(() => {
    if (dToken) {
      getDashData()
    }

  }, [dToken])

  // Render the dashboard if dashData is available
  return dashData && (
    <div className='m-5'>

      {/* Dashboard summary section showing total appointments and students */}
      <div className='flex flex-wrap gap-3'>

        {/* Total appointments section */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Booked Meetings</p>
          </div>
        </div>

         {/* Total students section */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.students_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.students}</p>
            <p className='text-gray-400'>Students</p></div>
        </div>
      </div>

       {/* Latest meetings section */}
      <div className='bg-white'>

         {/* Header for latest meetings */}
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Meetings</p>
        </div>

         {/* List of the latest appointments */}
        <div className='pt-4 border border-t-0'>

            {/* 
              Loops through the latest 5 appointments from the `dashData.latestAppointments` array.
              It renders the details of each appointment such as the student's name, profile image, and the booking date.
              The `slice(0, 5)` ensures that only the latest 5 appointments are shown on the dashboard.
            */}
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>

              {/* Student profile image and name */}
              <img className='rounded-full w-10' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                <p className='text-gray-600'> Meeting at {slotDateFormat(item.slotDate)}, {formatTimeTo12Hour(item.slotTime)}</p>

              </div>

             {/* If the appointment is cancelled, a red "Cancelled" label is shown. 
              If the appointment is completed, a green "Completed" label is displayed. 
              If neither, the action buttons for canceling or completing the appointment are shown. 
              The cancel button triggers the cancelAppointment function when clicked, 
              while the complete button triggers the completeAppointment function when clicked. */}
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium font-bold'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium font-bold'>Completed</p>
                  : <div className='flex gap-x-2'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-7 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-7 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfessorDashboard