import React, { useContext, useEffect, useState } from 'react'
import { ProfessorContext } from '../../context/ProfessorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const ProfessorProfile = () => {

    // Destructuring necessary values and functions from ProfessorContext
    // Destructuring the backendUrl from AppContext for API calls
    // State to toggle between edit and view modes for the profile
    const { dToken, profileData, setProfileData, getProfileData } = useContext(ProfessorContext)
    const { backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

     // Function to handle profile updates when the 'Save' button is clicked
    const updateProfile = async () => {

        try {
            // Prepare the updated profile data to be sent to the backend
            // Prepare the updated profile data, including office hours
            const updateData = {
                about: profileData.about,
                available: profileData.available,
                officeHours: profileData.officeHours // Include the officeHours object
            };

            // --- ADD THIS LOG ---
            console.log("Sending to backend:", JSON.stringify(updateData, null, 2));
            // --- END LOG ---

            // Sending the update request to the backend API
            const { data } = await axios.post(backendUrl + '/api/professor/update-profile', updateData, { headers: { dToken } })

            // If the update was successful, show a success toast and refresh profile data
            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                // If the update fails, show an error message using toast
                toast.error(data.message)
            }

            // Ensure that edit mode is turned off after trying to update
            setIsEdit(false)

        } catch (error) {
             // Handle any errors that occur during the update request
            toast.error(error.message)
            console.log(error)
        }

    }

    // Handler for changing office hours in the input fields
    const handleOfficeHoursChange = (day, timeType, value) => {
        setProfileData(prev => ({
            ...prev,
            officeHours: {
                ...prev.officeHours,
                [day]: {
                    // Ensure the day object exists
                    ...(prev.officeHours?.[day] || {}),
                    // Update start or end time
                    [timeType]: value || null // Set to null if value is empty (e.g., user clears input)
                }
            }
        }));
    };


    // useEffect hook to fetch the professor's profile data when the component mounts or when token changes
    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    // Helper to format day names for display
    const formatDayName = (day) => {
        return day.charAt(0).toUpperCase() + day.slice(1);
    };

    // Helper function to convert "HH:MM" (24-hour) to "h:mm AM/PM" (12-hour)
    const formatTimeTo12Hour = (time24) => {
        if (!time24 || !time24.includes(':')) {
            return time24; // Return original string if format is unexpected or null/empty
        }
        const [hours24, minutes] = time24.split(':');
        let hours = parseInt(hours24, 10);
        if (isNaN(hours) || isNaN(parseInt(minutes, 10))) {
             return time24; // Return original if parsing fails
        }

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 becomes 12)

        return `${hours}:${minutes} ${ampm}`;
    };
    // *** END OF HELPER FUNCTION ***

    // Use optional chaining and provide default empty object for safety
    const currentOfficeHours = profileData?.officeHours || {};

    return profileData && (
        <div>
            <div className='flex flex-col gap-4 m-5'>

                {/* Displaying the professor's profile picture */}
                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
                </div>

                 {/* Profile details container */}
                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                   {/* Professor's name, department & email */}
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700 '>{profileData.name}</p>
                    <hr className='bg-[#ADADAD] h-[1px] border-none' />
                    <p className='text-gray-600 underline mt-3'>PROFESSOR INFORMATION</p>

                    <div className='flex items-center gap-2 mt-3 text-gray-600'>
                        Department: <span className='text-blue-500'>{profileData.department}</span>              
                    </div>

                    <p className='flex items-center gap-2 mt-1 text-gray-700'>
                        Email: <span className='text-blue-500'>{profileData.email}</span>              
                    </p>

                     {/* --- Office Hours Section --- */}
                     <div className='mt-5'> {/* Increased margin */}
                        <p className='text-sm font-semibold text-gray-700 mb-2'>Office Hours:</p>
                        <div className='space-y-2'>
                            {daysOfWeek.map((day) => {
                                // Use the safer currentOfficeHours variable
                                const hours = currentOfficeHours[day];
                                // Values for input fields (need 24hr format "HH:MM" or empty string)
                                const startValue = hours?.start || '';
                                const endValue = hours?.end || '';
                                // Values for display (need 12hr format or "Not set")
                                const displayStart = hours?.start ? formatTimeTo12Hour(hours.start) : null;
                                const displayEnd = hours?.end ? formatTimeTo12Hour(hours.end) : null;

                                return (
                                    <div key={day} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                        <span className='w-24 font-medium text-gray-700 text-sm'>{formatDayName(day)}:</span>
                                        {isEdit ? (
                                            <div className='flex items-center gap-2 mt-1 sm:mt-0'>
                                                <input
                                                    type="time" // Input still expects "HH:MM"
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-28 focus:ring-primary focus:border-primary"
                                                    value={startValue} // Use 24hr value for input
                                                    onChange={(e) => handleOfficeHoursChange(day, 'start', e.target.value)}
                                                />
                                                <span className="text-gray-500">-</span>
                                                <input
                                                    type="time" // Input still expects "HH:MM"
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-28 focus:ring-primary focus:border-primary"
                                                    value={endValue} // Use 24hr value for input
                                                    onChange={(e) => handleOfficeHoursChange(day, 'end', e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            // *** UPDATED DISPLAY LOGIC ***
                                            <span className='text-sm text-gray-600 mt-1 sm:mt-0'>
                                                {displayStart && displayEnd
                                                    ? `${displayStart} - ${displayEnd}` // Use formatted 12hr times
                                                    : <span className="text-gray-400 italic">Not set</span>
                                                }
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* --- End Office Hours Section --- */}

                    {/* About section where the professor can add or edit their description */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About :</p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            
                            {/* If in edit mode, show a textarea for updating the about section */}
                            {
                                isEdit
                                    ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} 
                                    type='text' className='w-full outline-primary p-2' rows={8} value={profileData.about} />
                                    : profileData.about
                            }
                        </p>
                    </div>
                    
                    {/* Checkbox for toggling availability status */}
                    <div className='flex gap-1 pt-2'>
                        <input type="checkbox" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} 
                        checked={profileData.available} />
                        <label htmlFor="">Available</label>
                    </div>
                    
                    {/*
                        This section of the code renders either a "Save" or "Edit" button based on the `isEdit` state.
                        - If `isEdit` is true, the "Save" button is shown. This button allows the professor to save any changes made to their profile, 
                        - If `isEdit` is false, the "Edit" button is displayed. 
                    */}
                    {
                    isEdit
                        ? <button onClick={updateProfile} className='bg-primary text-white px-4 py-1 border border-primary text-sm 
                        rounded-md mt-5 hover:bg-[#4a1022] transition-all'>Save</button>
                        : <button onClick={() => setIsEdit(prev => !prev)} className='bg-primary text-white px-4 py-1 border border-primary 
                        text-sm rounded-md mt-5 hover:bg-[#4a1022] transition-all'>Edit</button>
                    }

                </div>
            </div>
        </div>
    )
}

export default ProfessorProfile