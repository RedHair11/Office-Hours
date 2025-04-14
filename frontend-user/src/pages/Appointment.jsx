import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    // Extract the professor's ID from the URL params
    const { profId } = useParams()
    // Access the context (professors list, backend URL, authentication token, and data fetching functions)
    const { professors, backendUrl, token, getProfessorsData } = useContext(AppContext)

    // Days of the week for easy reference
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const officeHoursDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    // Map JS Date day index (0-6) to lowercase officeHours keys
    const dayIndexToKey = { 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday' };

    // State to hold the professor info, available time slots, selected slot index, and selected slot time
    const [profInfo, setProfInfo] = useState(false)
    const [profSlots, setProfSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Navigate function for routing
    const navigate = useNavigate()

    // Fetch professor info based on profId passed through URL
    const fetchProfInfo = async () => {
        const profInfo = professors.find((prof) => prof._id === profId)
        setProfInfo(profInfo)  // Set the fetched professor data
    }

    // *** MODIFIED FUNCTION: ***
    const getAvailableSolts = async () => {
        // Ensure professor info and office hours are loaded
        if (!profInfo || !profInfo.officeHours) {
            console.log("Professor info or office hours not available yet.");
            setProfSlots([]); // Clear slots if info is missing
            return;
        }

        console.log("Generating slots based on office hours:", profInfo.officeHours);
        setIsLoadingSlots(true); // Start loading indicator
        setProfSlots([]); // Reset slots before generating new ones
        const generatedSlots = []; // Use a temporary array to build slots
        let today = new Date();

        for (let i = 0; i < 7; i++) { // Look ahead 7 days
            let currentDate = new Date();
            currentDate.setDate(today.getDate() + i);
            currentDate.setHours(0, 0, 0, 0); // Normalize to start of the day

            const dayOfWeekIndex = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.

            // Skip weekends (Saturday=6, Sunday=0)
            if (dayOfWeekIndex === 0 || dayOfWeekIndex === 6) {
                continue;
            }

            // Get the office hours key ('monday', 'tuesday', etc.)
            const officeHoursKey = dayIndexToKey[dayOfWeekIndex];
            const dailyOfficeHours = profInfo.officeHours[officeHoursKey];

            // Check if office hours are defined for this day
            if (!dailyOfficeHours || !dailyOfficeHours.start || !dailyOfficeHours.end) {
                console.log(`No office hours set for ${officeHoursKey} (Date: ${currentDate.toDateString()})`);
                continue; // Skip this day if no start or end time is set
            }

            // --- Parse Office Hours Start/End Times ---
            const [startHour, startMinute] = dailyOfficeHours.start.split(':').map(Number);
            const [endHour, endMinute] = dailyOfficeHours.end.split(':').map(Number);

            if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
                console.error(`Invalid office hours format for ${officeHoursKey}: start=${dailyOfficeHours.start}, end=${dailyOfficeHours.end}`);
                continue; // Skip day if format is invalid
            }

            // --- Create Date objects for loop boundaries ---
            let loopStartTime = new Date(currentDate);
            loopStartTime.setHours(startHour, startMinute, 0, 0);

            let loopEndTime = new Date(currentDate);
            loopEndTime.setHours(endHour, endMinute, 0, 0);

             // --- Adjust Start Time if it's Today & Past Office Hours Start ---
             let now = new Date(); // Current time
             if (currentDate.toDateString() === now.toDateString()) { // Check if it's today
                 // If the designated loop start time is already past
                 if (loopStartTime < now) {
                     // Start from the current time instead
                     loopStartTime = new Date(now);
                     // Round up to the next 30-minute interval
                     const currentMinutes = loopStartTime.getMinutes();
                     if (currentMinutes > 0 && currentMinutes <= 30) {
                         loopStartTime.setMinutes(30, 0, 0);
                     } else if (currentMinutes > 30) {
                         loopStartTime.setHours(loopStartTime.getHours() + 1, 0, 0, 0);
                     } else {
                          loopStartTime.setMinutes(0,0,0); // Keep on the hour if already 00
                     }
                 }
             }

            // --- Generate Slots within Office Hours ---
            let timeSlots = [];
            // Ensure the adjusted loop start time is not already past the end time
            while (loopStartTime < loopEndTime) {
                 // Use 24hr format internally for consistency & booking
                let formattedTimeValue = loopStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                 // Use 12hr format for display
                let displayTime = loopStartTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

                let day = loopStartTime.getDate();
                let month = loopStartTime.getMonth() + 1; // Use 1-12 for backend consistency
                let year = loopStartTime.getFullYear();
                const slotDate = `${day}_${month}_${year}`; // Key for checking booked slots

                // Check if the slot is already booked
                 // Use optional chaining for safety
                const isBooked = profInfo.slots_booked?.[slotDate]?.includes(formattedTimeValue);

                if (!isBooked) {
                    timeSlots.push({
                        datetime: new Date(loopStartTime), // Store exact Date object
                        time: displayTime,              // 12hr display time (e.g., "10:30 AM")
                        value: formattedTimeValue       // 24hr value time (e.g., "10:30")
                    });
                }

                // Increment time by 30 minutes for the next slot
                loopStartTime.setMinutes(loopStartTime.getMinutes() + 30);
            }

            // Only add the day's slots if there are any available ones
            if (timeSlots.length > 0) {
                generatedSlots.push(timeSlots);
            } else {
                 console.log(`No available slots generated for ${officeHoursKey} (Date: ${currentDate.toDateString()}) after checking booked slots.`);
            }
        } // End of for loop (days)

        setProfSlots(generatedSlots); // Update state with all generated slots
        setIsLoadingSlots(false); // Stop loading indicator
        console.log("Generated ProfSlots:", generatedSlots);
         // Reset selection after slots reload
         setSlotIndex(0);
         setSlotTime('');
    };
    // *** END OF MODIFIED FUNCTION ***

    // Function to handle the appointment booking
    const bookAppointment = async () => {

        // Check if the user is logged in (has a token). If not, show a warning and redirect to login page.
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login') // Navigate to the login page
        }

        // Get the date of the selected slot from the available slots (profSlots) array
        const date = profSlots[slotIndex][0].datetime

        // Format the date to day, month, and year
        let day = date.getDate()
        // APPEARS AS ONE MONTH LATER ON THE FRONT END FOR SOME REASON
        //let month = date.getMonth() + 1 // months are 0-indexed, so adding 1 
        let month = date.getMonth()  // APPEARS CORRECTLY, BUT ONE MONTH EARLIER ON DATABASE
        let year = date.getFullYear()

        // Create a unique string representing the selected date (used for slot availability)
        const slotDate = day + "_" + month + "_" + year

        try {

            // Make a POST request to the backend to book the appointment, passing profId, slotDate, and slotTime
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', 
                { profId, slotDate, slotTime }, { headers: { token } })

            // If the booking was successful, show a success message, refresh the professor data, and navigate to 'my-appointments'
            if (data.success) {
                toast.success(data.message)
                getProfessorsData() // Refresh professors data after successful appointment booking
                navigate('/my-appointments') // Redirect to the user's appointments page
            } else {
                // If booking failed, show an error message
                toast.error(data.message)
            }

        } catch (error) {
            // Handle any errors that occurred during the API request
            console.log(error)
            toast.error(error.message)
        }

    }

    // useEffect to fetch professor details when professors list is available
    useEffect(() => {
        if (professors.length > 0) {
            fetchProfInfo() // Fetch professor info for the selected professor
        }
    }, [professors, profId])

    // useEffect to load available slots when professor info is available
    useEffect(() => {
        if (profInfo) {
            getAvailableSolts() // Fetch available slots for the selected professor
        }
    }, [profInfo])

    
     // Helper function to format day names
     const formatDayName = (day) => {
        return day.charAt(0).toUpperCase() + day.slice(1);
    };

    // Helper function to convert "HH:MM" (24-hour) to "h:mm AM/PM" (12-hour)
    const formatTimeTo12Hour = (time24) => {
        if (!time24 || !time24.includes(':')) {
            return time24; // Return original string if format is unexpected
        }
        // Split hours and minutes
        const [hours24, minutes] = time24.split(':');
        let hours = parseInt(hours24, 10);

        // Determine AM or PM
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hour to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 becomes 12)

        // Return formatted string (minutes already have leading zero if needed from original format)
        return `${hours}:${minutes} ${ampm}`;
    };


    // Render the appointment booking page if professor info is available
    return profInfo ? (
        <div className='mx-20'>

            {/* ---------- Professor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={profInfo.image} alt="" />
                </div>

                {/* Professor's name, department & email */}
                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profInfo.name}</p>
                    <div>
                        <p className='text-gray-600'>
                            Department: <span className='text-blue-500'>{profInfo.department}</span>
                        </p>
                        <p className='text-gray-600'>
                            Email: <span className='text-blue-500'>{profInfo.email}</span>
                        </p>
                    </div>

                        {/* Office Hours Display */}
                        {profInfo.officeHours && (
                         <div className='py-4 mb-4'>
                             <p className='text-sm font-semibold text-gray-700 mb-1'>Office Hours:</p>
                             <div className='text-xs sm:text-sm text-gray-600 space-y-1'>
                                 {officeHoursDays.map((day) => {
                                     const hours = profInfo.officeHours[day];
                                     // Check if both start and end times exist
                                     const hasHours = hours?.start && hours?.end;

                                     return (
                                         <p key={day}>
                                             <span className='font-medium w-20 inline-block'>{formatDayName(day)}:</span>
                                             {/* Apply the formatting function here */}
                                             {hasHours
                                                 ? `${formatTimeTo12Hour(hours.start)} - ${formatTimeTo12Hour(hours.end)}`
                                                 : <span className="text-gray-400 italic">Not scheduled</span>
                                             }
                                         </p>
                                     );
                                 })}
                             </div>
                         </div>
                     )}
                     {/* --- End Office Hours Display --- */}


                    {/* About section*/}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src="" alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profInfo.about}</p>
                    </div>
                </div>
            </div>
            
            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                <p>Available Booking Slots</p>

                {/* ----------- Days of the week and date selection ----------- */}
                {/* This section displays clickable days of the week and their corresponding dates */}
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {profSlots.length && profSlots.map((item, index) => (
                        <div
                            // On clicking a date, update the selected slot index
                            onClick={() => setSlotIndex(index)}
                            key={index}
                            className={`text-center py-6 min-w-16 rounded-md cursor-pointer ${slotIndex === index ? 
                            'bg-primary text-white' : 'border border-gray-400'}`}>

                            {/* Display day of the week (e.g., Monday, Tuesday) */}
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            {/* Display the day of the month (e.g., 1, 2, 3, etc.) */}
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                {/* ----------- Time slots display ----------- */}
                {/* This section displays the available time slots for the selected day */}
                <div className='flex flex-wrap gap-3 items-center w-full mt-4'>
                    {profSlots.length && profSlots[slotIndex].map((item, index) => (
                        <div key={index} className={`flex-shrink-0 w-1/5`}>
                            <p
                                // On clicking a time slot, update the selected time
                                onClick={() => setSlotTime(item.time)}
                                className={`text-sm font-light px-5 py-2 rounded-md cursor-pointer ${item.time === slotTime ? 
                                'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}>
                                {/* Display the time in lowercase (e.g., "10:00 am", "2:00 pm") */}
                                {item.time.toLowerCase()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ----------- Book Appointment Button ----------- */}
                {/* This button allows the user to confirm and book the appointment with the selected date and time */}
                <button onClick={bookAppointment} className='bg-primary text-white text-lg font-light px-20 
                py-3 rounded-md my-6 hover:bg-[#4a1022]'>
                    Book a meeting
                </button>
            </div>
        </div>
    ) : null
}

export default Appointment