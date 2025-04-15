import { createContext, useState } from "react";
import axios from 'axios' // Axios for API requests
import { toast } from 'react-toastify' // Toast for notifications

// Create a context to share professor-specific state and functions
export const ProfessorContext = createContext()

const ProfessorContextProvider = (props) => {

    // Backend base URL from environment variable
    const backendUrl = "https://office-hours-backend.onrender.com";
    // const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    // Store the professor's authentication token (if exists in localStorage)
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    // State to store all appointments assigned to the professor
    const [appointments, setAppointments] = useState([])
    // State to store dashboard data like stats or analytics
    const [dashData, setDashData] = useState(false)
    // State to store the professor's profile data
    const [profileData, setProfileData] = useState(false)

    /**
     * Fetch all appointment data for the professor from the backend
     * and update the local state.
     */
    const getAppointments = async () => {
        try {
            // Make a GET request to the backend API to fetch appointments 
            const { data } = await axios.get(backendUrl + '/api/professor/appointments', { headers: { dToken } })

            // If successful, store appointments in state, newest first
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                // Show error if API response is unsuccessful
                toast.error(data.message)
            }

        } catch (error) {
            // Show error if API call fails
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to fetch professor's profile data from the backend
    const getProfileData = async () => {
        try {
            // Make a GET request to the backend API to fetch professor's profile data
            // This now requests data from the updated backend endpoint
            const { data } = await axios.get(backendUrl + '/api/professor/profile', { headers: { dToken } });

            // --- THIS IS THE KEY PART ---
            // Check this log output in your browser's console!
            console.log("Fetched profile data in Context:", data.profileData);
            // --- END KEY PART ---

            // This line will update the state with whatever object `data.profileData` contains.
            // If the backend sends officeHours, they will be stored here.
            setProfileData(data.profileData);

        } catch (error) {
            // Show error if API call fails
            console.error("Error fetching profile data in Context:", error); // Use console.error for errors
            toast.error(error?.response?.data?.message || error.message); // Try to show backend error message
        }
    }

    // Function to cancel an appointment using the backend API
    const cancelAppointment = async (appointmentId) => {

        try {
            // Send a POST request to the backend to cancel the appointment
            const { data } = await axios.post(backendUrl + '/api/professor/cancel-appointment', { appointmentId }, { headers: { dToken } })

            // If successful, show a success notification and refresh the appointments
            if (data.success) {
                toast.success(data.message) // Show success message
                getAppointments() // Refresh appointments after cancelation
                getDashData() // Update dashboard stats
            } else {
                // Show an error message if the API response is unsuccessful
                toast.error(data.message)
            }

        } catch (error) {
            // Handle any network or server errors
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to mark an appointment as complete using the backend API
    const completeAppointment = async (appointmentId) => {

        try {
            // Send a POST request to the backend to mark the appointment as complete
            const { data } = await axios.post(backendUrl + '/api/professor/complete-appointment', { appointmentId }, { headers: { dToken } })

            // If successful, show a success notification and refresh the appointments
            if (data.success) {
                toast.success(data.message) // Show success message
                getAppointments() // Refresh appointments after completion
                getDashData() // Update dashboard stats
            } else {
                // Show an error message if the API response is unsuccessful
                toast.error(data.message)
            }

        } catch (error) {
            // Handle any network or server errors
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to fetch overall professor dashboard data
    const getDashData = async () => {
        try {
            // Make a GET request to fetch dashboard summary data
            const { data } = await axios.get(backendUrl + '/api/professor/dashboard', { headers: { dToken } })
            
            // If successful, store the fetched dashboard data in state
            if (data.success) {
                setDashData(data.dashData) 
            } else {
                // Show an error if the dashboard data fetch fails
                toast.error(data.message)
            }

        } catch (error) {
            // Handle network or server errors
            console.log(error)
            toast.error(error.message)
        }

    }

    /**
    * Context value to be provided to all child components.
    * This includes state values and API interaction functions related to the professor.
    */
    const value = {
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    // Provide the context to children components to access professor-related data and functions
    return (
        <ProfessorContext.Provider value={value}>
            {props.children}
        </ProfessorContext.Provider>
    )


}

export default ProfessorContextProvider
