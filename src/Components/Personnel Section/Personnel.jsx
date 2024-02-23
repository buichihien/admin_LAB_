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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7); // Số mục trên mỗi trang
    
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
                <td><img id="imgUser" src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} alt="user" /></td>
                <td>{data.username}</td>
                <td>{data.email}</td>
                <td>{data.phone}</td>
                <td>{data.role}</td>
                <td>                                       
                    <button onClick={() => handleDelete(data.id)}><RiChatDeleteFill className="icon2" /></button>
                </td>
            </tr>
        ));

    // Logic xử lý chuyển trang
    const paginate = pageNumber => setCurrentPage(pageNumber);

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
                                        <button onClick={() => handleDelete(item.id)}><RiChatDeleteFill className="icon2" /></button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {/* Phân trang */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, index) => (
                    <button className="btnp" key={index} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    )  
};

export default Personnel;