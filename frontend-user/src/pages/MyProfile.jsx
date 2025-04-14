import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {

    // State to track if the user is editing their profile
    const [isEdit, setIsEdit] = useState(false)

    // State to store the selected profile image
    const [image, setImage] = useState(false)

    // Access global user data and functions from context
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    // Function to update user profile data using the API
    const updateUserProfileData = async () => {

        try {

            const formData = new FormData();

            // Append user details to the form data
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)

            // If a new image is selected, append it to the form data
            image && formData.append('image', image)

            // Send the update request to the backend
            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            // If successful
            if (data.success) {
                toast.success(data.message) // Show success message
                await loadUserProfileData() // Reload user profile data
                setIsEdit(false) // Exit edit mode
                setImage(false) // Reset image selection
            } else {
                toast.error(data.message) // Show error message
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message) // Show error message
        }

    }

    // Only render the component if user data is available
    return userData ? (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5 mx-20'>

            {/* Profile Image Upload Section */}   
            {isEdit
                ? <label htmlFor='image' >
                    <div className='inline-block relative cursor-pointer'>
                         {/* Display the selected image preview if an image is chosen, otherwise show the current profile image */}
                        <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                          {/* Show an upload icon if no new image is selected */}
                        <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
                    </div>
                    {/* Hidden file input that allows users to select a new profile image */}
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>

                /* If not in edit mode, simply display the user's current profile image */
                : <img className='w-36 rounded' src={userData.image} alt="" />
            }

            {/* If the user is in edit mode, show an input field to edit their name */}
            {isEdit
             // Update the user's name in the state when they type
                ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" onChange={(e) => 
                    setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                /* If not in edit mode, display the user's name as plain text */
                : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
            }

            {/* Horizontal line to visually separate sections */}
            <hr className='bg-[#ADADAD] h-[1px] border-none' />

            {/* Student Information Section */}
            <div>
                <p className='text-gray-600 underline mt-3'>STUDENT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    
                     {/* Student ID (cannot be edited) */}
                    <p className='font-medium'>Student ID:</p>
                    <p className='text-blue-500'>{userData.studentID}</p>

                     {/* Email (cannot be edited) */}
                    <p className='font-medium'>Email:</p>
                    <p className='text-blue-500'>{userData.email}</p>

                    {/* Phone Number Field */}
                    <p className='font-medium'>Phone:</p>

                    {/* If the user is in edit mode, show an input field to edit their phone number */}
                    {isEdit
                        // Update the user's phone number in the state as they type
                        ? <input className='bg-gray-50 max-w-52' type="text" onChange={(e) => 
                            setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                        /* If not in edit mode, display the phone number as plain text */    
                        : <p className='text-blue-500'>{userData.phone}</p>
                    }
                </div>
            </div>

            {/* Container for the action button, adding margin at the top for spacing */}
            <div className='mt-10'>
                {/* If the user is in edit mode, show a "Save information" button */}
                {isEdit
                    ? <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-md 
                    hover:bg-primary hover:text-white transition-all'>Save information</button>
                    /* If not in edit mode, show an "Edit" button to enable editing */
                    : <button onClick={() => setIsEdit(true)} className='bg-primary text-white border border-primary px-8 py-2 
                    rounded-md hover:bg-[#4a1022] transition-all'>Edit</button>
                }
            </div>
        </div>
    ) : null
}

export default MyProfile