import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmitHandler(e) {
    e.preventDefault();
    
    try {
      await axios.post('/register', {name, email, password});
      alert('Registration successfull, now you can login');
    } catch (error) {
      alert('Registration failed');
    }
    
  }

  return (
    <div className='grow flex items-center justify-center'>
        <div>
            <h1 className='text-4xl text-center mb-4 font-semibold'>Sign In</h1>
            <form className='max-w-md mx-auto' onSubmit={onSubmitHandler}>
                <input type="text" placeholder='John Doe' value={name} onChange={e=>setName(e.target.value)} />
                <input type="email" placeholder='your@gmail.com'  value={email} onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} />
                <button className='primary'>Sign In</button>
            </form>
            <div className='text-center my-2 text-gray-500'>
              Already registered?
              <Link to={"/login"} className="ml-2 font-semibold text-black">Login now</Link>

            </div>
        </div>
    </div>
  )
}

export default RegisterPage