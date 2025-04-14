import React, { useContext, useEffect } from 'react' 
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  // Accessing states and functions from context
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)
  
  // Fetch dashboard data when token is available
  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  
  return dashData && (
    <div className='m-5'>

      {/* Top Statistics Cards */}
      <div className='flex flex-wrap gap-3'>
        
        {/* Professors Count */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer 
        hover:scale-105 transition-all'>
          <img className='w-14' src="" alt="" /> {/* CHANGE TO PROFESSOR ICON */}
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.professors}</p>
            <p className='text-gray-400'>Professors</p>
          </div>
        </div>

         {/* Appointments Count */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer 
        hover:scale-105 transition-all'>
          <img className='w-14' src="" alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Booked Meetings</p>
          </div>
        </div>

        {/* Students Count */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer 
        hover:scale-105 transition-all'>
          <img className='w-14' src="" alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.students}</p>
            <p className='text-gray-400'>Students</p></div>
        </div>
      </div>

      {/* Latest Meetings Section */}
      <div className='bg-white'>

        {/* Section Header */}
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src="" alt="" />
          <p className='font-semibold'>Latest Meetings</p>
        </div>

        {/* Latest 5 Appointments */}
        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>

               {/* Professor Avatar */}
              <img className='rounded-full w-10' src={item.profData.image} alt="" />

              {/* Appointment Info */}

              {/*The status of the appointment 
              is conditionally rendered: if the appointment is cancelled (item.cancelled), it shows "Cancelled" in red text;
               if it is completed (item.isCompleted), it shows "Completed" in green text. If neither of these conditions are met, 
               a cancel icon is displayed, which, when clicked, triggers the cancelAppointment function with the current 
               appointment's ID (item._id). */}

              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.profData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? <p className='text-red-400 text-xs font-medium font-bold'>Cancelled</p> : item.isCompleted ? 
              <p className='text-green-500 text-xs font-medium font-bold'>Completed</p> : 
              <img onClick={() => cancelAppointment(item._id)} className='w-7 cursor-pointer' src={assets.cancel_icon} alt="" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard