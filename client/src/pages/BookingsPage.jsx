import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import AccountNav from '../components/AccountNav';
import { UserContext } from '../context/UserContext';

const BookingsPage = () => {
    const [bookingData, setBookingData] = useState([]);

    const {user, travelPlaces} = useContext(UserContext);

    useEffect(()=>{
        if(user){
            axios.get('/my-bookings/'+user._id).then(res=>{
                const {data} = res;
                setBookingData(data);
                // console.log(data[0].placeId);

                // const visitData = travelPlaces.filter(el => el._id === data[0].placeId);
                // console.log(visitData);
                // setTravelSite(visitData);
            })
                
        }
    },[user])

    const dateFormatFunc = (date)=>{
        let str = date.toString();
        str = str.substring(0,10);
        return str;
    }

    const onCancelHandler = (e,id)=>{
        e.preventDefault();

        axios.delete('/cancelBooking/'+id)
        setBookingData(bookingData.filter(el => el._id !== id));
    }

    if(!user){
        return (
            <>
            <AccountNav />
            <h1 className='text-center font-semibold text-lg'>Loading ...</h1>
            </>
        );
    }

  return (
    <>
        <AccountNav />

        <div>
            {user && bookingData.length >0 && bookingData.map((booking)=>{
                    const visitData = travelPlaces.filter(el => el._id === booking.placeId);
                    // console.log(visitData)
                    return (
                        <div className='bg-gray-200 rounded-2xl p-4 flex gap-4 mb-4' key={booking._id}>
                            <img className='w-1/4 rounded-2xl p-2' src={'http://127.0.0.1:8000/uploads/'+visitData[0].photos[0]} alt="photo" />            
                            <div className='flex flex-col gap-4 w-3/4 p-2'>
                                <div className='flex gap-2 items-center'>
                                    <p className='font-semibold text-2xl'>Booking Confirmed</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                                    </svg>
                                </div>
                              
                                <div className='flex gap-6'>
                                    <div className='flex flex-col gap-2 bg-white rounded-2xl p-4 w-96'>
                                        <p className='font-bold text-lg'>{visitData[0].title}</p>
                                        <p className='font-semibold text-sm'>{visitData[0].address}</p>
                                    </div>
                                    <div className='flex flex-col gap-2 bg-white rounded-2xl p-4'>
                                        <h1 className='font-bold text-lg'>Duration</h1>
                                        <div className="flex gap-3">
                                            <p>{dateFormatFunc(booking.checkInDate)}</p>
                                            <p className='font-semibold' >to</p>
                                            <p>{dateFormatFunc(booking.checkOutDate)}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 bg-white rounded-2xl p-4 w-40'>
                                        <h1 className='font-bold text-lg'>Guests</h1>
                                        <p className='font-semibold '>{booking.guest}</p>
                                    </div>
                                </div>

                                <div className='flex gap-6'>
                                    <div className='w-52 rounded-lg text-center border-2 py-2 px-4 border-primary text-primary bg-white font-bold'>
                                      <h1>{'Booking price: $'+booking.totalPrice}</h1>
                                    </div>
                                    <button onClick={(e)=>onCancelHandler(e,booking._id)} className=' flex gap-2 items-center bg-primary text-white font-bold py-2 px-4 rounded-lg'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>

Cancel booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
        {user && bookingData.length ===0 && (
            <h1 className='text-center font-semibold text-lg'>You have no upcoming bookings</h1>
        )}
    </>
  )
}

export default BookingsPage