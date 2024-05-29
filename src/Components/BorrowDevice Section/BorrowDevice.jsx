import React, { useEffect, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { RiChatDeleteFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const BorrowDevice = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [activeButton, setActiveButton] = useState('yc');

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

    const handleApprove = async (id) => {
        const borrowRef = doc(db, "Borrow", id);
        await updateDoc(borrowRef, { status: "Đã duyệt" });
    };

    const handleBorrow = async (borrowData) => {
        const borrowRef = doc(db, "Borrow", borrowData.id);
        await updateDoc(borrowRef, { status: "Đang mượn" });
    };

    const handleReturn = async (borrowData) => {
        const borrowRef = doc(db, "Borrow", borrowData.id);
        await updateDoc(borrowRef, { status: "Đã trả" });
    };

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Tìm kiếm người dùng" onChange={(e) => setSearch(e.target.value)} />
                    <FcSearch className="icon" />
                </div>
                <div className="buttons">
                    <button className={`button yc ${activeButton === 'yc' ? 'active' : ''}`} onClick={() => handleButtonClick('yc')}>Yêu cầu</button>
                    <button className={`button ddy ${activeButton === 'ddy' ? 'active' : ''}`} onClick={() => handleButtonClick('ddy')}>Đã duyệt</button>
                    <button className={`button dmg ${activeButton === 'dmg' ? 'active' : ''}`} onClick={() => handleButtonClick('dmg')}>Đang mượn</button>
                    <button className={`button dtr ${activeButton === 'dtr' ? 'active' : ''}`} onClick={() => handleButtonClick('dtr')}>Đã trả</button>
                </div>

            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên người dùng</th>
                            <th>Lớp</th>
                            <th>MSSV</th>
                            <th>Tên thiết bị</th>
                            <th>Số lượng</th>
                            <th>Thời gian</th>
                            <th>Ngày</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((data) => {
                            if (activeButton === 'yc') return data.status === "Yêu cầu";
                            if (activeButton === 'ddy') return data.status === "Đã duyệt";
                            if (activeButton === 'dmg') return data.status === "Đang mượn";
                            if (activeButton === 'dtr') return data.status === "Đã trả";
                            return true;
                        }).filter((data) => {
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
                                        {data.status === "Yêu cầu" && (
                                            <button
                                                className="approve"
                                                onClick={() => handleApprove(data.id)}
                                            >
                                                Duyệt
                                            </button>
                                        )}
                                        {data.status === "Đã duyệt" && (
                                            <button
                                                className="borrow"
                                                onClick={() => handleBorrow(data)}
                                            >
                                                Tiến hành mượn
                                            </button>
                                        )}
                                        {data.status === "Đang mượn" && (
                                            <button
                                                className="returned"
                                                onClick={() => handleReturn(data)}
                                            >
                                                Trả
                                            </button>
                                        )}
                                        {data.status === "Đã trả" && (
                                            <div className="returned-action">
                                                <p>Đã trả</p>
                                                <button onClick={() => handleDelete(data.id)}>
                                                    <RiChatDeleteFill className="icon2" />
                                                </button>
                                            </div>
                                        )}

                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BorrowDevice;
