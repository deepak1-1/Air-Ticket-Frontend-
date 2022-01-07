import React, {useState } from "react";
import { Routes ,Route } from 'react-router-dom';
import { URLInfo, functions } from './helper/context';
import { togglePassword, mainNotifier, 
         inputNotifier, regexMatcher,
         adminLoginChecker, adminLogout,userLoginChecker,
         disable, enable, show, hide,loginChecker } from "./helper/BasicFunctions";

import Home from "./components/user/Home";
import AdminLogin from "./components/basic/AdminLogin";
import UserLogin from "./components/basic/UserLogin";
import Register from "./components/basic/Register";
import AdminPage from "./components/admin/AdminPage";

const App = () =>{

    const [ urlInfo_, seturlInfo_] = useState("http://localhost:4000/")

    return (
        <URLInfo.Provider value={{urlInfo_}}>
            <functions.Provider value={{togglePassword, mainNotifier, disable, enable, userLoginChecker,loginChecker,
                                        inputNotifier, regexMatcher, adminLogout, show, hide, adminLoginChecker}}>
                <Routes>
                    <Route exact path="/" element={<Home />} ></Route>
                    <Route exact path="/register" element={<Register />} ></Route>
                    <Route exact path="/user-login" element={<UserLogin />} ></Route>
                    <Route exact path="/admin-login" element={<AdminLogin />} ></Route>
                    <Route exact path="/admin" element={<AdminPage />} ></Route>
                </Routes>
            </functions.Provider>
        </URLInfo.Provider>
    )
}

export default App;