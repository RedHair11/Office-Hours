import React from 'react'
import { departmentData } from '../assets/assets'
import { Link } from 'react-router-dom'

const DepartmentMenu = () => {
    return (
        // Main container with vertical layout, centered content, spacing, and padding
        <div id='department' className='flex flex-col items-center gap-4 py-16 text-[#262626]'>
            {/* Section heading */}
            <h1 className='text-3xl font-medium'>Find by Department</h1>
            
            {/* Description text to guide the user */}
            <p className='sm:w-1/3 text-center text-sm'>Browse through the list of available professors, schedule your meetings today.</p>
            
            {/* Container holding department options horizontally with scroll enabled if overflow */}
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll '>
                
                {/* Mapping through the departmentData array to create clickable department options */}
                {departmentData.map((item, index) => (

                    // Each department is a link that navigates to the corresponding professor list page
                    // scrollTo(0, 0) ensures the page scrolls to the top after navigation
                    <Link to={`/professors/${item.department}`} onClick={() => scrollTo(0, 0)} className='flex flex-col items-center 
                    text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        {/* Department image */}
                        <img className='w-16 sm:w-24 mb-2 ' src={item.image} alt="" />
                        
                         {/* Department name */}
                        <p>{item.department}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default DepartmentMenu