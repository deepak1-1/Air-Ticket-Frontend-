import '../css/main.css';
import { useState, useEffect } from 'react';

const BasicNavbar = () => {

    return (
        <>
            <nav className="navbar navbar-expand-sm bgBlack text-white navbar-dark fixed-top px-5">
                <div className="container-fluid d-flex navLogo">
                    <div className="float-left text-white font-weight-bold" onClick={()=>{window.location.href = '/'}}>
                        GoAir
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
                        <ul className="navbar-nav navUL">
                            <li className="nav-item">
                                <a className="nav-link navLink" href="/register">Register</a> 
                            </li>
                            <li className="nav-item">
                                <a className="nav-link navLink" href="/user-login">User</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link navLink" href="/admin-login">Admin</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}


export default BasicNavbar;