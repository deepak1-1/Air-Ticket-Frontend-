import axios from 'axios';
import { useContext, useState, useRef, useEffect } from 'react';
import { URLInfo, functions } from '../../helper/context'

import AdminNavbar from '../basic/AdminNavbar';
import Loading from '../basic/Loading';

const UpdatePasswordAdmin = (props) => {

    const { mainNotifier, inputNotifier, regexMatcher, enable, disable, togglePassword,
             show, hide, adminLoginChecker, loginChecker, addHeaders } = useContext(functions)
    const { urlInfo_ } = useContext(URLInfo);
    const [backendCode, setBackendCode] = useState(0);
    const [isLoading ,setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);

    const mainNotify = useRef(null);
    const currentPassword = useRef(null);
    const currentPasswordNotify = useRef(null);
    const newPassword = useRef(null);
    const newPasswordNotify = useRef(null);
    const confirmPassword = useRef(null);
    const confirmPasswordNotify = useRef(null);
    const updateBtn = useRef(null);
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


    useEffect( ()=> {
        adminLoginChecker().then(res=>res.data)
        .then(data => {
            loginChecker(data);
            setIsLoading(false);
            setIsLogin(true);
        })

    }, [])


    const handleUpdateBtn = (e) => {
        
        let currentpasswordPass = false;
        let newpasswordPass = false;

        if(!regexMatcher(currentPassword.current.value, 'password')){
            inputNotifier(currentPassword, currentPasswordNotify, "Atleast 6 character long!", "danger");
        } else { currentpasswordPass = true }
    
        if(!regexMatcher(newPassword.current.value, "password")){
            inputNotifier(newPassword, newPasswordNotify, "Atleast 6 character long!", "danger");
        } else {
            if(newPassword.current.value !== confirmPassword.current.value){
                inputNotifier(newPassword, newPasswordNotify, "", "danger");
                inputNotifier(confirmPassword, confirmPasswordNotify,"Password not matcher", "danger")
            } else { newpasswordPass = true }
        }

        if(currentPassword && newPassword){
            axios.post(urlInfo_+"admin/update-password", {
                oldpassword: currentPassword.current.value,
                newpassword: newPassword.current.value
            }, addHeaders({})).then(res=>res.data)
            .then(data=>{

                loginChecker(data);
                if(data.error){
                    mainNotifier(mainNotify, data.error, "danger");
                    inputNotifier(currentPassword, currentPasswordNotify, "", "danger");
                } else {
                    mainNotifier(mainNotify, "Updated Successfully", "success");
                    inputNotifier(currentPassword, currentPasswordNotify, "", "success");
                    currentPassword.current.value = null;
                    newPassword.current.value = null;
                    confirmPassword.current.value = null;
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
                                data: "admin" })
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

                if( !regexMatcher(modalPassword.current.value, "password"))
                    inputNotifier( modalPassword, modalPasswordNotify, "Atleast 6 character long", "danger");
                else {
                    if( modalPassword.current.value !== modalConfirmPassword.current.value )
                        inputNotifier( modalConfirmPassword, modalConfirmPasswordNotify, "not matches", "danger");
                    else {
                        
                        disable(codeBtn);
                        codeBtn.current.innerText = "Updating..."
                        axios.post( urlInfo_+"update-password-admin", 
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
                    data: "admin" })
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


    return (
        <>
            {
                isLoading? <Loading />:
                <>
                {
                    !isLogin? "":
                    <>
                        <AdminNavbar />

                        <div className="d-flex align-item-center p-2" id="mainDiv">
                            <div className="p-5 text-center" id="formDiv">
                                <h2 className="mb-0">Update Password</h2>
                                <div ref={mainNotify} className='mb-3'></div>
                                
                                <div className="input-group mb-0">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i class="fas fa-unlock-alt"></i></span>
                                    </div>
                                    <input type="password"  ref={currentPassword} className="form-control" placeholder="Current Password"/>
                                    <div className="input-group-append">
                                        <span className="input-group-text" onClick={(e)=> {togglePassword(e, currentPassword.current)}}><i class="fas fa-eye"></i></span>
                                    </div>
                                </div>
                                <div ref={currentPasswordNotify} className='mb-3'></div>

                                <div className="input-group mb-0">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i class="fas fa-key"></i></span>
                                    </div>
                                    <input type="password"  ref={newPassword} className="form-control" placeholder="New Password"/>
                                    <div className="input-group-append">
                                        <span className="input-group-text" onClick={(e)=> {togglePassword(e, newPassword.current)}}><i class="fas fa-eye"></i></span>
                                    </div>
                                </div>
                                <div ref={newPasswordNotify} className='mb-3'></div>

                                <div className="input-group mb-0">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i class="fas fa-key"></i></span>
                                    </div>
                                    <input type="password"  ref={confirmPassword} className="form-control" placeholder="Confirm Password"/>
                                    <div className="input-group-append">
                                        <span className="input-group-text" onClick={(e)=> {togglePassword(e, confirmPassword.current)}}><i class="fas fa-eye"></i></span>
                                    </div>
                                </div>
                                <div ref={confirmPasswordNotify} className='mb-3'></div>
                                
                                <div className="mt-0 mb-3 pointer" data-toggle="modal" data-target="#forgetpasswordModal">Forget Password?</div>    
                                
                                <button className='btn btn-primary col-4' ref={updateBtn} onClick={handleUpdateBtn}>Update</button>
                            </div>
                        </div>


                        <div className="modal fade text-center" id="forgetpasswordModal">
                            <div className="modal-dialog ">
                                <div className="modal-content">
                                
                                    <div className="modal-header">
                                    <h4 className="modal-title">Change Your Password!</h4>
                                    <button type="button" ref={closeBtn} className="close" data-dismiss="modal" onClick={handleModalClose}>&times;</button>
                                    </div>

                                    <div className="modal-body text-center">
                                        
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


                                        <button className='btn btn-primary col-6 mt-1' ref={codeBtn} onClick={getCodeBtnHandler}>Get Code</button>

                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                    </>
                }
                </>
            }
        </>
    )

}

export default UpdatePasswordAdmin;