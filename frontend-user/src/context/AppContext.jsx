import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

// Creating a global context to share state and functions across components
export const AppContext = createContext()

const AppContextProvider = (props) => {

    // Backend API base URL stored in environment variables for security and flexibility
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    // Global state: list of all professors fetched from the backend
    const [professors, setProfessors] = useState([])
    // Global state: user token for authentication, retrieved from localStorage if available
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    // Global state: authenticated user's profile data
    const [userData, setUserData] = useState(false)

    // Fetch all professors from the backend API and store them in the 'professors' state
    const getProfessorsData = async () => {

        try {
            
            // Sending GET request to fetch the list of professors
            const { data } = await axios.get(backendUrl + '/api/professor/list')

            // If the response is successful, update the professors state
            if (data.success) {
                setProfessors(data.professors)
            } else {

                // Show error toast if API responds with an error message
                toast.error(data.message)
            }

        } catch (error) {
            // Log the error for debugging and show error message
            console.log(error)
            toast.error(error.message)
        }

    }

    // Fetch the currently logged-in user's profile using the stored token
    const loadUserProfileData = async () => {

        try {
            // Sending GET request with token in headers for authentication
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            // If response is successful, update the userData state with user information
            if (data.success) {
                setUserData(data.userData)
            } else {
                // Show error toast if the API responds with an error
                toast.error(data.message)
            }

        } catch (error) {
            // Log the error for debugging and show error message
            console.log(error)
            toast.error(error.message)
        }

    }

    // useEffect runs once when the component mounts (like componentDidMount)
    // Purpose: Fetch professors immediately when the app loads
    useEffect(() => {
        getProfessorsData()
    }, [])

    // useEffect runs whenever the 'token' changes
    // Purpose: If the user logs in and token is set, fetch the user's profile  
    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    // Context value that will be shared with all components that consume this context
    const value = {
        professors,             // List of professors
        getProfessorsData,      // Function to fetch professors
        backendUrl,             // Backend API base URL
        token, setToken,        // Authentication token and setter
        userData, setUserData,  // User data and setter
        loadUserProfileData     // Function to fetch user profile
    }

    // Providing the context value to all child components wrapped by AppContextProvider
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
