import express from 'express'
import multer from 'multer'
import { loginProfessor, appointmentsProfessor, appointmentCancel,
         professorList, changeAvailability, appointmentComplete,
         professorDashboard, professorProfile, updateProfessorProfile } from '../controllers/professorController.js'
import authProfessor from '../middleware/authProfessor.js'

// Setup multer for temporary image storage
const upload = multer({ dest: 'uploads/' })

const professorRouter = express.Router()

professorRouter.post("/login", loginProfessor)
professorRouter.post("/cancel-appointment", authProfessor, appointmentCancel)
professorRouter.get("/appointments", authProfessor, appointmentsProfessor)
professorRouter.get("/list", professorList)
professorRouter.post("/change-availability", authProfessor, changeAvailability)
professorRouter.post("/complete-appointment", authProfessor, appointmentComplete)
professorRouter.get("/dashboard", authProfessor, professorDashboard)
professorRouter.get("/profile", authProfessor, professorProfile)

// UPDATED: Allow image upload for professor profile update
professorRouter.post("/update-profile", authProfessor, upload.single('image'), updateProfessorProfile)

export default professorRouter
