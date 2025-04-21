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

    const formatDayName = (day) => day.charAt(0).toUpperCase() + day.slice(1)

    const formatTimeTo12Hour = (time24) => {
        if (!time24 || !time24.includes(':')) return time24
        const [h, m] = time24.split(':')
        let hr = parseInt(h)
        const ampm = hr >= 12 ? 'PM' : 'AM'
        hr = hr % 12 || 12
        return `${hr}:${m} ${ampm}`
    }

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

                    {/* Office Hours */}
                    <div className='mt-5'>
                        <p className='text-sm font-semibold text-gray-700 mb-2'>Office Hours:</p>
                        <div className='space-y-2'>
                            {daysOfWeek.map(day => {
                                const hours = currentOfficeHours[day] || {}
                                const startVal = hours.start || ''
                                const endVal = hours.end || ''
                                const dispStart = hours.start ? formatTimeTo12Hour(hours.start) : null
                                const dispEnd = hours.end ? formatTimeTo12Hour(hours.end) : null

                                return (
                                    <div key={day} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                        <span className='w-24 font-medium text-gray-700 text-sm'>{formatDayName(day)}:</span>
                                        {
                                            isEdit
                                                ? (
                                                    <div className='flex items-center gap-2 mt-1 sm:mt-0'>
                                                        <input
                                                            type="time"
                                                            className="border border-gray-300 rounded px-2 py-1 text-sm w-28"
                                                            value={startVal}
                                                            onChange={(e) => handleOfficeHoursChange(day, 'start', e.target.value)}
                                                        />
                                                        <span className="text-gray-500">-</span>
                                                        <input
                                                            type="time"
                                                            className="border border-gray-300 rounded px-2 py-1 text-sm w-28"
                                                            value={endVal}
                                                            onChange={(e) => handleOfficeHoursChange(day, 'end', e.target.value)}
                                                        />
                                                    </div>
                                                )
                                                : (
                                                    <span className='text-sm text-gray-600 mt-1 sm:mt-0'>
                                                        {dispStart && dispEnd
                                                            ? `${dispStart} - ${dispEnd}`
                                                            : <span className="text-gray-400 italic">Not set</span>
                                                        }
                                                    </span>
                                                )
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>

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
                            checked={profileData.available}
                        />
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
