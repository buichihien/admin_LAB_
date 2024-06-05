import React, { useEffect, useState } from "react";
import "./room.css";
import { FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Users = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Room"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            list.sort((a, b) => {
                // Compare dates first
                const dateComparison = a.date.localeCompare(b.date);
                if (dateComparison !== 0) {
                    return dateComparison;
                }
    
                // If dates are equal, compare times
                return a.time.localeCompare(b.time);
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
                    <input type="text" placeholder="Search User" onChange={(e) => setSearch(e.target.value)}/>
                    <FcSearch className="icon" />
                </div>
                <div><button><Link to="/bookingRoom">Đặt phòng</Link></button></div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Họ và tên</th>
                            <th>Lớp</th>
                            <th>MSSV</th>
                            <th>Số điện thoại</th>
                            <th>Ngày đặt</th>
                            <th>Thời gian đặt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((data)=>{
                            return search.toLowerCase() === ''
                            ? data
                            :  data.class.toLowerCase().includes(search);
                        }).map((data, index) => {
                            return (
                                <tr key={data.id}>
                                    <td>{index+1}</td>
                                    <td>{data.username}</td>
                                    <td>{data.class}</td>
                                    <td>{data.mssv}</td>
                                    <td>{data.phone}</td>
                                    <td>{data.date}</td>
                                    <td>{data.time}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users