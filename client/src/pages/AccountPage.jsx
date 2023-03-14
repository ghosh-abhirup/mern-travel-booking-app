import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import AccountNav from '../components/AccountNav';
import { UserContext } from '../context/UserContext'

const AccountPage = () => {
    const [redirect, setRedirect] = useState(false);
    const {user, ready, setUser} = useContext(UserContext);

    const onLogoutHandler = async ()=>{
        await axios.post('/logout');
        setUser(null);
        setRedirect(true);
    }

    if(redirect){
        return <Navigate to={"/"}/>
    }

    if(!ready){
        return 'Loading ...';
    }

    if(ready && !user){
        return <Navigate to={"/login"}/>;
    }
    
    

  return (
    <div>
        <AccountNav />
        <div className='flex flex-col justify-between items-center'>
            <h3 className='font-medium mb-4'>Logged in as {user.name} ({user.email})</h3>
            <button onClick={onLogoutHandler} className='py-2 px-4 font-medium bg-primary text-white rounded-md'>Logout</button>
        </div>
    </div>
  )
}

export default AccountPage