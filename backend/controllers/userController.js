import jwt from "jsonwebtoken"; // for creating JSON Web Tokens
import bcrypt from "bcrypt"; // for password hashing
import validator from "validator"; // for validating email and other fields
import userModel from "../models/userModel.js"; // import the user model
import professorModel from "../models/professorModel.js"; // import the professor model
import appointmentModel from "../models/appointmentModel.js"; // import the appointment model
import { v2 as cloudinary } from 'cloudinary' // for uploading images to Cloudinary

// Function to register a new user
const registerUser = async (req, res) => {

    try {
        // Destructuring the name, email, and password from the request body
        const { name, email, password, studentID } = req.body;

        // Check if all required details are provided
        // If any required field is missing, return an error message
        if (!name || !email || !password || !studentID) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // Validate if the provided email is in the correct format
        // If the email format is invalid, return an error message
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // If the student ID is too long, return an error message
        if (studentID.length > 9) { 
            console.log('Student ID length check failed!'); // Add another log here
            return res.json({ success: false, message: "Please enter a student ID less than 9 characters." })
        }

        // Validate if the password is strong enough (at least 8 characters long)
        // If the password is too short, return an error message
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

         // Hash the user password using bcrypt (for security purposes)
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds (more rounds = more secure but slower)
        const hashedPassword = await bcrypt.hash(password, salt) // Hash the password with the salt

         // Create a new user object with the validated and hashed data
        const userData = {
            name,                     // Store the user's name
            email,                    // Store the user's email
            password: hashedPassword, // Store the hashed password instead of plain text password
            studentID,                // Store the user's student ID
        }

         // Save the new user data in the database
        const newUser = new userModel(userData)                            
        const user = await newUser.save()   // Save the new user data in the database                                
        // Create a token that contains the user's ID and is signed using the JWT secret key
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)    

        // Return the success message along with the generated token
        res.json({ success: true, token })

    } catch (error) {
        // Log any error that occurs
        // Return a failure message if an error occurs
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to log in an existing user
const loginUser = async (req, res) => {

    try {
        // Destructure email and password from the request body
        // Check if the user exists in the database by finding the user with the provided email
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

         // If the user is not found, return an error message
        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        // Compare the entered password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password)
        
        // If the passwords match, generate a JWT token and return it
        if (isMatch) {
            // Create a JWT with the user's ID and sign it using the secret key
            // Return the token in the response
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
             // If the password doesn't match, return an invalid credentials message
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        // Log any errors that occur
        // Return a failure message if an error occurs
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

/// Function to get the profile of the logged-in user
const getProfile = async (req, res) => {

    try {
        // Destructure the userId from the request body
        // Fetch the user data from the database using the userId
        // The '-password' excludes the password field from the returned user data
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
        
        // Return the user data with a success message
        res.json({ success: true, userData })

    } catch (error) {
        // Log the error to the console for debugging
        // Return the error message in the response
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to update the profile of the logged-in user
const updateProfile = async (req, res) => {

    try {
        // Destructure userId, name, and phone from the request body  
        // Get the uploaded image file from the request (if any)          
        const { userId, name, phone} = req.body
        const imageFile = req.file

        // Check if both name and phone are provided
        // Return error if any data is missing
        if (!name || !phone) {
            return res.json({ success: false, message: "Data Missing" })
        }
        
        // Update the user document in the database with the new name and phone number
        await userModel.findByIdAndUpdate(userId, { name, phone})

        // If an image file is uploaded, upload it to Cloudinary
        if (imageFile) {

            // Upload image to Cloudinary and get the secure URL
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            // Update the user document in the database with the new image URL
            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        // Return success message
        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        // Log the error for debugging purposes
        // Return error message in case of an issue
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function for booking an appointment with a professor 
const bookAppointment = async (req, res) => {

    try {
        // Extract user and professor details, along with the appointment time and date
        // Find the professor's data based on the provided professor ID (excluding password)
        const { userId, profId, slotDate, slotTime } = req.body
        const profData = await professorModel.findById(profId).select("-password")

        // Check if the professor is available, if not return a notice message
        if (!profData.available) {
            return res.json({ success: false, message: 'Professor Not Available' })
        }
        
        // Get the list of already booked slots for the professor
        let slots_booked = profData.slots_booked

        // Check if the selected date already has booked slots 
        if (slots_booked[slotDate]) {
            // If the selected time slot is already booked, return error
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            // If the slot is not booked, add the new time to the list of booked slots
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            // If the date is not in the slots_booked, initialize it with the selected time slot
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        // Get the user's details based on the userId (excluding password)
        // Remove professor's booked slots before storing the appointment data
        const userData = await userModel.findById(userId).select("-password")
        delete profData.slots_booked

        // Create the appointment data object with the necessary details
        const appointmentData = {
            userId,             // User ID
            profId,             // Professor ID
            userData,           // User data
            profData,           // Professor data
            slotTime,           // Slot time
            slotDate,           // Slot date
            date: Date.now()    // Current timestamp to track when the appointment was booked
        }

        // Create a new appointment entry and save it to the database
        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // Save the updated slots booking data back to the professor's document in the database
        await professorModel.findByIdAndUpdate(profId, { slots_booked })

        // Respond with success message
        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        // Log any errors for debugging purposes
        // Return error message if any
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// Function to cancel an appointment
const cancelAppointment = async (req, res) => {
    try {

        // Extract userId and appointmentId from request body
        // Fetch the appointment data from the database using the appointmentId
        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // Verify if the user requesting the cancellation is the same as the one who booked the appointment 
        // If the userId doesn't match, return an error for unauthorized action
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }
        
        // Proceed to mark the appointment as cancelled in the database
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // Retrieve the professor's ID, slotDate, and slotTime from the cancelled appointment 
        // Find the professor's data using profId
        const { profId, slotDate, slotTime } = appointmentData
        const professorData = await professorModel.findById(profId)

        // Retrieve the professor's booked slots
        // Remove the cancelled slot from the professor's list of booked slots
        let slots_booked = professorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        // Update the professor's slots_booked in the database to reflect the released slot
        await professorModel.findByIdAndUpdate(profId, { slots_booked })

        // Respond with a success message indicating the appointment was successfully cancelled
        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        // Log the error for debugging purposes
        // Return a failure response with the error message
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to list appointments for a specific user
const listAppointment = async (req, res) => {
    try {

        // Extract userId from the request body to identify the user
        // Fetch all appointments from the database that match the provided userId
        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        // Return the fetched appointments in the response, indicating success
        res.json({ success: true, appointments })

    } catch (error) {
        // Log the error for debugging purposes
        // Return a failure response with the error message in case of an issue
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// export the functions to be used in other parts of the project
export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
}