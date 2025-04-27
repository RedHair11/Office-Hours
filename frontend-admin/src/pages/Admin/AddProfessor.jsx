import React, { useContext, useState } from 'react' 
import { assets } from '../../assets/assets' // for images
import { toast } from 'react-toastify' // for toast messages
import axios from 'axios' // for api calls
import { AdminContext } from '../../context/AdminContext' // for admin context
import { AppContext } from '../../context/AppContext' // for app context

const AddProfessor = () => {

    // Local state for form inputs and image upload
    const [profImg, setProfImg] = useState(false) // Holds the uploaded professor image file
    const [name, setName] = useState('')  // Professor's name
    const [email, setEmail] = useState('') // Professor's email
    const [password, setPassword] = useState('') // Professor's password
    const [about, setAbout] = useState('')  // Professor's bio/description
    const [department, setDepartment] = useState('Math') // Selected department

    // Access backend URL and admin token from context
    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    /**
     * Handles the form submission to add a new professor.
     * Validates input, prepares FormData including the image,
     * sends the POST request to the backend, and resets the form on success.
     */
    const onSubmitHandler = async (event) => {
        
        event.preventDefault() // Prevents the default form submission behavior

        try {
            // Prepare form data including image and text fields
            const formData = new FormData();

            // Conditionally append image only if selected
            if (profImg) {
                formData.append('image', profImg);
            }
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('about', about)
            formData.append('department', department)

            // console log formdata            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            // Send POST request to backend to add the new professor
            const { data } = await axios.post(backendUrl + '/api/admin/add-professor', formData, { headers: { aToken } })
            
            // if success, show success message and reset the form
            if (data.success) {
                toast.success(data.message)
                setProfImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAbout('')
            } else {
                // if error, show error message
                toast.error(data.message)
            }

        } catch (error) {
            // Notify if an exception occurs
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Professor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                
                {/* Image Upload Section */}
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="prof-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' 
                        src={profImg ? URL.createObjectURL(profImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setProfImg(e.target.files[0])} type="file" name="" id="prof-img" hidden />
                    <p>Upload Professor <br /> picture</p>
                </div>

                {/* Form Fields for Professor Details */}       
                <div className='flex flex-col gap-4 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        {/* Name Field */}
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Professor Name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                         {/* Email Field */}
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Professor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        {/* Password Field */}
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>
                    </div>

                    {/* Department Dropdown */}
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Department</p>
                            <select onChange={e => setDepartment(e.target.value)} value={department} className='border rounded px-2 py-2'>
                                <option value="Math">Math</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Business">Business</option>
                                <option value="Science">Science</option>
                                <option value="English">English</option>
                                <option value="Art">Art</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* About Section */}
                <div>
                    <p className='mt-4 mb-2'>About Professor</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' 
                    rows={5} placeholder='write about professor'></textarea>
                </div>
                
                {/* Submit Button */}
                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-md hover:bg-[#4a1022]'>Add Professor</button>
            </div>
        </form>
    )
}

export default AddProfessor