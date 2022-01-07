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

    let notify;

    if(type === "danger"){
        notify = "red";
    } else {
        notify = "green";
    }

    notificationDiv.current.style.color = notify;
    notificationDiv.current.innerText = message;

    setTimeout( ()=>{
        notificationDiv.current.style.color = '';
        notificationDiv.current.innerText = "";
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


export const checkAdmin = () => {

    let token = window.localStorage.getItem('token');
    
    axios.post(URL+"admin/check-admin", {token})
        .then(res => res.data)
        .then(data=>{
            
            if(!data.valid)
                window.location.href = "/"
        
        })
        .catch(error => {
            console.log(error);
            window.location.href = "/"
        })
    
}

export const adminLogout = ( ) => {

    window.localStorage.setItem('login', false);
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


export const loginChecker = () => {
    let login = window.localStorage.getItem('login')

    if(login === "admin"){
        window.location.href = "/admin";
    } else {
        window.location.href = "/";
    }
}

export const adminLoginChecker = () => {
    
    if(window.localStorage.getItem('login') !== "admin")
        {
            window.localStorage.setItem('login', 'false');
            window.location.href = "/";
        }
    let token = window.localStorage.getItem('token');
    axios.post(URL+"check-user", {token, data: "admin"})
    .then(res => res.data)
    .then( data => {
        console.log(data);
        if(data.found)
            return true
        window.localStorage.setItem('login', 'false');
        window.location.href = "/";
    })
    .catch(err => {
        console.log(err);
        setTimeout(()=>{  
            window.localStorage.setItem('login', 'false');
            window.location.href = "/"; 
        },4000)
    })
}


export const userLoginChecker = () => {
    
    let value = window.localStorage.getItem('login');
        if(value === 'user')
            {
                let token = window.localStorage.getItem('token');
                axios.post(URL+"check-user", { token, data: "user" })
                    .then(res=>res.data)
                    .then(data=>{
                        console.log(data);
                        if(data.found)
                            return true;
                        return false;
                    })
                    .catch(error=>{
                        console.log(error);
                        return false;
                    })
                return false
        } else {
            return false;
        }
}