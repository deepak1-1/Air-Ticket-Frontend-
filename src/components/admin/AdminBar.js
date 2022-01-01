import React, {useState, useContext} from 'react';
import './css/AdminBar.css'
import { basicInfo } from "../../store/Context";


function AdminBar(props){

    const {basicInfo_, setBasicInfo_} = useContext(basicInfo)

    const logMeOut = () => {
        setBasicInfo_({
            ...basicInfo_,
            login: false
        })

        window.location.href = '/';
    }

    return (
        <>
            <nav className="navbar navbar-expand-sm bgBlack text-white navbar-dark fixed-top">
                <div className="container-fluid d-flex">
                    <div className="float-left text-white font-weight-bold">GoAir</div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/home-admin">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/admin/add-route">Add Routes</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/admin/add-admin">Add Admin</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/admin/schedule-flight">Schedule Flight</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link" data-toggle="dropdown" id="updateDropdown">Update <i class="fas fa-caret-down align-middle pl-1"></i></a>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item text-dark" href="/admin/update-routes">Routes</a>
                                    <a class="dropdown-item text-dark" href="#">Flights</a>
                                </div>
                            </li>                            
                            {/* <li className="nav-item">
                                <a className="nav-link" href="/admin/Profile">Profile</a>
                            </li> */}
                            <li className="nav-item">
                                <a className="nav-link" onClick={logMeOut} id="logout">Log Out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="offcanvas offcanvas-end" id="settingOffCanvas">
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn-close text-reset m-1 mx-2" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body text-center">
                    <p>User Info</p>
                </div>
            </div>
        </>
    )
}

export default AdminBar;