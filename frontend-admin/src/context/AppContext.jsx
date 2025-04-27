import { createContext } from "react";

// Create a context to share app-wide utilities and constants
export const AppContext = createContext()

const AppContextProvider = (props) => {

    // Base URL for all backend API requests, loaded from environment variables
    //const backendUrl = "https://office-hours-backend.onrender.com";
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    // Array of month abbreviations for converting numeric months to readable format
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    
    /**
     * Utility function to format slot date strings into a readable format
     * Example input: "25_3_2025" (represents 25th March 2025)
     * Output: "25 Apr 2025"
     **/

    const slotDateFormat = (slotDate) => {
        if (!slotDate || typeof slotDate !== 'string') { // Basic validation
            return 'Invalid Date';
        }
        const dateArray = slotDate.split('_');
        if (dateArray.length !== 3) { // Ensure correct format
             return 'Invalid Date Format';
        }
        // --- Convert 1-based month to 0-based index ---
        const monthIndex = Number(dateArray[1]) - 1;
        // Check if the calculated index is valid for the months array
        if (monthIndex >= 0 && monthIndex < months.length) {
             // Use the corrected monthIndex
            return dateArray[0] + " " + months[monthIndex] + " " + dateArray[2];
        } else {
            console.error("Invalid month index calculated:", monthIndex, "from slotDate:", slotDate);
            return 'Invalid Month';
        }
    };

    /**
     * Utility function to format 24-hour time ("HH:MM") to 12-hour AM/PM format
     */
    const formatTimeTo12Hour = (time24) => {
        if (!time24 || typeof time24 !== 'string' || !time24.includes(':')) {
             return time24 || 'Invalid Time'; // Return original or error if invalid
        }
        const [hours24, minutes] = time24.split(':');
        let hours = parseInt(hours24, 10);

        // Check for valid hour/minute numbers after split
        if (isNaN(hours) || isNaN(parseInt(minutes, 10)) || hours < 0 || hours > 23) {
             return 'Invalid Time Format';
        }

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert hour 0 to 12 for 12 AM
        // Ensure minutes has leading zero if needed
        const formattedMinutes = minutes.padStart(2, '0');
        return `${hours}:${formattedMinutes} ${ampm}`;
    };

    // Bundle the values and utility functions that will be accessible through this context
    const value = {
        backendUrl, // Base backend API URL
        slotDateFormat, // Date formatting utility function
        formatTimeTo12Hour, // New time formatting utility function
    }

    // Provide the context value to all child components that need it
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
