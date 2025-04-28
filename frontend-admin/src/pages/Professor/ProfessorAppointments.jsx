import React, { useContext, useEffect, useState } from 'react'
import { ProfessorContext } from '../../context/ProfessorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './calendar.css'

const ProfessorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(ProfessorContext)
  const { slotDateFormat, formatTimeTo12Hour } = useContext(AppContext)

  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (dToken) getAppointments()
  }, [dToken])

  const getFilteredAppointments = () => {
    if (!selectedDate) return appointments;
  
    // Convert selected Date object to same format as stored slotDate (e.g., "25_3_2025")
    const selectedDay = selectedDate.getDate();
    const selectedMonth = selectedDate.getMonth() + 1; // 1-indexed
    const selectedYear = selectedDate.getFullYear();
    const formattedSelected = `${selectedDay}_${selectedMonth}_${selectedYear}`;
  
    return appointments.filter(app => app.slotDate === formattedSelected);
  };
  
  const hasAppointmentsOnDay = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}_${month}_${year}`;
  
    return appointments.some(app => app.slotDate === formattedDate);
  };
  
  

  const filteredAppointments = getFilteredAppointments()

  return (
    <div className='w-full max-w-7xl mx-auto flex gap-6 m-5'>

      {/* Calendar section */}
      <div className="pl-4">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={({ date, view }) => {
            if (view === 'month' && hasAppointmentsOnDay(date)) {
              return <div className="dot" />
            }
          }}
        />
        <button
          className="text-sm mt-2 text-blue-500 underline"
          onClick={() => setSelectedDate(null)}
        >
          Clear Selection
        </button>
      </div>

      {/* Appointments section */}
      <div className='flex-1'>

        <p className='mb-3 text-lg font-medium'>All Meetings</p>
        <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>

          {/* Header */}
          <div className='grid grid-cols-[0.3fr_1.7fr_1.3fr_2fr_1fr] gap-x-4 gap-2 py-3 px-6 border-b font-semibold'>
            <p>#</p>
            <p>Student</p>
            <p>Student ID</p>
            <p>Date & Time</p>
            <p>Action</p>
          </div>

          {/* Appointment Rows */}
          {filteredAppointments.map((item, index) => (
            <div key={index} className='grid grid-cols-[0.3fr_1.7fr_1.3fr_2fr_1fr] gap-1 items-center text-gray-500 gap-x-4 py-3 px-6 border-b hover:bg-gray-50'>
              <p>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} className='w-8 rounded-full' alt="" />
                <p>{item.userData.name}</p>
              </div>
              <p>{item.userData?.studentID || 'N/A'}</p>
              <p>{slotDateFormat(item.slotDate)}, {formatTimeTo12Hour(item.slotTime)}</p>
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium font-bold'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium font-bold'>Completed</p>
              ) : (
                <div className='flex w-20 gap-4'>
                  <img onClick={() => cancelAppointment(item._id)} className='w-7 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={() => completeAppointment(item._id)} className='w-7 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfessorAppointments
