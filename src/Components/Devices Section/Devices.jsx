import React, { useEffect, useState } from "react";
import "./devices.css";
import { FcSearch } from "react-icons/fc";
import { RiChatDeleteFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';


const Devices = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7); // Số mục trên mỗi trang

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Device"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
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
        const deleteVal = doc(db, "Device", id);
        await deleteDoc(deleteVal);
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        // Cập nhật số lượng trên Firebase
        const docRef = doc(db, "Device", productId);
        await setDoc(docRef, { quantity: newQuantity }, { merge: true });
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
                    <input
                        type="text"
                        placeholder="Search Devices"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FcSearch className="icon" />
                </div>
                <div>
                    <button>
                        <Link to="/NewDevice">Add Device</Link>
                    </button>
                </div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Image</th>
                            <th>DeviceName</th>
                            <th>Seri</th>
                            <th>Quantity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            .filter((item) =>
                                search.toLowerCase() === ""
                                    ? item
                                    : item.seri.toLowerCase().includes(search)
                            )
                            .map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            id="imgDevices"
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "400px",
                                                borderRadius: "0",
                                            }}
                                            src={
                                                item.img ||
                                                "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                                            }
                                            alt={`Device ${index + 1}`}
                                        />
                                    </td>
                                    <td>{item.devicename}</td>
                                    <td>{item.seri}</td>
                                    <td>
                                        {item.quantity}
                                        <div className="quantity-controls">
                                            <button
                                                className="quantity-button"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                            <button
                                                className="quantity-button"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity === 0}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                        </div>
                                    </td>

                                    <td>
                                        <button onClick={() => handleDelete(item.id)}><RiChatDeleteFill className="icon2" /></button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, index) => (
                    <button className="btnp" key={index} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Devices;
