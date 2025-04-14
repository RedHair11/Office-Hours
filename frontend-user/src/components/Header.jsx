import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 mx-20 shadow-md'>

            {/* --------- Header Left Section --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>

                {/* Header text with responsive font size, white color, and bold weight */}
                <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                    Book Meetings<br /> With Professors
                </p>

                {/* Button linking to the 'department' section */}
                <a href='#department' className='bg-secondary flex items-center gap-2 px-8 py-3 rounded-md text-white text-lg m-auto 
                md:m-0 hover:scale-105 transition-all duration-300 hover:bg-[#968755]'>
                    {/* Arrow icon next to the button text */}
                    Book now <img className='w-3' src={assets.arrow_icon} alt="" />
                </a>
            </div>

            {/* --------- Header Right Section --------- */}
            <div className='md:w-1/2 relative flex items-center justify-center'>
                {/* Header image with responsive width, rounded corners, and maintaining aspect ratio */}
                <img className='w-auto max-w-full h-auto scale-110 rounded-lg' src={assets.header2_img} alt="" />
            </div>
        </div>
    )
}

export default Header