import {useContext} from 'react';

import '../css/main.css';
import { URLInfo, functions } from '../../helper/context'

const AdminNavbar = () => {
    
    const { adminLogout } = useContext(functions)

    return (
        <>
            <nav className="navbar navbar-expand-sm bgBlack text-white navbar-dark fixed-top px-5">
                <div className="container-fluid d-flex navLogo">
                    <div className="float-left text-white font-weight-bold pointer" onClick={()=>{window.location.href = '/admin'}}>
                        GoAir
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
                        <ul className="navbar-nav navUL">
                            <li className="nav-item dropdown">
                                <a className="nav-link navLink" data-toggle="dropdown" id="updateDropdown">Add <i class="fas fa-caret-down align-middle pl-1"></i></a>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="/admin/add-admin">Admin</a>
                                    <a class="dropdown-item" href="/admin/add-route">Route</a>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link navLink" data-toggle="dropdown" id="updateDropdown">Schedule Flight <i class="fas fa-caret-down align-middle pl-1"></i></a>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="/admin/add-everyday-flight">EveryDay Flight</a>
                                    <a class="dropdown-item" href="/admin/add-normal-flight">Normal Flight</a>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link navLink" data-toggle="dropdown" id="updateDropdown">Update <i class="fas fa-caret-down align-middle pl-1"></i></a>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="/admin/update-route">Routes</a>
                                    <a class="dropdown-item" href="/admin/update-flight">Flight schedule</a>
                                </div>
                            </li>    
                            <li className="nav-item">
                                <a className="nav-link navLink" href="/admin/notification">Notification</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link navLink" href="/admin/free-planes">Free Planes</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link navLink" onClick={adminLogout}>
                                    Log Out
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}


export default AdminNavbar;