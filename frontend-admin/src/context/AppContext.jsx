import { createContext } from "react";

// Create a context to share app-wide utilities and constants
export const AppContext = createContext()

const AppContextProvider = (props) => {

    // Base URL for all backend API requests, loaded from environment variables
    const backendUrl = "https://office-hours-backend.onrender.com";
    // const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    // Array of month abbreviations for converting numeric months to readable format
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    
    /**
     * Utility function to format slot date strings into a readable format
     * Example input: "25_3_2025" (represents 25th March 2025)
     * Output: "25 Apr 2025"
     **/

    const slotDateFormat = (slotDate) => {
        // Split the slotDate into day, month index, and year
        const dateArray = slotDate.split('_') 
        // Convert the numeric month to its corresponding abbreviation using the months array
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Bundle the values and utility functions that will be accessible through this context
    const value = {
        backendUrl, // Base backend API URL
        slotDateFormat, // Date formatting utility function
    }

    // Provide the context value to all child components that need it
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
