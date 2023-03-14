import React from 'react'

const ImageComponent = ({path, ...rest}) => {

    const source = path.includes('https://') ? path : 'http://127.0.0.1:8000/uploads/'+path;
  return (
    <img src={source} {...rest}/>
  )
}

export default ImageComponent