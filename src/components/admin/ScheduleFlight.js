import {useState, useContext, useRef, useEffect} from 'react';
import axios from 'axios';
import { URLInfo, functions } from '../../helper/context'


import AdminNavbar from '../basic/AdminNavbar';
import Loading from '../basic/Loading';


const ScheduleFlight = (props) => {

    const { mainNotifier, inputNotifier, regexMatcher, enable, show, hide,
        disable, adminLoginChecker, loginChecker, addHeaders} = useContext(functions)
    const { urlInfo_ } = useContext(URLInfo);

    const initialState = {
        to: "",
        from: "",
        startDate: "",
        startTime: "",
        duration: "",
        repeatOn: "",
        repeatDay: "",
        repeatWeek: "",
        repeatWeekDay: [],
        endsOn: "",
        flightId: ""
    }

    const [isLoading ,setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [placeList, setPlaceList] = useState([]);
    const [distanceList, setDistanceList] = useState([]);
    const [data, setData] = useState(initialState);
    
    const selectedWeekList = [];
    const weekDaysList = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]

    const to = useRef(null);
    const toNotify = useRef(null);
    const from = useRef(null);
    const fromNotify = useRef(null);
    const startDate = useRef(null);
    const startDateNotify = useRef(null);
    const duration = useRef(null);
    const durationNotify = useRef(null);
    const startTime = useRef(null);
    const startTimeNotify = useRef(null);
    const endsOnDate = useRef(null);
    const endsOnOccurence = useRef(null);
    const endsOnRadioNever = useRef(null);
    const endsOnRadioDate = useRef(null);
    const endsOnRadioOccurence = useRef(null);

    //Divs 
    const selectDaysDiv = useRef(null);
    const endsOnDiv = useRef(null);

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
            setPlaceList(data.nameList);
            setData({
                to: data.nameList[0],
                from: data.nameList[0]

            })
            setDistanceList(data.distanceList);
        })
    
    }, [])


    const handleWeekDaysInput = (e) => {
        
        let className = e.target.className.split(" ");
        if(className.length == 1){
            selectedWeekList.push(e.target.innerText);
            e.target.className = "weekDays active";
        } else {
            var index = selectedWeekList.indexOf(e.target.innerText);
            if (index !== -1) {
                selectedWeekList.splice(index, 1);
            }
            e.target.className = "weekDays";
        }
    }

    const handleRepeatOptionsInput = (e) => {
        
        switch(e.target.value){
            case "NO":
                hide(selectDaysDiv);
                hide(endsOnDiv);
                break
            case "DAY":
                show(endsOnDiv);
                hide(selectDaysDiv);
                break;
            case "WEEK":
                show(endsOnDiv);
                show(selectDaysDiv);
                break
        }
    }

    const handleInputTo = (e) => {

        if(data.from === e.target.value){
            console.log("Inside to if");
            inputNotifier(to, toNotify, "can't be same", "danger");
            inputNotifier(from, fromNotify, "", "danger");
        } else {
            console.log("Inside to else");
            setData({
                ...data,
                to: e.target.value
            })
        }
        console.log(data);
    }

    const handleInputFrom = (e) => {

        if(data.to === e.target.value){
            console.log("Inside from if");
            inputNotifier(from, fromNotify, "can't be same", "danger");
            inputNotifier(to, toNotify, "", "danger");
        } else {
            console.log("Inside from else");
            setData({
                ...data,
                from: e.target.value
            })
        }
        console.log(data);

    }

    const handleInputStartDate = (e) => {
        console.log(e.target.value);
        let date = new Date(e.target.value);
        setData({
            ...data,
            startDate: e.target.value
        })
        // console.log();
    }

    const handleEndsOnClick = (e) =>{

        if(endsOnRadioNever.current.checked){
            disable(endsOnDate);
            disable(endsOnOccurence);
        }

        if(endsOnRadioDate.current.checked){
            enable(endsOnDate);
            disable(endsOnOccurence);
        }

        if(endsOnRadioOccurence.current.checked){
            disable(endsOnDate);
            enable(endsOnOccurence);
        }
    }

    return (
            <>  
                <AdminNavbar/>
                <div className="container p-2">
                    <div className="p-5 text-center row" >
                        <h2 className="mb-0 col-12">Schedule Flight</h2>
                        <div className='mb-3'></div>
                        
                        
                        <div className='col-4 text-center p-2 mx-auto'>
                            <label className='w-100 text-left'>To: </label>
                            <br />
                            <select name="to" ref={to} onClick={handleInputTo} class="custom-select" placeholder='to'>
                                {
                                    placeList.map((eachPlace)=>
                                        <option value={eachPlace}>{eachPlace}</option>
                                    )
                                }
                            </select>
                            <div className='text-center' ref={toNotify}></div>
                        </div>

                        <div className='col-4 p-2 text-center mx-auto'>
                            <label className='w-100 text-left'>From: </label>
                            <br />
                            <select name="from" ref={from} onClick={handleInputFrom} class="custom-select" placeholder='to'>
                                {
                                    placeList.map((eachPlace)=>
                                        <option value={eachPlace}>{eachPlace}</option>
                                    )
                                }
                            </select>
                            <div className='text-center' ref={fromNotify}></div>
                        </div>

                        <div className='col-4 text-center mx-auto p-2'>
                            <label className="w-100 text-left">Start Date: </label>
                            <br />
                            <input type="date" onInput={handleInputStartDate} className="form-control" ref={startDate} min={todayDate()}/>
                            <div className='text-center' ref={startDateNotify}></div>
                        </div>

                        <div className='col-4 text-center mx-auto p-2'>
                            <label className='w-100 text-left'>Duration(in hours): </label>
                            <br />
                            <input type="number" ref={duration} className="form-control" step="0.01" min="0"/>
                            <div className='text-center' ref={durationNotify}></div>
                        </div>

                        <div className='col-4 text-center mx-auto p-2'>
                            <label className='w-100 text-left'>Distance(in Km): </label>
                            <br />
                            <input type="text" className="form-control" disabled/>
                        </div>

                        <div className='col-4 text-center mx-auto p-2'>
                            <label className='w-100 text-left'>Start Time: </label>
                            <br />
                            <input type="time" className="form-control" ref={startTime}/>
                            <div className='text-center' ref={startTimeNotify}></div>
                        </div>
                        
                        <div className='col-12 text-left row mt-3'>
                            <label className='text-left col-2'>Repeat Every: </label>
                            <input type='number' className="form-control col-2 mx-1" min={1} />
                            <select name="repeat" class="custom-select col-2 mx-1" onChange={handleRepeatOptionsInput}>
                                <option value="NO" selected>No</option>
                                <option value="DAY">Day</option>
                                <option value="WEEK">Week</option>
                            </select>
                        </div>
                        <div className='col-12  row mt-4 hide' ref={selectDaysDiv}>
                            <label className='col-2 text-left'>Select Days: </label>
                            <div className='col-4'>
                                {
                                    weekDaysList.map((eachDay) => 
                                        <span onClick={handleWeekDaysInput} className='weekDays'>{eachDay}</span>
                                    )
                                }
                            </div>
                        </div>

                        <div className='col-12  row mt-4 hide' ref={endsOnDiv}>
                            <label className='col-2 text-left' for="endsOn">Ends On: </label>
                            <div className='col-10 text-left' onClick={handleEndsOnClick}>
                            <div class="custom-control custom-radio custom-control-inline col-12 my-2">
                                    <input type="radio" ref={endsOnRadioNever} class="custom-control-input" id="never" name="endsOn" value="never" />
                                    <label class="custom-control-label" for="never">Never</label>
                                </div>
                                <div class="custom-control custom-radio custom-control-inline col-12 my-2">
                                    <input type="radio" ref={endsOnRadioDate} class="custom-control-input" id="after" name="endsOn" value="afterDate" />
                                    <label class="custom-control-label" for="after">After Date</label>
                                    <input type="date" min={todayDate()} ref={endsOnDate} className="form-control col-6 mx-3" disabled/>
                                </div>
                                <div class="custom-control custom-radio custom-control-inline col-12 my-2">
                                    <input type="radio" ref={endsOnRadioOccurence} class="custom-control-input" id="occurence" name="endsOn" value="afterOccurence" />
                                    <label class="custom-control-label" for="occurence">After</label>
                                    <input className='form-control-sm mx-3 col-1' ref={endsOnOccurence} type="number" min={1} disabled/>
                                    <label class="custom-control-label mx-1">occurences</label>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 mt-3 '>
                            <button className='btn btn-primary col-6'>Schedule</button>
                        </div>
                    </div>
                </div>
            </>

    )

}

export default ScheduleFlight;