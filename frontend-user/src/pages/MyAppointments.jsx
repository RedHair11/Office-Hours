import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    // Access backend URL and authentication token from the context
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    // State to store the list of user appointments
    const [appointments, setAppointments] = useState([])

    // Array of month abbreviations for date formatting
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format date from "DD_MM_YYYY" to "DD Mon YYYY"
    const slotDateFormat = (slotDate) => {
        if (!slotDate || typeof slotDate !== 'string') { // Add basic check
            return 'Invalid Date';
        }
        const dateArray = slotDate.split('_'); // Split the date string
        if (dateArray.length !== 3) { // Ensure correct format
            return 'Invalid Date Format';
        }
        // Convert the 1-based month (MM) to a 0-based index for the array
        const monthIndex = Number(dateArray[1]) - 1;

        // Check if the calculated index is valid for the months array
        if (monthIndex >= 0 && monthIndex < months.length) {
            return dateArray[0] + " " + months[monthIndex] + " " + dateArray[2]; // Format the date
        } else {
            console.error("Invalid month index calculated:", monthIndex, "from slotDate:", slotDate);
            return 'Invalid Month'; // Indicate error
        }
    }
    // Add this function inside or outside the MyAppointments component definition
    const formatTimeTo12Hour = (time24) => {
        if (!time24 || !time24.includes(':')) return time24; // Handle potential null/invalid format
        const [hours24, minutes] = time24.split(':');
        let hours = parseInt(hours24, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return `${hours}:${minutes} ${ampm}`;
    };

    // Function to fetch the user's booked appointments from the backend
    const getUserAppointments = async () => {
        try {
            // Fetch appointment data from the API
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse()) // Reverse to show newest first

        } catch (error) {
            // Show error message if request fails
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel an appointment using the API
    const cancelAppointment = async (appointmentId) => {

        try {
            // Send cancellation request to the API
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            // If cancellation is successful
            if (data.success) { 
                toast.success(data.message) // Show success message
                getUserAppointments() // Refresh the appointments list
            } else {
                toast.error(data.message) 
            }

        } catch (error) {
            // Show error message if cancellation fails
            console.log(error)
            toast.error(error.message)
        }
    }

    // Fetch appointments when the component loads or when the token changes
    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className='mx-20'>
            {/* Section header */}
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>Booked meetings</p>
            
            <div className=''>
                {/* Loop through and display each appointment */}
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        
                        {/* Professor's image */}
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.profData.image} alt="" />
                        </div>

                        {/* Appointment details */}
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.profData.name}</p>
                            <p>Department: {item.profData.department}</p>
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span>
                            {slotDateFormat(item.slotDate)} | {formatTimeTo12Hour(item.slotTime)} {/* <-- Apply the function here */}
                            </p>

    
                        </div>
                        <div></div>

                        {/* Buttons for cancelling or showing meeting status */}
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            
                            {/* Show "Cancel meeting" button if the appointment is still active */}
                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} 
                            className='text-white sm:min-w-48 py-2 border rounded bg-red-700 hover:bg-red-900 transition-all
                             duration-300'>Cancel meeting</button>}

                            {/* Show "Meeting cancelled" if the appointment was cancelled */} 
                            {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded 
                            text-red-500'>Meeting cancelled</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments