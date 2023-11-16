import React, { useEffect, useState } from "react";
import "./devices.css";
import { FcSearch } from "react-icons/fc";
import { BiSolidCommentEdit } from "react-icons/bi";
import { RiChatDeleteFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, setDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Devices = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Device"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
        },
            (err) => {
                console.log(err);
            }
        );
        return()=>{
            unsub();
        };
    }, [])

    const handleToggle = async (employeeId) => {
        const updatedData = data.map((employee) => {
            if (employee.id === employeeId) {
                const updatedStatus = !employee.status;
                return { ...employee, status: updatedStatus };
            }
            return employee;
        });

        setData(updatedData);

        const docRef = doc(db, "Personnel", employeeId);
        await setDoc(docRef, { status: updatedData.find((employee) => employee.id === employeeId).status }, { merge: true });
    };
    
    const handleDelete = async (id) => {
        const deleteVal = doc(db, "Device", id)
        await deleteDoc(deleteVal)
    }
    
    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Search Devices" onChange={(e) => setSearch(e.target.value)}/>
                    <FcSearch className="icon" />
                </div>
                <div><button><Link to="/NewDevice">Add Device</Link></button></div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Image</th>
                            <th>DeviceName</th>
                            <th>Seri</th>
                            <th>Quantity</th>
                            <th>State</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((item)=>{
                            return search.toLowerCase() === ''
                            ? item
                            :  item.seri.toLowerCase().includes(search);
                        }).map((item, index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{index+1}</td>
                                    <td><img id="imgDevices" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0' }} src={item.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} /></td>
                                    <td>{item.devicename}</td>
                                    <td>{item.seri}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        <button className="status" onClick={() => handleToggle(item.id)}>
                                            <p>{item.status ? 'CÒN' : 'HẾT'}</p>
                                        </button>
                                    </td>
                                    <td>
                                        <button><BiSolidCommentEdit className="icon2" /></button>
                                        <span>   </span>
                                        <button onClick={() => handleDelete(data.id)}><RiChatDeleteFill className="icon2" /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )  
};

export default Devices;