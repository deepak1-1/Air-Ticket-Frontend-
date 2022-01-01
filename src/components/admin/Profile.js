import React, {useState, useEffect} from "react";
import axios from 'axios';
import AdminBar from "./AdminBar";
import './css/AddAdmin.css';

function Profile(props) {

    const [adminData, setAdminData] = useState(null);

    function getById(id){
        return document.getElementById(id);
    }

    
    useEffect( ()=>{

            axios.post('http://localhost:4000/admin/my-data', {id: '61a4fc95612cf35ef0b495f9'})
                .then( (result) => {
                    
                    const data = result.data.data;
                    console.log(data);
                    setAdminData(data);
                    const nameDiv = getById('name'),
                        emailDiv = getById('email'),
                        mobileDiv = getById('mobile'),
                        adharcardDiv = getById('adharcard');
                    console.log(adminData);
                    nameDiv.value = data.name;
                    emailDiv.value = data.email;
                    mobileDiv.value = data.mobile;
                    adharcardDiv.value = data.adharCard;
                })
    
        }, [])
    

    function h1(){
        console.log("hello");
    }

    return (
        <>
            <AdminBar />
            <div className='container'>
                <div className="col-lg-8 offset-2 text-center mt-4" id="AddAdminForm">
                    <h2 className='font-size-bolder h1 mb-0 pb-0'>Profile!</h2>
                    <hr id="belowHeading"/>
                    <div id="mainNotification"></div>
                    <div className="px-4 text-center" >
                        <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                            <input type="text" className="form-control" id="name" onChange={h1} disabled/>
                            <label for="name" className="label">Name</label>
                            <div id="nameNotification"></div>
                        </div>
                        <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                            <input type="text" className="form-control" id="email" onChange={h1} disabled/>
                            <label for="email" className="label">Email</label>
                            <div id="emailNotification"></div>
                        </div>
                        <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                            <input type="text" className="form-control" id="mobile" onChange={h1} disabled/>
                            <label for="mobile" className="label">Mobile Number</label>
                            <div id="mobileNotification"></div>
                        </div>
                        <div className="form-group col-md-8 col-sm-10 offset-md-2 offset-sm-1">
                            <input type="text" className="form-control" id="adharcard" onChange={h1} disabled/>
                            <label for="adharcard" className="label">Adharcard Number</label>
                            <div id="adharcardNotification"></div>
                        </div>
                        <button className="btn black col-2" ><bold>Edit?</bold></button>
                    </div>
                </div>
            </div>
        </>
    )
    
}

export default Profile;

