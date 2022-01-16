import axios from "axios";


const URL = "http://localhost:4000/";


export const togglePassword = (e, input) => {

    let tagValue;

    if(e.target.className === "input-group-text")
        tagValue = e.target;  
    else 
        tagValue = e.target.parentElement;

    if(input.type === 'text'){
        input.type = 'password'
        tagValue.innerHTML = '<i class="fas fa-eye"></i>'
    } else {
        tagValue.innerHTML = '<i class="fas fa-eye-slash"></i>'        
        input.type = 'text'
    }
}


export const inputNotifier = (inputDiv, notifyDiv, message, type) => {

    let notify;

    if(type === "danger"){
        notify = "red";
    } else {
        notify = "green";
    }
    
    inputDiv.current.style.border = "1px solid "+notify;
    notifyDiv.current.style.color = notify;
    notifyDiv.current.innerText = message;

    setTimeout( ()=>{
        inputDiv.current.style.border = ""
        notifyDiv.current.style.color = '';
        notifyDiv.current.innerText = "";
    }, 3000);


}

export const mainNotifier = ( notificationDiv, message, type ) => {

    const classname = `col-12 alert alert-${type}`

    notificationDiv.current.innerHTML = `<div className=${classname}>${message}</div>`

    setTimeout( ()=>{
        notificationDiv.current.innerHTML = "";
    }, 3000);

}

export const regexMatcher = ( string_to_match, type) => {
    
    const emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const adharcardExp = /^[2-9]{1}[0-9]{11}$/;
    const mobileExp = /^(91|0|)[6-9]\d{9}$/;
    const passwordExp = /.{6,}$/;
    
    switch(type){

        case 'email':
            return string_to_match.match(emailExp)? true: false;
            break;
        case 'adharcard':
            return string_to_match.match(adharcardExp)? true: false;
            break;
        case 'mobile':
            return string_to_match.match(mobileExp)? true: false;
            break;
        case 'password':
            return string_to_match.match(passwordExp)? true: false;
            break;
    }
}


export const Logout = ( ) => {

    window.localStorage.setItem('login', 'false');
    window.localStorage.setItem('token', '');
    window.location.href = "/";

}


export const disable = (element) => {
    element.current.setAttribute("disabled", "");
}

export const enable = (element) => {
    element.current.removeAttribute("disabled");
}

export const show = (element) => {
    element.current.style.display = "flex";
}

export const hide = (element) => {
    element.current.style.display = "none";
}

export const adminLoginChecker = () => {
    
    const token = window.localStorage.getItem('token');
    return axios.get(URL+"admin/check-admin", {headers: {token}})

}

export const loginChecker = (data) => {
    if(!data.login){
        window.localStorage.setItem('login', 'false');
        window.localStorage.setItem('token', '');
        window.location.href = '/';
        return false;
    }
    return true;
}

export const userLoginChecker = () => {
    const token = window.localStorage.getItem('token');
    return axios.get(URL+"user/check-user", {headers: {token}});
}

export const addHeaders = (data) => {

    const token = window.localStorage.getItem('token');
    data.headers = {token}
    return data;

}
