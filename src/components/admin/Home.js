import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import AdminBar from './AdminBar'
import './css/Home.css';
import { basicInfo } from "../../store/Context";


function Home(props){

    const [countData, setCountData] = useState({
        flight: 0,
        booking: 0,
        admin: 0
    })

    const {basicInfo_, setBasicInfo_} = useContext(basicInfo)

    // if(basicInfo_.login !== "Admin"){
    //     window.location.href = '/'
    // }
    // console.log(basicInfo_.login);

    console.log(basicInfo_.login);

    function render(){

        // axios.get( basicInfo_.url + 'admin/admin-page' )
        // .then(result =>{
        //     if(!result.Valid){
        //         window.location.href = '/login-admin'
        //     }
        // })

        axios.get( basicInfo_.url + 'admin/count-today')
        .then(result => {
            let data = result.data.data;
            setCountData({
                ...countData,
                flight: data.flight,
                booking: data.booking
            })
        })
    
        axios.get( basicInfo_.url + 'admin/admin-count')
            .then(result => {
                const data = result.data.data
                setCountData( {
                    ...countData,
                    admin: data
                })
            })
    }

    useEffect( ()=>{
        render();
    }, [])

    return (
        <>
            <AdminBar />
            <div className="mainDiv row text-center">
                <div className="col-4 p-1">
                    <div id='circle'>
                        <h2 className="display-1">{String(countData.flight)}</h2>
                        <p className="font-weight-bold">Todays flight</p>
                    </div>
                </div>
                <div className="col-4 p-1">
                    <div id='circle'>
                        <h2 className="display-1">{String(countData.booking)}</h2>
                        <p className="font-weight-bold">Todays Booking</p>
                    </div>
                </div>
                <div className="col-4 p-1">
                    <div id='circle'>
                        <h2 className="display-1">{String(countData.admin)}</h2>
                        <p className="font-weight-bold">Total Admins</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;