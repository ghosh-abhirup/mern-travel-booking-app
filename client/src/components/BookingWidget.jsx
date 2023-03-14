import React, { useEffect, useState } from 'react';
import {differenceInCalendarDays} from 'date-fns';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BookingWidget = ({travelSite}) => {
    const [checkInTime,setCheckInTime] = useState('')
    const [checkoutTime, setCheckoutTime] = useState('')
    const [numGuests, setNumGuests] = useState(1);
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    // const [name,setName] = useState('');
    // const [phone, setPhone] = useState('');
// console.log(travelSite)
    const totalFees = differenceInCalendarDays(new Date(checkoutTime), new Date(checkInTime)) * travelSite.price;

    // check if user is logged in or not

    useEffect(()=>{
        axios.get("/profile").then(response=>{
            const data = response.data;

            if(data){
                setLoggedIn(true);
                setUser(data);
            }
        })
    },[])

    const onBookingHandler = async(e)=>{
        e.preventDefault();

        const placeId = travelSite._id;
        const userId = user._id;
        const bookingData = {checkInTime, checkoutTime, numGuests, placeId, userId, totalFees};
        const {data} = await axios.post('/booking', bookingData);
        console.log(data);

        setCheckInTime('');
        setCheckoutTime('');
        setNumGuests(1);
    }

  return (
    <div className='bg-white px-6 py-4 rounded-2xl shadow'>
        <h1 className='font-semibold text-lg mb-2'>${travelSite.price} /per night</h1>
        <div className='border mt-4 rounded-2xl overflow-hidden'>
            <div className='flex justify-between border'>
                <div className=' p-4'>
                    <label>Check-in:</label>
                    <input type="date" value={checkInTime} onChange={(e)=> setCheckInTime(e.target.value)}/>
                </div>
                <div className=' p-4'>
                    <label>Check-out:</label>
                    <input type="date" value={checkoutTime} onChange={(e)=> setCheckoutTime(e.target.value)}/>
                </div>
            </div>
            <div className=' px-4 py-2'>
                    <label>Max. guests:</label>
                    <input type="number" value={numGuests} onChange={(e)=> setNumGuests(e.target.value)} max={travelSite.maxGuest} min={1}/>
            </div>
            {/* <div className=' px-4 py-2'>
                    <label>Full name:</label>
                    <input type="text" value={name} onChange={(e)=> setName(e.target.value)} />
            </div>
            <div className=' px-4 py-2'>
                    <label>Phone number:</label>
                    <input type="tel" value={phone} onChange={(e)=> setPhone(e.target.value)} />
            </div> */}
        </div>
        {loggedIn && (
            <button className='primary mt-4' onClick={(e)=>onBookingHandler(e)}>
            Reserve 
            {checkInTime && checkoutTime && (
                <span> for ${totalFees}</span>
            )}
            </button>
        )}
        {!loggedIn && (
            <div>
                <h1 className='text-sm font-semibold text-red-500 text-center mt-2'>You are not logged in!</h1>
            <Link to={'/login'}>
                <button className='primary mt-4'>
                    Login to your account
                </button>
            </Link>
            </div>
        )}
        
    </div>
  )
}

export default BookingWidget