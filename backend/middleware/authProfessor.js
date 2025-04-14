import jwt from 'jsonwebtoken' // for creating JSON Web Tokens

// This is the professor authentication middleware that protects routes
// from unauthorized access by verifying the professor's JWT token.
const authProfessor = async (req, res, next) => {
    
    // Get the token from the request headers
    const { dtoken } = req.headers

    // If no token is provided, return an error message and block access
    if (!dtoken) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        // Decode the token using the secret key from environment variables
        // Store the professor's ID in the request body for later use in the route handler
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
        req.body.profId = token_decode.id

        // If the token is valid, call the next middleware or route handler
        next()
    } catch (error) {
        // If there is any error during token verification, log it and send an error response
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Export the 'authProfessor' middleware so it can be used in other parts of the application
export default authProfessor;