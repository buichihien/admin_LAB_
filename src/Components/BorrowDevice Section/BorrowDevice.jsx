import React, { useEffect, useState } from "react";
import "./borrow.css";
import { FcSearch } from "react-icons/fc";
import { RiChatDeleteFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const BorrowDevice = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Borrow"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            list.sort((a, b) => {
                const dateComparison = a.date.localeCompare(b.date);
                if (dateComparison !== 0) {
                    return dateComparison;
                }
                return a.time.localeCompare(b.time);
            });
            setData(list);
        },
            (err) => {
                console.log(err);
            });
        return () => {
            unsub();
        };
    }, []);

    const handleDelete = async (id) => {
        const deleteVal = doc(db, "Borrow", id);
        await deleteDoc(deleteVal);
    };

    const handleReturn = async (borrowData) => {
        const borrowRef = doc(db, "Borrow", borrowData.id);
        const deviceQuery = await getDocs(collection(db, "Device"));
        const deviceData = deviceQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const device = deviceData.find(item => item.devicename === borrowData.deviceName);

        if (device) {
            const deviceRef = doc(db, "Device", device.id);
            await updateDoc(deviceRef, { quantity: device.quantity + borrowData.quantity });
        }

        await updateDoc(borrowRef, { status: "Đã trả" });
    };

    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Search User" onChange={(e) => setSearch(e.target.value)} />
                    <FcSearch className="icon" />
                </div>
                <div><button><Link to="/bookingRoom">Add Booking</Link></button></div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>User Name</th>
                            <th>Class</th>
                            <th>MSSV</th>
                            <th>Name device</th>
                            <th>Quantity</th>
                            <th>Time</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((data) => {
                            return search.toLowerCase() === ''
                                ? data
                                : data.deviceName.toLowerCase().includes(search);
                        }).map((data, index) => {
                            return (
                                <tr key={data.id}>
                                    <td>{index + 1}</td>
                                    <td>{data.userName}</td>
                                    <td>{data.userClass}</td>
                                    <td>{data.userMSSV}</td>
                                    <td>{data.deviceName}</td>
                                    <td>{data.quantity}</td>
                                    <td>{data.time}</td>
                                    <td>{data.date}</td>
                                    <td className="status-cell">
                                        <div>
                                            {data.status === "Đã mượn" ? (
                                                <button
                                                    className="borrowed"
                                                    onClick={() => handleReturn(data)}
                                                >
                                                    Đang mượn
                                                </button>
                                            ) : (
                                                <button
                                                    className="returned"
                                                    onClick={() => handleReturn(data)}
                                                >
                                                    Đã trả
                                                </button>
                                            )}
                                        </div>
                                        <button onClick={() => handleDelete(data.id)}>
                                            <RiChatDeleteFill className="icon2" />
                                        </button>
                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BorrowDevice;
