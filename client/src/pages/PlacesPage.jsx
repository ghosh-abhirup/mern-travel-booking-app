import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AccountNav from '../components/AccountNav';
import ImageComponent from '../components/ImageComponent';

const PlacesPage = () => {
  const [places,setPlaces] = useState([]);

  useEffect(()=>{
    axios.get('/places').then(({data})=>{
      // console.log(data[0].title);
      setPlaces(data);
    })
  },[])

  return (
    
    <div>
      <AccountNav />
        <div className='text-center'>
        <Link className='inline-flex items-center gap-2 bg-primary text-white py-2 px-4 font-medium rounded-md' to={'/account/places/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new place
        </Link>
      </div>
      <div className='mt-4 flex flex-col gap-2'>
        {places.length>0 && places.map(place => (
          <Link to={'/account/places/'+ place._id} key={place._id} className='flex justify-between gap-4 bg-gray-200 p-4 rounded-2xl '>
            <ImageComponent path={place.photos[0]} className='w-1/4 rounded-2xl p-2' alt="photo"/>
              
            <div className='flex flex-col gap-2 w-3/4 p-2'>
              <p className='font-semibold text-2xl'>{place.title}</p>
              <p className='font-semibold text-sm cursor-pointer'>{place.address}</p>
              <p className='font-semibold '>{place.desc.substring(0,300)+'...'}</p>
              <div className='flex gap-10'>
                <p><span className='font-semibold'>Check In Time: </span>{place.checkIn+':00'}</p>
                <p><span className='font-semibold'>Check Out Time: </span>{place.checkOut+':00'}</p>
              </div>
              <p><span className='font-semibold mr-2'>{'$'+place.price}</span>per night</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PlacesPage