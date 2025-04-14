import { v2 as cloudinary } from 'cloudinary'; // Import the cloudinary library

//function to connect and configure Cloudinary
const connectCloudinary = async () => {

    // Set up Cloudinary with the necessary credentials (stored in environment variables)
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,        //Cloudinary account name
        api_key: process.env.CLOUDINARY_API_KEY,        //Cloudinary API key
        api_secret: process.env.CLOUDINARY_SECRET_KEY   //Cloudinary API secret key
    });

}

// Export the function so it can be used in other files
export default connectCloudinary;