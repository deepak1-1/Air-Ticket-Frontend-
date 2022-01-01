import React, {useState, useEffect} from "react";
import axios from 'axios';
import AdminBar from "./AdminBar";
import './css/AddAdmin.css';

function ScheduleFlight(props) {

    const initialState = {
        to: "",
        from: "",
        km: "",
        fair: '',
        duration: '',
        takeoffDate: '',
        takeoffTime: '',
        userId: '61a4f09e61a2d2d728b90b2b'
    }
    const [flightData, setFlightData] = useState(initialState)


    //
    const destinationInitialState = {
        places: [],
        distance: []
    }
    const [destinationData, setDestinationData] = useState(destinationInitialState);


    const email_exp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          adharCard_exp = /^[2-9]{1}[0-9]{11}$/,
          mobile_exp = /^(91|0|)[6-9]\d{9}$/;


    //function to check regex matching
    function check_regex_match( regex_exp, input_string ){

        return input_string.match(regex_exp)? true: false;
        
    }

    // to show red color notifications
    function toNotifyDanger(div, errorMessage, inputField){
        
        div.innerText = errorMessage;
        div.style.color = 'red';
        inputField.style.border = '2px solid red';

        setTimeout( ()=>{
            div.innerText = '';
            div.style.color = '';
            inputField.style.border = '';
        },3000)
    }

    // to show green color Notifications
    function toNotifySuccess(div, errorMessage, inputField){
        
        div.innerText = errorMessage;
        div.style.color = 'green';
        inputField.style.border = '2px solid green';

        setTimeout( ()=>{
            div.innerText = '';
            div.style.color = '';
            inputField.style.border = '';
        },3000)
    }

    function getById(id){
        return document.getElementById(id);
    }

    //function to genrate min date as today
    function minDate(){
        let dateNow = new Date();
        dateNow = dateNow.toISOString();
        dateNow = dateNow.substr(0, 10);
        return dateNow;
    }

    // function to get Data
    function render(){

        axios.get('http://localhost:4000/admin/get-destinations')
        .then(result => {

            const data = result.data;
            setDestinationData({
                ...destinationData,
                distance: data.distanceList,
                places: data.nameList
            })
        })
    }

    useEffect( ()=>{
        render();
    }, [])

    // ************* main functions starts here **************

    const fromInput = getById('from'),
          toInput = getById('to'),
          kmInput = getById('km'),
          takeoffDateInput = getById('takeoffDate'),
          takeoffTimeInput = getById('takeoffTime'),
          durationInput = getById('duration');
    const fromNotify = getById('fromNotification'),
          toNotify = getById('toNotification'),
          kmNotify = getById('kmNotification'),
          takeoffDateNotify = getById('takeoffDateNotification'),
          takeoffTimeNotify = getById('takeoffTimeNotification'),
          durationNotify = getById('durationNotification'),
          mainNotify = getById('mainNotification');
    const noBtn = getById('noBtn');

    // to handle inputs of fields
    function handleInputTo(e){

        console.log(flightData.from,"+",e.target.value)
        if(flightData.from === e.target.value){
            toNotifyDanger( toNotify, 'can\'t be same' , toInput )
        } else {
            setFlightData({
                ...flightData,
                to: e.target.value
            })

            destinationData.distance.forEach( eachRoute =>{
                if((eachRoute[0] === flightData.from && eachRoute[1] === flightData.to) || 
                   (eachRoute[0] === flightData.to && eachRoute[1] === flightData.from))
                   {
                       kmInput.value = eachRoute[2];
                       setFlightData({
                           ...flightData,
                           km: eachRoute[2],
                           fair: eachRoute[2]*50
                       })
                       
                   }
            })
        }
    }

    function handleInputFrom(e){
        toInput.disabled = false;
        setFlightData({
            ...flightData,
            from: e.target.value
        })
    }
    
    function handleInputTakeoffDate(e){
        let takeoffDate = e.target.value;
        takeoffDate = takeoffDate.split('-');
        takeoffDate = takeoffDate[2]+"-"+takeoffDate[1]+"-"+takeoffDate[0];
        
        setFlightData({
            ...flightData,
            takeoffDate: takeoffDate
        })
    }

    function handleInputTakeoffTime(e){
        
        let time = e.target.value;
        time = time.split(':')
        let date = flightData.takeoffDate.split('-');

        const dateNow = new Date();
        const inputDate = new Date(date[2], date[1], date[0], time[0],time[1]);
        if(inputDate>dateNow){
            setFlightData({
                ...flightData,
                takeoffTime: time[0]+":"+time[1]
            })
        } else {
            toNotifyDanger(takeoffTimeNotify, "Please select valid Time", takeoffTimeInput);
        }
    }

    function handleInputDuration(e){

        const duration = Number(e.target.value);
        if(duration>20){
            toNotifyDanger(durationNotify, 'Duration can\'t be more than 20 hrs', durationInput);
        } else {    
            setFlightData({
                ...flightData,
                duration: e.target.value
            })
        }
    }

    // function to handle click on
    function handleScheduleBtn(){

        let toPass = false, fromPass = false, takeoffDatePass = false,
            takeoffTimePass = false, durationPass = false;

        if(flightData.to === ""){
            toNotifyDanger( toNotify, 'Select where flight will go', toInput);
        } else { toPass = true }

        if(flightData.from === ""){
            toNotifyDanger( fromNotify, 'Select where flight starts', fromInput );
        } else { fromPass = true }

        if(flightData.takeoffDate === ""){
            toNotifyDanger( takeoffDateNotify, 'select a Date', takeoffDateInput );
        } else { takeoffDatePass = true }

        if(flightData.takeoffTime === ""){
            toNotifyDanger( takeoffTimeNotify, 'select a time', takeoffTimeInput);
        } else { takeoffTimePass = true }

        if(flightData.duration === ""){
            toNotifyDanger( durationNotify, 'select duration of flight', durationInput);
        } else { durationPass = true }

        if(toPass && fromPass && takeoffDatePass && takeoffTimePass && durationPass){
            getById('openModal').click()
        }
    }

    function handleYesBtn(){

        axios.post('http://localhost:4000/admin/schedule-flight', flightData)
            .then(result=>{
                
                noBtn.click();
                const data = result.data;                
                if(data.error){
                    toNotifyDanger( mainNotify, 'Unable to Schedule!', toInput );
                } else if(data.alreadyExists){
                    toNotifyDanger( mainNotify, 'Same flight Already exists', toInput );
                } else if(data.scheduled){
                    toNotifySuccess( mainNotify, 'Scheduled successfully!', toInput );

                    setTimeout( ()=>{
                        window.location.href = '/admin/schedule-flight';
                    }, 3000);
                }
            })
            .catch(err => {
                console.log(err);
            })

    }

    return(
        <>
            <AdminBar />

            <div class="modal" id="confirmationModal">
                <div class="modal-dialog">
                    <div class="modal-content">

                        <div class="modal-header">
                            <h4 class="modal-title">Are you sure?<br/>you want to add this flight?</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <div class="modal-body clearfix p-3">
                            <button className="btn btn-danger float-left" onClick={handleYesBtn}>Yes</button>
                            <button className="btn btn-primary float-right" data-dismiss="modal" id="noBtn">No</button>
                        </div>

                    </div>
                </div>
            </div>
            <div className="col-6 offset-3 text-center my-4" id="flightDiv">
                <h2 className='font-size-bolder h3 mb-0 pb-0'>Schedule Flight</h2>
                <hr id="belowHeading"/>
                <div id="mainNotification"></div>
                <div className="px-4 text-center mt-5" >
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <select type="text" className="form-control" id="from" onInput={handleInputFrom}>
                            <option disabled selected value> -- select an option -- </option>
                            { destinationData.places.map( place => (<option value={place}>{place}</option>)) }
                        </select>
                        <label for="from" className="label">From</label>
                        <div id="fromNotification"></div>
                    </div>
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <select type="text" className="form-control" id="to" onInput={handleInputTo} disabled>
                            <option disabled selected value> -- select an option -- </option>
                            { destinationData.places.map( place => (<option value={place}>{place}</option>)) }
                        </select>
                        <label for="to" className="label">To</label>
                        <div id="toNotification"></div>
                    </div>
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <input type="text" className="form-control" id="km" disabled/>
                        <label for="km" className="label">Distance(in KM)</label>
                    </div>
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <input type="date" className="form-control" id="takeoffDate" onChange={handleInputTakeoffDate} min={minDate()} />
                        <label for="date" className="label">Take Off Date</label>
                        <div id="takeoffDateNotification"></div>
                    </div>
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <input type="time" className="form-control" id="takeoffTime" placeholder="" onChange={handleInputTakeoffTime}/>
                        <label for="takeoffTime" className="label">Take Off Time</label>
                        <div id="takeoffTimeNotification"></div>
                    </div>
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <input type="number" className="form-control" id="duration" placeholder="" onInput={handleInputDuration} min="0"/>
                        <label for="duration" className="label">Flight Duration(in hours)</label>
                        <div id="durationNotification"></div>
                    </div>
                    <button className="btn black col-4" id="scheduleBtn" onClick={handleScheduleBtn}><bold>Schedule</bold></button>
                    <button className="invisible" id="openModal" data-toggle="modal" data-target="#confirmationModal"></button>
                </div>
            </div>
        </>
    )
}

export default ScheduleFlight;

