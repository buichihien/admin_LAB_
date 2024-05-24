// import React, { useEffect, useState } from "react";
// import "./users.css";
// import { FcSearch } from "react-icons/fc";
// import { RiChatDeleteFill } from "react-icons/ri";
// import { Link } from "react-router-dom";
// import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
// import { db } from "../../firebase";

// const Users = () => {
//     const [search, setSearch] = useState('');
//     const [data, setData] = useState([]);
//     useEffect(() => {
//         const unsub = onSnapshot(collection(db, "Users"), (snapshot) => {
//             let list = [];
//             snapshot.docs.forEach((doc) => {
//                 list.push({ id: doc.id, ...doc.data() });
//             });
//             setData(list);
//         },
//             (err) => {
//                 console.log(err);
//             }
//         );
//         return()=>{
//             unsub();
//         };
//     }, [])

//     const handleDelete = async (id) => {
//         const deleteVal = doc(db, "Users", id)
//         await deleteDoc(deleteVal)
//     }

//     return (
//         <div className="mainContent">
//             <div className="top">
//                 <div className="searchBar flex">
//                     <input type="text" placeholder="Search User" onChange={(e) => setSearch(e.target.value)}/>
//                     <FcSearch className="icon" />
//                 </div>
//                 <div><button><Link to="/NewUser">Add User</Link></button></div>
//             </div>

//             <div className="header_fixed">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>S No.</th>
//                             <th>Image</th>
//                             <th>Username</th>
//                             <th>Email</th>
//                             <th>Phone</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.filter((data)=>{
//                             return search.toLowerCase() === ''
//                             ? data
//                             :  data.username.toLowerCase().includes(search);
//                         }).map((data, index) => {
//                             return (
//                                 <tr key={data.id}>
//                                     <td>{index+1}</td>
//                                     <td><img id="imgUser" src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} /></td>
//                                     <td>{data.username}</td>
//                                     <td>{data.email}</td>
//                                     <td>{data.phone}</td>
//                                     <td>                                       
//                                         <button onClick={() => handleDelete(data.id)}><RiChatDeleteFill className="icon2" /></button>
//                                     </td>
//                                 </tr>
//                             )
//                         })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     )
// }

// export default Users

import React, { useEffect, useState } from "react";
import "./users.css";
import { FcSearch } from "react-icons/fc";
import { RiChatDeleteFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Users = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7); // Số mục trên mỗi trang

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
                <td>{data.mssv}</td>
                <td>{data.class}</td>
                <td>{data.email}</td>
                <td>{data.phone}</td>
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
                            <th>Full name</th>
                            <th>MSSV</th>
                            <th>Class</th>
                            <th>Email</th>
                            <th>Phone</th>
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
                {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, index) => (
                    <button className="btnp" key={index} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Users;
