import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import AdminBar from './AdminBar';
import './css/AdminBar.css';
import { basicInfo } from "../../store/Context";


function RouteUpdate(){


    const [routeData, setRouteData] = useState([]);
    const {basicInfo_, setBasicInfo_} = useContext(basicInfo)

    axios.get( basicInfo_.url + 'admin/get-route-data' )
            .then( result=>{
                const data = result.data;
                if(!data.valid){
                    window.location.href = '/login-admin';
                } else if(data.error){
                    console.log(data.error);
                } else {
                    setRouteData(data.result);
                    console.log(data.result);
                }
            })

    useEffect( ()=>{
        return (
            <>
                <AdminBar />
                
                <div className='mainDiv'>
                    {
                        // const arrayLength = routeData.length;
                        routeData.map( route => {
                            <div doc={route.id}>HEllo World</div>
                        })
                    }
                </div>
            </>
        )
    }, [routeData])
    
    return null;
    
}

export default RouteUpdate;