import express from "express" // Import express for setting up the server
import cors from 'cors' // Import CORS middleware for handling cross-origin requests
import 'dotenv/config' // Import dotenv to load environment variables from a .env file
import connectDB from "./config/mongodb.js" // Import the MongoDB connection utility
import connectCloudinary from "./config/cloudinary.js" // Import the Cloudinary connection utility
import userRouter from "./routes/userRoute.js" // Import routes for user-related APIs
import professorRouter from "./routes/professorRoute.js" // Import routes for professor-related APIs
import adminRouter from "./routes/adminRoute.js" // Import routes for admin-related APIs

// app config
const app = express()                   // Create an instance of the Express application
const port = process.env.PORT || 4000   // Use the environment variable for port or default to 4000
connectDB()                             // Connect to MongoDB
connectCloudinary()                     // Connect to Cloudinary

// middlewares
app.use(express.json()) // Middleware to parse incoming requests with JSON payloads
app.use(cors()) // Middleware to enable Cross-Origin Resource Sharing (CORS)

// api endpoints
app.use("/api/user", userRouter) // Route to handle user-related API requests
app.use("/api/admin", adminRouter) // Route to handle admin-related API requests
app.use("/api/professor", professorRouter) // Route to handle professor-related API requests

// Basic route to check if the API is working
// Sends a simple response if the root URL is accessed
app.get("/", (req, res) => {
  res.send("API Working")
});

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Server started on PORT:${port}`))
