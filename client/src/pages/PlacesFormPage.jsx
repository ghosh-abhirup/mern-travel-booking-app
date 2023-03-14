import React, { useEffect, useState } from 'react'

import Perks from '../components/Perks';
import axios from 'axios';
import AccountNav from '../components/AccountNav';
import { Navigate, useParams } from 'react-router-dom';
import ImageComponent from '../components/ImageComponent';

const PlacesFormPage = () => {

  const {id} = useParams();

    const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhoto, setAddedPhoto] = useState([]);
  const [photoLink, setPhotoLink] = useState('');
  const [desc, setDesc] = useState('');
  const [perks,setPerks] = useState([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guest, setGuest] = useState(1);
  const [extraInfo, setExtraInfo] = useState('');
  const [redirect, setRedirect] = useState(false); 
  const [price, setPrice] = useState('');

  useEffect(()=>{
    if(!id){
      return ;
    } else{
      axios.get('/places/'+id).then(response=>{
        const {data} = response;

        setTitle(data.title);
        setAddress(data.address);
        setAddedPhoto(data.photos);
        setDesc(data.desc);
        setPerks(data.perks);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setGuest(data.maxGuest);
        setExtraInfo(data.extraInfo);
        setPrice(data.price);
      })
    }
  },[])

  const addPhotoHandler = async(e)=>{
    e.preventDefault();
    const {data} = await axios.post('/upload-by-link', {link: photoLink});
    
    setAddedPhoto([...addedPhoto, data]);

    setPhotoLink('');
  }

  const uploadPhotoHandler = (e)=>{
    const files = e.target.files;
    const data = new FormData();

    for(let i=0; i<files.length; i++){
      data.append('photos', files[i]);
    }

    axios.post('/upload', data, {
      headers: {'Content-type': 'multipart/form-data'}
    }).then(response =>{
      const {data:filenames} = response;
      setAddedPhoto([...addedPhoto, ...filenames]); 
    })
  }

  const savePlaceHandler = async(e)=>{
    e.preventDefault();

    if(!id){
      // new place
      const place = {title, address, addedPhoto, desc, perks, checkIn, checkOut, guest,extraInfo, price};

      await axios.post('/places', place);
    } else{
      // update place
      const place = {id, title, address, addedPhoto, desc, perks, checkIn, checkOut, guest,extraInfo, price};

      await axios.put('/places', place);
    }
    setRedirect(true);
  }

  const onPhotoDeleteHandler = (e,link)=>{
    e.preventDefault();
    setAddedPhoto(addedPhoto.filter(photo => photo !== link));
  }

  const selectAsMainPhoto = (e,link) =>{
    e.preventDefault();
    const notSelectedPhotos = addedPhoto.filter(photo => photo !== link);

    setAddedPhoto([link, ...notSelectedPhotos]);
  }

  if(redirect){
    return <Navigate to={'/account/places'}/>
  }

  return (
    <>
    <AccountNav />
    <div className='mx-auto w-1/2'>
          <form onSubmit={savePlaceHandler}>
            <h2 className='font-medium mt-2 text-lg'>Title</h2>
            <input type="text" name="title" id="title" placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)}/>
            <h2 className='font-medium mt-2 text-lg'>Address</h2>
            <input type="text" placeholder='Address' value={address} onChange={e=>setAddress(e.target.value)}/>
            <h2 className='font-medium mt-2 text-lg'>Photos</h2>
            <div className='flex gap-2 items-center'>
              <input type="text" placeholder='Add photos using link' value={photoLink} onChange={e=>setPhotoLink(e.target.value)}/>
              <button className='py-2 px-4 rounded-lg font-medium' onClick={addPhotoHandler}>Grab&nbsp;Photo</button>
            </div>
            <div className='flex gap-2 justify-start flex-wrap'>
              {addedPhoto.length >0 && addedPhoto.map(link=> (
                <div className='h-32 flex relative' key={link} >
                  <ImageComponent path={link} className='rounded-lg object-cover'/>
                  {/* <img src={`http://127.0.0.1:8000/uploads/${link}`} className='rounded-lg object-cover' /> */}
                  <button onClick={(e)=>onPhotoDeleteHandler(e,link)} className='absolute bg-black p-2 text-white bg-opacity-40 cursor-pointer rounded-lg bottom-1 right-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                  <button onClick={(e)=>selectAsMainPhoto(e,link)} className='absolute bg-black p-2 text-white bg-opacity-40 cursor-pointer rounded-lg bottom-1 left-1'>
                    {link === addedPhoto[0] && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
</svg>

                    )}
                    {link !== addedPhoto[0] && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
</svg>
                    )}
                  
                  </button>
                </div>
              ))}
              <label className='p-8 rounded-md font-medium bg-transparent border flex items-center flex-col cursor-pointer'>
                <input type="file" className='hidden' onChange={uploadPhotoHandler}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
                Upload Photos
              </label>
            </div>
            <h2 className='font-medium mt-2 text-lg'>Description</h2>
            <textarea rows={5} className='' placeholder='Description of your place' value={desc} onChange={e=>setDesc(e.target.value)}/>
            <h2 className='font-medium mt-2 text-lg'>Perks</h2>
            <div className='grid gap-2 grid-cols-2 md:grid-cols-3 mt-2'>
              <Perks selected={perks} onChange={setPerks}/>
            </div>
            <div className='w-full flex gap-2'>
              <div>
                <h2 className='font-medium mt-4 text-lg'>Check in time</h2>
                <input type="text" placeholder='Ex. 14:00' value={checkIn} onChange={e=>setCheckIn(e.target.value)}/>
              </div>
              <div>
                <h2 className='font-medium mt-4 text-lg'>Checkout time</h2>
                <input type="text" placeholder='Ex. 14:00' value={checkOut} onChange={e=>setCheckOut(e.target.value)}/>
              </div>
              <div>
                <h2 className='font-medium mt-4 text-lg'>Max. guests</h2>
                <input type="number" placeholder='Ex. 2' value={guest} onChange={e=>setGuest(e.target.value)}/>
              </div>
            </div>
            <h2 className='font-medium mt-2 text-lg'>Price per night</h2>
            <h2 className='font-medium mt-2 text-sm text-gray-500 leading-2'>in dollars ($)</h2>
            <input type="number" name="price" id="price" placeholder='$1000' value={price} onChange={e=>setPrice(e.target.value)}/>
            <h2 className='font-medium mt-4 text-lg'>Extra Information</h2>
            <textarea rows={5} className='' placeholder='House rules, prohibitions etc.' value={extraInfo} onChange={e=>setExtraInfo(e.target.value)}/>

            <button className='primary my-4'>Save</button>
          </form>
        </div>
        </>
  )
}

export default PlacesFormPage