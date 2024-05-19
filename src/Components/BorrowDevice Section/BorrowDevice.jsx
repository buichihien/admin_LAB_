import React, { useEffect, useState } from "react";
import "./borrow.css";
import { FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

const BorrowDevice = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Borrow"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                const borrowData = doc.data();
                if (borrowData.userEmail === userEmail) {
                    list.push({ id: doc.id, ...borrowData });
                }
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
            }
        );

        return () => {
            unsub();
        };
    }, [userEmail]);    

    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Search User" onChange={(e) => setSearch(e.target.value)} />
                    <FcSearch className="icon" />
                </div>
                <div><button><Link to="/bookingRoom">Add Book</Link></button></div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Name device</th>
                            <th>Email</th>
                            <th>Quantity</th>
                            <th>Time</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((borrow) => {
                            return search.toLowerCase() === '' || borrow.deviceName.toLowerCase().includes(search);
                        }).map((borrow, index) => {
                            return (
                                <tr key={borrow.id}>
                                    <td>{index + 1}</td>
                                    <td>{borrow.deviceName}</td>
                                    <td>{borrow.userEmail}</td>
                                    <td>{borrow.quantity}</td>
                                    <td>{borrow.time}</td>
                                    <td>{borrow.date}</td>
                                    <td>{borrow.status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BorrowDevice;
