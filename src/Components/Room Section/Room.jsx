import React, { useEffect, useState } from "react";
import "./room.css";
import { FcSearch } from "react-icons/fc";
import { BiSolidCommentEdit } from "react-icons/bi";
import { RiChatDeleteFill } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Users = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Số mục trên mỗi trang
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        date: '',
        time: ''
    });

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Room"), (snapshot) => {
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
        const deleteVal = doc(db, "Room", id);
        await deleteDoc(deleteVal);
    };

    const handleEdit = (user) => {
        setEditId(user.id);
        setEditData({
            date: user.date,
            time: user.time
        });
    };

    const handleSave = async (id) => {
        const updateRef = doc(db, "Room", id);
        await updateDoc(updateRef, { date: editData.date, time: editData.time });
        setEditId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    // Tính toán phạm vi dữ liệu hiển thị trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Logic phân trang và hiển thị dữ liệu
    const renderData = currentItems
        .filter(item => search === '' || item.username.toLowerCase().includes(search))
        .map((data, index) => (
            <tr key={data.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>
                    {
                        data.userEmail
                    }
                </td>
                <td>
                    {
                        data.username
                    }
                </td>
                <td>
                    {
                        data.mssv
                    }
                </td>
                <td>
                    {
                        data.class
                    }
                </td>
                <td>
                    {
                        data.phone
                    }
                </td>
                <td>
                    {editId === data.id ? (
                        <input name="date" value={editData.date} onChange={handleChange} />
                    ) : (
                        data.date
                    )}
                </td>
                <td>
                    {editId === data.id ? (
                        <input name="time" value={editData.time} onChange={handleChange} />
                    ) : (
                        data.time
                    )}
                </td>
                <td>
                    {editId === data.id ? (
                        <button onClick={() => handleSave(data.id)}><FaRegSave className="icon2"/></button>
                    ) : (
                        <>
                            <button onClick={() => handleEdit(data)}><BiSolidCommentEdit className="icon2" /></button>
                            <button onClick={() => handleDelete(data.id)}><RiChatDeleteFill className="icon2" /></button>
                        </>
                    )}
                </td>
            </tr>
        ));

    // Logic xử lý chuyển trang
    const paginate = (direction) => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < Math.ceil(data.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Search User Email" onChange={(e) => setSearch(e.target.value)} />
                    <FcSearch className="icon" />
                </div>
                <div><button><Link to="/bookingRoom">Add Booking</Link></button></div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Email User</th>
                            <th>Full Name</th>
                            <th>MSSV</th>
                            <th>Class</th>
                            <th>Phone</th>
                            <th>DateBooking</th>
                            <th>TimeBooking</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderData}
                    </tbody>
                </table>
            </div>
            {/* Phân trang */}
            <div className="pagination">
                <button className="btnp" onClick={() => paginate('prev')}>{"<<"}</button>
                <span>{currentPage}</span>
                <button className="btnp" onClick={() => paginate('next')}>{">>"}</button>
            </div>
        </div>
    );
};

export default Users;