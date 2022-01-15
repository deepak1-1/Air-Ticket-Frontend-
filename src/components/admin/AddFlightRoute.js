import axios from 'axios';
import { useContext, useState, useRef, useEffect } from 'react';
import { URLInfo, functions } from '../../helper/context'

import AdminNavbar from '../basic/AdminNavbar';
import Loading from '../basic/Loading';

const AddFlightRoute = (props) =>{

    const { mainNotifier, inputNotifier, adminLoginChecker, loginChecker, addHeaders } = useContext(functions)
    const { urlInfo_ } = useContext(URLInfo);

    const [isLoading ,setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);

    const mainNotify = useRef(null);
    const place1 = useRef(null);
    const place1Notify = useRef(null);
    const place2 = useRef(null);
    const place2Notify = useRef(null);
    const distance = useRef(null);
    const distanceNotify = useRef(null);
    const addRouteBtn = useRef(null);


    useEffect( ()=> {
        adminLoginChecker().then(res=>res.data)
        .then(data => {
            loginChecker(data);
            setIsLoading(false);
            setIsLogin(true);
        })

    }, [])


    const handleAddRoute = (e) => {
        
        let place1Pass = false;
        let place2Pass = false;
        let distancePass = false;

        if(place1.current.value.trim().length === 0){
            inputNotifier(place1, place1Notify, "Empty", "danger");
        } else { place1Pass = true }

        if(place2.current.value.trim().length === 0){
            inputNotifier(place2, place2Notify, "Empty", "danger");
        } else { 
            if(place1.current.value === place2.current.value){
                inputNotifier(place2, place2Notify, "can't be same", "danger");
                inputNotifier(place1, place1Notify, "", "danger");
            } else { place2Pass = true }
        }

        let test = Number(distance.current.value);
        if(!test){
            inputNotifier(distance, distanceNotify, "Invalid", "danger");
        } else {
            if(test>=50){
                distancePass = true;
            } else { inputNotifier(distance, distanceNotify, "min value 50", "danger"); }
        }

        if(place1Pass && place2Pass && distancePass){
            
            addRouteBtn.current.innerText = "Adding...";

            axios.post(urlInfo_+"admin/add-flight-route", {
                place1: place1.current.value,
                place2: place2.current.value,
                distance: Number(distance.current.value)
            }, addHeaders({})).then(res=>res.data)
            .then(data=>{
                addRouteBtn.current.innerText = "Add Route";
                if(data.exists){
                    mainNotifier(mainNotify, "Already Exists", "danger");
                } else {
                    if(data.added){
                        mainNotifier(mainNotify, "Added Successfully", "danger");
                        place1.current.value = null;
                        place2.current.value = null;
                        distance.current.value = null;
                    } else {
                        mainNotifier(mainNotify, "Some Issue While Adding", "danger");
                    }
                }

            })
            .catch(err=>{
                console.log(err);
                addRouteBtn.current.innerText = "Add Route";
                mainNotifier(mainNotify, "Some Error", "danger");
            })
        }
    }

    return (
        <>
            {
                isLoading? <Loading />:
                <>
                    {
                        !isLogin? "":
                        <>
                            <AdminNavbar />
                            <div className="d-flex align-item-center p-2" id="mainDiv">
                                <div className="p-5 text-center" id="formDiv">
                                    <h2 className="mb-1">Add Flight Route</h2>
                                    <div ref={mainNotify} className='mb-3'></div>
                                    
                                    <div className="input-group mb-0">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
                                        </div>
                                        <input type="text"  ref={place1} className="form-control" placeholder="Enter First Place"/>
                                    </div>
                                    <div ref={place1Notify} className='mb-2'></div>

                                    <div className="input-group mb-0">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
                                        </div>
                                        <input type="text"  ref={place2} className="form-control" placeholder="Enter Second Place"/>
                                    </div>
                                    <div ref={place2Notify} className='mb-2'></div>

                                    <div className="input-group mb-0">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i class="fas fa-route"></i></span>
                                        </div>
                                        <input type="text"  ref={distance} className="form-control" placeholder="Enter Distance in KM"/>
                                    </div>
                                    <div ref={distanceNotify} className='mb-4'></div>
                                    <button className='btn btn-primary col-6' ref={addRouteBtn} onClick={handleAddRoute}>Add Route</button>
                                </div>
                            </div>
                        </>
                    }
                </>
            }
        </>
    )
}


export default AddFlightRoute;