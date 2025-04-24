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
            <div className='flex sm:justify-center gap-6 pt-5 w-full overflow-scroll '>
                
                {/* Mapping through the departmentData array to create clickable department options */}
                {departmentData.map((item, index) => (

                    // Each department is a link that navigates to the corresponding professor list page
                    // scrollTo(0, 0) ensures the page scrolls to the top after navigation
                    <div className='lg:w-15'>  
                    <Link to={`/professors/${item.department}`} onClick={() => scrollTo(0, 0)} className='flex flex-col items-center 
                    text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        {/* Department image */}
                            <div className='bg-primary rounded-full p-2 hover:bg-secondary'>
                            
                                <img className='w-16 md:w-24 p-3' src={item.image} alt="" />
                            </div>
                        
                         {/* Department name */}
                        <p className='text-base font-semibold md:font-normal lg:font-bold sm:font-normal'>{item.department}</p>
                    </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DepartmentMenu