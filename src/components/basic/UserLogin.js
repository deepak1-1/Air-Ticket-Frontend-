import { useState, useContext, useRef, useEffect } from 'react';
import {GoogleLogin} from 'react-google-login';
import axios from 'axios';

import BasicNavbar from "./BasicNavbar";

import { URLInfo, functions } from "../../helper/context";


const UserLogin = () => {

    const email = useRef(null);
    const password = useRef(null);
    const emailNotify = useRef(null);
    const passwordNotify = useRef(null);
    const mainNotify = useRef(null);
    // variables for modal div
    const forgetPasswordEmail = useRef(null);
    const codeDiv = useRef(null);
    const code = useRef(null);
    const forgetPasswordEmailNotify = useRef(null);
    const codeNotify = useRef(null);
    const codeBtn = useRef(null);
    const resendCode = useRef(null);
    const modalPassword = useRef(null);
    const modalPasswordNotify = useRef(null);
    const modalPasswordDiv = useRef(null);
    const modalConfirmPassword = useRef(null);
    const modalConfirmPasswordNotify = useRef(null);
    const modalConfirmPasswordDiv = useRef(null);
    const closeBtn = useRef(null);

    const {togglePassword, regexMatcher, inputNotifier, addHeaders,
             mainNotifier, disable, enable, hide, show } = useContext(functions);
    const {urlInfo_} = useContext(URLInfo);
    const [backendCode, setBackendCode] = useState(0);


    const handleLogin = (e) => {
        
        let emailPass = false, passwordPass = false;

        if(!regexMatcher(email.current.value, "email")){
            inputNotifier(email, emailNotify, "Invalid", "danger");
        } else { emailPass = true }
        
        if(!regexMatcher(password.current.value, "password")){
            inputNotifier(password, passwordNotify, "Atleast 6 character long", "danger");
        } else { passwordPass = true }

        if(emailPass && passwordPass){
           
            axios.post(urlInfo_+"login", {email: email.current.value, password: password.current.value},
            addHeaders({})).then(res=>res.data)
            .then(data=>{
                console.log(data);
                if(!data.email){
                    inputNotifier(email, emailNotify, "No user with this email", "danger");
                }else {
                    if(!data.password){
                        inputNotifier(password, passwordNotify, "Password Incorrect", "danger");
                    } else {
                        mainNotifier(mainNotify, "Login Successfull", "success");
                        window.localStorage.setItem('login', "USER");
                        window.localStorage.setItem('token', data.token);
                        setTimeout(()=>{
                            window.location.href = '/'
                        }, 3000 )
                    }
                }
                
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }



    const getCodeBtnHandler = (e) => {

        switch(codeBtn.current.innerText){

            case "Get Code":

                if(!regexMatcher(forgetPasswordEmail.current.value, 'email')){
                    inputNotifier( forgetPasswordEmail, forgetPasswordEmailNotify, "Enter Valid email", "danger" );
                } else {
    
                    forgetPasswordEmailNotify.current.innerText = "sending...";
                    disable( forgetPasswordEmail );
                    axios.post(urlInfo_+'send-code', 
                              {email: forgetPasswordEmail.current.value,
                                data: "user" })
                            .then(res=> res.data)
                            .then(data=>{
                                
                                if(!data.exists){
                                    enable(forgetPasswordEmail);
                                    inputNotifier( forgetPasswordEmail, forgetPasswordEmailNotify, "Email doesn't exists", "danger" );
                                } else {
                                    if(!data.codeSended){
                                        enable(forgetPasswordEmail);
                                        inputNotifier( forgetPasswordEmail, forgetPasswordEmailNotify, "some issue while sending code", "danger" );
                                    } else {
                                        setBackendCode(data.codeSended);
                                        codeBtn.current.innerText = "Verify Code";
                                        show( codeDiv );
                                        inputNotifier( forgetPasswordEmail, forgetPasswordEmailNotify, "code sended", "success" );
                                        
                                    }
                                }
                            })
                            .catch(err=>{
                                console.log(err);
                                enable( forgetPasswordEmail );
                                inputNotifier(forgetPasswordEmail, forgetPasswordEmailNotify, "Some issue", "danger");
                            })
                }
                break;

            case "Verify Code":

                let userCode = Number(code.current.value);
                if(userCode == backendCode){
                    
                    disable(code);
                    show(modalPasswordDiv);
                    show(modalConfirmPasswordDiv);
                    codeBtn.current.innerText = "Update Password"
                
                } else {
                    resendCode.current.style.display = "block";
                    codeBtn.current.innerText = "Change Email";
                    inputNotifier( code, codeNotify, "code don't match", "danger" )
                }
                break;

            case "Change Email":

                hide(codeDiv);
                enable(forgetPasswordEmail);
                hide( resendCode );
                codeBtn.current.innerText = "Get Code"
                break;

            case "Update Password":

                if( modalPassword.current.value.trim() === "")
                    inputNotifier( modalPassword, modalPasswordNotify, "can't be empty", "danger");
                else {
                    if( modalPassword.current.value !== modalConfirmPassword.current.value )
                        inputNotifier( modalConfirmPassword, modalConfirmPasswordNotify, "not matches", "danger");
                    else {
                        
                        disable(codeBtn);
                        codeBtn.current.innerText = "Updating..."
                        axios.post( urlInfo_+"update-password", 
                                    {email: forgetPasswordEmail.current.value,
                                     password: modalPassword.current.value}
                                  ).then(res => res.data)
                                  .then(data=>{
                                      
                                    if(data.error){
                                        enable(codeBtn);
                                        codeBtn.current.innerText = "Update Password";
                                        inputNotifier( modalPassword, modalPasswordNotify, data.error, "danger");
                                    } else {
                                        enable(codeBtn);
                                        codeBtn.current.innerText = "Update Password";
                                        inputNotifier( forgetPasswordEmail, forgetPasswordEmailNotify, "Updated!!", "success");
                                        setTimeout( ()=>{
                                            closeBtn.current.click();
                                        }, 2000)
                                    }
                                  })
                                  .catch(err=>{
                                      console.log(err);
                                      inputNotifier( modalPassword, modalPasswordNotify, "Some issue while updating password", "danger");
                                      enable(codeBtn);
                                      codeBtn.current.innerText = "Update Password";
                                  })

                    }
                }
                break

        }

    }

    const handleGetCodeAgain = () => {

        forgetPasswordEmailNotify.current.innerText = "sending...";
        axios.post(urlInfo_+'send-code', 
                    {email: forgetPasswordEmail.current.value,
                    data: "user" })
                .then(res=> res.data)
                .then(data=>{
                    
                    if(!data.exists){
                        enable(forgetPasswordEmail);
                        inputNotifier( forgetPasswordEmail, forgetPasswordEmailNotify, "Email doesn't exists", "danger" );
                        setTimeout( ()=>{
                            closeBtn.current.click();
                        }, 2000)
                    } else {
                        if(!data.codeSended){
                            enable(forgetPasswordEmail);
                            inputNotifier( forgetPasswordEmail, forgetPasswordEmailNotify, "some issue while sending code", "danger" );
                            setTimeout( ()=>{
                                closeBtn.current.click();
                            }, 2000)
                        } else {
                            setBackendCode(data.codeSended);
                            codeBtn.current.innerText = "Verify Code";
                            inputNotifier( forgetPasswordEmail, forgetPasswordEmailNotify, "code sended", "success" );
                            
                        }
                    }
                })
                .catch(err=>{
                    console.log(err);
                    inputNotifier(forgetPasswordEmail, forgetPasswordEmailNotify, "Some issue", "danger");
                    setTimeout( ()=>{
                        closeBtn.current.click();
                    }, 2000)
                })

    }

    const handleModalClose = () => {
        
        forgetPasswordEmail.current.value = null;
        code.current.value = null;
        modalPassword.current.value = null;
        modalConfirmPassword.current.value = null;
        setBackendCode(0);
        codeBtn.current.innerText = "Get Code";
        enable( forgetPasswordEmail );
        enable( code );
        hide( codeDiv );
        hide( modalPasswordDiv );
        hide( modalConfirmPasswordDiv );

    }

    const handleGoogleResponse = (googleResponse)=>{
        
    axios.post(urlInfo_+"google/login", {
            googleId: googleResponse.googleId,
            token: googleResponse.tokenId
        }).then(res=>res.data)
        .then(data=>{
            console.log(data);
            if(!data.email){
                mainNotifier(mainNotify, "No user with this email", "danger");
            }else {
                if(!data.password){
                    mainNotifier(mainNotify, "Password Incorrect", "danger");
                } else {
                    mainNotifier(mainNotify, "Login Successfull", "success");
                    window.localStorage.setItem('login', "USER");
                    window.localStorage.setItem('token', data.token);
                    setTimeout(()=>{
                        window.location.href = '/'
                    }, 3000 )
                }
            }
            
        })
        .catch(err=>{
            console.log(err);
        })


    }


    return ( 
        <>
            <BasicNavbar />
            <div className="d-flex align-item-center p-2" id="mainDiv">
                <div className="p-5 text-center" id="formDiv">
                    <h2 className="mb-2">User Login</h2>
                    <div ref={mainNotify} className="mb-2"></div>
                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i class="far fa-envelope"></i></span>
                        </div>
                        <input type="text" ref={email} className="form-control" placeholder="your email"/>
                    </div>
                    <div ref={emailNotify} className="mb-2"></div>
                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i class="fas fa-key"></i></span>
                        </div>
                        <input type="password" ref={password} className="form-control" placeholder="your password"/>
                        <div className="input-group-append">
                            <span className="input-group-text" onClick={(e)=> {togglePassword(e, password.current)}}><i class="fas fa-eye"></i></span>
                        </div>
                    </div>
                    <div ref={passwordNotify} className="mb-2"></div>

                    <div className="mt-0 mb-3 pointer" data-toggle="modal" data-target="#forgetpasswordModal">Forget Password?</div>    
                    <button className="btn btn-primary col-4" onClick={handleLogin}>Login </button>

                    <div className="text-center my-4">
                        <h2 id="or">
                            <span>or</span>
                        </h2>
                    </div>

                    <div className='text-center'>
                        <GoogleLogin
                            clientId="49974421307-4tj948gbjsthp1gf6r1rtlhl5tafg8bb.apps.googleusercontent.com"
                            buttonText='Login'
                            onSuccess={handleGoogleResponse}
                            onFailure={handleGoogleResponse}
                            cookiePolicy='single_host_origin'
                         />
                    </div>

                </div>
            </div>


            <div class="modal fade text-center" id="forgetpasswordModal">
                <div class="modal-dialog ">
                    <div class="modal-content">
                    
                        <div class="modal-header">
                        <h4 class="modal-title">Change Your Password!</h4>
                        <button type="button" ref={closeBtn} class="close" data-dismiss="modal" onClick={handleModalClose}>&times;</button>
                        </div>

                        <div class="modal-body text-center">
                            
                            <div className="input-group mb-0">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="far fa-envelope"></i></span>
                                </div>
                                <input type="text"  ref={forgetPasswordEmail} className="form-control" placeholder="your email"/>
                            </div>
                            <div ref={forgetPasswordEmailNotify} className="mb-3"></div>
                            
                            <div className="input-group hide" ref={codeDiv}>
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fas fa-envelope-open-text"></i></span>
                                </div>
                                <input type="password" ref={code} className="form-control" placeholder="enter code here"/>
                                <div className="input-group-append">
                                    <span className="input-group-text" onClick={(e)=> {togglePassword(e, code.current)}}><i class="fas fa-eye"></i></span>
                                </div>
                            </div>
                            <div ref={codeNotify} className="mb-3"></div>

                            <div ref={resendCode} className="mb-1 pointer hide" onClick={handleGetCodeAgain}>Get Code again?</div>

                            <div className="input-group mb-0 hide" ref={modalPasswordDiv}>
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fas fa-key"></i></span>
                                </div>
                                <input type="password" ref={modalPassword} className="form-control" placeholder="enter new password"/>
                                <div className="input-group-append">
                                    <span className="input-group-text" onClick={(e)=> {togglePassword(e, modalPassword.current)}}><i class="fas fa-eye"></i></span>
                                </div>
                            </div>
                            <div ref={modalPasswordNotify} className="mb-3"></div>

                            <div className="input-group mb-0 hide" ref={modalConfirmPasswordDiv}>
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fas fa-key"></i></span>
                                </div>
                                <input type="password" ref={modalConfirmPassword} className="form-control" placeholder="confirm password"/>
                                <div className="input-group-append">
                                    <span className="input-group-text" onClick={(e)=> {togglePassword(e, modalConfirmPassword.current)}}><i class="fas fa-eye"></i></span>
                                </div>
                            </div>
                            <div ref={modalConfirmPasswordNotify} className="mb-3"></div>


                            <button className='btn btn-primary col-4 mt-1' ref={codeBtn} onClick={getCodeBtnHandler}>Get Code</button>

                        </div>
                        
                    </div>
                </div>
            </div>

        </>
     )

}

export default UserLogin;