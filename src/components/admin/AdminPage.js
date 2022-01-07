import {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import { URLInfo, functions } from '../../helper/context';
import Loading from '../basic/Loading';
import AdminNavbar from '../basic/AdminNavbar'

const AdminPage = () =>{

    const { mainNotifier, inputNotifier, regexMatcher, adminLoginChecker, adminLogout,loginChecker } = useContext(functions)
    const { urlInfo_ } = useContext(URLInfo);
    
    const [isLoading ,setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [bookingCount, setBookingCount] = useState(0);
    const [flightCount, setFlightCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    
    //sending request on mounting 
    useEffect( ()=> {

        const check = adminLoginChecker();
        console.log(check);
        setIsLogin(check);

        let token = window.localStorage.getItem('token')

        axios.get( urlInfo_ + 'admin/count-today', {token})
            .then( res=> res.data.data)
            .then(data=>{
                setBookingCount(data.booking);
                setFlightCount(data.flight);
            })

        axios.get(urlInfo_+'admin/admin-count', {token})
            .then(res=> res.data)
            .then(data =>{
                setAdminCount(data.data);
            });
        setIsLoading(false);
        console.log(isLogin, isLoading);
        return () =>{
            setIsLoading(false);
        }
    }, [])


    return (
        <>
            { isLoading ? <Loading />:
                <>
                    {
                        !isLogin ? "":
                        <>
                            <AdminNavbar />      
                            <div className='container row text-center'>
                                <div className='col-4'>{bookingCount}<br/>Today Bookings</div>
                                <div className='col-4'>{flightCount}<br/>Today Flights</div>
                                <div className='col-4'>{adminCount}<br/>Total Admins</div>
                            </div>
                        </>
                    }
                    
                </>
            }
        </>
    )
}


export default AdminPage;