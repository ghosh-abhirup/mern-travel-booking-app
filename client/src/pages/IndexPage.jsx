import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ImageComponent from '../components/ImageComponent';
import { UserContext } from '../context/UserContext';

const IndexPage = () => {
  const [travelPlaces, setTravelPlaces] = useState([]);

  useEffect(()=>{
    axios.get('/all-places').then(response=>{
        const {data} = response;
        setTravelPlaces(data);
      })
  }, [])

  return (
    <div className='grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10'>
      {travelPlaces.length >0 && travelPlaces.map((place)=>(
        <Link to={'/travel/'+place._id} key={place._id}>
          <div className='rounded-2xl mb-2'>
          <ImageComponent path={place.photos[0]} alt="photo" className='rounded-2xl object-cover aspect-square'/>
          
          </div>
          <h2 className='font-bold '>{place.address}</h2>
          <h2 className='text-sm  text-gray-500'>{place.title}</h2>
          <h2 className='text-lg '><span className='font-bold text-lg mr-1'>{'$'+place.price}</span>per night</h2>
        </Link>
      ))}
    </div>
  )
}

export default IndexPage