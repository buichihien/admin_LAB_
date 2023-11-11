import React, { useEffect, useState } from "react";
import "./users.css";
import { FcSearch } from "react-icons/fc";
import { BiSolidCommentEdit } from "react-icons/bi";
import { RiChatDeleteFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Users = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const value = collection(db, "Users")
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
        return()=>{
            unsub();
        };
    }, [])

    const handleDelete = async (id) => {
        const deleteVal = doc(db, "Users", id)
        await deleteDoc(deleteVal)
    }

    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Search User" onChange={(e) => setSearch(e.target.value)}/>
                    <FcSearch className="icon" />
                </div>
                <div><button><Link to="/NewUser">Add User</Link></button></div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Image</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((data)=>{
                            return search.toLowerCase() === ''
                            ? data
                            :  data.username.toLowerCase().includes(search);
                        }).map((data, index) => {
                            return (
                                <tr key={data.id}>
                                    <td>{index+1}</td>
                                    <td><img style={{ width: '25%', height: '70px'}} src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} /></td>
                                    <td>{data.username}</td>
                                    <td>{data.email}</td>
                                    <td>{data.phone}</td>
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
}

export default Users