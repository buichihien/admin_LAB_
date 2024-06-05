import React, { useEffect, useState } from "react";
import "./users.css";
import { FcSearch } from "react-icons/fc";
import { FaRegSave } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiChatDeleteFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Users = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        username: '',
        mssv: '',
        class: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Users"), (snapshot) => {
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
        return () => {
            unsub();
        };
    }, []);

    const handleDelete = async (id) => {
        const deleteVal = doc(db, "Users", id);
        await deleteDoc(deleteVal);
    };

    const handleEdit = (user) => {
        setEditId(user.id);
        setEditData({
            username: user.username,
            mssv: user.mssv,
            class: user.class,
            email: user.email,
            phone: user.phone
        });
    };

    const handleSave = async (id) => {
        const updateRef = doc(db, "Users", id);
        await updateDoc(updateRef, editData);
        setEditId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const renderData = currentItems
        .filter(item => search === '' || item.username.toLowerCase().includes(search))
        .map((data, index) => (
            <tr key={data.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td><img id="imgUser" src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} alt="user" /></td>
                <td>
                    {editId === data.id ? (
                        <input name="username" value={editData.username} onChange={handleChange} />
                    ) : (
                        data.username
                    )}
                </td>
                <td>
                    {editId === data.id ? (
                        <input name="mssv" value={editData.mssv} onChange={handleChange} />
                    ) : (
                        data.mssv
                    )}
                </td>
                <td>
                    {editId === data.id ? (
                        <input name="class" value={editData.class} onChange={handleChange} />
                    ) : (
                        data.class
                    )}
                </td>
                <td>
                    {data.email}
                </td>
                <td>
                    {editId === data.id ? (
                        <input name="phone" value={editData.phone} onChange={handleChange} />
                    ) : (
                        data.phone
                    )}
                </td>
                <td>
                    {editId === data.id ? (
                        <button onClick={() => handleSave(data.id)}><FaRegSave className="icon2" /></button>
                    ) : (
                        <>
                            <button onClick={() => handleEdit(data)} ><FaEdit className="icon2" /></button>
                            <button onClick={() => handleDelete(data.id)}><RiChatDeleteFill className="icon2" /></button>
                        </>
                    )}
                </td>
            </tr>
        ));

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
                    <input type="text" placeholder="Search User" onChange={(e) => setSearch(e.target.value)} />
                    <FcSearch className="icon" />
                </div>
                <div><button><Link to="/NewUser">Thêm người dùng</Link></button></div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Image</th>
                            <th>Họ và tên</th>
                            <th>MSSV</th>
                            <th>Lớp</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderData}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button className="btnp" onClick={() => paginate('prev')}>{"<<"}</button>
                <span>{currentPage}</span>
                <button className="btnp" onClick={() => paginate('next')}>{">>"}</button>
            </div>
        </div>
    );
};

export default Users;