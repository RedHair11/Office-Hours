import express from 'express'; // for using express.Router()
import { loginProfessor, appointmentsProfessor, appointmentCancel, 
         professorList, changeAvailability, appointmentComplete, 
         professorDashboard, professorProfile, updateProfessorProfile } from '../controllers/professorController.js'; // for importing route handlers
import authProfessor from '../middleware/authProfessor.js'; // for protecting routes from unauthorized access

// creating an express router
const professorRouter = express.Router();

// Route for professor login
professorRouter.post("/login", loginProfessor)
// Route for canceling an appointment (professor only)
professorRouter.post("/cancel-appointment", authProfessor, appointmentCancel)
// Route for fetching appointments (professor only)
professorRouter.get("/appointments", authProfessor, appointmentsProfessor)
// Route for fetching all professors (no authentication required)
professorRouter.get("/list", professorList)
// Route for changing professor's availability (professor only)
professorRouter.post("/change-availability", authProfessor, changeAvailability)
// Route for marking an appointment as complete (professor only)
professorRouter.post("/complete-appointment", authProfessor, appointmentComplete)
// Route for fetching professor's dashboard (professor only)
professorRouter.get("/dashboard", authProfessor, professorDashboard)
// Route for viewing professor's profile (professor only)
professorRouter.get("/profile", authProfessor, professorProfile)
// Route for updating professor's profile (professor only)
professorRouter.post("/update-profile", authProfessor, updateProfessorProfile)

// exporting the router
export default professorRouter;