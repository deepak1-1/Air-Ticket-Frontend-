import React from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner';
import ReactLoading from 'react-loading';

const Loading = () => {
    return (
        <>  
            {/* <h2 className='display-5'>Loading    </h2> */}
            {/* <Loader
                type="Oval"
                color='#4d423f'
                height={100}
                width={100}
                timeout={11000}
                radius={5}
            /> */}
            <ReactLoading
                type= "bars"
                color='#4d423f'
                height={70}
                width={80}
            />
        </>
    )
}

export default Loading
