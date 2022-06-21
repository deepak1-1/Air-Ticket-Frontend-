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
    useEffect(() => {
        
        // setIsLoading(false);

        let login = window.localStorage.getItem('login')
        let userChecker;
        switch(login){
            case "false":
                setIsLoading(false); 
                break;
            case "ADMIN":
                window.location.href = "/admin";
                break;
            case "USER":
                userChecker = userLoginChecker();
                userChecker.then(res=>res.data)
                .then(data=>{
                    if(loginChecker(data)){
                        setLoginValue(true);
                    }
                })
                setIsLoading(false);
                break;
        }
        
        // Promise.all([userChecker])
        // .then(values=>{
        //     userData = values[0].data;
        //     if(loginChecker(userData)){
        //         setLoginValue(true);
        //     }
        //     setIsLoading(false);
        // })

    }, [])

    return (
        <>
            {isLoading? <Loading />:
            
            <>
                { loginValue? <UserNavbar /> : <BasicNavbar />}
                <div className='container text-center' id="mainDiv">
                    World + { urlInfo_ }
                </div>
            </>
            }
        </>
        
    )
}

export default Home;