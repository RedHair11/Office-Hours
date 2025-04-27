import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Appointment.css'; 

//  Helper Functions
const formatDayName = (day) => day.charAt(0).toUpperCase() + day.slice(1);

const formatTimeTo12Hour = (time24) => {
    if (!time24 || !time24.includes(':')) return time24;
    const [hours24, minutes] = time24.split(':');
    let hours = parseInt(hours24, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${hours}:${minutes} ${ampm}`;
};

const dayIndexToKey = { 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday' };
const officeHoursDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const Appointment = () => {
    const { profId } = useParams();
    const { professors, backendUrl, token, getProfessorsData } = useContext(AppContext);
    const navigate = useNavigate();

    // --- State ---
    const [profInfo, setProfInfo] = useState(null);
    const [isLoadingProfInfo, setIsLoadingProfInfo] = useState(true);
    const [profError, setProfError] = useState(null); // State to store errors fetching prof info

    const [selectedDate, setSelectedDate] = useState(new Date()); // Calendar selection
    const [dailySlots, setDailySlots] = useState([]); // Slots for the selected date
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [selectedTime, setSelectedTime] = useState(''); // e.g., "10:30 AM" (display value)

    // Memoize availableDates calculation to prevent re-running on every render
    const availableDates = useMemo(() => {
        // If no professor info or no office hours are provided, return an empty Set
        if (!profInfo || !profInfo.officeHours) {
            return new Set(); 
        }

        const potentiallyAvailable = new Set(); // Initialize a Set to store available dates
        const today = new Date(); // Get today's date
        today.setHours(0, 0, 0, 0); // Reset time to midnight for consistency

        // Loop through the next 60 days starting from today
        for (let i = 0; i < 60; i++) { 
            let checkDate = new Date(today); // Create a copy of today's date
            checkDate.setDate(today.getDate() + i); // Move forward by i days
            const dayOfWeekIndex = checkDate.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)

            // Only consider weekdays (Monday to Friday)
            if (dayOfWeekIndex >= 1 && dayOfWeekIndex <= 5) { 
                // Map day index to the key used in officeHours (e.g., 'monday', 'tuesday')
                const officeHoursKey = dayIndexToKey[dayOfWeekIndex];
                // Check if office hours for that day have both a start and end time
                if (profInfo.officeHours[officeHoursKey]?.start && profInfo.officeHours[officeHoursKey]?.end) {
                    potentiallyAvailable.add(checkDate.toDateString()); // Add the date (as a string) to the Set
                }
            }
        }
        return potentiallyAvailable; // Return the Set of available dates
    }, [profInfo]); // Only recalculate when profInfo changes

    // --- Effects ---

    // Effect 1: Fetch Professor Info
    useEffect(() => {
        setIsLoadingProfInfo(true);  // Start loading state
        setProfError(null); // Reset any previous error when starting a new fetch attempt

        if (professors.length > 0 && profId) {
            // If the list of professors is available and there's a profId to search
            const foundProf = professors.find((prof) => prof._id === profId); // Try to find the professor by ID
            
            if (foundProf) {
                console.log("Found professor:", foundProf.name); // Log the found professor's name
                setProfInfo(foundProf);  // Save the found professor info to state
            } else {
                console.error("Professor not found with ID:", profId); // Log an error if no match
                setProfError("Professor not found."); // Set an error message
                setProfInfo(null); // Clear stale info if not found
            }
            setIsLoadingProfInfo(false);// Stop loading after search is complete
        } else if (professors.length === 0) {
            console.log("Professor list is empty.");
            // If no professors are available yet (maybe fetching separately), just stop loading
             setIsLoadingProfInfo(false); // Stop loading if list is confirmed empty and won't be fetched here
        }
    }, [professors, profId]); // Depend on changes to professors or profId

          
    // Effect 2: Get Slots for the Selected Date (using useCallback)
    const getSlotsForDate = useCallback(async (dateToFetch) => {
        // Pre-checks to avoid unnecessary processing
        if (!profInfo || !profInfo.officeHours) {
            console.log("Cannot fetch slots: profInfo or officeHours missing.");
            setDailySlots([]);
            setIsLoadingSlots(false);
            return;
        }

        const dateStr = dateToFetch.toDateString(); // Human-readable date string
        console.log(`Callback: Fetching slots for: ${dateStr}`); // Debugging log
        setIsLoadingSlots(true); // Start loading
        setDailySlots([]); // Reset previous slots
        setSelectedTime(''); // Reset selected time

        const selectedDayStart = new Date(dateToFetch);
        selectedDayStart.setHours(0, 0, 0, 0); // Normalize to start of day
        const dayOfWeekIndex = selectedDayStart.getDay(); // 0 = Sunday, 6 = Saturday

        // Skip weekends or days without general office hours definition 
        if (dayOfWeekIndex === 0 || dayOfWeekIndex === 6) { setIsLoadingSlots(false); return; }
        const officeHoursKey = dayIndexToKey[dayOfWeekIndex]; // Map day index to office hours key
        const dailyOfficeHours = profInfo.officeHours[officeHoursKey];
        if (!dailyOfficeHours?.start || !dailyOfficeHours?.end) { setIsLoadingSlots(false); return; }

        // Parse Office Hours safely 
        const [startHour, startMinute] = dailyOfficeHours.start.split(':').map(Number);
        const [endHour, endMinute] = dailyOfficeHours.end.split(':').map(Number);
        // Validate parsed times
        if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) { setIsLoadingSlots(false); return; }

        // --- Generate Slots ---
        try {
            // Set up loop start and end times
            let loopStartTime = new Date(selectedDayStart);
            loopStartTime.setHours(startHour, startMinute, 0, 0);

            let loopEndTime = new Date(selectedDayStart);
            loopEndTime.setHours(endHour, endMinute, 0, 0);

            const now = new Date(); // Get current time 
            const isToday = selectedDayStart.toDateString() === now.toDateString(); // Check if the selected date is today

            // If today, adjust starting time to prevent past slot generation
            if (isToday && loopStartTime < now) {
                // Start from rounded-up current time
                loopStartTime = new Date(now);
                const currentMinutes = loopStartTime.getMinutes();
                if (currentMinutes === 0) { loopStartTime.setSeconds(0,0); }
                else if (currentMinutes <= 30) { loopStartTime.setMinutes(30, 0, 0); }
                else { loopStartTime.setHours(loopStartTime.getHours() + 1, 0, 0, 0); }
            }


            const timeSlotsResult = []; // Array to hold generated slots
            const bookedSlotMap = profInfo.slots_booked || {}; // Look up already booked slots

            // --- Time Slot Loop ---
            let currentSlotTime = new Date(loopStartTime); // Initialize before loop

            while (currentSlotTime < loopEndTime) {
                const slotTimeValue = currentSlotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const displayTime = currentSlotTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                const slotDateKey = `${currentSlotTime.getDate()}_${currentSlotTime.getMonth() + 1}_${currentSlotTime.getFullYear()}`;

                // Check if booked
                const bookedTimesForDate = bookedSlotMap[slotDateKey] ?? [];
                const isBooked = bookedTimesForDate.includes(slotTimeValue);

                // Check if slot has already passed (only if today)
                // Compare end of the slot (e.g., 10:00 slot is past at 10:30)
                let slotEndTime = new Date(currentSlotTime);
                slotEndTime.setMinutes(slotEndTime.getMinutes() + 30); // Calculate the end time of this slot
                const isPast = isToday && slotEndTime <= now; // Is the slot's end time before or equal to now?

                // Determine availability
                const isAvailable = !isBooked && !isPast;

                timeSlotsResult.push({
                    datetime: new Date(currentSlotTime), // Store the start time
                    time: displayTime,
                    value: slotTimeValue,
                    isAvailable: isAvailable // Add the flag
                });

                // Increment for the next slot's start time
                currentSlotTime.setMinutes(currentSlotTime.getMinutes() + 30); // Move to the next slot
            }
            // --- End of Loop ---

            console.log(`Generated ${timeSlotsResult.length} potential slots for ${dateStr}`); // Debugging log
            setDailySlots(timeSlotsResult); // Save generated slots

        } catch (error) {
            console.error("Error generating time slots:", error); // Log unexpected errors
            toast.error("Could not generate time slots for this date."); // User facing error
            setDailySlots([]);
        } finally {
            setIsLoadingSlots(false); // Stop loading no matter what
            console.log("Finished fetching/generating slots."); // Debugging log
        }

    }, [profInfo]); // Dependency remains profInfo

    // Effect 3: Trigger Slot Fetch when Date or Professor changes
    useEffect(() => {
        // Only fetch slots if both a professor is selected and a date is selected
        if (profInfo && selectedDate) {
            getSlotsForDate(selectedDate); // Call the memoized function to fetch available slots
        } else {
             setDailySlots([]); // Clear slots if profInfo becomes null
        }

    }, [selectedDate, profInfo, getSlotsForDate]);

    // --- Booking Handler ---
    const bookAppointment = async () => {
        // Client-side validations
        if (!token) {
            toast.warning('Please login to book an appointment.');
            navigate('/login');
            return;
        }
        if (!selectedTime) {
            toast.warning('Please select a time slot.');
            return;
        }
        if (!selectedDate || !profInfo || !dailySlots.length) {
            toast.error('Cannot book: Missing required information (date, professor, or slots). Please refresh.');
            return;
        }

        // Find the slot object matching the selected display time
        const selectedSlotObject = dailySlots.find(slot => slot.time === selectedTime);
        if (!selectedSlotObject) {
            toast.error('Selected time slot is invalid or no longer available. Please re-select.');
            // Optionally refresh slots here if needed
             getSlotsForDate(selectedDate);
            return;
        }
        const slotTimeValue = selectedSlotObject.value; // The 24hr format time

        // Format the selected date for backend (format: day_month_year)
        const slotDate = `${selectedDate.getDate()}_${selectedDate.getMonth() + 1}_${selectedDate.getFullYear()}`;

        try {
            const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`,
                { profId, slotDate, slotTime: slotTimeValue },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message || 'Appointment booked successfully!');
                await getProfessorsData(); // Refresh context data
                // Navigate AFTER data refresh is likely complete, or handle state update locally
                navigate('/my-appointments');
            } else {
                // Backend indicated failure (e.g., slot taken just now)
                toast.error(data.message || 'Failed to book appointment. The slot might have been taken.');
                // Refresh slots for the current date to show updated availability
                getSlotsForDate(selectedDate);
            }
        } catch (error) {
            console.error("Booking API error:", error);
            const errorMsg = error.response?.data?.message || error.message || 'An error occurred during booking.';
            toast.error(errorMsg);
            // Refresh slots on error too, maybe the state is out of sync
            getSlotsForDate(selectedDate);
        } 
    };

    // --- Calendar Tile Control ---
    const tileDisabled = useCallback(({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) return true; // Disable past dates

            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) return true; // Disable weekends

             // Check if office hours are generally defined for this day of the week
             if (profInfo?.officeHours) {
                 const officeHoursKey = dayIndexToKey[dayOfWeek];
                 const dailyHours = profInfo.officeHours[officeHoursKey];
                  // Disable if no start/end defined for this weekday *at all*
                 if (!dailyHours?.start || !dailyHours?.end) {
                     return true;
                 }
             } else if (!isLoadingProfInfo && !profError) {
                 // If profInfo is loaded, no error, but no officeHours object, disable weekdays too
                 return true;
             }
        }
        return false;
    }, [profInfo, isLoadingProfInfo, profError]); // Dependencies for disabling logic

    // Highlight dates with available slots
    const tileClassName = useCallback(({ date, view }) => {
        if (view === 'month') {
             // Use the memoized 'availableDates' Set for highlighting
            if (availableDates.has(date.toDateString())) {
                return 'react-calendar__tile--hasSlots'; // Add a custom CSS class
            }
        }
        return null;
    }, [availableDates]); 

    // --- Render Logic ---
    // Loading state while fetching professor info
    if (isLoadingProfInfo) {
        return <div className='flex justify-center items-center min-h-[60vh]'><p>Loading professor details...</p></div>;
    }

    // Display error if fetching professor info failed
    if (profError) {
        return <div className='text-center my-10 text-red-600 font-semibold'>{profError}</div>;
    }

    // Display fallback if professor info isn't available
    if (!profInfo) {
        // This case should ideally be covered by profError, but as a fallback
        return <div className='text-center my-10 text-gray-600'>Professor information not available.</div>;
    }

    // Main component render
    return (
        <div className='mx-auto max-w-7xl px-4 py-1'>

            {/* Professor Details Section (Keep as is) */}
            <div className='flex flex-col sm:flex-row gap-4 mb-8'>
                 {/* Image */}
                <div className='flex-shrink-0 mx-auto sm:mx-0'>
                    <img className='bg-primary w-48 h-48 sm:w-60 sm:h-60 object-cover rounded-lg shadow-md' src={profInfo.image || assets.profile_icon} alt={profInfo.name} />
                </div>
                 {/* Info Box */}
                <div className='flex-1 border border-gray-300 rounded-lg p-6 bg-white shadow-sm'>
                    {/* ... (name, department, email - keep as is) ... */}
                     <p className='text-2xl sm:text-3xl font-semibold text-gray-800 mb-2'>{profInfo.name}</p>
                    <div className='space-y-1 mb-4'>
                        <p className='text-gray-600'>
                            Department: <span className='text-blue-600 font-medium'>{profInfo.department}</span>
                        </p>
                        <p className='text-gray-600'>
                            Email: <span className='text-blue-600 font-medium'>{profInfo.email}</span>
                        </p>
                    </div>

                    {/* Office Hours Display */}
                    {profInfo.officeHours ? (
                         <div className='mb-4 border-t pt-4'>
                             <p className='text-sm font-semibold text-gray-700 mb-2'>Office Hours:</p>
                             <div className='text-xs sm:text-sm text-gray-600 space-y-1'>
                                 {officeHoursDays.map((day) => {
                                     const hours = profInfo.officeHours[day];
                                     const hasHours = hours?.start && hours?.end;
                                     return (
                                         <div key={day} className="flex">
                                             <span className='font-medium w-20 inline-block'>{formatDayName(day)}:</span>
                                             <span>
                                                 {hasHours
                                                     ? `${formatTimeTo12Hour(hours.start)} - ${formatTimeTo12Hour(hours.end)}`
                                                     : <span className="text-gray-400 italic">Not scheduled</span>
                                                 }
                                             </span>
                                         </div>
                                     );
                                 })}
                             </div>
                         </div>
                     ) : (
                        <div className='mb-4 border-t pt-4'>
                             <p className='text-sm font-semibold text-gray-700 mb-2'>Office Hours:</p>
                             <p className='text-sm text-gray-500 italic'>Office hours not set.</p>
                         </div>
                     )}

                    {/* About */}
                    {profInfo.about && (
                        <div className='border-t pt-4'>
                            <p className='text-sm font-semibold text-gray-700 mb-1'>About</p>
                            <p className='text-sm text-gray-600 leading-relaxed'>{profInfo.about}</p>
                        </div>
                    )}
                </div>
            </div>


            {/* Booking Section */}
            <div className='mt-8 p-6 border border-gray-300 rounded-lg bg-white shadow-sm'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Select Time & Date</h2>

                        {/* --- FLEX CONTAINER --- */}
                        <div className="md:flex md:gap-6 lg:gap-8">

            {/* Calendar Column (Flex Item 1) */}
            <div className="flex justify-center md:justify-start md:basis-3/5 flex-shrink-0 mb-6 md:mb-0">
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    tileDisabled={tileDisabled}
                    tileClassName={tileClassName}
                    className="shadow"
                />
            </div>

            {/* Time Slots Column (Flex Item 2) */}
            <div className='md:basis-2/5 min-h-[6rem] mt-6 md:mt-0'>
                <h3 className='text-lg font-medium text-gray-700 mb-3'>
                    Slots for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}:
                </h3>

                {isLoadingSlots ? (
                    <div className="flex justify-center items-center h-full pt-5">
                        <p className='text-gray-500 animate-pulse'>Loading slots...</p>
                    </div>
                ) : dailySlots.length > 0 ? (
                    <div className='flex flex-wrap gap-3'>
                        {dailySlots.map((item) => (
                            <div key={item.value} className="time-slot-item"> {/* Ensure time-slot-item class still adjusts button widths appropriately WITHIN this column */}
                                <button
                                    onClick={() => { if (item.isAvailable) setSelectedTime(item.time); }}
                                    disabled={!item.isAvailable || isLoadingSlots}
                                    className={`w-full text-sm font-medium px-4 py-2 rounded-md border transition-colors duration-150 ease-in-out ${
                                        item.isAvailable
                                        ? (item.time === selectedTime
                                            ? 'bg-primary text-white border-primary ring-2 ring-primary/50 cursor-pointer shadow-md'
                                            : 'text-primary border-primary bg-white hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer')
                                        : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                                    }`}
                                    aria-disabled={!item.isAvailable}
                                    aria-label={`Time slot ${item.time} ${item.isAvailable ? '(Available)' : '(Unavailable)'}`}
                                >
                                    {item.time}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                        <p className='text-gray-500 italic pt-2'>
                        {"No office hours slots available for this date."}
                        </p>
                )}
            </div> {/* End Time Slots Column */}

            </div> {/* --- END FLEX CONTAINER --- */}

                {/* Book Appointment Button (Remains below the flex container) */}
                {dailySlots.some(slot => slot.isAvailable) && ( // Only show if *any* slot is available
                     <div className="mt-8 flex justify-center">
                         <button
                             onClick={bookAppointment}
                             disabled={!selectedTime || isLoadingSlots}
                             className={`bg-primary text-white text-lg font-light px-16 py-3 rounded-md hover:bg-[#4a1022] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                             aria-label="Book selected appointment time"
                         >
                             Book Meeting
                         </button>
                     </div>
                 )}

            </div> {/* End Booking Section */}
        </div> /* End Container */
    );
};

export default Appointment;