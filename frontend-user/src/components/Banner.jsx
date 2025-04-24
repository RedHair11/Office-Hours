import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    // Initialize the navigate function to enable navigation to different routes
    const navigate = useNavigate()

    return (
        // Outer container for the banner with background color, padding, and rounded corners
        <div className='flex bg-primary rounded-lg  px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>

            {/* ------- Left Side (Text and Button) ------- */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    <p>New?</p>
                    <p className='mt-4'>Join Today</p>
                </div>

                {/* Button that navigates the user to the login page when clicked */}
                {/* Also scrolls the page to the top on navigation */}
                <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='bg-secondary text-lg sm:text-base 
                text-white px-8 py-3 rounded-md mt-6 hover:scale-105 transition-all hover:bg-[#968755]'>Create account</button>
            </div>

            {/* ------- Right Side (Image) ------- */}
            {/* This section is hidden on smaller screens and only appears on medium devices and above */}
            <div className='bg-slate-200 hidden md:block md:w-1/2 lg:w-[450px] relative flex justify-center items-center  py-9'>
                <img className='rounded-md' src={assets.student_group} alt="" style={{ transform: 'scale(1.1)' }}/>
            </div>
        </div>
    )
}

export default Banner