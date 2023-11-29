import React, { useEffect, useState } from "react";
import "./personnel.css";
import { FcSearch } from "react-icons/fc";
import { BiSolidCommentEdit } from "react-icons/bi";
import { RiChatDeleteFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, setDoc, getDocs, onSnapshot, and } from "firebase/firestore";
import { db } from "../../firebase";


const Personnel = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [editedData, setEditedData] = useState({});
    
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Personnel"), (snapshot) => {
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
        const deleteVal = doc(db, "Personnel", id);
        await deleteDoc(deleteVal)
    }

    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Search Personnel" onChange={(e) => setSearch(e.target.value)}/>
                    <FcSearch className="icon" />
                </div>
                <div><button><Link to="/NewPersonnel">Add Personnel</Link></button></div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>State</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            .filter((item) => {
                                return search.toLowerCase() === '' ? true : item.personnelname.toLowerCase().includes(search);
                            })
                            .map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td><img src={item.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} alt={item.personnelname} /></td>
                                    <td>{item.personnelname}</td>
                                    <td>{item.timein}</td>
                                    <td>{item.timeout}</td>
                                    <td>                                         
                                        <button className="status" onClick={() => handleToggle(item.id)}>
                                            <p>{item.status ? 'ON' : 'OFF'}</p>
                                        </button>
                                    </td>
                                    <td>           
                                        <button>
                                            <Link to="/EditPersonnel"><BiSolidCommentEdit className="icon2" /></Link>                                                                                      
                                        </button>
                                        <span>   </span>
                                        <button onClick={() => handleDelete(item.id)}><RiChatDeleteFill className="icon2" /></button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )  
};

export default Personnel;