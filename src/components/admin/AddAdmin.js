import React, {useState} from "react";
import axios from 'axios';
import AdminBar from "./AdminBar";
import './css/AddAdmin.css';

function AddAdmin(props) {

    const initialState = {
        name: "",
        email: "",
        mobile: "",
        adharCard: ""
    }
    const [adminData, setAdminData] = useState(initialState)

    const email_exp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          adharCard_exp = /^[2-9]{1}[0-9]{11}$/,
          mobile_exp = /^(91|0|)[6-9]\d{9}$/;

    //function to check regex matching
    function check_regex_match( regex_exp, input_string ){

        return input_string.match(regex_exp)? true: false;
        
    }

    // 4 functions to Update data
    function handleInputName(e){
        setAdminData({
            ...adminData,
            name: e.target.value
        })
    }

    function handleInputEmail(e){
        setAdminData({
            ...adminData,
            email: e.target.value
        })
    }

    function handleInputAdharcard(e){
        setAdminData({
            ...adminData,
            adharCard: e.target.value
        })
    }

    function handleInputMobile(e){
        setAdminData({
            ...adminData,
            mobile: e.target.value
        })
    }

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

    // to handle Add Admin
    function handleAddAdmin(e){

        document.getElementById('noBtn').click();// to close modal first

        let namePass = false,
            emailPass = false,
            adharcardPass = false,
            mobilePass = false;

        const nameNotify = document.getElementById('nameNotification'),
              emailNotify = document.getElementById('emailNotification'),
              adharcardNotify = document.getElementById('adharcardNotification'),
              mobileNotify = document.getElementById('mobileNotification'),
              mainNotify = document.getElementById('mainNotification');
        const nameInput = document.getElementById('name'),
              emailInput = document.getElementById('email'),
              mobileInput = document.getElementById('mobile'),
              adharcardInput = document.getElementById('adharcard');
        if(adminData.name.trim().length === 0){
            toShowNotification(nameNotify, "Name cam't be empty", nameInput)
        } else { namePass = true }

        if(!check_regex_match(email_exp, adminData.email)){
            toShowNotification( emailNotify, "Email not valid", emailInput);
        } else { emailPass = true }

        if(!check_regex_match(adharCard_exp, adminData.adharCard)){
            toShowNotification( adharcardNotify, "Not valid", adharcardInput);
        } else { adharcardPass = true }

        if(!check_regex_match(mobile_exp, adminData.mobile)){
            toShowNotification( mobileNotify, "Not valid", mobileInput);
        } else { mobilePass = true }

        if(emailPass && namePass && adharcardPass && mobilePass){

            axios.post('http://localhost:4000/admin/add-admin', adminData)
             .then(result => {
                 
                const data = result.data;
                if(data.found){

                    if(data.found === 'email'){
                        toShowNotification(emailNotify, "already in use", emailInput);
                    } else {
                        toShowNotification(mobileNotify, 'already in use', mobileInput);
                    }

                } else {
                    mainNotify.innerHTML = '<div className="alert alert-success">Successfully Added</div>';
                    
                    setTimeout( ()=>{
                        mainNotify.innerHTML = '';

                        setAdminData(initialState);
                        nameInput.value = ''
                        emailInput.value = ''
                        mobileInput.value = ''
                        adharcardInput.value = ''
                    },3000);
                }
             })

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
                            <button className="btn btn-danger float-left" onClick={handleAddAdmin}>Yes</button>
                            <button className="btn btn-primary float-right" data-dismiss="modal" id="noBtn">No</button>
                        </div>

                    </div>
                </div>
            </div>
            <div className="col-lg-8 offset-2 text-center mt-4" id="AddAdminForm">
                <h2 className='font-size-bolder h1 mb-0 pb-0'>Add Admin</h2>
                <hr id="belowHeading"/>
                <div id="mainNotification"></div>
                <div className="px-4 text-center" >
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <input type="text" className="form-control" id="name" placeholder="" onChange={handleInputName}/>
                        <label for="name" className="label">Name</label>
                        <div id="nameNotification"></div>
                    </div>
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <input type="text" className="form-control" id="email" placeholder="" onChange={handleInputEmail}/>
                        <label for="email" className="label">Email</label>
                        <div id="emailNotification"></div>
                    </div>
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <input type="text" className="form-control" id="mobile" placeholder="" onChange={handleInputMobile}/>
                        <label for="mobile" className="label">Mobile Number</label>
                        <div id="mobileNotification"></div>
                    </div>
                    <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                        <input type="text" className="form-control" id="adharcard" placeholder="" onChange={handleInputAdharcard}/>
                        <label for="adharcard" className="label">Adharcard Number</label>
                        <div id="adharcardNotification"></div>
                    </div>
                    <button className="btn black col-2" data-toggle="modal" data-target="#confirmationModal"><bold>Add</bold></button>
                </div>
            </div>
        </>
    )
}

export default AddAdmin;

