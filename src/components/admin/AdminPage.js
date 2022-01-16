import {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import { URLInfo, functions } from '../../helper/context';
import Loading from '../basic/Loading';
import AdminNavbar from '../basic/AdminNavbar'

const AdminPage = () =>{

    const { Logout, addHeaders, loginChecker } = useContext(functions)
    const { urlInfo_ } = useContext(URLInfo);
    
    const [isLoading ,setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [bookingCount, setBookingCount] = useState(0);
    const [flightCount, setFlightCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    
    //sending request on mounting 
    useEffect( ()=> {

        const countToday = axios.get( urlInfo_ + 'admin/count-today', addHeaders({}))

        Promise.all([countToday])
        .then((values)=>{

            const data = values[0].data;
            if(loginChecker(data)){
                setFlightCount(data.flight);
                setBookingCount(data.booking);
                setAdminCount(data.admin);
                setIsLogin(true);
                setIsLoading(false);
            }

        })
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