import mongoose from "mongoose"; // Import the Mongoose library to connect and interact with MongoDB

// Function to connect to the MongoDB database
const connectDB = async () => {

    // When the database connection is successful, log a message
    mongoose.connection.on('connected', () => console.log("Database Connected"))
    // Connect to the MongoDB database using the URI from environment variables
    // "/Office_Hours_Test" is the specific database name being connected to
    await mongoose.connect(`${process.env.MONGODB_URI}/Office_Hours`)

}

// Export the function so it can be used in other parts of the project
export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.