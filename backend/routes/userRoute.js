import express from 'express'; // for using express.Router()
import { loginUser, registerUser, getProfile, updateProfile, 
         bookAppointment, listAppointment, cancelAppointment } from '../controllers/userController.js'; // for importing route handlers
import upload from '../middleware/multer.js'; // for handling file uploads
import authUser from '../middleware/authUser.js'; // for protecting routes from unauthorized access

// creating an express router
const userRouter = express.Router();

// Route for user registration
userRouter.post("/register", registerUser)
// Route for user login
userRouter.post("/login", loginUser)
// Route for fetching user's profile (requires authentication)
userRouter.get("/get-profile", authUser, getProfile)
// Route for updating user's profile (requires authentication and allows image upload)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
// Route for booking an appointment (requires authentication)
userRouter.post("/book-appointment", authUser, bookAppointment)
// Route for listing user's appointments (requires authentication)
userRouter.get("/appointments", authUser, listAppointment)
// Route for listing user's appointments (requires authentication)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)

// exporting the router
export default userRouter;