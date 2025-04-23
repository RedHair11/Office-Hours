import React, { useContext, useEffect, useState } from 'react'
import { ProfessorContext } from '../../context/ProfessorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'

const ProfessorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(ProfessorContext)
    const { backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

    const updateProfile = async () => {
        try {
            const formData = new FormData()
            formData.append('profId', profileData._id)
            formData.append('about', profileData.about)
            formData.append('available', profileData.available)
            formData.append('officeHours', JSON.stringify(profileData.officeHours))
            if (image) {
                formData.append('image', image)
            }

            const { data } = await axios.post(`${backendUrl}/api/professor/update-profile`, formData, {
                headers: { dToken }
            })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                setImage(false)
                await getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const handleOfficeHoursChange = (day, timeType, value) => {
        setProfileData(prev => ({
            ...prev,
            officeHours: {
                ...prev.officeHours,
                [day]: {
                    ...(prev.officeHours?.[day] || {}),
                    [timeType]: value || null
                }
            }
        }))
    }

    useEffect(() => {
        if (dToken) getProfileData()
    }, [dToken])

    const formatDayName = (day) =>{
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

    const currentOfficeHours = profileData?.officeHours || {}

    return profileData && (
        <div>
            <div className='flex flex-col gap-4 m-5'>

                {/* Editable Profile Picture */}
                <div>
                    {
                        isEdit ? (
                            <label htmlFor="image">
                                <div className="inline-block relative cursor-pointer hover:opacity-90 border border-gray-300 rounded-md">
                                    <img
                                        className='bg-primary/80 w-full sm:max-w-64 rounded-lg opacity-75'
                                        src={
                                            image
                                                ? URL.createObjectURL(image)
                                                : (profileData.image?.startsWith('http')
                                                    ? profileData.image
                                                    : `${backendUrl}/${profileData.image}`)
                                        }
                                        alt="Profile"
                                    />
                                    {!image && (
                                        <img
                                            className='w-10 absolute bottom-10 right-10'
                                            src={assets.upload_icon}
                                            alt="Upload icon"
                                        />
                                    )}
                                </div>
                                <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
                            </label>
                        ) : (
                            <img
                                className='bg-primary/80 w-full sm:max-w-64 rounded-lg'
                                src={
                                    profileData.image?.startsWith('http')
                                        ? profileData.image
                                        : `${backendUrl}/${profileData.image}`
                                }
                                alt="Profile"
                            />
                        )
                    }
                </div>

                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                    <p className='text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <hr className='bg-[#ADADAD] h-[1px] border-none' />
                    <p className='text-gray-600 underline mt-3'>PROFESSOR INFORMATION</p>

                    <div className='flex items-center gap-2 mt-3 text-gray-600'>
                        Department: <span className='text-blue-500'>{profileData.department}</span>
                    </div>
                    <p className='mt-1 text-gray-700'>
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

                    {/* About */}
                    <div>
                        <p className='text-sm font-medium text-[#262626] mt-3'>About :</p>
                        {
                            isEdit
                                ? <textarea
                                    onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                                    className='w-full outline-primary p-2'
                                    rows={8}
                                    value={profileData.about}
                                />
                                : <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
                        }
                    </div>

                    {/* Availability */}
                    <div className='flex gap-1 pt-2'>
                        <input
                            type="checkbox"
                            onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                            checked={profileData.available}/>
                        <label>Available</label>
                    </div>

                    {/* Action Button */}
                    {
                        isEdit
                            ? <button onClick={updateProfile}
                                className='bg-primary text-white px-4 py-1 border border-primary text-sm rounded-md mt-5 hover:bg-[#4a1022] transition-all'>
                                Save
                            </button>
                            : <button onClick={() => setIsEdit(true)}
                                className='bg-primary text-white px-4 py-1 border border-primary text-sm rounded-md mt-5 hover:bg-[#4a1022] transition-all'>
                                Edit
                            </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default ProfessorProfile
