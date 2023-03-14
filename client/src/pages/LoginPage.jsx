import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const LoginPage = () => {
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const {setUser} = useContext(UserContext);

  async function onLoginHandler(e) {
    e.preventDefault();

    try {
      const {data} = await axios.post('/login', {email, password}); 
      setUser(data);
      alert('Login successfull');
      setRedirect(true) ;
    } catch (error) {
      alert('Login failed');
    }
  }

  if(redirect){
    return <Navigate to={"/"}/>;
  }
  return (
    <div className='grow flex items-center justify-center'>
        <div>
            <h1 className='text-4xl text-center mb-4 font-semibold'>Login</h1>
            <form className='max-w-md mx-auto' onSubmit={onLoginHandler}>
                <input type="email" placeholder='your@gmail.com' value={email} onChange={e => setEmail(e.target.value)}/>
                <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                <button className='primary'>Login</button>
            </form>
            <div className='text-center my-2 text-gray-500'>
              Don't have an account?
              <Link to={"/register"} className="ml-2 font-semibold text-black">Register now</Link>

            </div>
        </div>
    </div>
  )
}

export default LoginPage