import jwt from "jsonwebtoken"; // For creating JSON Web Tokens
import bcrypt from "bcrypt";    // for password hashing
import professorModel from "../models/professorModel.js"; // Import the professor model to interact with the database
import appointmentModel from "../models/appointmentModel.js"; // Import the appointment model to interact with the database

// Function for professor login
const loginProfessor = async (req, res) => {

    try {
        // Extract email and password from the request body (sent by the professor attempting to log in)
        // Find the professor in the database using the email provided
        const { email, password } = req.body
        const user = await professorModel.findOne({ email })
        
        // If no professor is found with the given email, return an error response
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }
        
        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password)

        // If the password matches, generate a JWT token to authenticate the professor
        if (isMatch) {
            // Sign a new JWT token using the professor's ID and a secret key
            // Send a success response with the generated token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            // If the password does not match, return an error response
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        // If any error occurs during the process, log the error for debugging
        // Send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to get professor's appointments for the professor panel
const appointmentsProfessor = async (req, res) => {
    try {
        // Extract the professor's ID from the request body
        // Find all appointments in the database that are associated with the given professor's ID
        const { profId } = req.body
        const appointments = await appointmentModel.find({ profId })
        
        // Send a success response along with the appointments list for the professor
        res.json({ success: true, appointments })

    } catch (error) {
        // If an error occurs during the process, log the error for debugging
        // Send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to cancel an appointment from the professor's panel
const appointmentCancel = async (req, res) => {
    try {
        // Extract the professor's ID and the appointment ID from the request body
        // Find the appointment details using the appointment ID
        const { profId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // Check if the appointment exists and if the professor ID matches the one associated with the appointment
        if (appointmentData && appointmentData.profId === profId) {
            // If the appointment is valid and belongs to the professor, mark it as cancelled
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            // Return a success response indicating the appointment has been cancelled
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }
        
        // Return a success response indicating the appointment has been cancelled
        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        // If an error occurs during the process, log the error for debugging
        // Send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to cancel an appointment for a professor
const appointmentComplete = async (req, res) => {
    try {
        // Extract the professor's ID and appointment ID from the request body
        // Find the appointment by its ID from the database
        const { profId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // Check if the appointment exists and if the professor ID matches the one in the appointment
        if (appointmentData && appointmentData.profId === profId) {
            // If the professor is the one who owns the appointment, update the appointment status to "cancelled"
            // Return a success response indicating that the appointment was cancelled
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }
        // If the appointment doesn't exist or the professor does not match, return a failure response
        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        // If an error occurs during the process, log the error for debugging
        // Send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// function to get the list of all professors, excluding sensitive information
const professorList = async (req, res) => {
    try {
        // Find all professors in the database, but exclude 'password' and 'email' fields for privacy
        // Return the list of professors as a success response
        const professors = await professorModel.find({}).select(['-password',])
        res.json({ success: true, professors })

    } catch (error) {
        // If an error occurs during the process, log the error for debugging
        // If an error occurs during the process, log the error for debugging
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to toggle the availability status of a professor
const changeAvailability = async (req, res) => {
    try {
        // Extract the professor's ID from the request body
        // Find the professor's current data using the provided professor ID
        const { profId } = req.body
        const profData = await professorModel.findById(profId)

        // Toggle the professor's availability status (change from true to false or vice versa)
         // Return a success response indicating that the availability has been changed
        await professorModel.findByIdAndUpdate(profId, { available: !profData.available })
        res.json({ success: true, message: 'Availability Changed' })

    } catch (error) {
        // If an error occurs during the process, log the error for debugging
        // Send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to retrieve a professor's profile information
const professorProfile = async (req, res) => {
    try {
        // Extract the professor's ID from the request body
        // Find the professor's profile data by their ID, excluding the 'password' field for privacy
        const { profId } = req.body
        const profileData = await professorModel.findById(profId).select('-password')

        // Return the professor's profile data as a success response
        res.json({ success: true, profileData })

    } catch (error) {
        // If an error occurs during the process, log the error for debugging
        // Send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API function to update a professor's profile (USE FOR UPDATING OFFICE HOURS LATER)
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const updateProfessorProfile = async (req, res) => {
    try {
        let { profId, about, available, officeHours } = req.body;
        const imageFile = req.file;

        // Convert types
        if (typeof available === 'string') {
            available = available === 'true';
        }
        if (typeof officeHours === 'string') {
            try {
                officeHours = JSON.parse(officeHours);
            } catch (err) {
                return res.status(400).json({ success: false, message: 'Invalid officeHours format' });
            }
        }

        if (!profId) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }

        // Fetch existing professor data
        const professor = await professorModel.findById(profId);
        if (!professor) {
            return res.status(404).json({ success: false, message: 'Professor not found.' });
        }

        // Always require an image, whether new or existing
        let finalImageUrl = professor.image || null;

        if (imageFile) {
            const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            });
            finalImageUrl = uploadedImage.secure_url;
            fs.unlinkSync(imageFile.path); // remove temp file
        }

        if (!finalImageUrl) {
            return res.status(400).json({ success: false, message: 'Profile image is required.' });
        }

        // Update only if data has changed
        const updateFields = {};

        if (about !== professor.about) updateFields.about = about;
        if (available !== professor.available) updateFields.available = available;
            updateFields.officeHours = officeHours;
        if (finalImageUrl !== professor.image) updateFields.image = finalImageUrl;

        // If nothing changed, just return success
        if (Object.keys(updateFields).length === 0) {
            return res.json({ success: true, message: 'No changes made.', profileData: professor });
        }

        // Apply update
        const updatedProfessor = await professorModel.findByIdAndUpdate(
            profId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ success: true, message: 'Profile Updated Successfully', profileData: updatedProfessor });

    } catch (error) {
        console.error("Error updating professor profile:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Validation failed.', errors: error.errors });
        }

        res.status(500).json({ success: false, message: "Server error updating profile." });
    }
};




// Function to retrieve dashboard data for a professor
const professorDashboard = async (req, res) => {
    try {
        // Extract the professor's ID from the request body
        // Find all appointments for the given professor using their ID
        const { profId } = req.body
        const appointments = await appointmentModel.find({ profId })

         // Initialize an empty array to track unique students (userIds) who have booked appointments
        let students = []

        // Loop through each appointment and add unique student IDs to the students array if not already present
        appointments.map((item) => {
            if (!students.includes(item.userId)) {
                students.push(item.userId)
            }
        })

        // Prepare the dashboard data object 
        const dashData = {
            appointments: appointments.length,          // Total number of appointments
            students: students.length,                  // Number of unique students who booked appointments
            latestAppointments: appointments.reverse()  // List of appointments in reverse order (latest first)
        }
        
        // Return the dashboard data as a success response
        res.json({ success: true, dashData })

    } catch (error) {
        // If an error occurs during the process, log the error for debugging
        // Send a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Exporting the various professor-related functions
export {
    loginProfessor,
    appointmentsProfessor,
    appointmentCancel,
    professorList,
    changeAvailablity,
    appointmentComplete,
    professorDashboard,
    professorProfile,
    updateProfessorProfile
}