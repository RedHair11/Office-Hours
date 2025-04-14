import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

const Professors = () => {
    const { department } = useParams();
    const { professors } = useContext(AppContext);
    const navigate = useNavigate();

    // State for professors filtered ONLY by department
    const [departmentFilteredProf, setDepartmentFilteredProf] = useState([]);
    // State for the search term
    const [searchTerm, setSearchTerm] = useState('');
    // State for filter visibility on small screens
    const [showFilter, setShowFilter] = useState(false);

    // Filter by department first
    useEffect(() => {
        let filteredByDept;
        if (department) {
            filteredByDept = professors.filter(prof => prof.department === department);
        } else {
            filteredByDept = professors;
        }
        setDepartmentFilteredProf(filteredByDept);
        // Reset search when department changes
        setSearchTerm('');
    }, [professors, department]);

    // Apply search term filter to the department-filtered list
    const displayedProfessors = departmentFilteredProf.filter(prof =>
        prof.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        // Keeping your original outer margin
        <div className='mx-20'>

            {/* Header description */}
            <p className='text-gray-600'>Browse through the professor list by department or search by name.</p>
            
            {/* --- Search Bar --- */}
            <div className="py-2 mb-4"> {/* Add margin below search bar */}
                <input
                    type="search"
                    placeholder="Search by professor name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary" 
                />
            </div>
            {/* --- End Search Bar --- */}

            {/* Flex container for filters and main content */}
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

                {/* --- Left Column: Filters --- */}
                <div className='flex-shrink-0'> {/* Prevent filter column from growing excessively */}
                    {/* Toggle button for filter menu (only visible on small screens) */}
                    <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm mb-3 sm:mb-0 
                      transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : 'border-gray-300 text-gray-600'}`}>
                        {showFilter ? 'Hide' : 'Show'} Filters
                    </button>

                    {/* Filter options for selecting a department */}
                    {/* Keeping your original filter button styling and structure */}
                    <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                        <p onClick={() => department === 'Math' ? navigate('/professors') : navigate('/professors/Math')}
                           className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all 
                           cursor-pointer ${department === 'Math' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Math</p>
                        <p onClick={() => department === 'Engineering' ? navigate('/professors') : navigate('/professors/Engineering')}
                           className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all 
                           cursor-pointer ${department === 'Engineering' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Engineering</p>
                         {/* Add other departments similarly */}
                         <p onClick={() => department === 'Business' ? navigate('/professors') : navigate('/professors/Business')}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all 
                            cursor-pointer ${department === 'Business' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Business</p>
                        <p onClick={() => department === 'Science' ? navigate('/professors') : navigate('/professors/Science')}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all 
                            cursor-pointer ${department === 'Science' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Science</p>
                        <p onClick={() => department === 'English' ? navigate('/professors') : navigate('/professors/English')}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all 
                            cursor-pointer ${department === 'English' ? 'bg-[#E2E5FF] text-black ' : ''}`}>English</p>
                        <p onClick={() => department === 'Art' ? navigate('/professors') : navigate('/professors/Art')}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all 
                            cursor-pointer ${department === 'Art' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Art</p>
                    </div>
                </div>

                {/* --- Right Column: Search and Professor Grid --- */}
                <div className='w-full'> {/* This column takes remaining width */}

                    {/* Display the list of filtered professors */}
                    {/* Check if there are professors to display */}
                    {displayedProfessors.length > 0 ? (
                        // Keeping your original grid structure and styling
                        <div className='grid grid-cols-auto gap-4 gap-y-6'>
                            {/* Mapping over the SEARCH filtered list */}
                            {displayedProfessors.map((item) => (
                                // Keeping your original card structure and styling
                                <div
                                    onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }} // Use window.scrollTo
                                    className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-3
                                    transition-all duration-500'
                                    key={item._id} // Use unique _id for key
                                >
                                    <img className='bg-[#EAEFFF]' src={item.image} alt={`${item.name}`} />
                                    <div className='p-4'>
                                        <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                                            <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
                                            <p>{item.available ? 'Available' : "Not Available"}</p>
                                        </div>
                                        <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                                        <p className='text-[#5C5C5C] text-sm'>{item.department}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     ) : (
                         // Message when no professors match filters
                         <div className="text-center py-6 px-4 text-gray-500">
                             No matching professors found.
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default Professors;

