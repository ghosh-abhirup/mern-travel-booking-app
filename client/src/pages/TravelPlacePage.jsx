import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import BookingWidget from '../components/BookingWidget';
import ImageComponent from '../components/ImageComponent';

const TravelPlacePage = () => {
    const [travelSite, setTravelSite] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const {id} = useParams();

    useEffect(()=>{
        if(!id){
            return ;
        }

        const axiosLink = '/travel/'+id;
        axios.get(axiosLink).then(response=>{
            // console.log(response.data)
            setTravelSite(response.data)
        })
    },[])

    if(!travelSite){
        return '';
    }

    if(showAllPhotos){
        return (
            <div className='absolute bg-white min-h-screen inset-0'>
                <div className='p-8 grid grid-cols-1 gap-4'>
                    <div >
                        <h2 className='font-medium text-2xl'>Photos of {travelSite.title}</h2>
                        <button onClick={()=>setShowAllPhotos(false)} className='fixed right-12 top-6 py-2 px-4 flex items-center gap-2 shadow shadow-black rounded-2xl'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
Close photos
                        </button>
                    
                    </div>
                    {travelSite.photos.length>0 && travelSite.photos.map((photo)=>(
                        <div key={photo}>
                            <img src={'http://127.0.0.1:8000/uploads/'+photo} alt="photo" className='w-4/5 object-cover mx-auto'/>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

  return (
    <>
    <div className='mt-10 bg-gray-100 -mx-8 px-8 py-4'>
        <div className='flex flex-col items-start'>
            <h1 className='text-2xl '>{travelSite.title}</h1>
            <a target="_blank" href={'https://maps.google.com/?q='+travelSite.address} className='block text-md font-bold my-2 underline'>{travelSite.address}</a>
            <div className='relative'>
                <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                    <div>
                        <ImageComponent onClick={()=>setShowAllPhotos(true)} className='aspect-square object-cover cursor-pointer' alt="" path={travelSite.photos[0]}/>
                        {/* <img onClick={()=>setShowAllPhotos(true)} className='aspect-square object-cover cursor-pointer' src={'http://127.0.0.1:8000/uploads/'+travelSite.photos[0]} alt="" /> */}
                    </div>
                    <div className='grid'>
                    <ImageComponent onClick={()=>setShowAllPhotos(true)} className='aspect-square object-cover cursor-pointer' alt="" path={travelSite.photos[1]}/>
                        {/* <img onClick={()=>setShowAllPhotos(true)} src={'http://127.0.0.1:8000/uploads/'+travelSite.photos[1]} className='aspect-square object-cover cursor-pointer' alt="" /> */}
                        <div className='overflow-hidden'>
                        <ImageComponent onClick={()=>setShowAllPhotos(true)} className='aspect-square object-cover relative top-2 cursor-pointer' alt="" path={travelSite.photos[2]}/>
                            {/* <img onClick={()=>setShowAllPhotos(true)} src={'http://127.0.0.1:8000/uploads/'+travelSite.photos[2]} className='aspect-square object-cover relative top-2 cursor-pointer' alt="" /> */}
                        </div>
                    </div>
                </div>
                <button onClick={()=>setShowAllPhotos(true)} className='flex items-center gap-2 absolute bottom-2 right-2 py-2 px-4 rounded-2xl bg-white shadow shadow-grey-500'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
</svg>

                    Show all photos
                    </button>
            </div>
            
            <div className="my-5 grid gap-4 grid-cols-1 md:grid-cols-[2fr_1fr] w-full">
                <div>
                    <div>
                        <h1 className='font-semibold text-2xl mb-2'>Description</h1>
                        <p className='text-md'>{travelSite.desc}</p>
                    </div>
                    <div className='my-5'>
                        <h1><span className='font-semibold '>Check-in: </span>{travelSite.checkIn}</h1>
                        <h1><span className='font-semibold '>Check-out: </span>{travelSite.checkOut}</h1>
                        <h1><span className='font-semibold '>Max. guests: </span>{travelSite.maxGuest}</h1>
                    </div>
                    
                </div>
                <div>
                    <BookingWidget travelSite={travelSite}/>
                </div>
                
            </div>
            
        </div>
        
    </div>
    <div className='bg-white -mx-8 px-8 py-4'>
    <h1 className='font-semibold text-2xl mb-2'>Extra Information</h1>
    <h1>{travelSite.extraInfo}</h1>
</div>
</>
    
  )
}

export default TravelPlacePage