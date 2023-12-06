import React, { useEffect, useState } from "react";
import "./devices.css";
import { FcSearch } from "react-icons/fc";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
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
    
    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Search Devices" onChange={(e) => setSearch(e.target.value)}/>
                    <FcSearch className="icon" />
                </div>
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
                            {/* <th>State</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((data)=>{
                            return search.toLowerCase() === ''
                            ? data
                            :  data.devicename.toLowerCase().includes(search);
                        }).map((data, index) => {
                            return (
                                <tr key={data.id}>
                                    <td>{index+1}</td>
                                    <td><img className="imgDevices" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0' }} src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} /></td>
                                    <td>{data.devicename}</td>
                                    <td>{data.seri}</td>
                                    <td>{data.quantity}</td>
                                    {/* <td><div className="state">{data.state}</div></td>                                   */}
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