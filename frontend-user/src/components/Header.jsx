import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='flex bg-primary rounded-lg  px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        {/* <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 mx-20 shadow-md'> */}

            {/* --------- Header Left Section --------- */}
            <div className='flex flex-col items-start justify-centerpy-9 sm:py-10 md:py-24 md:pr-4 lg:py-24 lg:pl-5 m-auto'>
            {/* <div className='bg-slate-200 md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'> */}

                {/* Header text with responsive font size, white color, and bold weight */}
                
                <p className='flex-1 text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                    Book Meetings<br /> With Professors
                </p>

                {/* Button linking to the 'department' section */}
                <a href='#department' className='bg-secondary flex items-center gap-2 px-8 py-3 rounded-md text-white text-lg sm:text-base 
                md:m-0 hover:scale-105 transition-all duration-300 hover:bg-[#968755]'>
                    {/* Arrow icon next to the button text */}
                    Book now <img className='w-3' src={assets.arrow_icon} alt="" />
                </a>
            </div>

            {/* --------- Header Right Section --------- */}
            <div className='hidden md:block md:w-1/2 lg:w-[650px] relative flex justify-center items-center  py-9'>
                {/* Header image with responsive width, rounded corners, and maintaining aspect ratio */}
                <img className='rounded-md' src={assets.header2_img} alt="" style={{transform: 'scale(1.1)'}}/>
            </div>
        </div>
    )
}

export default Header