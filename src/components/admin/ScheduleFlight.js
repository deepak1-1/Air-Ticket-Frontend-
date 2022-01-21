import {useState, useContext, useRef, useEffect} from 'react';
import axios from 'axios';
import { URLInfo, functions } from '../../helper/context'


import AdminNavbar from '../basic/AdminNavbar';
import Loading from '../basic/Loading';


const ScheduleFlight = (props) => {

    const { mainNotifier, inputNotifier, regexMatcher, enable, 
        disable, adminLoginChecker, loginChecker, addHeaders} = useContext(functions)
    const { urlInfo_ } = useContext(URLInfo);

    const [isLoading ,setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [placeList, setPlaceList] = useState([]);
    const [distanceList, setDistanceList] = useState([]);

    const to = useRef(null);
    const from = useRef(null);

    function todayDate(){
        let dateNow = new Date();
        dateNow = dateNow.toISOString();
        dateNow = dateNow.substr(0, 10);
        return dateNow;
    }

    useEffect( ()=>{
        
        axios.get(urlInfo_+"admin/get-destinations", addHeaders({}))
        .then(res=>res.data)
        .then(data=>{
            console.log(data);
            setPlaceList(data.nameList);
            setDistanceList(data.distanceList);
        })
        

    
    }, [])

    return (
            <>  
                <AdminNavbar/>
                <div className="d-flex align-item-center p-2" id="mainDiv">
                    <div className="p-5 text-center row" >
                        <h2 className="mb-0 col-12">Schedule Flight</h2>
                        <div className='mb-3'></div>
                        
                        <div className='col-6 text-left p-2'>
                            <label >To: </label>
                            <br />
                            <select name="to" ref={to} class="custom-select col-8" placeholder='to'>
                                {
                                    placeList.map((eachPlace)=>
                                        <option value={eachPlace}>{eachPlace}</option>
                                    )
                                }
                            </select>
                        </div>

                        <div className='col-6 text-left p-2'>
                            <label>From: </label>
                            <br />
                            <select name="from" ref={from} class="custom-select col-8" placeholder='to'>
                                {
                                    placeList.map((eachPlace)=>
                                        <option value={eachPlace}>{eachPlace}</option>
                                    )
                                }
                            </select>
                        </div>

                        <div className='col-6 text-left p-2'>
                            <label>Start Date: </label>
                            <br />
                            <input type="date" className="form-control col-8" min={todayDate()}/>
                        </div>

                        <div className='col-6 text-left p-2'>
                            <label>Duration(in hours): </label>
                            <br />
                            <input type="number" className="form-control col-8" step="0.01" min="0"/>
                        </div>

                        <select name="repeat" class="custom-select">
                            <option selected>Custom Select Menu</option>
                            <option value="volvo">Volvo</option>
                            <option value="fiat">Fiat</option>
                            <option value="audi">Audi</option>
                        </select>
                        
                        <div className='col-12'>
                            <button className='btn btn-primary col-6'>Schedule</button>
                        </div>
                    </div>
                </div>
            </>

    )

}

export default ScheduleFlight;