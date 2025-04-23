import mongoose from "mongoose" // for working with MongoDB

/******************************************************************************************************************
 *Primary key are automatically created in MongoDB, they are label as "_id", foreign key are label as "variableId"
 *mongoose.models from user and professor are used to reference the primary keys to the appointment Schema
*******************************************************************************************************************/

// Define a schema for the 'appointment' collection in the database
const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },     // The user ID who booked the appointment (required field)
    profId: { type: String, required: true },     // The professor ID who the appointment is with (required field)
    slotDate: { type: String, required: true },   // The date of the appointment (required field)
    slotTime: { type: String, required: true },   // The time slot for the appointment (required field)
    userData: { type: Object, required: true },   // User's data for the appointment (e.g., name, email) (required field)
    profData: { type: Object, required: true },   // Professor's data for the appointment (e.g., name, department) (required field)
    date: { type: Number, required: true },       // The timestamp when the appointment was created (required field)
    cancelled: { type: Boolean, default: false }, // Boolean flag to mark if the appointment has been cancelled (default is false)
    isCompleted: { type: Boolean, default: false }// Boolean flag to mark if the appointment has been completed (default is false)
})

// Create a model for the 'appointment' schema. If the model already exists, use the existing one.
// This will allow us to interact with the 'appointments' collection in MongoDB.
const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)

// Export the 'appointmentModel' so it can be used in other parts of the application
export default appointmentModel

//Primary key are automatically created in MongoDB, they are label as "_id", foreign key are label as "variableId"
//mongoose.models from user and professor are used to reference the primary keys to the appointment Schema
