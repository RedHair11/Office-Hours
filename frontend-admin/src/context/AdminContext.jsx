import axios from "axios"; // Axios for making HTTP requests
import { createContext, useState } from "react"; // CreateContext and useState for state management
import { toast } from "react-toastify"; // Toast notifications for success or error messages

// Create the AdminContext to manage the admin token and admin data
export const AdminContext = createContext()

// AdminContextProvider component that wraps around parts of the app needing admin data
const AdminContextProvider = (props) => {

    // Get the backend URL from environment variables
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // State to store admin token, fetched from local storage if available
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [appointments, setAppointments] = useState([])     // State to store all appointments
    const [professors, setProfessors] = useState([])     // State to store all professors
    const [dashData, setDashData] = useState(false)     // State to store dashboard data

    // Function to fetch all professors from the database (Admin only)
    // This is used by the admin to get the list of all professors registered in the system.
    const getAllProfessors = async () => {

        try {

            // Make GET request to the backend API to fetch professors, passing the admin token for authorization
            const { data } = await axios.get(backendUrl + '/api/admin/all-professors', { headers: { aToken } })
            
            // If the API call is successful, update the professors state with the retrieved data
            if (data.success) {
                setProfessors(data.professors) 
            } 
            else {
                 // If the API returns a failure message, show it as a toast notification
                toast.error(data.message)
            }

        } catch (error) {
            // Handle any network or server errors
            toast.error(error.message)
        }

    }

    // Function to change a professor's availability status (Admin only)
    // Admin can toggle a professor's availability for appointments
    const changeAvailability = async (profId) => {
        try {

            // Send a POST request to the backend to change the availability of the professor by their ID
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { profId }, { headers: { aToken } })
           
            // If successful, show a success notification 
            // Refresh the professors list to reflect the updated availability
            if (data.success) {
                toast.success(data.message)
                getAllProfessors()
            } else {
                // If the API returns a failure, show the error message
                toast.error(data.message)
            }

        } catch (error) {
            // Handle any network or server errors
            console.log(error)
            toast.error(error.message)
        }
    }


    // Function to fetch all booked appointments from the database (Admin only)
    // Admin can view all appointments booked with professors
    const getAllAppointments = async () => {

        try {
            // Make a GET request to fetch appointment data
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            
            // If successful, store the fetched appointments in reverse order (latest first)
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                // Display an error message if fetching fails
                toast.error(data.message)
            }

        } catch (error) {
            // Handle any network or server errors
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to cancel a specific appointment by appointment ID (Admin only)
    // Admin can cancel any appointment directly from the system
    const cancelAppointment = async (appointmentId) => {

        try {
            // Send a POST request to cancel the appointment by ID
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            // Show a success message upon successful cancellation
            // Refresh the appointment list to remove the canceled appointment
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                // Show an error message if cancellation fails
                toast.error(data.message)
            }

        } catch (error) {
            // Handle any network or server errors
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to fetch overall admin dashboard data (Admin only)
    // Provides summary data like total professors, total appointments, etc.
    const getDashData = async () => {
        try {
            // Make GET request to fetch dashboard summary data
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            
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

    // Define the values and functions that this AdminContext will provide to its children
    const value = {
        aToken, setAToken,
        professors,
        getAllProfessors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData
    }

    // Return the context provider wrapping the child components
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider