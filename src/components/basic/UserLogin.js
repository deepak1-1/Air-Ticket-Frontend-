import BasicNavbar from "./BasicNavbar";

import { useState, useContext, useRef, useEffect } from 'react';
import {GoogleLogin} from 'react-google-login';
import { functions } from "../../helper/context";

const UserLogin = () => {

    const email = useRef(null);
    const password = useRef(null);

    const {togglePassword} = useContext(functions)


    return ( 
        <>
            <BasicNavbar />
            <div className="d-flex align-item-center p-2" id="mainDiv">
                <div className="p-5 text-center" id="formDiv">
                    <h2 className="mb-3">User Login!</h2>
                    <div className="input-group mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i class="far fa-envelope"></i></span>
                        </div>
                        <input type="text" ref={email} className="form-control" placeholder="your email"/>
                    </div>
                    <div id="emailNotification"></div>
                    <div className="input-group mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i class="fas fa-key"></i></span>
                        </div>
                        <input type="password" ref={password} className="form-control" placeholder="your password"/>
                        <div class="input-group-append">
                            <span class="input-group-text" onClick={(e)=> {togglePassword(e, password.current)}}><i class="fas fa-eye"></i></span>
                        </div>
                    </div>
                    <div id="passwordNotification"></div>

                    <div className="mt-0 mb-3">Forget Password?</div>    
                    <button className="btn btn-primary col-4">Login </button>

                    <div className="text-center my-4">
                        <h2 id="or">
                            <span>or</span>
                        </h2>
                    </div>

                </div>

            </div>
        </>
     )

}

export default UserLogin;