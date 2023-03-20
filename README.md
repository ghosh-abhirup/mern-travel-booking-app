# mern-travel-booking-app
This is a MERN app that shows the functionalities of a proper travel app where an user can register his place and book a place to visit.

# Concepts Used
`React Hooks` `React State` `Context API` `react-router-dom` `fetch` `MongoDB Models` `bcrypt` `hash` `Promise`

# File Structure
:file_folder: **api** &emsp; *This folder is the backend or server-side of the MERN app*  
  - :file_folder: **models** &emsp; *Contains all the MongoDB models* 
  - :file_folder: **uploads** &emsp; *Contains initially uploaded pictures later I connected AWS S3 server to upload the pictures there*  
  - :memo: **index.js** &emsp; *Contains all api end points and its functions one can build different :file_folder:routes and :file_folder:controller for simplicity*  
  
:file_folder: **client/src** 
  - :file_folder: **components** &emsp; *Contains all the separate components used in the MERN app*  
  - :file_folder: **context** &emsp; *Contains Usercontext.js, the context API file*  
  - :file_folder: **pages** &emsp; *Contains all the different pages built for the app*  
  - :memo: **App.jsx** &emsp; *Contains all routes to the different pages of the app*  

# Deploy
`Deployed with Vercel`  
- Link: https://mern-travel-booking-app.vercel.app/
