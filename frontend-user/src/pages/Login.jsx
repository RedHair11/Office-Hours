import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  // State to toggle between "Sign Up" and "Login"
  const [state, setState] = useState('Sign Up')

  // States to store user input for name, email, and password
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [studentID, setStudentID] = useState('')

  // Hook to navigate to different pages
  const navigate = useNavigate()
  // Access backend URL and authentication token from the context
  const { backendUrl, token, setToken } = useContext(AppContext)

  // Function to handle form submission for login or signup
  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent page refresh on form submission

    // If signing up to website
    if (state === 'Sign Up') {

      // Sending user data to register endpoint if in Sign Up mode
      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password, studentID })

      // if successful, store token in local storage and update global state
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        // Show error message if registration fails
        toast.error(data.message)
      }

    } else {

      // Sending user data to login endpoint if in Login mode
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

      // If successful, store token in local storage and update global state
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        // Show error message if login fails
        toast.error(data.message)
      }
    }
  }

  // Automatically navigate to home page if the user is already logged in
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] 
      text-sm shadow-lg'>

        {/* Display form title based on state */}
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book meeting</p>
        
        {/* Show Name and Student ID input only for Sign Up */}
        {state === 'Sign Up' ? 
        <>
          {/* Full Name input field*/}
          <div className='w-full '>
            <p>Full Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1 border-gray-400' 
            type="text" required />
          </div>

          {/* Student ID input field*/}
          <div className='w-full '>
            <p>Student ID</p>
            <input onChange={(e) => setStudentID(e.target.value)} value={studentID} className='border border-[#DADADA] rounded w-full 
            p-2 mt-1 border-gray-400'type="text" required />
           </div>
          </>
          : null  
        }

        {/* Email input field */}
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1 border-gray-400' 
          type="email" required />
        </div>
        <div className='w-full '>


        {/* Password input field */} 
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1 border-gray-400' 
          type="password" required />
        </div>

        {/* Submit button that changes based on state */}
        <button className='bg-primary hover:bg-[#4a1022] text-white w-full py-2 my-2 rounded-md text-base '>
          {state === 'Sign Up' ? 'Create account' : 'Login'}</button>
        
        {/* Toggle between Sign Up and Login modes */}
        {state === 'Sign Up'
          ? <p>Already have an account? <span onClick={() => setState('Login')} 
          className='text-primary underline cursor-pointer'>Login here</span></p>
          : <p>Create an new account? <span onClick={() => setState('Sign Up')} 
          className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login