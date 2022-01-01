import React ,{ useState} from "react";
import './css/Login.css';
import axios from 'axios';

const Login = (props)=> {
    
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })

    
    function handleInputEmail(e){
        setUserData({
            ...userData,
            email: e.target.value
        })
    }

    function handleInputPassword(e){
        setUserData({
            ...userData,
            password: e.target.value
        })
    }

    function togglePassword(e, toChange){
        
        const inputType = document.getElementById(toChange);

        if(e.target.className === "fas fa-eye-slash"){
            e.target.className = "fas fa-eye";
        } else {
            e.target.className = "fas fa-eye-slash";
        }

        if(inputType.type === "password")
            inputType.type = 'text';
        else 
            inputType.type = "password";
    }

    function handleLogin(e){

        const emailNotify = document.getElementById('emailNotification'),
              passwordNotify = document.getElementById('passwordNotification'),
              mainContentNotify = document.getElementById('mainContentNotification'); 

        if(userData.email.trim().length === 0){
            emailNotify.innerText = 'Can\'t be empty';
            emailNotify.style.color = 'red';
            setTimeout( ()=>{
                emailNotify.innerText = '';
            },3000);
        }
        
        if(userData.password.trim().length === 0){
            passwordNotify.innerText = 'Can\'t be empty';
            passwordNotify.style.color = 'red';
            setTimeout( ()=>{
                passwordNotify.innerText = '';
            },3000);
        }

        if((userData.email.trim().length !== 0) && (userData.password.trim().length !== 0)){
            
            axios.post('http://localhost:4000/login', userData)
                .then(res => {

                    const data = res.data;
                    if(!data.error){

                        mainContentNotify.innerText = 'Successfull Login!'
                        mainContentNotify.className = 'alert alert-success text-center';
                        setTimeout( ()=>{
                            mainContentNotify.innerText = '';
                            mainContentNotify.className = '';
                            console.log('Everything is fine');
                            // window.location.href = ''
                        },3000)

                    } else {
                        if(data.email && !data.password){
                            passwordNotify.innerText = data.error;
                            passwordNotify.style.color = 'red';
                            setTimeout( ()=>{
                                passwordNotify.innerText = '';
                            },3000);
                        } else {
                            emailNotify.innerText = data.error;
                            emailNotify.style.color = 'red';
                            setTimeout( ()=>{
                                emailNotify.innerText = '';
                            },3000)
                        }
                    }
                })
            }
    }


    // Below functions for Forget Password modal 

    const [modalData , setModalData] = useState({
        email: "",
        code: "",
        password: "",
        confirm_password: "",
        backendCode: ""
    })

    const email_exp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            password_exp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    function  disableInput(input){
        input.setAttribute( 'disabled', 'disabled');
    };
    function  enableInput(input){
        input.removeAttribute( 'disabled', 'disabled');
    };

    // cheking for regex match 
    function check_regex_match( regex_exp, input_string ){

        return input_string.match(regex_exp)? true: false;
        
    }

    function showModalDiv(div){
        document.querySelector(div).style.display = 'block';
    }

    function hideModalDiv(div){
        document.querySelector(div).style.display = 'none';
    }

    function toDismissModal(){
        setModalData({
            email: "",
            password: "",
            confirm_password: "",
            code: "",
            backend: ""
        });

        document.getElementById('goBackBtn').click();
        document.getElementById('goBackBtn').click();
        document.getElementById('fpEmail').value = '';
        document.getElementById('crossButton').click()
        
    }

    function handleInputModalEmail(e){
        setModalData({
            ...modalData,
            email: e.target.value
        })
    }

    function handleInputModalCode(e){
        setModalData({
            ...modalData,
            code: e.target.value
        })
    }

    function handleInputModalPassword(e){
        setModalData({
            ...modalData,
            password: e.target.value
        })
    }

    function handleInputModalConfirmPassword(e){
        setModalData({
            ...modalData,
            confirm_password: e.target.value
        })
    }

    function handleGetCode(e){

        const emailNotify = document.getElementById('fpEmailNotification'),
              codeNotify = document.getElementById('codeNotification'),
              passwordNotify = document.getElementById('fpPasswordNotification'),
              confirmPasswordNotify = document.getElementById('fpConfirmPasswordNotification'),
              mainNotify = document.getElementById('mainModalNotification');
        const getCodeBtn = document.getElementById('getCodeBtn'),
              goBackBtn = document.getElementById('goBackBtn');

        if(e.target.innerText === 'Get Code'){
            if(check_regex_match(email_exp, modalData.email)){
                
                emailNotify.innerHTML = "<div className='text-secondary'><div className='spinner-border text-primary'></div> sending...</div>";
                axios.post( 'http://localhost:4000/send-code',{email: modalData.email, data:"user"})
                    .then(res=>{
                        
                        const data = res.data;
                        if(data.codeSended){

                            setModalData({
                                ...modalData,
                                backendCode: data.codeSended
                            });

                            disableInput(document.getElementById('fpEmail'));
                            showModalDiv('.codeDiv');
                            getCodeBtn.innerText = 'Verify Code';
                            goBackBtn.style.display = 'block';
                            emailNotify.innerText = 'Code sended check mail!'
                            emailNotify.style.color = 'green';
                            setTimeout( ()=>{
                                emailNotify.innerText = '';
                            },3000)

                        } else {
                            emailNotify.innerText = "No account with this Email!";
                            emailNotify.style.color = 'red';
                            setTimeout( ()=>{
                                emailNotify.innerText = '';
                            },3000)
                        }
                    })
            } else {

                emailNotify.innerText = 'Enter valid email!';
                emailNotify.style.color = 'red';

                setTimeout( ()=>{
                    emailNotify.innerText = '';
                },3000)
            }

        } if(e.target.innerText === 'Verify Code'){

            if(Number(modalData.code) === modalData.backendCode){

                disableInput(document.getElementById('code'));
                showModalDiv('.passwordDiv');
                showModalDiv('.confirmPasswordDiv');
                getCodeBtn.innerText = 'Update Password';

            } else {

                codeNotify.innerText = 'Code not matches';
                codeNotify.style.color = 'red';
                setTimeout( ()=>{
                    codeNotify.innerText = '';
                },3000)
            }

        } else if(e.target.innerText === 'Update Password'){

            if(check_regex_match(password_exp, modalData.password)){

                if(modalData.password === modalData.confirm_password){

                    axios.post('http://localhost:4000/update-password',
                                {email: modalData.email, password: modalData.password, data: "user"})
                        .then(result => {
                            
                            if(result.error){
                                mainNotify.innerText = result.error;
                                mainNotify.className = 'alert alert-danger';
                                setTimeout( ()=>{
                                    mainNotify.innerText = '';
                                    mainNotify.className = '';

                                },3000);
                            } else {
                                mainNotify.innerText = "successful!";
                                mainNotify.className = 'alert alert-success text-center';
                                setTimeout( ()=>{
                                    mainNotify.innerText = '';
                                    mainNotify.className = '';
                                    toDismissModal();

                                },3000);
                            }

                        })
                } else {

                    confirmPasswordNotify.innerText = 'Password don\'t match';
                    confirmPasswordNotify.style.color = 'red';
                    setTimeout( ()=>{
                        confirmPasswordNotify.innerText = '';
                    },3000);

                }
            } else {

                passwordNotify.innerText = 'Password should be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter';
                passwordNotify.style.color = 'red';
                setTimeout( ()=>{
                    passwordNotify.innerText = '';
                },6000)
            
            }

        }
        
    }

    function handleGoBack(e){

        const getCodeBtn = document.getElementById('getCodeBtn'),
              goBackBtn = document.getElementById('goBackBtn');
        
        
        if(getCodeBtn.innerText === 'Verify Code'){
            setModalData({
                ...modalData,
                code: ""
            })
            hideModalDiv( '.codeDiv' );
            getCodeBtn.innerText = 'Get Code';
            goBackBtn.style.display = 'none';
            enableInput(document.getElementById('fpEmail'));
        } else if(getCodeBtn.innerText === 'Update Password'){

            setModalData({
                ...modalData,
                password: "",
                confirm_password: ''
            });
            hideModalDiv('.passwordDiv');
            hideModalDiv('.confirmPasswordDiv');
            getCodeBtn.innerText = 'Verify Code';
            enableInput(document.getElementById('code'));
        }
    }

    return (
        <>  
            
            {/* Div for forgetPassword modal */}
            <div class="modal fade" id="forgetPasswordModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                    {/* <!-- Modal Header --> */}
                    <div class="modal-header text-center">
                        <h4 class="modal-title">Update Password!</h4>
                        <button type="button" className="btn" data-dismiss="modal" id="crossButton">&times;</button>
                    </div>
                    <div id="mainModalNotification"></div>
                    {/* <!-- Modal body --> */}
                    <div class="modal-body">
                        
                        <div className="mb-2 text-center">
                            <div className="form-group">
                                <input onChange={handleInputModalEmail} className="form-control col-12" type="text" placeholder="Enter Email to get code" name="email" id="fpEmail"/>
                                <div id="fpEmailNotification"></div>               
                            </div>
                            <div className="form-group codeDiv">
                                <input onChange={handleInputModalCode} className="form-control col-12" type="text" placeholder="Enter Code" name="code" id="code"/>
                                <div id="codeNotification"></div>               
                            </div>
                            <div className="form-group ml-2 my-0 passwordDiv">
                                <div className="row ml-2">
                                    <input onChange={handleInputModalPassword} className="form-control col-10 mr-0 pr-0" type="password" placeholder="Enter New Password" id="fpPswd"/>
                                    <div className="input-group-append col-2 ml-0 pl-0">
                                        <span className="input-group-text">
                                            <i onClick={(e)=>{togglePassword(e,"fpPswd")}} className="fas fa-eye" id="passwordEye"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="form-text col-12" id="fpPasswordNotification"></div>
                            </div>
                            <div className="form-group ml-2 my-0 confirmPasswordDiv">
                                <div className="row ml-2">
                                    <input onChange={handleInputModalConfirmPassword} className="form-control col-10 mr-0 pr-0" type="password" placeholder="Confirm New Password" id="fpConfirmPswd"/>
                                    <div className="input-group-append col-2 ml-0 pl-0">
                                        <span className="input-group-text">
                                            <i onClick={(e)=>{togglePassword(e,"fpConfirmPswd")}} className="fas fa-eye" id="passwordEye"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="form-text col-12" id="fpConfirmPasswordNotification"></div>
                            </div>
                        </div>
                        
                        <div class="mx-4  clearfix">
                            <button type="button" className="btn btn-primary float-left" onClick={handleGetCode} id="getCodeBtn">Get Code</button>
                            <button type="button" class="btn btn-secondary float-right" id="goBackBtn" onClick={handleGoBack}>Go back</button>
                        </div>
                    </div>
                    

                    </div>
                </div>
            </div>
            {/* Main content div */}
            <div className="mt-5 p-lg-5 p-sm-2 text-center" id="mainDiv">
                <div className="col-lg-6 offset-3 text-left border border-secondary p-sm-2 p-lg-5 rounded">
                    <div id="mainContentNotification"></div>
                    <form >
                        <div className="form-group row">
                            <label htmlFor="email" className="col-lg-2 align-middle"><b>Email:</b></label>
                            <input onChange={handleInputEmail} className="form-control col-10" type="text" placeholder="Enter Email" name="email" id="email"/>
                            <div className="col-2"></div>
                            <div className="form-text col-10" id="emailNotification"></div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="pswd" className="col-lg-2"><b>Password:</b></label>
                            <input onChange={handleInputPassword} className="form-control col-9 mr-0 pr-0" type="password" placeholder="Enter Password" name="pswd" id="pswd"/>
                            <div className="input-group-append col-1 ml-0 pl-0">
                                <span className="input-group-text">
                                <i onClick={(e)=>{togglePassword(e,"pswd")}} className="fas fa-eye" id="passwordEye"></i>
                                </span>
                            </div>
                            <div className="col-2"></div>
                            <div className="form-text col-10" id="passwordNotification"></div>
                        </div>
                        <div className="col-8 offset-2">
                            <button type="button" className="col-6 offset-3 btn btn-outline-primary" onClick={handleLogin}><b>User login</b> <i className="fas fa-arrow-right"></i></button>
                        </div>
                        <div className="text-center row my-4">
                            <h2 id="or" className="col-8 offset-2">
                                <span>or</span>
                            </h2>
                        </div>
                        <div className="container signin text-center mt-2">
                            <p className="mb-0 pb-0">New User? <a href="/">register</a> or Login as <a href="/login-admin">Admin?</a>.</p>
                            <a data-toggle="modal" data-target="#forgetPasswordModal" id="forgetPassword">Forget Password?</a>
                        </div>
                    </form>
                </div>
            </div>
            
       
        </>
    )
}

export default  Login;