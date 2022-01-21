import axios from 'axios';
import { useContext, useState, useRef, useEffect } from 'react';
import { URLInfo, functions } from '../../helper/context'

import AdminNavbar from '../basic/AdminNavbar';
import Loading from '../basic/Loading';

const AddAdmin = (props) => {

    const { mainNotifier, inputNotifier, regexMatcher, enable, 
            disable, adminLoginChecker, loginChecker, addHeaders} = useContext(functions)
    const { urlInfo_ } = useContext(URLInfo);

    const [isLoading ,setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);

    const mainNotify = useRef(null);
    const name  = useRef(null);
    const nameNotify = useRef(null);
    const email = useRef(null);
    const emailNotify = useRef(null);
    const mobile = useRef(null);
    const mobileNotify = useRef(null);
    const adharcard = useRef(null);
    const adharcardNotify = useRef(null);
    const addBtn = useRef(null);


    useEffect( ()=> {
        adminLoginChecker().then(res=>res.data)
        .then(data => {
            if(loginChecker(data)){
                setIsLoading(false);
                setIsLogin(true);
            }; 
        })

    }, [])

    const handleAddBtn = (e) => {

        disable(name);
        disable(email);
        disable(mobile);
        disable(adharcard);
        disable(addBtn);

        let namepass = false;
        let emailpass = false;
        let mobilepass = false; 
        let adharcardpass = false;

        if( name.current.value.trim().length === 0 ){
            inputNotifier(name, nameNotify, "Empty", "danger");
        } else { namepass = true }

        if( !regexMatcher( email.current.value, "email" )){
            inputNotifier(email, emailNotify, "Invalid", "danger");
        } else { emailpass = true }

        if( !regexMatcher( mobile.current.value, "mobile" )){
            inputNotifier(mobile, mobileNotify, "Invalid", "danger");
        } else { mobilepass = true }

        if( !regexMatcher( adharcard.current.value, "adharcard" )){
            inputNotifier( adharcard, adharcardNotify, "Invalid", "danger" );
        } else { adharcardpass = true }

        if( namepass && emailpass && mobilepass && adharcardpass ){

            axios.post(urlInfo_+"admin/add-admin", {
                name: name.current.value,
                email: email.current.value,
                mobile: mobile.current.value,
                adharcard: adharcard.current.value
            }, addHeaders({})).then( res => res.data )
            .then(data=>{

                loginChecker(data);

                enable(name);
                enable(email);
                enable(mobile);
                enable(adharcard);
                enable(addBtn);

                if(!data.error){
                    mainNotifier(mainNotify, "Added Successfully!", "success");
                    name.current.value = null;
                    email.current.value = null;
                    mobile.current.value = null;
                    adharcard.current.value = null;

                } else if(data.error === 'email'){
                    inputNotifier(email, emailNotify, "Already Exists", "danger")
                } else if( data.error === "mobile" ){
                    inputNotifier(mobile, mobileNotify, "Already Exists", "danger")
                } else {
                    mainNotifier(mainNotify, "Some Issue while registering", "danger")
                }
            })
            .catch(error => {
                enable(name);
                enable(email);
                enable(mobile);
                enable(adharcard);
                enable(addBtn);
                mainNotifier(mainNotify, "Some Issue while Registering", "danger");
            })
        }
    }

    return (
        <>
            {isLoading? <Loading /> :
            <>
                {!isLogin? "" :
                <>
                    <AdminNavbar/>
                    
                    <div className="d-flex align-item-center p-2" id="mainDiv">
                        <div className="p-5 text-center" id="formDiv">
                            <h2 className="mb-0">Add Admin</h2>
                            <div ref={mainNotify} className='mb-3'></div>
                            
                            <div className="input-group mb-0">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fas fa-user-alt"></i></span>
                                </div>
                                <input type="text"  ref={name} className="form-control" placeholder="Enter name"/>
                            </div>
                            <div ref={nameNotify} className='mb-3'></div>

                            <div className="input-group mb-0">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="far fa-envelope"></i></span>
                                </div>
                                <input type="text"  ref={email} className="form-control" placeholder="Enter email"/>
                            </div>
                            <div ref={emailNotify} className='mb-3'></div>

                            <div className="input-group mb-0">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fas fa-phone"></i></span>
                                </div>
                                <input type="text"  ref={mobile} className="form-control" placeholder="Enter Phone Number"/>
                            </div>
                            <div ref={mobileNotify} className='mb-3'></div>

                            <div className="input-group mb-0">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fas fa-id-card"></i></span>
                                </div>
                                <input type="text"  ref={adharcard} className="form-control" placeholder="Enter Adhar Card"/>
                            </div>
                            <div ref={adharcardNotify} className='mb-3'></div>

                            <button className='btn btn-primary col-4' ref={addBtn} onClick={handleAddBtn}>Add</button>
                        </div>
                    </div>
                </>}
            </>}
        </>
    )
}

export default AddAdmin;