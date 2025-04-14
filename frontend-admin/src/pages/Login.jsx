import axios from 'axios'
import React, { useContext, useState } from 'react'
import { ProfessorContext } from '../context/ProfessorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Login = () => {

  // Defining the state for determining whether the user is logging in as Admin or Professor
  const [state, setState] = useState('Admin')  // Default is 'Admin' login

  // States for email and password input fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Getting the backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Using context to manage the tokens for Admin and Professor
  const { setDToken } = useContext(ProfessorContext)
  const { setAToken } = useContext(AdminContext)

  // The function that handles form submission and login process
  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevents default form submission behavior

    // If the login type is Admin
    if (state === 'Admin') {

      // Making a POST request to the backend for admin login
      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      
      // If login is successful, save the token in the context & save the token in local storage
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
         // Else display an error toast message
        toast.error(data.message)
      }

    // If the login type is Professor
    } else {

      // Making a POST request to the backend for professor login
      const { data } = await axios.post(backendUrl + '/api/professor/login', { email, password })

      // If login is successful, save the token in the context & save the token in local storage
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        // Else display an error toast message
        toast.error(data.message)
      }
    }
  }

  // Return the login form
  return (

  <div className='bg-primary min-h-screen flex items-center justify-center'>    
      {/* Login Form Start*/}
      <div className='flex flex-col items-center'> {/* Container div for logo and form */}
          <form onSubmit={onSubmitHandler} className='bg-white w-full sm:w-96 flex items-center rounded-xl shadow-lg'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] 
                      text-sm shadow-lg'>
              <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
        
              {/* Email input field */}
              <div className='w-full '>
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-gray-400 
                rounded w-full p-2 mt-1' type="email" required />
              </div>

              {/* Password input field */}
              <div className='w-full '>
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-gray-400 
                  rounded w-full p-2 mt-1' type="password" required />
              </div>

              {/* Submit button for login */}

              {/*If the current login state is 'Admin', the text "Professor Login?" 
                appears, and clicking on it sets the state to 'Professor', 
                enabling the option to login as a professor. If the current state is 'Professor', 
                the option to switch to Admin login is presented. */}
              <button className='bg-primary hover:bg-[#4a1022] text-white w-full py-2 rounded-md text-base'>Login</button>
              {
                state === 'Admin'
                  ? <p>Professor Login? <span onClick={() => setState('Professor')} className='text-primary underline cursor-pointer'>
                    Click here</span></p>
                  : <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>
                    Click here</span></p>
              }
              
            </div>
          </form>
          <img src={assets.TAMIU_logo} alt='TAMIU Logo' className='w-[calc(200px*0.5)] mb-4' />

      </div>
  </div>
    
  )
}

export default Login