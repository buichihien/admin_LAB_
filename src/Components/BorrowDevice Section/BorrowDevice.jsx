import React, { useEffect, useState } from "react";
import "./borrow.css";
import { FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
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
    
            list = list.filter(item => item.date && item.time); // Lọc các mục có date và time được định nghĩa
    
            list.sort((a, b) => {
                // Kiểm tra xem date và time có tồn tại không trước khi sử dụng localeCompare
                const dateComparison = (a.date && b.date) ? a.date.localeCompare(b.date) : 0;
                if (dateComparison !== 0) {
                    return dateComparison;
                }
                return (a.time && b.time) ? a.time.localeCompare(b.time) : 0;
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
                    <input type="text" placeholder="Search Devices" onChange={(e) => setSearch(e.target.value)} />
                    <FcSearch className="icon" />
                </div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>User Name</th>
                            <th>Class</th>
                            <th>MSSV</th>
                            <th>Name Device</th>
                            <th>DateTime</th>
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
                                    <td>{borrow.userName}</td>
                                    <td>{borrow.userClass}</td>
                                    <td>{borrow.userMSSV}</td>
                                    <td>{borrow.deviceName}</td>
                                    <td>{`${borrow.date} ${borrow.time}`}</td>
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
