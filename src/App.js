import React, {useState } from "react";
import { Routes ,Route } from 'react-router-dom';
import { basicInfo } from './store/Context';

import Login from './components/basics/Login';
import LoginAdmin from './components/basics/LoginAdmin';
import SignUp from './components/basics/SignUp';
import ForgetPassword from './components/basics/ForgetPassword'
import AdminHomePage from './components/admin/Home';
import UserHomePage from './components/user/Home';
import AddAdmin from "./components/admin/AddAdmin";
import AddRoutes from './components/admin/AddRoutes';
import ScheduleFlight from "./components/admin/ScheduleFlight";
import Profile from "./components/admin/Profile";
import RouteUpdate from "./components/admin/RouteUpdate";

const App = () =>{

    const [basicInfo_, setBasicInfo_] = useState({
        url: "http://localhost:4000/",
        login: false
    })

    return (
        <basicInfo.Provider value={{basicInfo_, setBasicInfo_}}>
            <Routes>
                <Route exact path="/" element={<SignUp />} ></Route>
                <Route exact path="/Login" element={<Login />}></Route>
                <Route exact path="/forget-password" element={<ForgetPassword />}></Route>
                <Route exact path="/login-admin" element={<LoginAdmin />}></Route>
                <Route exact path="/home" element={<UserHomePage />}></Route>
                <Route exact path="/home-admin" element={<AdminHomePage />}></Route>
                <Route exact path="/admin/add-admin" element={<AddAdmin />}></Route>
                <Route exact path="/admin/add-route" element={<AddRoutes />}></Route>
                <Route exact path="/admin/schedule-flight" element={<ScheduleFlight />}></Route>
                <Route exact path="/admin/profile" element={<Profile />}></Route>
                <Route exact path="/admin/update-routes" element={<RouteUpdate />}></Route>
            </Routes>
        </basicInfo.Provider>
    )
}

export default App;