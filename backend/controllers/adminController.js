import jwt from "jsonwebtoken"; // For creating JSON Web Tokens
import appointmentModel from "../models/appointmentModel.js"; // Import the appointment model
import professorModel from "../models/professorModel.js"; // Import the professor model
import userModel from "../models/userModel.js"; // Import the user model
import bcrypt from "bcrypt"; // For password hashing
import validator from "validator"; // For validating email and other fields
import { v2 as cloudinary } from "cloudinary"; // For uploading images to Cloudinary


// Function to handle admin login
const loginAdmin = async (req, res) => {
    try {

        // Extract email and password from the request body
        const { email, password } = req.body
        // Check if the entered email and password match the admin credentials stored in environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // If credentials are correct, generate a JWT token for the admin
            // Send success response along with the token
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            // If credentials are invalid, send a failure response
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        // Catch and log any errors, then send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Function to get all appointments for the admin panel
const appointmentsAdmin = async (req, res) => {
    try {
        // Get all appointment records from the database
        // Send success response along with the list of appointments
        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        // Catch and log any errors, then send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// Function to cancel an appointment
const appointmentCancel = async (req, res) => {
    try {
        // Extract the appointment ID from the request body
        // Find the appointment by ID and update its 'cancelled' status to true
        // Send a success response after cancelling the appointment
        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        // Catch and log any errors, then send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// Function to add a new professor
const addProfessor = async (req, res) => {

    try {
        // Extract professor details from the request body
        const { name, email, password, department, about } = req.body
        const imageFile = req.file // Get the uploaded image file

        // Check if any required field is missing
        // If any field is missing, return an error response
        if (!name || !email || !password || !department || !about ) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // Validate the email format using the validator library
        // If the email is invalid, return an error response
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // Check if the password is at least 8 characters long
        // If it's too weak, return an error response
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // Generate a salt to strengthen the password hashing process
        // The higher the number of rounds, the more secure but slower the process
        const salt = await bcrypt.genSalt(10); 
        // Hash the professor's password using the generated salt
        // This ensures that the password is stored securely in the database
        const hashedPassword = await bcrypt.hash(password, salt)

        let imageUrl = null; // Initialize imageUrl

        // Only upload if an image file is provided
        if (imageFile) {
            try {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
                imageUrl = imageUpload.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                 return res.json({ success: false, message: "Image upload failed." });
            }
        }
        // If imageUrl is still null here, the default from the schema will be used upon saving.

        // Create a professor object with all the necessary data to store in the database
        const professorData = {
            name,                       // Professor's name
            email,                      // Professor's email
            // Only include image if it was successfully uploaded
            ...(imageUrl && { image: imageUrl }), // Conditionally add image property
            password: hashedPassword,   // Hashed password for security
            department,                 // Department the professor belongs to
            about,                      // Additional info or description about the professor
            date: Date.now()            // Current timestamp to track when the professor was added
        }

        // Create a new professor document using the professorModel 
        // Save the new professor document to the database
        // Send a success response indicating the professor has been added
        const newProfessor = new professorModel(professorData)  
        await newProfessor.save()   
        res.json({ success: true, message: 'Professor Added' }) 

    } catch (error) {
        // If any error occurs during the process, log it to the console for debugging
        // Also, send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to fetch and return all professors' data for the admin panel
const allProfessors = async (req, res) => {
    try {
        // Fetch all professor records from the database using the professor model
        // The 'select("-password")' removes the password field from the result for security reasons
        // Send a success response along with the list of professors
        const professors = await professorModel.find({}).select('-password')
        res.json({ success: true, professors })

    } catch (error) {
        // If an error occurs while fetching data, log the error for debugging
        // Send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to fetch dashboard data for the admin panel
const adminDashboard = async (req, res) => {
    try {

        const professors = await professorModel.find({})        // Fetch all professor records from the database
        const users = await userModel.find({})                  // Fetch all user (student) records from the database
        const appointments = await appointmentModel.find({})    // Fetch all appointment records from the database

        // Prepare dashboard data object
        const dashData = {
            professors: professors.length,              // Total number of professors
            appointments: appointments.length,          // Total number of appointments
            students: users.length,                     // Total number of students
            latestAppointments: appointments.reverse()  // List of latest appointments (reversed for most recent first)
        }
        // Send a success response with the dashboard data
        res.json({ success: true, dashData })

    } catch (error) {
        // If an error occurs while fetching the data, log the error
        // Send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// Exporting all functions so they can be used in other parts of the application
export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addProfessor,
    allProfessors,
    adminDashboard
}