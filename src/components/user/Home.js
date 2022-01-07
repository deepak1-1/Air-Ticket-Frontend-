import axios from 'axios';
import {useState, useContext, useRef, useEffect } from 'react';
import { URLInfo, functions } from '../../helper/context';

import BasicNavbar from '../basic/BasicNavbar';
import UserNavbar from '../basic/UserNavbar';
import Loading from '../basic/Loading';

const Home = (props) => {

    const {urlInfo_} = useContext(URLInfo);
    const { adminLoginChecker, userLoginChecker,loginChecker } = useContext(functions);
    
    const [ loginValue, setLoginValue] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    // runs everytime on reload
    useEffect( ()=>{

        let login = window.localStorage.getItem('login')
        if(login !== "admin"){
            const returnValue = userLoginChecker();
            setLoginValue(returnValue);
        } else {
            loginChecker();
        }        
        
        setIsLoading(false);

    }, [])

    return (
        <>
            {isLoading? <Loading />:
            
            <>
                { loginValue? <UserNavbar /> : <BasicNavbar />}
                <div className='container text-center' id="mainDiv">
                    Hello World + { urlInfo_ }
                </div>
            </>
            }
        </>
        
    )
}

export default Home;