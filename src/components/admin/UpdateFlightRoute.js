import axios from 'axios';
import { useContext, useState, useRef, useEffect } from 'react';
import { URLInfo, functions } from '../../helper/context'

import AdminNavbar from '../basic/AdminNavbar';
import Loading from '../basic/Loading';

const UpdateFlightRoute = (props) => {

    const { mainNotifier, inputNotifier, addHeaders, loginChecker } = useContext(functions)
    const { urlInfo_ } = useContext(URLInfo);

    const [isLoading ,setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [routeData, setRouteData] = useState([]); //"To be worked";
    const [modalRoute, setModalRoute] = useState({});
    const [routeDelete, setRouteDelete] = useState({});
    const [index, setIndex] = useState(null);

    const mainNotify = useRef(null);
    const place1 = useRef(null);
    const place2 = useRef(null);
    const distance = useRef(null);
    const place1Notify = useRef(null);
    const place2Notify = useRef(null);
    const distanceNotify = useRef(null);
    const openUpdateModal = useRef(null);
    const modalUpdateBtn = useRef(null);
    const updateModalClose = useRef(null);
    const openDeleteModal = useRef(null);
    const mainNotifyDelete = useRef(null);
    const closeDeleteModal = useRef(null);

    useEffect( ()=>{

        axios.get(urlInfo_+'admin/get-flight-routes', addHeaders({}))
        .then(res=>res.data)
        .then(data=>{
            if(loginChecker(data)){
                setIsLogin(true);
                setRouteData( data.data );
                setIsLoading(false);
            }
        })
        .catch(err=>{
            console.log(err);
        })
    
    }, [])

    const handleUpdate = (e)=>{

        routeData.forEach( (eachRoute, eachIndex)=>{
            if(eachRoute._id === e.target.id){
                setIndex(eachIndex);
                setModalRoute(eachRoute);
                openUpdateModal.current.click();
                place1.current.value = eachRoute.place1;
                place2.current.value = eachRoute.place2;
                distance.current.value = eachRoute.distance
            }
        })

    }

    const handleModalUpdate = (e) =>{

        if((modalRoute.place1 !== place1.current.value && place1.current.value.trim().length !== 0) ||
            (modalRoute.place2 !== place2.current.value && place2.current.value.trim().length !== 0) ||
            (modalRoute.distance !== Number(distance.current.value) && Number(distance.current.value>=50)))
        {
            modalUpdateBtn.current.innerText = "Updating....";
            axios.post(urlInfo_+'admin/update-flight-route', {
                id: modalRoute._id,
                place1: place1.current.value,
                place2: place2.current.value,
                distance: Number(distance.current.value)
            }, addHeaders({})).then(res=>res.data)
            .then(data=>{
                loginChecker(data);
                modalUpdateBtn.current.innerText = "Update";
                if(data.error){
                    mainNotifier(mainNotify, "Unable to update", "danger");
                } else {
                    if(data.modified){
                        mainNotifier(mainNotify, "Updated!", "danger");
                        window.location.href = '/admin/update-flight-route'
                    } else {
                        mainNotifier(mainNotify, "Unable to update", "danger");
                    }
                }
            })
            .catch(err=>{
                modalUpdateBtn.current.innerText = "Update";
                updateModalClose.current.click();
                console.log(err);
                mainNotifier(mainNotify, "Some Error", "danger")
            })

        }else {

            if(place1.current.value.trim().length === 0)
                inputNotifier(place1, place1Notify, "Empty", "danger");
            if(place2.current.value.trim().length === 0)
                inputNotifier(place2, place2Notify, "Empty", "danger");
            if(!Number(distance.current.value))
                inputNotifier(place1, place1Notify, "Invalid", "danger");
            else {
                if(Number(distance.current.value<50)){
                    inputNotifier(distance, distanceNotify, "more than 50 Km", "danger")
                }
            }

            mainNotifier(mainNotify, "Update fields", "danger")
                
        }
    }

    const handleModalUpdateClose = (e) => {
        setModalRoute({});
        setIndex(null);
        place1.current.value = null;
        place2.current.value = null;
        distance.current.value = null;
    }

    const handleInput = (e) => {
        e.target.value = e.target.value.toUpperCase();
    }

    const handleDelete = (e)=>{
        
        routeData.forEach( (eachRoute, eachIndex)=>{
            if(eachRoute._id === e.target.id){
                setIndex(eachIndex);
                setRouteDelete(eachRoute);
                openDeleteModal.current.click();
            }
        })
        
    }

    const handleModalDelete = (e) => {
        
        axios.post(urlInfo_+"admin/delete-flight-route", { id:routeDelete._id }, addHeaders({}))
        .then(res=>res.data)
        .then(data=>{
            loginChecker(data);
            if(data.done){
                mainNotifier(mainNotifyDelete, "Deleted", "danger");
                setTimeout( ()=>{
                    closeDeleteModal.current.click();
                    window.location.href = '/admin/update-flight-route'
                },2000)
            } else {
                mainNotifier(mainNotifyDelete, "Unable to delete", "danger");
                closeDeleteModal.current.click();
            }
        })
        .catch(err=>{
            console.log(err);
            mainNotifier(mainNotifyDelete, "Unable to delete", "danger");
            closeDeleteModal.current.click();
        })
    }

    const handleDeleteClose = (e) =>{
        setIndex(null);
        setRouteDelete({});
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
                            <div className="container text-center">
                                <h2 className="display-4" >Flight Routes</h2>

                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Destination 1</th>
                                            <th>Destination 2</th>
                                            <th>Distance between</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {   routeData.length === 0?  <tr>No Route Available Please Add Some</tr> :
                                            routeData.map( (eachRoute)=>
                                                <tr key={eachRoute._id}>
                                                    <td>{eachRoute.place1}</td>
                                                    <td>{eachRoute.place2}</td>
                                                    <td>{eachRoute.distance}</td>
                                                    <td><button className="btn btn-primary" id={eachRoute._id} onClick={handleUpdate}>Update</button></td>
                                                    <td><button className="btn btn-danger" id={eachRoute._id} onClick={handleDelete}>Delete</button></td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div class="modal" id="updateModal">
                                <div class="modal-dialog text-center">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h4 class="modal-title">Make changes to Update Route</h4>
                                        <button type="button" class="close" ref={updateModalClose} data-dismiss="modal" onClick={handleModalUpdateClose}>&times;</button>
                                    </div>
                                    <div class="modal-body">
                                        <div ref={mainNotify} className='mb-3'></div>
                                        
                                        <div className="input-group mb-0">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
                                            </div>
                                            <input type="text"  ref={place1} onChange={handleInput} className="form-control" placeholder="Enter First Place"/>
                                        </div>
                                        <div ref={place1Notify} className='mb-2'></div>

                                        <div className="input-group mb-0">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
                                            </div>
                                            <input type="text"  ref={place2} onChange={handleInput} className="form-control" placeholder="Enter Second Place"/>
                                        </div>
                                        <div ref={place2Notify} className='mb-2'></div>

                                        <div className="input-group mb-0">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><i class="fas fa-route"></i></span>
                                            </div>
                                            <input type="text"  ref={distance} onChange={handleInput} className="form-control" placeholder="Enter Distance in KM"/>
                                        </div>
                                        <div ref={distanceNotify} className='mb-4'></div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" ref={modalUpdateBtn}class="btn btn-primary" onClick={handleModalUpdate}>Update</button>
                                    </div>

                                    </div>
                                </div>
                            </div>

                            <div class="modal" id="deleteModal">
                                <div class="modal-dialog text-center">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h4 class="modal-title">Are you sure ?</h4>
                                        <button type="button" class="close" data-dismiss="modal" onClick={handleDeleteClose}>&times;</button>
                                    </div>
                                    <div class="modal-body">
                                        <div ref={mainNotifyDelete} className='mb-3'></div>
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Destination 1</th>
                                                    <th>Destination 2</th>
                                                    <th>Distance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{routeDelete.place1}</td>
                                                    <td>{routeDelete.place2}</td>
                                                    <td>{routeDelete.distance}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="modal-footer clearfix mx-3">
                                        <button type="button" class="btn btn-primary float-left" onClick={handleDeleteClose}>No</button>
                                        <button type="button" ref={closeDeleteModal}class="btn btn-danger float-right" onClick={handleModalDelete} data-dismiss="modal">Delete</button>
                                    </div>

                                    </div>
                                </div>
                            </div>

                            <button type="button" ref={openUpdateModal} class="hide" data-toggle="modal" data-target="#updateModal"></button>
                            <button type="button" ref={openDeleteModal} class="hide" data-toggle="modal" data-target="#deleteModal"></button>
                        </>
                    }
                </>
            }
        </>
    )
}


export default UpdateFlightRoute;
