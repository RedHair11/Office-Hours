import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const ProfessorsList = () => {

  // Get the list of professors, the function to change availability, the admin token, 
  // and the function to fetch all professors from AdminContext.
  const { professors, changeAvailability , aToken , getAllProfessors} = useContext(AdminContext)

  // Fetch the list of professors when the admin token is available 
  useEffect(() => {
    if (aToken) {
        getAllProfessors()
    }
}, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
       {/* Title of the page */}
      <h1 className='text-lg font-medium'>All Professors</h1>

      {/* Container for the professor cards */}
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>

        {/* Loop through the list of professors and display them as cards */}
        {professors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            
             {/* Image of the professor */}
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              
              {/* Professor's name */}
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              
               {/* Professor's department */}
              <p className='text-[#5C5C5C] text-sm'>Department: {item.department}</p>
              
               {/* Checkbox to mark professor as available or not */}
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                
                {/* Label next to the checkbox */}
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfessorsList