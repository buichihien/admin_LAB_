import React, { useEffect, useState } from "react";
import "./devices.css";
import { FcSearch } from "react-icons/fc";
import { collection, onSnapshot, updateDoc, doc, addDoc, getDocs } from "firebase/firestore";
import { auth,db } from "../../firebase";
import { serverTimestamp } from "firebase/firestore";
import { format } from "date-fns";

const Devices = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [borrowQuantities, setBorrowQuantities] = useState({}); // Sử dụng object để lưu trữ từng quantity riêng lẻ
    const valueData = collection(db, "Borrow");

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

    // lấy user đang đăng nhập
    useEffect(() => {
        // Get the current user when the component mounts
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const handleBorrow = async (productId) => {
        // Lấy dữ liệu của thiết bị
        const device = data.find(item => item.id === productId);
    
        // Kiểm tra nếu borrowQuantity là số hợp lệ và nhỏ hơn hoặc bằng quantity
        const quantityToBorrow = parseInt(borrowQuantities[productId], 10);
        if (!isNaN(quantityToBorrow) && quantityToBorrow > 0 && quantityToBorrow <= device.quantity) {
            // Cập nhật quantity trong Firestore
            const deviceRef = doc(db, "Device", productId);
            await updateDoc(deviceRef, { quantity: device.quantity - quantityToBorrow });
    
            // Thêm dữ liệu vào bảng "Borrow" với thời gian và ngày hiện tại
            try {
                // Định dạng thời gian thành ngày tháng năm
                const formattedDate = format(new Date(), "dd-MM-yyyy");
    
                // Thêm dữ liệu vào bảng "Borrow" với thời gian và ngày hiện tại
                await addDoc(valueData, {
                    userEmail,
                    date: formattedDate,
                    time: new Date().toLocaleTimeString(),
                    deviceName: device.devicename,
                    quantity: quantityToBorrow,
                    status: "Đã mượn",
                });
    
                // Reset borrowQuantity cho thiết bị cụ thể
                setBorrowQuantities(prevState => ({ ...prevState, [productId]: "" }));
    
                // Thực hiện các hành động khác nếu cần
                console.log(`Borrowed ${quantityToBorrow} items from device with ID ${productId}`);
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Please enter a valid quantity to borrow.");
        }
    };
    
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
                            <th>Image</th>
                            <th>DeviceName</th>
                            <th>Seri</th>
                            <th>Quantity</th>
                            <th>BorrowDevice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((data) => {
                            return search.toLowerCase() === ''
                                ? data
                                : data.devicename.toLowerCase().includes(search);
                        }).map((data, index) => {
                            return (
                                <tr key={data.id}>
                                    <td>{index + 1}</td>
                                    <td><img className="imgDevices" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0' }} src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} /></td>
                                    <td>{data.devicename}</td>
                                    <td>{data.seri}</td>
                                    <td>{data.quantity}</td>
                                    <td>
                                        <div className="form-container">
                                            <input
                                                className="form-input"
                                                type="text"
                                                placeholder="Quantity to Borrow"
                                                value={borrowQuantities[data.id] || ""}
                                                onChange={(e) => setBorrowQuantities(prevState => ({ ...prevState, [data.id]: e.target.value }))}
                                            />
                                            <button
                                                className="form-button"
                                                onClick={() => handleBorrow(data.id)}
                                            >
                                                Borrow
                                            </button>                                            
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Devices;
