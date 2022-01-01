import React,{useState} from 'react';
import axios from 'axios';
import AdminBar from './AdminBar'

function AddRoutes(props){

    const initialState = {
        place1: "",
        place2: "",
        km: ""
    }
    const [routeData, setRouteData] = useState(initialState);

    // function to get element by id
    function getById(id){
        return document.getElementById(id);
    }

    // to handle input 
    function handleInputPlace1(e){
        e.target.value = e.target.value.toUpperCase()
        setRouteData({
            ...routeData,
            place1: e.target.value
        })
    }

    function handleInputPlace2(e){
        e.target.value = e.target.value.toUpperCase()
        setRouteData({
            ...routeData,
            place2: e.target.value
        })
    }

    function handleInputKm(e){
        setRouteData({
            ...routeData,
            km: e.target.value
        })
    }
    //....

    // to show notifications
    function toShowNotification(div, errorMessage, inputField){
        
        div.innerText = errorMessage;
        div.style.color = 'red';
        inputField.style.border = '2px solid red';

        setTimeout( ()=>{
            div.innerText = '';
            div.style.color = 'red';
            inputField.style.border = '';
        },3000)
    }
    // ...

    function handleAddRoute(e){
        
        document.getElementById('noBtn').click();// to close modal first

        let place1Pass = false, place2Pass = false, kmPass = false;

        const mainNotify = getById('mainNotification'),
              place1Notify = getById('place1Notification'),
              place2Notify = getById('place2Notification'),
              kmNotify = getById('kmNotification');
        const place1Input = getById('place1'),
              place2Input = getById('place2'),
              kmInput = getById('km');

        if(routeData.place1.trim().length === 0){
            toShowNotification(place1Notify, 'can\'t be empty or whiteSpaces', place1Input);
        } else { place1Pass = true }

        if(routeData.place2.trim().length === 0){
            toShowNotification(place2Notify, 'can\'t be empty or whiteSpaces', place2Input);
        } else { place2Pass = true }

        const number = Number(routeData.km);
        if(number){
            
            if(number<0){
                toShowNotification(kmNotify, "Distance can't be negative!", kmInput);
            } else if (number<100){
                toShowNotification(kmNotify, 'minimum distance is 100km', kmInput);
            }  else if (number>10000){
                toShowNotification(kmNotify, 'maximum distance is 10,000km', kmInput);
            } else {
                
                kmPass = true;
                setRouteData({
                    ...routeData,
                    km: number
                })
            }

        } else {
            toShowNotification(kmNotify, "Not valid!", kmInput);
        }

        if(routeData.place1 === routeData.place2){

            toShowNotification(place2Notify, 'Both destinations can\'t be same', place2Input);

        } else {
            if(place1Pass && place2Pass && kmPass){
            
                axios.post('http://localhost:4000/admin/add-route',routeData)
                    .then(result => {
                        result = result.data
                        if(result.exists){

                            mainNotify.innerHTML = '<div className="alert alert-danger">Route already exists</div>';
                            setTimeout( ()=>{
                                mainNotify.innerHTML = '';
                            },3000);
                        } else {
                            mainNotify.innerHTML = '<div className="alert alert-secondary">Added Successfully</div>';
                            setTimeout( ()=>{
                                mainNotify.innerHTML = '';
                                setRouteData(initialState);
                                place1Input.value = ''
                                place2Input.value = ''
                                kmInput.value = ''
                            },3000)
                        }
                    })
                
            }
        }
    }


    return(
        <>
            <AdminBar />
            
            <div class="modal" id="confirmationModal">
                <div class="modal-dialog">
                    <div class="modal-content">

                        <div class="modal-header">
                            <h4 class="modal-title">Are you sure?</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <div class="modal-body clearfix p-3">
                            <button className="btn btn-danger float-left" onClick={handleAddRoute}>Yes</button>
                            <button className="btn btn-primary float-right" data-dismiss="modal" id="noBtn">No</button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="col-md-4 offset-md-4 text-center mt-4" id="AddAdminForm">
                <h2 className='font-size-bolder h1 mb-0 pb-0'>Add Route</h2>
                <hr id="belowHeading"/>
                <div id="mainNotification"></div>
                <div className="text-center col-12 mt-4 p-1">
                    <div className="form-group col-10 offset-1">
                        <input type="text" className="form-control" id="place1" placeholder="" onChange={handleInputPlace1}/>
                        <label for="place1" className="label">Place 1</label>
                        <div id="place1Notification"></div>
                    </div>
                    <div className="form-group col-10 offset-1">
                        <input type="text" className="form-control" id="place2" placeholder="" onChange={handleInputPlace2}/>
                        <label for="place2" className="label">Place 2</label>
                        <div id="place2Notification"></div>
                    </div>
                    <div className="form-group col-10 offset-1">
                        <input type="text" className="form-control" id="km" placeholder="" onChange={handleInputKm}/>
                        <label for="km" className="label">Distance(Km)</label>
                        <div id="kmNotification"></div>
                    </div>
                    <button className="btn black col-4" data-toggle="modal" data-target="#confirmationModal"><bold>Add Route</bold></button>
                </div>
            </div>
        </>
    )
}

export default AddRoutes;