import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const AvailableProfessors = () => {

    const navigate = useNavigate()

    // Access the professors data from AppContext
    const { professors } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10'>
            {/* Section Title */}
            <h1 className='text-3xl font-medium'>Book Office Hours Meetings With Professors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Browse through the list of available professors.</p>

            {/* Professors grid - displays first 6 professors */}
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {professors.slice(0, 6).map((item, index) => (

                    // Each professor card is clickable and redirects to their appointment page
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF]
                     rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        
                        {/* Professor image */}
                        <img className='bg-[#EAEFFF]' src={item.image} alt="" />

                        {/* Professor details */}
                        <div className='p-4'>

                            {/* Availability status with colored indicator */}
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 
                                "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
                                <p>{item.available ? 'Available' : "Not Available"}</p>
                            </div>

                            {/* Professor Name */}
                            <p className='text-[#262626] text-lg font-medium'>{item.name}</p>

                            {/* Department */}
                            <p className='text-[#5C5C5C] text-sm'>{item.department}</p>
                        </div>
                    </div>
                ))}
            </div>

             {/* 'More' button to navigate to the full professors list */}
            <button onClick={() => { navigate('/professors'); scrollTo(0, 0) }} className='bg-[#EAEFFF] text-gray-600 px-12 py-3 
            rounded-full mt-10'>more</button>
        </div>
    )
}

export default AvailableProfessors