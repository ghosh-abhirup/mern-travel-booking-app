import { useState, createContext, useEffect } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export const UserContextProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [travelPlaces, setTravelPlaces] = useState([]);

    useEffect(()=>{
        axios.get("/profile")
            .then(({data})=>{
                setUser(data);
                setReady(true);
            })

        axios.get('/all-places').then(response=>{
            const {data} = response;
            // console.log(data);
            setTravelPlaces(data);
          })
    }, [])

    return (
        <UserContext.Provider value={{user, setUser, ready, travelPlaces, setTravelPlaces}}>
            {children}
        </UserContext.Provider>
    );
}