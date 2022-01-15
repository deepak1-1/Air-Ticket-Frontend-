import React, {useState } from "react";
import { Routes ,Route } from 'react-router-dom';
import { URLInfo, functions } from './helper/context';
import { togglePassword, mainNotifier, addHeaders, 
         inputNotifier, regexMatcher,
         adminLoginChecker, Logout,userLoginChecker,
         disable, enable, show, hide,loginChecker } from "./helper/BasicFunctions";

import Home from "./components/user/Home";
import AdminLogin from "./components/basic/AdminLogin";
import UserLogin from "./components/basic/UserLogin";
import Register from "./components/basic/Register";
import AdminPage from "./components/admin/AdminPage";
import AddAdmin from "./components/admin/AddAdmin";
import UpdatePasswordAdmin from "./components/admin/UpdatePasswordAdmin";
import AddFlightRoute from "./components/admin/AddFlightRoute";
import UpdateFlightRoute from "./components/admin/UpdateFlightRoute";

const App = () =>{

    const [ urlInfo_, seturlInfo_] = useState("http://localhost:4000/")

    return (
        <URLInfo.Provider value={{urlInfo_}}>
            <functions.Provider value={{togglePassword, mainNotifier, disable, enable, userLoginChecker,loginChecker,
                                        inputNotifier, regexMatcher, Logout, show, hide, adminLoginChecker,
                                        addHeaders}}>
                <Routes>
                    <Route exact path="/" element={<Home />} ></Route>
                    <Route exact path="/register" element={<Register />} ></Route>
                    <Route exact path="/user-login" element={<UserLogin />} ></Route>
                    <Route exact path="/admin-login" element={<AdminLogin />} ></Route>
                    <Route exact path="/admin" element={<AdminPage />} ></Route>
                    <Route exact path="/admin/add-admin" element={<AddAdmin />} ></Route>
                    <Route exact path="/admin/update-password" element={<UpdatePasswordAdmin />} ></Route>
                    <Route exact path="/admin/add-flight-route" element={<AddFlightRoute />} ></Route>
                    <Route exact path="/admin/update-flight-route" element={<UpdateFlightRoute />} ></Route>
                </Routes>
            </functions.Provider>
        </URLInfo.Provider>
    )
}

export default App;