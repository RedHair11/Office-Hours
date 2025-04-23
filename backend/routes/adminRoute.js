import express from 'express'; // for using express.Router()
import { loginAdmin, appointmentsAdmin, appointmentCancel, 
         addProfessor, allProfessors, adminDashboard } from '../controllers/adminController.js'; // for importing route handlers
import { changeAvailability } from '../controllers/professorController.js'; // for importing route handlers
import authAdmin from '../middleware/authAdmin.js'; // for protecting routes from unauthorized access
import upload from '../middleware/multer.js'; // for handling file uploads

// creating an express router
const adminRouter = express.Router();

// Route for admin login
adminRouter.post("/login", loginAdmin)
// Route for adding a professor (only accessible by an authenticated admin, with image upload)
adminRouter.post("/add-professor", authAdmin, upload.single('image'), addProfessor)
// Route for viewing all appointments (admin only)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
// Route for canceling an appointment (admin only)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
// Route for fetching all professors (admin only)
adminRouter.get("/all-professors", authAdmin, allProfessors)
// Route for changing professor availability (admin only)
adminRouter.post("/change-availability", authAdmin, changeAvailability)
// Route for viewing the admin dashboard (admin only)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

// exporting the router
export default adminRouter;