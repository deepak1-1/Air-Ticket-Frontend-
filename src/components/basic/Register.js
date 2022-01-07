import BasicNavbar from "./BasicNavbar";

import { functions } from "../../helper/context";
import { useState, useEffect, useContext, useRef } from 'react';

const Register = () => {

    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const nameNotify = useRef(null);
    const emailNotify = useRef(null);
    const passwordNotify = useRef(null);
    const confirmPasswordNotify = useRef(null);

    const {togglePassword} = useContext(functions);



    const handleRegister = () => {

        console.log(name.current.value);
        console.log(email.current.value);
        console.log(password.current.value);
        console.log(confirmPassword.current.value);

        console.log(nameNotify);
        console.log(emailNotify);
        console.log(passwordNotify);
        console.log(confirmPasswordNotify);
        
        nameNotify.current.style.color = "red";
        nameNotify.current.innerText = "I worked!";
        name.current.style.border = "1px solid red";

        setTimeout( ()=>{
            name.current.style.border = "";
            nameNotify.current.style.color = '';
            nameNotify.current.innerText = '';
        },3000);
        
    }



    return ( 
        <>  
            <BasicNavbar />
            <BasicNavbar />
            <div className="d-flex align-item-center p-2" id="mainDiv">
                
                <div className="p-5 text-center" id="formDiv">

                    <h2 className="mb-3">Register Yourself</h2>

                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i class="fas fa-user-alt"></i></span>
                        </div>
                        <input type="text" ref={name} className="form-control" placeholder="your name"/>
                    </div>
                    <div ref={nameNotify} className="mb-3"></div>

                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i class="far fa-envelope"></i></span>
                        </div>
                        <input type="text" ref={email} className="form-control" placeholder="your email"/>
                    </div>
                    <div ref={emailNotify} className="mb-3"></div>

                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i class="fas fa-key"></i></span>
                        </div>
                        <input type="password" ref={password} className="form-control" placeholder="your password"/>
                        <div class="input-group-append">
                            <span class="input-group-text" onClick={(e)=>{togglePassword(e, password.current)}}>
                                <i class="fas fa-eye"></i>
                            </span>
                        </div>
                    </div>
                    <div ref={passwordNotify} className="mb-3"></div>

                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i class="fas fa-key"></i></span>
                        </div>                        
                        <input type="password" ref={confirmPassword} className="form-control" placeholder="confirm password"/>
                        <div class="input-group-append">
                            <span class="input-group-text" onClick={(e)=>{togglePassword(e, confirmPassword.current)}}>
                                <i class="fas fa-eye"></i>
                            </span>
                        </div>
                    </div>
                    <div ref={confirmPasswordNotify} className="mb-3"></div> 

                    <button className="btn btn-primary col-4" onClick={ handleRegister }>Register </button>

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

export default Register;