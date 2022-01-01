import React, { useState } from 'react';
import './css/SignUp.css';
import axios from "axios";


function SignUp(props) {

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    function handleInputEmail(e){
        setData({
            ...data,
            email: e.target.value
        })
    }
    
    function handleInputName(e){
        setData({
            ...data,
            name: e.target.value
        })
    }
    
    function handleInputPassword(e){
        setData({
            ...data,
            password: e.target.value
        })
    }
    
    function handleInputConfirmPassword(e){
        setData({
            ...data,
            confirm_password: e.target.value
        })
    }
    
    function togglePassword(e){
        
        let toChange = "";
        if(e.target.id === "confirmPasswordEye")
            toChange = 'confirm_pswd';
        else 
            toChange = 'pswd';
        
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
    
    // cheking for regex match 
    function check_regex_match( regex_exp, input_string ){

        return input_string.match(regex_exp)? true: false;
        
    }

    function handleSignUp(e){

        let namePass=false, emailPass=false, passwordPass=false;
        const nameNotify = document.getElementById("nameNotification"),
              emailNotify = document.getElementById("emailNotification"),
              passwordNotify = document.getElementById("passwordNotification"),
              confirmPasswordNotify = document.getElementById("confirmPasswordNotification");
        
        const email_exp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              password_exp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        
        //Email Validation checking
        if(check_regex_match(email_exp, data.email))
            emailPass = true;
        else {
            emailNotify.innerText = "Enter Valid Email!";
            emailNotify.style.color = 'red';
            emailNotify.style.fontSize = "0.8em";
            setTimeout( ()=> {
                emailNotify.innerText = "";
                emailNotify.style.color = "";
            },3000);
        }
        
        // Name Checking
        if(data.name.trim()=== ""){
            nameNotify.innerText = "Name can't be empty or contain only spaces!";
            nameNotify.style.color = 'red';
            nameNotify.style.fontSize = "0.8em";
            
            setTimeout( ()=>{
                nameNotify.innerText = "";
                nameNotify.style.color = '';
            },3000)
        } else { namePass = true }

        //Paswword Validation checking
        if(check_regex_match(password_exp, data.password)){
            if(data.password === data.confirm_password){
                passwordPass = true;
            } else {
                confirmPasswordNotify.innerText = "Password don't matches!";
                confirmPasswordNotify.style.color = 'red';
                confirmPasswordNotify.style.fontSize = "0.8em";
                setTimeout( ()=>{
                    confirmPasswordNotify.innerText = '';
                    confirmPasswordNotify.style.color = '';
                },3000);
            }
        } else {
            passwordNotify.style.color = 'red';
            passwordNotify.style.fontSize = "0.8em";
            setTimeout(() => {
                passwordNotify.style.color = "black";
            }, (3000));
        }
        
        
        if(emailPass && passwordPass && namePass){
            axios.post('http://localhost:4000/check-user', {email:data.email})
            .then(res=>{
                if(!res.data.error && !res.data.found){

                    axios.post('http://localhost:4000/register', data)
                    .then(res=>{
                        const mainNotify = document.getElementById('mainNotification');
        
                        if(!res.data.error && res.data.redirect){
                            
                            mainNotify.innerText = "Registered Successfully!"
                            mainNotify.className = "alert alert-success text-center mt-0 pt-0";

                            setTimeout( ()=> {
                                mainNotify.innerText = "";
                                mainNotify.className = "";
                                window.location.href = res.data.redirect;
                            },3000);

                        } else {
                            mainNotify.innerText = res.data.error;
                            mainNotify.className = "alert alert-danger text-center mt-0 pt-0";
                            setTimeout( ()=>{
                                mainNotify.innerText = "";
                                mainNotify.className = ""
                            },3000);
                        }
                    })

                } else if(!res.data.error && res.data.found){
                    emailNotify.innerText = "Email already exists go to login";
                    emailNotify.style.color = 'red';
                    emailNotify.style.fontSize = '0.8em';
                    setTimeout( ()=> {
                        emailNotify.innerText = "";
                    },3000);
                } else if( res.data.error && !res.data.found){
                    emailNotify.innerText = "There is some issue with this email!";
                    emailNotify.style.color = 'red';
                    emailNotify.style.fontSize = '0.8em';
                    setTimeout( ()=> {
                        emailNotify.innerText = "";
                    },3000);
                }
            })
        }
    }

    return (
        <>
            <form className="col-6 offset-3 mt-4 border border-secondary rounded py-lg-5 shadow">
                <div className="container">
                <h1 className="text-center mb-0 pb-0">Air Ticket</h1>
                <hr className="mb-4" id="belowHeading"/>
                <div id="mainNotification"></div>
                <div className="form-group row">
                    <label htmlFor="email" className="col-lg-2"><b>Email:</b></label>
                    <input onChange={handleInputEmail} className="form-control col-lg-9" type="text" placeholder="Enter Email" name="email" id="email"/>
                    <div className="col-2"></div>
                    <div className="form-text col-lg-10" id="emailNotification"></div>
                </div>
                <div className="form-group row">
                    <label htmlFor="name" className="col-lg-2"><b>Name:</b></label>
                    <input onChange={handleInputName} className="form-control col-lg-9" type="text" placeholder="Enter Name" name="name" id="name"/>
                    <div className="col-2"></div>
                    <div className="form-text col-lg-10" id="nameNotification"></div>
                </div>          
                <div className="form-group row">
                    <label htmlFor="pswd" className="col-lg-2"><b>Password:</b></label>
                    <input onChange={handleInputPassword} className="form-control col-9 mr-0 pr-0" type="password" placeholder="Enter Password" name="pswd" id="pswd"/>
                    <div className="input-group-append col-1 ml-0 pl-0">
                        <span className="input-group-text">
                        <i onClick={togglePassword} className="fas fa-eye" id="passwordEye"></i>
                        </span>
                    </div>
                    <div className="col-2"></div>
                    <div className="form-text col-lg-10" id="passwordNotification">Password should be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter</div>
                </div>
                <div className="form-group row">
                    <label htmlFor="confirm_pswd" className="col-lg-2"><b>Confirm Password:</b></label>
                    <input onChange={handleInputConfirmPassword} className="form-control col-9 mr-0 pr-0" type="password" placeholder="Confirm Password" name="confirm_pswd" id="confirm_pswd"/>
                    <div className="input-group-append col-1 ml-0 pl-0">
                        <span className="input-group-text">
                        <i onClick={togglePassword} className="fas fa-eye" id="confirmPasswordEye"></i>
                        </span>
                    </div>
                    <div className="col-2"></div>
                    <div className="form-text col-lg-10" id="confirmPasswordNotification"></div>
                </div>
                <div className="text-center">
                    <button onClick={handleSignUp} id="submit" type="button" className="btn btn-outline-success col-4"><b>Register</b> <i className="fas fa-arrow-right"></i></button>
                </div>
                </div>
                <div className="text-center row my-4">
                    <h2 id="or" className="col-8 offset-2">
                        <span>or</span>
                    </h2>
                </div>
                <div className="container signin text-center mt-2">
                    <p>Already have an account? <a href="/login">Log in</a>.</p>
                </div>
            </form>
        </>
    )
}

export default SignUp;