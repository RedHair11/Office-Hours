import jwt from "jsonwebtoken" // For creating JSON Web Tokens

// This is the admin authentication middleware that will protect routes
// from unauthorized access by verifying the admin's JWT token.
const authAdmin = async (req, res, next) => {
    try {
        // Get the token from the request headers
        const { atoken } = req.headers
        
        // If no token is provided, return an error message and block access
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        // Decode the token using the secret key from environment variables
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        // Check if the decoded token matches the admin's credentials (email + password combination)
        // If it does not, block access and send an error message
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        // If everything is fine, call the next middleware or route handler
        next()
    } catch (error) {
        // If there is any error during token verification, log it and send an error response
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Export the 'authAdmin' middleware so it can be used in other parts of the application
export default authAdmin;