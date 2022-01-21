import { useState, useEffect, useContext, useRef } from 'react';
import {GoogleLogin} from 'react-google-login';
import axios from 'axios';

import BasicNavbar from "./BasicNavbar";
import { functions, URLInfo } from "../../helper/context";


const Register = () => {

    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const nameNotify = useRef(null);
    const emailNotify = useRef(null);
    const passwordNotify = useRef(null);
    const confirmPasswordNotify = useRef(null);
    const mainNotify = useRef(null);

    const {togglePassword, inputNotifier, mainNotifier, regexMatcher} = useContext(functions);
    const {urlInfo_} = useContext(URLInfo)



    const handleRegister = () => {

        let emailPass = false, namePass = false, passwordPass = false;
        
        if(name.current.value.trim().length === 0){
            inputNotifier(name, nameNotify, "Empty", "danger");
        } else { namePass = true }

        if(!regexMatcher(email.current.value, "email")){
            inputNotifier(email, emailNotify, "Invalid", "danger");
        } else { emailPass = true }

        if(!regexMatcher(password.current.value, "password")){
            inputNotifier(password, passwordNotify, "atleast 6 character long", "danger");
            inputNotifier(confirmPassword, confirmPasswordNotify, "", "danger");
        } else {
            if(password.current.value !== confirmPassword.current.value){
                inputNotifier(confirmPassword, confirmPasswordNotify, "Not matches", "danger");
                inputNotifier(password, passwordNotify, "", "danger");
            } else { passwordPass = true }
        }

        if(emailPass && namePass && passwordPass){
            
            axios.post(urlInfo_+"register", {
                name: name.current.value,
                email: email.current.value,
                password: password.current.value
            }).then(res=>res.data)
            .then(data=>{
                if(data.error){
                    mainNotifier(mainNotify, data.error, "danger");
                }
                if(data.email){
                    inputNotifier(email, emailNotify, "Email Already exists", "danger");
                }

                if(data.added){
                    mainNotifier(mainNotify, "Registered successfully");
                    inputNotifier(email, emailNotify, "", "success");
                    setTimeout(()=>{
                        window.location.href = '/user-login';
                    },3000)
                }
            })
            .catch(err=>{
                console.log(err);
                mainNotifier(mainNotify, "Issue While registering!", "danger");
                inputNotifier(email, emailNotify, "", "danger");
            })

        }

    }


    const handleGoogleResponse = (googleResponse) => {

        axios.post(urlInfo_+"google/register", {
            googleId: googleResponse.googleId,
            token: googleResponse.tokenId
        }).then(res=>res.data)
        .then(data=>{
            if(data.error){
                mainNotifier(mainNotify, data.error, "danger");
            }
            if(data.email){
                mainNotifier(mainNotify, "Email Already exists", "danger");
            }

            if(data.added){
                mainNotifier(mainNotify, "Registered successfully");
                setTimeout(()=>{
                    window.location.href = '/user-login';
                },3000)
            }
        })
        .catch(err=>{
            console.log(err);
            mainNotifier(mainNotify, "Issue While registering!", "danger");
            inputNotifier(email, emailNotify, "", "danger");
        })
    }


    return ( 
        <>  
            <BasicNavbar />
            <div className="d-flex align-item-center p-2" id="mainDiv">
                
                <div className="p-5 text-center" id="formDiv">

                    <h2 className="mb-2">Register Yourself</h2>
                    <div className="mb-2" ref={mainNotify}></div>

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

                    <div className='text-center'>
                        <GoogleLogin
                            clientId = "49974421307-4tj948gbjsthp1gf6r1rtlhl5tafg8bb.apps.googleusercontent.com"
                            buttonText='Sign Up'
                            onSuccess={handleGoogleResponse}
                            onFailure={handleGoogleResponse}
                            cookiePolicy='single_host_origin'
                         />
                    </div>

                </div>

            </div>
        </>
     )

}

export default Register;